import EmptyState from "@/components/EmptyState";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  useCollegeMatchScore,
  useColleges,
  useCollegesByCountry,
  useStudentProfile,
} from "@/hooks/useQueries";
import { type AiMatchScore, FinancialAidTier } from "@/types";
import type { College } from "@/types";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Building2,
  GitCompare,
  Globe,
  Loader2,
  MapPin,
  Scale,
  Search,
  Target,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

const COUNTRIES = [
  "US",
  "UK",
  "Canada",
  "Australia",
  "India",
  "Germany",
  "France",
  "Japan",
  "Singapore",
  "UAE",
];

type AidFilter = "all" | "noAid" | "meritOnly" | "needBased" | "fullRide";

const AID_LABELS: Record<AidFilter, string> = {
  all: "All",
  noAid: "No Aid",
  meritOnly: "Merit Only",
  needBased: "Need Based",
  fullRide: "Full Ride",
};

const AID_BADGE_STYLES: Record<FinancialAidTier, string> = {
  [FinancialAidTier.fullRide]: "bg-accent/15 text-accent border-accent/30",
  [FinancialAidTier.needBased]: "bg-primary/10 text-primary border-primary/30",
  [FinancialAidTier.meritOnly]:
    "bg-secondary/40 text-secondary-foreground border-border",
  [FinancialAidTier.noAid]: "bg-muted text-muted-foreground border-border",
};

const AID_TIER_LABELS: Record<FinancialAidTier, string> = {
  [FinancialAidTier.fullRide]: "Full Ride",
  [FinancialAidTier.needBased]: "Need Based",
  [FinancialAidTier.meritOnly]: "Merit Only",
  [FinancialAidTier.noAid]: "No Aid",
};

const MAX_COMPARE = 4;

function FinancialAidBadge({ tier }: { tier: FinancialAidTier }) {
  return (
    <Badge
      variant="outline"
      className={`text-xs font-semibold ${AID_BADGE_STYLES[tier]}`}
    >
      {AID_TIER_LABELS[tier]}
    </Badge>
  );
}

