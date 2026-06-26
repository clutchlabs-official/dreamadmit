import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useCalculateLoan } from "@/hooks/useQueries";
import type { AmortizationEntry } from "@/types";
import {
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Info,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

const fmt = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

function calcMonthly(principal: number, annualRate: number, years: number) {
  if (principal <= 0 || years <= 0) return 0;
  const r = annualRate / 100 / 12;
  const n = years * 12;
  if (r === 0) return principal / n;
  return (principal * r * (1 + r) ** n) / ((1 + r) ** n - 1);
}

function buildAmortization(
  principal: number,
  annualRate: number,
  years: number,
): AmortizationEntry[] {
  const r = annualRate / 100 / 12;
  const n = years * 12;
  const monthly = calcMonthly(principal, annualRate, years);
  let balance = principal;
  const rows: AmortizationEntry[] = [];
  for (let i = 1; i <= n; i++) {
    const interest = balance * r;
    const principal = monthly - interest;
    balance = Math.max(0, balance - principal);
    rows.push({
      month: BigInt(i),
      principal,
      interest,
      balance,
    });
  }
  return rows;
}

type FormState = {
  totalCost: string;
  expectedAid: string;
  annualInterestRate: string;
  repaymentYears: string;
};

type CalcResult = {
  netCost: number;
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  aidRatio: number;
  amortization: AmortizationEntry[];
};

export default function CalculatorPage() {
  const [form, setForm] = useState<FormState>({
    totalCost: "",
    expectedAid: "",
    annualInterestRate: "5.5",
    repaymentYears: "10",
  });
  const [result, setResult] = useState<CalcResult | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const calculateLoan = useCalculateLoan();

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleCalculate = async () => {
    const totalCost = Number.parseFloat(form.totalCost);
    const expectedAid = Number.parseFloat(form.expectedAid || "0");
    const rate = Number.parseFloat(form.annualInterestRate);
    const years = Number.parseInt(form.repaymentYears);

    if (!form.totalCost || Number.isNaN(totalCost) || totalCost <= 0) {
      setError("Please enter a valid total cost of attendance.");
      return;
    }
    if (Number.isNaN(rate) || rate < 0 || rate > 30) {
      setError("Please enter a valid annual interest rate (0–30%).");
      return;
    }

    const netCost = Math.max(0, (totalCost - expectedAid) * years);
    const monthly = calcMonthly(netCost, rate, years);
    const total = monthly * years * 12;
    const interest = total - netCost;
    const aidRatio = totalCost > 0 ? expectedAid / totalCost : 0;
    const localAmort = buildAmortization(netCost, rate, years);

    setResult({
      netCost,
      monthlyPayment: monthly,
      totalPayment: total,
      totalInterest: interest,
      aidRatio,
      amortization: localAmort,
    });
    setShowAll(false);

    // Also fire backend call for authoritative data
    try {
      await calculateLoan.mutateAsync({
        totalCost,
        expectedAid,
        annualInterestRate: rate,
        repaymentYears: BigInt(years),
      });
    } catch {
      // Backend call is supplementary; local calc already shown
    }
  };

  const aidColor =
    result === null
      ? ""
      : result.aidRatio > 0.5
        ? "border-accent bg-accent/10"
        : result.aidRatio > 0
          ? "border-orange-400/60 bg-orange-500/10 text-orange-700"
          : "border-destructive bg-destructive/10";

  const aidBadge =
    result === null
      ? null
      : result.aidRatio > 0.5
        ? { label: "Aid covers >50%", variant: "success" as const }
        : result.aidRatio > 0
          ? { label: "Aid covers <50%", variant: "warning" as const }
          : { label: "No aid applied", variant: "destructive" as const };

  const displayRows =
    result && !showAll
      ? result.amortization.slice(0, 12)
      : (result?.amortization ?? []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">
          Loan Calculator
        </h1>
        <p className="mt-2 text-muted-foreground max-w-xl">
          Estimate your monthly payments, total cost, and full amortization
          schedule for your college loans.
        </p>
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-4 py-2 text-sm text-muted-foreground w-fit">
          <Info className="h-4 w-4 shrink-0 text-primary" />
          Average US college tuition is ~$25,000/year for public schools
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        {/* ── Left: Form ── */}
        <div className="lg:col-span-2">
          <Card className="border border-border shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="font-display text-lg text-foreground">
                Loan Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="totalCost" className="text-sm font-medium">
                  Total cost of attendance
                  <span className="ml-1 text-muted-foreground">($ / year)</span>
                </Label>
                <Input
                  id="totalCost"
                  data-ocid="calculator.total_cost.input"
                  type="number"
                  placeholder="e.g. 35000"
                  value={form.totalCost}
                  onChange={(e) => handleChange("totalCost", e.target.value)}
                  min={0}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="expectedAid" className="text-sm font-medium">
                  Expected financial aid / scholarships
                  <span className="ml-1 text-muted-foreground">($ / year)</span>
                </Label>
                <Input
                  id="expectedAid"
                  data-ocid="calculator.expected_aid.input"
                  type="number"
                  placeholder="e.g. 10000"
                  value={form.expectedAid}
                  onChange={(e) => handleChange("expectedAid", e.target.value)}
                  min={0}
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="annualInterestRate"
                  className="text-sm font-medium"
                >
                  Annual interest rate
                  <span className="ml-1 text-muted-foreground">(%)</span>
                </Label>
                <Input
                  id="annualInterestRate"
                  data-ocid="calculator.interest_rate.input"
                  type="number"
                  step="0.1"
                  placeholder="5.5"
                  value={form.annualInterestRate}
                  onChange={(e) =>
                    handleChange("annualInterestRate", e.target.value)
                  }
                  min={0}
                  max={30}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Repayment period</Label>
                <Select
                  value={form.repaymentYears}
                  onValueChange={(v) => handleChange("repaymentYears", v)}
                >
                  <SelectTrigger data-ocid="calculator.repayment_years.select">
                    <SelectValue placeholder="Select years" />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 10, 15, 20, 25].map((y) => (
                      <SelectItem key={y} value={String(y)}>
                        {y} years
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {error && (
                <div
                  data-ocid="calculator.error_state"
                  className="flex items-center gap-2 rounded-md bg-destructive/10 border border-destructive/30 px-3 py-2 text-sm text-destructive"
                >
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              <Button
                type="button"
                data-ocid="calculator.calculate.primary_button"
                className="w-full font-display font-semibold"
                onClick={handleCalculate}
                disabled={calculateLoan.isPending}
              >
                {calculateLoan.isPending ? "Calculating…" : "Calculate"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* ── Right: Results ── */}
        <div className="lg:col-span-3 space-y-6">
          {!result && (
            <div
              data-ocid="calculator.empty_state"
              className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 text-center px-6"
            >
              <TrendingDown className="mb-3 h-10 w-10 text-muted-foreground/50" />
              <p className="font-display text-base font-semibold text-foreground">
                Enter your details to see results
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Fill in the form and click Calculate to see your loan breakdown.
              </p>
            </div>
          )}

          {result && (
            <>
              {/* Summary card */}
              <Card className={`border-2 ${aidColor} shadow-sm`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-display text-lg text-foreground">
                      Loan Summary
                    </CardTitle>
                    {aidBadge && (
                      <span
                        data-ocid="calculator.aid_badge"
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          result.aidRatio > 0.5
                            ? "bg-accent/15 text-accent"
                            : result.aidRatio > 0
                              ? "bg-orange-500/10 text-orange-700"
                              : "bg-destructive/15 text-destructive"
                        }`}
                      >
                        {result.aidRatio > 0.5 ? (
                          <TrendingDown className="h-3 w-3" />
                        ) : (
                          <TrendingUp className="h-3 w-3" />
                        )}
                        {aidBadge.label}
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {(
                      [
                        {
                          label: "Net cost",
                          value: fmt(result.netCost),
                          ocid: "calculator.net_cost.card",
                        },
                        {
                          label: "Monthly payment",
                          value: fmt(result.monthlyPayment),
                          ocid: "calculator.monthly_payment.card",
                          highlight: true,
                        },
                        {
                          label: "Total paid",
                          value: fmt(result.totalPayment),
                          ocid: "calculator.total_payment.card",
                        },
                        {
                          label: "Total interest",
                          value: fmt(result.totalInterest),
                          ocid: "calculator.total_interest.card",
                        },
                      ] as {
                        label: string;
                        value: string;
                        ocid: string;
                        highlight?: boolean;
                      }[]
                    ).map(({ label, value, ocid, highlight }) => (
                      <div
                        key={label}
                        data-ocid={ocid}
                        className={`rounded-lg p-3 ${
                          highlight
                            ? "bg-primary/10 border border-primary/20"
                            : "bg-muted/40"
                        }`}
                      >
                        <p className="text-xs text-muted-foreground">{label}</p>
                        <p
                          className={`mt-1 font-display text-lg font-bold ${
                            highlight ? "text-primary" : "text-foreground"
                          }`}
                        >
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Amortization table */}
              <Card className="border border-border shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-display text-base text-foreground">
                      Amortization Schedule
                    </CardTitle>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      data-ocid="calculator.amortization.toggle"
                      className="flex items-center gap-1 text-sm"
                      onClick={() => setShowAll((s) => !s)}
                    >
                      {showAll ? (
                        <>
                          <ChevronUp className="h-4 w-4" /> Show first 12
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-4 w-4" /> Show all{" "}
                          {result.amortization.length} months
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border bg-muted/40">
                          <th className="py-2.5 pl-4 pr-2 text-left font-medium text-muted-foreground">
                            Month
                          </th>
                          <th className="px-2 py-2.5 text-right font-medium text-muted-foreground">
                            Principal
                          </th>
                          <th className="px-2 py-2.5 text-right font-medium text-muted-foreground">
                            Interest
                          </th>
                          <th className="py-2.5 pl-2 pr-4 text-right font-medium text-muted-foreground">
                            Balance
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {displayRows.map((row, i) => (
                          <tr
                            key={Number(row.month)}
                            data-ocid={`calculator.amortization.item.${i + 1}`}
                            className="border-b border-border/50 transition-colors hover:bg-muted/20"
                          >
                            <td className="py-2.5 pl-4 pr-2 font-display font-medium text-foreground">
                              {Number(row.month)}
                            </td>
                            <td className="px-2 py-2.5 text-right tabular-nums text-accent font-medium">
                              {fmt(row.principal)}
                            </td>
                            <td className="px-2 py-2.5 text-right tabular-nums text-muted-foreground">
                              {fmt(row.interest)}
                            </td>
                            <td className="py-2.5 pl-2 pr-4 text-right tabular-nums font-display font-semibold text-foreground">
                              {fmt(row.balance)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {!showAll && result.amortization.length > 12 && (
                    <div className="border-t border-border bg-muted/20 px-4 py-2.5 text-center">
                      <button
                        type="button"
                        data-ocid="calculator.amortization.show_all_button"
                        className="text-sm text-primary underline-offset-2 hover:underline"
                        onClick={() => setShowAll(true)}
                      >
                        + {result.amortization.length - 12} more months
                      </button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}

          {calculateLoan.isPending && (
            <div data-ocid="calculator.loading_state" className="space-y-3">
              <Skeleton className="h-32 w-full rounded-xl" />
              <Skeleton className="h-64 w-full rounded-xl" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
