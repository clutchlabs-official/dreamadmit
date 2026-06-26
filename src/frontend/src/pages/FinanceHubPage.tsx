import AnimatedCard from "@/components/AnimatedCard";
import PageTransition from "@/components/PageTransition";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

type ScholarshipStatus = "Not Started" | "In Progress" | "Submitted";

const scholarships = [
  {
    name: "Gates Millennium Scholars",
    amount: "$50,000",
    deadline: "2026-06-15",
    status: "Not Started" as ScholarshipStatus,
    daysLeft: 15,
  },
  {
    name: "Coca-Cola Scholars Program",
    amount: "$20,000",
    deadline: "2026-06-18",
    status: "In Progress" as ScholarshipStatus,
    daysLeft: 18,
  },
  {
    name: "Jack Kent Cooke Foundation",
    amount: "$40,000",
    deadline: "2026-07-05",
    status: "Not Started" as ScholarshipStatus,
    daysLeft: 35,
  },
  {
    name: "Davidson Fellows Scholarship",
    amount: "$50,000",
    deadline: "2026-06-08",
    status: "Submitted" as ScholarshipStatus,
    daysLeft: 8,
  },
  {
    name: "Regeneron Science Talent Search",
    amount: "$25,000",
    deadline: "2026-06-05",
    status: "In Progress" as ScholarshipStatus,
    daysLeft: 5,
  },
  {
    name: "Buick Achievers Scholarship",
    amount: "$25,000",
    deadline: "2026-07-20",
    status: "Not Started" as ScholarshipStatus,
    daysLeft: 50,
  },
  {
    name: "Elks National Foundation",
    amount: "$12,500",
    deadline: "2026-06-03",
    status: "Submitted" as ScholarshipStatus,
    daysLeft: 3,
  },
  {
    name: "Ron Brown Scholar Program",
    amount: "$40,000",
    deadline: "2026-06-30",
    status: "Not Started" as ScholarshipStatus,
    daysLeft: 30,
  },
];

const essayTemplates = [
  {
    emoji: "🌟",
    title: "Why This Scholarship",
    hook: "Start with a specific moment that made this award meaningful to your journey.",
    words: 500,
  },
  {
    emoji: "🏆",
    title: "Leadership Experience",
    hook: "Describe a challenge your team faced and how your decision changed the outcome.",
    words: 650,
  },
  {
    emoji: "🤝",
    title: "Community Need",
    hook: "Paint the problem before you paint the solution — make the reader feel the gap.",
    words: 600,
  },
  {
    emoji: "💪",
    title: "Overcome a Challenge",
    hook: "Begin in the middle of the hardest moment, then reveal how you got there.",
    words: 550,
  },
  {
    emoji: "🎯",
    title: "Career Goals",
    hook: "Connect your past experience to a specific, achievable future milestone.",
    words: 700,
  },
  {
    emoji: "🌍",
    title: "Cultural Identity",
    hook: "Share a tradition, food, or memory that taught you something no classroom could.",
    words: 600,
  },
];

const colleges = [
  {
    name: "MIT",
    tuition: 57986,
    roomBoard: 17960,
    books: 2900,
    personal: 2600,
    aid: 48000,
  },
  {
    name: "Stanford",
    tuition: 62484,
    roomBoard: 19449,
    books: 1455,
    personal: 2100,
    aid: 52000,
  },
  {
    name: "UMich (in-state)",
    tuition: 16736,
    roomBoard: 12426,
    books: 1048,
    personal: 2400,
    aid: 12000,
  },
  {
    name: "UT Austin (in-state)",
    tuition: 11752,
    roomBoard: 12248,
    books: 700,
    personal: 2200,
    aid: 8000,
  },
  {
    name: "NYU",
    tuition: 60438,
    roomBoard: 21400,
    books: 780,
    personal: 2600,
    aid: 35000,
  },
  {
    name: "Purdue (in-state)",
    tuition: 9992,
    roomBoard: 10030,
    books: 420,
    personal: 1800,
    aid: 7000,
  },
];