function CollegeCard({
  college,
  isComparing,
  onToggleCompare,
}: {
  college: College;
  isComparing: boolean;
  onToggleCompare: (c: College) => void;
}) {
  const tuitionNum = Number(college.tuition);
  const topMajors = college.majorsOffered.slice(0, 3);
  const { data: profile } = useStudentProfile();
  const matchMutation = useCollegeMatchScore();
  const [matchResult, setMatchResult] = useState<AiMatchScore | null>(null);

  const handleMatchScore = async () => {
    if (!profile) return;
    try {
      const result = await matchMutation.mutateAsync({
        collegeId: college.id,
        collegeName: college.name,
        profile,
      });
      setMatchResult(result);
    } catch {
      // silently ignore
    }
  };

  const scoreColorClass =
    matchResult && matchResult.score >= 70
      ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800"
      : matchResult && matchResult.score >= 40
        ? "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800"
        : "text-destructive bg-destructive/10 border-destructive/20";

  return (
    <Card
      className="flex flex-col h-full transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 border-border"
      data-ocid={`colleges.card.${college.id}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-display text-base font-semibold text-foreground truncate">
              {college.name}
            </h3>
            <p className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{college.location}</span>
            </p>
          </div>
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <FinancialAidBadge tier={college.financialAidTier} />
            {matchResult && (
              <Badge
                variant="outline"
                className={`text-xs font-bold ${scoreColorClass}`}
                data-ocid={`colleges.match_score_badge.${college.id}`}
              >
                {matchResult.score}% Match
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 pb-3 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-muted/60 px-3 py-2">
            <p className="text-xs text-muted-foreground mb-0.5">Tuition</p>
            <p className="text-sm font-semibold text-foreground">
              ${tuitionNum.toLocaleString()}
            </p>
          </div>
          <div className="rounded-lg bg-muted/60 px-3 py-2">
            <p className="text-xs text-muted-foreground mb-0.5">Acceptance</p>
            <p className="text-sm font-semibold text-foreground">
              {college.acceptanceRate.toFixed(1)}%
            </p>
          </div>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1.5">Top Majors</p>
          <div className="flex flex-wrap gap-1">
            {topMajors.map((major) => (
              <Badge
                key={major}
                variant="secondary"
                className="text-xs font-normal"
              >
                {major}
              </Badge>
            ))}
            {college.majorsOffered.length > 3 && (
              <Badge variant="secondary" className="text-xs font-normal">
                +{college.majorsOffered.length - 3} more
              </Badge>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0 flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="flex-1 gap-1.5 text-xs min-w-[90px]"
          onClick={handleMatchScore}
          disabled={!profile || matchMutation.isPending}
          data-ocid={`colleges.match_score_button.${college.id}`}
        >
          {matchMutation.isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Target className="h-3.5 w-3.5" />
          )}
          {matchResult ? "Recalculate" : "Match Score"}
        </Button>
        <Button
          variant={isComparing ? "default" : "outline"}
          size="sm"
          className="flex-1 gap-1.5 text-xs min-w-[90px]"
          onClick={() => onToggleCompare(college)}
          data-ocid={`colleges.compare_button.${college.id}`}
          aria-pressed={isComparing}
        >
          <GitCompare className="h-3.5 w-3.5" />
          {isComparing ? "Remove" : "Compare"}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 gap-1.5 text-xs min-w-[90px]"
          asChild
        >
          <Link
            to="/colleges/$id"
            params={{ id: String(college.id) }}
            data-ocid={`colleges.view_detail.${college.id}`}
          >
            View Details
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function ComparisonBar({
  selected,
  onRemove,
}: {
  selected: College[];
  onRemove: (id: bigint) => void;
}) {
  const navigate = useNavigate();
  if (selected.length === 0) return null;

  const handleCompare = () => {
    const ids = selected.map((c) => String(c.id)).join(",");
    navigate({ to: "/compare", search: { ids } as Record<string, string> });
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card shadow-lg"
      data-ocid="colleges.comparison_bar"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          <span className="text-sm font-medium text-muted-foreground shrink-0">
            Comparing ({selected.length}/{MAX_COMPARE}):
          </span>
          {selected.map((c) => (
            <span
              key={String(c.id)}
              className="inline-flex items-center gap-1 rounded-full bg-primary/10 pl-3 pr-1.5 py-0.5 text-xs font-medium text-primary"
            >
              <span className="truncate max-w-[120px]">{c.name}</span>
              <button
                type="button"
                onClick={() => onRemove(c.id)}
                className="rounded-full hover:bg-primary/20 p-0.5 transition-colors"
                aria-label={`Remove ${c.name} from comparison`}
                data-ocid={`colleges.comparison_remove.${c.id}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        <Button
          size="sm"
          onClick={handleCompare}
          className="shrink-0 gap-2"
          data-ocid="colleges.compare_now_button"
        >
          <Scale className="h-4 w-4" />
          Compare Now
        </Button>
      </div>
    </div>
  );
}

export default function CollegesPage() {
  const [countryFilter, setCountryFilter] = useState("");
  const {
    data: allColleges = [],
    isLoading: allLoading,
    isError: allError,
  } = useColleges();
  const {
    data: countryColleges = [],
    isLoading: countryLoading,
    isError: countryError,
  } = useCollegesByCountry(countryFilter);

  const colleges = countryFilter ? countryColleges : allColleges;
  const isLoading = countryFilter ? countryLoading : allLoading;
  const isError = countryFilter ? countryError : allError;

  const [search, setSearch] = useState("");
  const [aidFilter, setAidFilter] = useState<AidFilter>("all");
  const [minRate, setMinRate] = useState("");
  const [maxRate, setMaxRate] = useState("");
  const [compareList, setCompareList] = useState<College[]>([]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const min = minRate !== "" ? Number.parseFloat(minRate) : null;
    const max = maxRate !== "" ? Number.parseFloat(maxRate) : null;
    return colleges.filter((c) => {
      if (
        q &&
        !c.name.toLowerCase().includes(q) &&
        !c.location.toLowerCase().includes(q)
      )
        return false;
      if (aidFilter !== "all" && c.financialAidTier !== aidFilter) return false;
      if (min !== null && c.acceptanceRate < min) return false;
      if (max !== null && c.acceptanceRate > max) return false;
      return true;
    });
  }, [colleges, search, aidFilter, minRate, maxRate]);

  const toggleCompare = (college: College) => {
    setCompareList((prev) => {
      const exists = prev.some((c) => c.id === college.id);
      if (exists) return prev.filter((c) => c.id !== college.id);
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, college];
    });
  };

  const aidFilters: AidFilter[] = [
    "all",
    "noAid",
    "meritOnly",
    "needBased",
    "fullRide",
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Page header */}
      <div className="bg-card border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Explore Colleges
            </h1>
          </div>
          <p className="text-muted-foreground text-sm pl-13">
            Browse and compare colleges to find your perfect fit.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {/* Filters */}
        <div className="bg-card border border-border rounded-xl p-4 mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or location…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
              data-ocid="colleges.search_input"
            />
          </div>
          <div className="flex flex-wrap gap-4 items-start">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-muted-foreground mb-2">
                Country
              </p>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <select
                  value={countryFilter}
                  onChange={(e) => setCountryFilter(e.target.value)}
                  data-ocid="colleges.country_filter.select"
                  className="h-9 w-full max-w-[200px] rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 appearance-none"
                >
                  <option value="">All Countries</option>
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-muted-foreground mb-2">
                Financial Aid
              </p>
              <div className="flex flex-wrap gap-1.5">
                {aidFilters.map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setAidFilter(f)}
                    data-ocid={`colleges.aid_filter.${f}`}
                    className={[
                      "rounded-full px-3 py-1 text-xs font-medium border transition-colors duration-150",
                      aidFilter === f
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground",
                    ].join(" ")}
                  >
                    {AID_LABELS[f]}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">
                Acceptance Rate (%)
              </p>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={minRate}
                  onChange={(e) => setMinRate(e.target.value)}
                  className="w-20 text-sm"
                  data-ocid="colleges.min_rate_input"
                />
                <span className="text-muted-foreground text-sm">–</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={maxRate}
                  onChange={(e) => setMaxRate(e.target.value)}
                  className="w-20 text-sm"
                  data-ocid="colleges.max_rate_input"
                />
              </div>
            </div>
          </div>
        </div>

        {!isLoading && !isError && (
          <p className="text-sm text-muted-foreground mb-4">
            {filtered.length === colleges.length
              ? `${colleges.length} college${colleges.length !== 1 ? "s" : ""}`
              : `${filtered.length} of ${colleges.length} college${colleges.length !== 1 ? "s" : ""}`}
          </p>
        )}

        {isLoading ? (
          <div data-ocid="colleges.loading_state">
            <LoadingSpinner label="Loading colleges…" />
          </div>
        ) : isError ? (
          <div
            className="flex flex-col items-center py-16 text-center"
            data-ocid="colleges.error_state"
          >
            <p className="text-destructive font-medium">
              Failed to load colleges.
            </p>
            <p className="text-muted-foreground text-sm mt-1">
              Please try again later.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="No colleges found"
            description="Try adjusting your search or filter criteria."
            actionLabel={
              search ||
              aidFilter !== "all" ||
              countryFilter ||
              minRate ||
              maxRate
                ? "Clear Filters"
                : undefined
            }
            onAction={() => {
              setSearch("");
              setAidFilter("all");
              setCountryFilter("");
              setMinRate("");
              setMaxRate("");
            }}
          />
        ) : (
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4${
              compareList.length > 0 ? " pb-24" : ""
            }`}
            data-ocid="colleges.list"
          >
            {filtered.map((college) => (
              <CollegeCard
                key={String(college.id)}
                college={college}
                isComparing={compareList.some((c) => c.id === college.id)}
                onToggleCompare={toggleCompare}
              />
            ))}
          </div>
        )}
      </div>

      <ComparisonBar
        selected={compareList}
        onRemove={(id) =>
          setCompareList((prev) => prev.filter((c) => c.id !== id))
        }
      />
    </div>
  );
}