const statusColor: Record<ScholarshipStatus, string> = {
  "Not Started": "bg-muted text-muted-foreground",
  "In Progress": "bg-primary/15 text-primary",
  Submitted: "bg-[oklch(0.55_0.18_145)]/15 text-[oklch(0.45_0.18_145)]",
};

function urgencyClass(days: number) {
  if (days <= 7) return "text-destructive font-bold";
  if (days <= 14) return "text-[oklch(0.6_0.18_60)] font-semibold";
  return "text-muted-foreground";
}

function ScholarshipTable() {
  return (
    <AnimatedCard delay={0.05}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📅 Scholarship Deadline Tracker
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 font-semibold text-foreground">
                  Scholarship
                </th>
                <th className="text-right py-2 font-semibold text-foreground">
                  Amount
                </th>
                <th className="text-right py-2 font-semibold text-foreground">
                  Days Left
                </th>
                <th className="text-center py-2 font-semibold text-foreground">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {scholarships.map((s) => (
                <tr
                  key={s.name}
                  className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                >
                  <td className="py-3 text-foreground font-medium">{s.name}</td>
                  <td className="py-3 text-right text-primary font-semibold">
                    {s.amount}
                  </td>
                  <td className={`py-3 text-right ${urgencyClass(s.daysLeft)}`}>
                    {s.daysLeft <= 7 ? "🔴 " : s.daysLeft <= 14 ? "🟡 " : "🟢 "}
                    {s.daysLeft}d
                  </td>
                  <td className="py-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[s.status]}`}
                    >
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </AnimatedCard>
  );
}

function MeritNeedGuide() {
  const meritChecks = [
    "GPA 3.5+",
    "Strong test scores",
    "Awards & honors",
    "Leadership roles",
    "Exceptional talent",
  ];
  const needChecks = [
    "Family income < $75k",
    "FAFSA submitted",
    "CSS Profile filed",
    "Demonstrated financial need",
    "EFC calculation",
  ];
  return (
    <AnimatedCard delay={0.1}>
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              🏅 Merit-Based Aid
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Awarded for academic excellence and achievements
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-foreground">
              Merit aid rewards your hard work. Schools offer this to attract
              top students regardless of income level.
            </p>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                Eligibility Checklist
              </p>
              <ul className="space-y-1">
                {meritChecks.map((c) => (
                  <li
                    key={c}
                    className="flex items-center gap-2 text-sm text-foreground"
                  >
                    <span className="text-primary">✓</span> {c}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg bg-primary/10 p-3">
              <p className="text-xs text-primary font-semibold">
                Typical Estimate
              </p>
              <p className="text-lg font-bold text-primary">
                $5,000 – $35,000/yr
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-accent/30 bg-accent/5">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              💙 Need-Based Aid
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Awarded based on your family's financial situation
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-foreground">
              Need-based aid bridges the gap between what your family can pay
              and what college actually costs.
            </p>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                Eligibility Checklist
              </p>
              <ul className="space-y-1">
                {needChecks.map((c) => (
                  <li
                    key={c}
                    className="flex items-center gap-2 text-sm text-foreground"
                  >
                    <span className="text-accent">✓</span> {c}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg bg-accent/10 p-3">
              <p className="text-xs text-accent font-semibold">
                Typical Estimate
              </p>
              <p className="text-lg font-bold text-accent">
                $10,000 – $65,000/yr
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AnimatedCard>
  );
}

function EssayTemplates() {
  const [selected, setSelected] = useState<number | null>(null);
  return (
    <AnimatedCard delay={0.08}>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {essayTemplates.map((t, i) => (
          <Card
            key={t.title}
            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
              selected === i
                ? "border-primary ring-2 ring-primary/30"
                : "border-border"
            }`}
            onClick={() => setSelected(selected === i ? null : i)}
            data-ocid={`finance.essay_template.item.${i + 1}`}
          >
            <CardContent className="p-4">
              <div className="text-3xl mb-2">{t.emoji}</div>
              <h3 className="font-semibold text-sm text-foreground mb-1">
                {t.title}
              </h3>
              <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                {t.hook}
              </p>
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-xs">
                  {t.words} words
                </Badge>
                {selected === i && (
                  <span className="text-xs text-primary font-medium">
                    Selected ✓
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {selected !== null && (
        <div className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/20">
          <p className="text-sm font-semibold text-primary mb-1">
            Opening Hook Idea:
          </p>
          <p className="text-sm text-foreground italic">
            &ldquo;{essayTemplates[selected].hook}&rdquo;
          </p>
          <Button
            size="sm"
            className="mt-3"
            data-ocid="finance.use_template.button"
          >
            Use This Template
          </Button>
        </div>
      )}
    </AnimatedCard>
  );
}

function FinancialAidCalc() {
  const [income, setIncome] = useState(75000);
  const [assets, setAssets] = useState(30000);
  const [efc, setEfc] = useState(8000);

  const pell =
    income < 30000 ? 7395 : income < 50000 ? 4000 : income < 75000 ? 1500 : 0;
  const subsidizedLoan = Math.min(5500, Math.max(0, efc < 15000 ? 5500 : 3500));
  const grant = Math.max(0, Math.round(((100000 - income) / 100000) * 15000));
  const workStudy = income < 60000 ? 3000 : 0;

  return (
    <AnimatedCard delay={0.1}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🧮 Financial Aid Estimator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label className="text-xs font-semibold">
                Annual Family Income ($)
              </Label>
              <Input
                type="number"
                value={income}
                onChange={(e) => setIncome(Number(e.target.value))}
                className="mt-1"
                data-ocid="finance.aid_income.input"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold">Family Assets ($)</Label>
              <Input
                type="number"
                value={assets}
                onChange={(e) => setAssets(Number(e.target.value))}
                className="mt-1"
                data-ocid="finance.aid_assets.input"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold">
                Expected Family Contribution / SAI ($)
              </Label>
              <Input
                type="number"
                value={efc}
                onChange={(e) => setEfc(Number(e.target.value))}
                className="mt-1"
                data-ocid="finance.aid_efc.input"
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            {[
              {
                label: "Pell Grant",
                value: pell,
                color: "text-[oklch(0.45_0.18_145)]",
                bg: "bg-[oklch(0.55_0.18_145)]/10",
                emoji: "🎓",
              },
              {
                label: "Institutional Grant",
                value: grant,
                color: "text-primary",
                bg: "bg-primary/10",
                emoji: "🏛️",
              },
              {
                label: "Subsidized Loan",
                value: subsidizedLoan,
                color: "text-accent",
                bg: "bg-accent/10",
                emoji: "💳",
              },
              {
                label: "Work-Study",
                value: workStudy,
                color: "text-muted-foreground",
                bg: "bg-muted",
                emoji: "💼",
              },
            ].map((item) => (
              <div
                key={item.label}
                className={`rounded-xl p-4 ${item.bg} text-center`}
              >
                <div className="text-xl mb-1">{item.emoji}</div>
                <p className={`text-xl font-bold ${item.color}`}>
                  ${item.value.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
          <div className="rounded-xl bg-primary/5 border border-primary/20 p-4">
            <p className="text-sm font-semibold text-foreground">
              Total Estimated Aid:{" "}
              <span className="text-primary text-lg">
                ${(pell + grant + subsidizedLoan + workStudy).toLocaleString()}
                /yr
              </span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Estimates only. Actual aid depends on your FAFSA and institution.
            </p>
          </div>
        </CardContent>
      </Card>
    </AnimatedCard>
  );
}

function LoanAdvisor() {
  const [principal, setPrincipal] = useState(30000);
  const [rate, setRate] = useState(6.54);
  const [years, setYears] = useState(10);

  const monthlyRate = rate / 100 / 12;
  const n = years * 12;
  const monthly =
    (principal * (monthlyRate * (1 + monthlyRate) ** n)) /
    ((1 + monthlyRate) ** n - 1);
  const total = monthly * n;
  const interest = total - principal;

  return (
    <AnimatedCard delay={0.1}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🏦 Loan Advisor & Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-4 p-4 rounded-xl bg-primary/5 border border-primary/20">
              <h3 className="font-semibold text-sm text-primary">
                🏛️ Federal Loans
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="text-muted-foreground">
                    Direct Subsidized
                  </span>
                  <span className="font-medium">6.53% fixed</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">
                    Direct Unsubsidized
                  </span>
                  <span className="font-medium">6.53% fixed</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">PLUS Loan</span>
                  <span className="font-medium">9.08% fixed</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Max undergrad</span>
                  <span className="font-medium">$27,000</span>
                </li>
              </ul>
              <Badge className="bg-[oklch(0.55_0.18_145)]/15 text-[oklch(0.45_0.18_145)] border-none">
                ✓ Income-driven repayment
              </Badge>
            </div>
            <div className="space-y-4 p-4 rounded-xl bg-muted/50 border border-border">
              <h3 className="font-semibold text-sm text-foreground">
                🏢 Private Loans
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Variable rate</span>
                  <span className="font-medium">5% – 14%</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Fixed rate</span>
                  <span className="font-medium">6% – 16%</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Credit check</span>
                  <span className="font-medium">Required</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Co-signer</span>
                  <span className="font-medium">Often needed</span>
                </li>
              </ul>
              <Badge variant="outline" className="text-xs">
                ⚠️ No federal protections
              </Badge>
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-sm font-semibold text-foreground">
              Monthly Payment Calculator
            </p>
            <div className="grid md:grid-cols-3 gap-3">
              <div>
                <Label className="text-xs">Loan Amount ($)</Label>
                <Input
                  type="number"
                  value={principal}
                  onChange={(e) => setPrincipal(Number(e.target.value))}
                  className="mt-1"
                  data-ocid="finance.loan_principal.input"
                />
              </div>
              <div>
                <Label className="text-xs">Interest Rate (%)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="mt-1"
                  data-ocid="finance.loan_rate.input"
                />
              </div>
              <div>
                <Label className="text-xs">Repayment Years</Label>
                <Input
                  type="number"
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="mt-1"
                  data-ocid="finance.loan_years.input"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="text-center p-3 rounded-xl bg-primary/10">
                <p className="text-xl font-bold text-primary">
                  ${Number.isNaN(monthly) ? "0" : monthly.toFixed(0)}
                </p>
                <p className="text-xs text-muted-foreground">Monthly Payment</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-muted">
                <p className="text-xl font-bold text-foreground">
                  ${Number.isNaN(total) ? "0" : total.toFixed(0)}
                </p>
                <p className="text-xs text-muted-foreground">Total Repaid</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-destructive/10">
                <p className="text-xl font-bold text-destructive">
                  ${Number.isNaN(interest) ? "0" : interest.toFixed(0)}
                </p>
                <p className="text-xs text-muted-foreground">Total Interest</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </AnimatedCard>
  );
}

function CostComparison() {
  const [showAid, setShowAid] = useState(false);
  return (
    <AnimatedCard delay={0.08}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="flex items-center gap-2">
              🏫 Cost of Attendance Comparison
            </CardTitle>
            <button
              type="button"
              onClick={() => setShowAid(!showAid)}
              className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${showAid ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
              data-ocid="finance.aid_toggle.toggle"
            >
              {showAid ? "✓ Aid Applied" : "Show with Aid"}
            </button>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 font-semibold">College</th>
                <th className="text-right py-2 font-semibold">Tuition</th>
                <th className="text-right py-2 font-semibold">Room & Board</th>
                <th className="text-right py-2 font-semibold">Books</th>
                <th className="text-right py-2 font-semibold">Personal</th>
                <th className="text-right py-2 font-semibold text-primary">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {colleges.map((c) => {
                const total =
                  c.tuition +
                  c.roomBoard +
                  c.books +
                  c.personal -
                  (showAid ? c.aid : 0);
                return (
                  <tr
                    key={c.name}
                    className="border-b border-border/50 hover:bg-muted/30"
                  >
                    <td className="py-3 font-medium text-foreground">
                      {c.name}
                    </td>
                    <td className="py-3 text-right text-muted-foreground">
                      ${c.tuition.toLocaleString()}
                    </td>
                    <td className="py-3 text-right text-muted-foreground">
                      ${c.roomBoard.toLocaleString()}
                    </td>
                    <td className="py-3 text-right text-muted-foreground">
                      ${c.books.toLocaleString()}
                    </td>
                    <td className="py-3 text-right text-muted-foreground">
                      ${c.personal.toLocaleString()}
                    </td>
                    <td className="py-3 text-right font-bold text-primary">
                      ${total.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {showAid && (
            <p className="text-xs text-muted-foreground mt-2">
              * Aid amounts are estimated averages. Your actual aid depends on
              your FAFSA.
            </p>
          )}
        </CardContent>
      </Card>
    </AnimatedCard>
  );
}

function TrackedScholarships() {
  const [notes, setNotes] = useState<Record<string, string>>({});
  const tracked = scholarships.slice(0, 4);
  return (
    <AnimatedCard delay={0.06}>
      <div className="grid sm:grid-cols-2 gap-4">
        {tracked.map((s, i) => (
          <Card
            key={s.name}
            className="border-border"
            data-ocid={`finance.tracked_scholarship.item.${i + 1}`}
          >
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-sm text-foreground">
                    {s.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {s.amount} • Due in {s.daysLeft}d
                  </p>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[s.status]}`}
                >
                  {s.status}
                </span>
              </div>
              <Input
                placeholder="Add notes..."
                className="text-xs h-8"
                value={notes[s.name] || ""}
                onChange={(e) =>
                  setNotes((prev) => ({ ...prev, [s.name]: e.target.value }))
                }
                data-ocid={`finance.scholarship_note.input.${i + 1}`}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </AnimatedCard>
  );
}

export default function FinanceHubPage() {
  return (
    <PageTransition className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 flex items-center gap-3">
        <span className="text-4xl">💰</span>
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Finance Hub
          </h1>
          <p className="text-muted-foreground mt-1">
            Track scholarships, understand aid, calculate costs, and plan your
            loans.
          </p>
        </div>
      </div>

      <Tabs defaultValue="deadlines" className="w-full">
        <TabsList className="flex flex-wrap h-auto gap-1 mb-6 bg-muted/60 p-1">
          <TabsTrigger value="deadlines" data-ocid="finance.deadlines.tab">
            📅 Deadlines
          </TabsTrigger>
          <TabsTrigger value="tracker" data-ocid="finance.tracker.tab">
            📌 Tracker
          </TabsTrigger>
          <TabsTrigger value="guide" data-ocid="finance.guide.tab">
            🏅 Merit vs Need
          </TabsTrigger>
          <TabsTrigger value="templates" data-ocid="finance.templates.tab">
            ✍️ Essay Templates
          </TabsTrigger>
          <TabsTrigger value="calculator" data-ocid="finance.calculator.tab">
            🧮 Aid Calc
          </TabsTrigger>
          <TabsTrigger value="loans" data-ocid="finance.loans.tab">
            🏦 Loan Advisor
          </TabsTrigger>
          <TabsTrigger value="costs" data-ocid="finance.costs.tab">
            🏫 Cost Compare
          </TabsTrigger>
        </TabsList>

        <TabsContent value="deadlines">
          <ScholarshipTable />
        </TabsContent>
        <TabsContent value="tracker">
          <TrackedScholarships />
        </TabsContent>
        <TabsContent value="guide">
          <MeritNeedGuide />
        </TabsContent>
        <TabsContent value="templates">
          <EssayTemplates />
        </TabsContent>
        <TabsContent value="calculator">
          <FinancialAidCalc />
        </TabsContent>
        <TabsContent value="loans">
          <LoanAdvisor />
        </TabsContent>
        <TabsContent value="costs">
          <CostComparison />
        </TabsContent>
      </Tabs>
    </PageTransition>
  );
}
