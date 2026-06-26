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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import {
  useSaveScholarshipShortlist,
  useScholarshipShortlist,
  useScholarships,
} from "@/hooks/useQueries";
import type { Scholarship, ScholarshipId } from "@/types";
import {
  BookmarkCheck,
  BookmarkPlus,
  Calendar,
  DollarSign,
  GraduationCap,
  Search,
  Star,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useMemo, useState } from "react";

interface Filters {
  search: string;
  major: string;
  minGpa: string;
  financialNeedOnly: boolean;
}

const DEFAULT_FILTERS: Filters = {
  search: "",
  major: "",
  minGpa: "",
  financialNeedOnly: false,
};

function formatAmount(amount: number | bigint): string {
  const n = typeof amount === "bigint" ? Number(amount) : amount;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function formatDeadline(deadline: string): string {
  try {
    const d = new Date(deadline);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return deadline;
  }
}

function isDeadlineSoon(deadline: string): boolean {
  try {
    const d = new Date(deadline);
    const diff = d.getTime() - Date.now();
    return diff > 0 && diff < 1000 * 60 * 60 * 24 * 30;
  } catch {
    return false;
  }
}

function FilterPanel({
  filters,
  onChange,
  onReset,
}: {
  filters: Filters;
  onChange: (f: Partial<Filters>) => void;
  onReset: () => void;
}) {
  const hasActiveFilters =
    !!filters.search ||
    !!filters.major ||
    !!filters.minGpa ||
    filters.financialNeedOnly;

  return (
    <Card className="sticky top-24 h-fit" data-ocid="scholarships.filter_panel">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-primary" />
            <span className="font-display text-sm font-semibold text-foreground">
              Filters
            </span>
          </div>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              data-ocid="scholarships.filter_reset_button"
            >
              <X className="h-3 w-3" />
              Reset
            </button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-1.5">
          <Label
            htmlFor="filter-search"
            className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
          >
            Scholarship Name
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              id="filter-search"
              placeholder="Search scholarships…"
              value={filters.search}
              onChange={(e) => onChange({ search: e.target.value })}
              className="pl-9 h-9 text-sm"
              data-ocid="scholarships.search_input"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="filter-major"
            className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
          >
            Field of Study
          </Label>
          <Input
            id="filter-major"
            placeholder="e.g. Computer Science"
            value={filters.major}
            onChange={(e) => onChange({ major: e.target.value })}
            className="h-9 text-sm"
            data-ocid="scholarships.major_input"
          />
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="filter-gpa"
            className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
          >
            Minimum GPA
          </Label>
          <Input
            id="filter-gpa"
            type="number"
            min="0"
            max="4.0"
            step="0.1"
            placeholder="0.0 – 4.0"
            value={filters.minGpa}
            onChange={(e) => onChange({ minGpa: e.target.value })}
            className="h-9 text-sm"
            data-ocid="scholarships.gpa_input"
          />
        </div>

        <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5">
          <div className="space-y-0.5">
            <p className="text-xs font-medium text-foreground">
              Financial Need Only
            </p>
            <p className="text-xs text-muted-foreground">
              Requires financial aid
            </p>
          </div>
          <Switch
            checked={filters.financialNeedOnly}
            onCheckedChange={(val) => onChange({ financialNeedOnly: val })}
            data-ocid="scholarships.financial_need_toggle"
          />
        </div>
      </CardContent>
    </Card>
  );
}

function ShortlistButton({
  scholarshipId,
  isShortlisted,
  isAuthenticated,
  onToggle,
  index,
}: {
  scholarshipId: ScholarshipId;
  isShortlisted: boolean;
  isAuthenticated: boolean;
  onToggle: (id: ScholarshipId) => void;
  index: number;
}) {
  if (!isAuthenticated) {
    return (
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="cursor-not-allowed">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled
                className="h-8 w-8 text-muted-foreground opacity-40"
              >
                <BookmarkPlus className="h-4 w-4" />
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">Login to save scholarships</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={() => onToggle(scholarshipId)}
      className={`h-8 w-8 transition-colors ${
        isShortlisted
          ? "text-accent hover:text-accent/80"
          : "text-muted-foreground hover:text-accent"
      }`}
      data-ocid={`scholarships.shortlist_button.${index}`}
    >
      {isShortlisted ? (
        <BookmarkCheck className="h-4 w-4" />
      ) : (
        <BookmarkPlus className="h-4 w-4" />
      )}
    </Button>
  );
}

function ScholarshipCard({
  scholarship,
  isShortlisted,
  isAuthenticated,
  onToggleShortlist,
  index,
}: {
  scholarship: Scholarship;
  isShortlisted: boolean;
  isAuthenticated: boolean;
  onToggleShortlist: (id: ScholarshipId) => void;
  index: number;
}) {
  const soon = isDeadlineSoon(scholarship.deadline);
  const schId = scholarship.id as ScholarshipId;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.04, 0.4) }}
    >
      <Card
        className={`flex flex-col h-full transition-shadow hover:shadow-md ${
          isShortlisted ? "ring-2 ring-accent/40 border-accent/30" : ""
        }`}
        data-ocid={`scholarships.card.${index}`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-display font-semibold text-foreground text-base leading-snug line-clamp-2">
                {scholarship.name}
              </h3>
              {scholarship.eligibilityMajor && (
                <p className="mt-0.5 text-xs text-muted-foreground truncate">
                  {scholarship.eligibilityMajor}
                </p>
              )}
            </div>
            <ShortlistButton
              scholarshipId={schId}
              isShortlisted={isShortlisted}
              isAuthenticated={isAuthenticated}
              onToggle={onToggleShortlist}
              index={index}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-2">
            <Badge
              variant="secondary"
              className="bg-primary/10 text-primary border-primary/20 font-semibold text-sm px-2.5"
            >
              <DollarSign className="h-3 w-3 mr-0.5" />
              {formatAmount(scholarship.amount)}
            </Badge>
            <Badge
              variant="outline"
              className={`text-xs ${
                soon
                  ? "border-orange-400/60 bg-orange-500/10 text-orange-700 dark:text-orange-400"
                  : "border-border text-muted-foreground"
              }`}
            >
              <Calendar className="h-3 w-3 mr-1" />
              {formatDeadline(scholarship.deadline)}
              {soon && " · Soon"}
            </Badge>
            {scholarship.requiresFinancialNeed && (
              <Badge
                variant="outline"
                className="text-xs border-primary/30 bg-primary/8 text-primary"
              >
                Financial Need
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="flex-1 pb-3">
          {scholarship.eligibilityMajor && (
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Major:</span>{" "}
              {scholarship.eligibilityMajor}
            </p>
          )}
          {scholarship.eligibilityMinGpa !== undefined && (
            <p className="mt-1 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Min GPA:</span>{" "}
              {scholarship.eligibilityMinGpa.toFixed(1)}
            </p>
          )}
        </CardContent>

        <CardFooter className="pt-0">
          <Button
            type="button"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            asChild
            data-ocid={`scholarships.apply_button.${index}`}
          >
            <a
              href={scholarship.applyLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              Apply Now
            </a>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

export default function ScholarshipsPage() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  const { isAuthenticated } = useAuth();
  const { data: scholarships = [], isLoading: loadingScholarships } =
    useScholarships();
  const { data: shortlistIds = [], isLoading: loadingShortlist } =
    useScholarshipShortlist();
  const saveShortlist = useSaveScholarshipShortlist();

  const shortlistSet = useMemo(
    () => new Set(shortlistIds.map(String)),
    [shortlistIds],
  );

  const handleFilterChange = useCallback((partial: Partial<Filters>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
  }, []);

  const handleReset = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  const filtered = useMemo(() => {
    const q = filters.search.toLowerCase().trim();
    const majorQ = filters.major.toLowerCase().trim();
    const gpaMin = filters.minGpa ? Number.parseFloat(filters.minGpa) : null;

    return scholarships.filter((s) => {
      if (q && !s.name.toLowerCase().includes(q)) return false;
      if (majorQ) {
        const matchesMajor =
          s.eligibilityMajor?.toLowerCase().includes(majorQ) ?? false;
        if (!matchesMajor) return false;
      }
      if (gpaMin !== null && !Number.isNaN(gpaMin)) {
        if (s.eligibilityMinGpa !== undefined && s.eligibilityMinGpa > gpaMin)
          return false;
      }
      if (filters.financialNeedOnly && !s.requiresFinancialNeed) return false;
      return true;
    });
  }, [scholarships, filters]);

  const handleToggleShortlist = useCallback(
    (id: ScholarshipId) => {
      const idStr = String(id);
      let next: ScholarshipId[];
      if (shortlistSet.has(idStr)) {
        next = shortlistIds.filter((sid) => String(sid) !== idStr);
      } else {
        next = [...shortlistIds, id];
      }
      saveShortlist.mutate(next);
    },
    [shortlistIds, shortlistSet, saveShortlist],
  );

  const isLoading =
    loadingScholarships || (isAuthenticated && loadingShortlist);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <GraduationCap className="h-5 w-5 text-primary" />
          </div>
          <h1
            className="font-display text-3xl font-bold text-foreground"
            data-ocid="scholarships.page"
          >
            Scholarships
          </h1>
        </div>
        <p className="text-muted-foreground ml-[52px]">
          Discover scholarships that match your goals and save your favorites.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 items-start">
        {/* Filter sidebar */}
        <FilterPanel
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleReset}
        />

        {/* Results area */}
        <div>
          {/* Results meta bar */}
          {!isLoading && (
            <div
              className="flex items-center justify-between mb-5"
              data-ocid="scholarships.results_bar"
            >
              <div className="flex items-center gap-2">
                <span className="font-display font-semibold text-foreground">
                  {filtered.length}
                </span>
                <span className="text-muted-foreground text-sm">
                  scholarship{filtered.length !== 1 ? "s" : ""} found
                </span>
                {isAuthenticated && shortlistIds.length > 0 && (
                  <Badge
                    variant="outline"
                    className="ml-2 text-xs border-accent/40 text-accent gap-1"
                  >
                    <Star className="h-3 w-3 fill-accent" />
                    {shortlistIds.length} saved
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Loading state */}
          {isLoading && (
            <div
              className="flex flex-col items-center justify-center py-24"
              data-ocid="scholarships.loading_state"
            >
              <LoadingSpinner size="lg" label="Loading scholarships…" />
            </div>
          )}

          {/* Empty state */}
          {!isLoading && filtered.length === 0 && (
            <EmptyState
              icon={Search}
              title={
                scholarships.length === 0
                  ? "No scholarships available"
                  : "No results match your filters"
              }
              description={
                scholarships.length === 0
                  ? "Scholarships will appear here once they are added."
                  : "Try adjusting your search terms or clearing some filters."
              }
              actionLabel={
                scholarships.length > 0 ? "Clear filters" : undefined
              }
              onAction={scholarships.length > 0 ? handleReset : undefined}
              className="mt-8"
            />
          )}

          {/* Results grid */}
          {!isLoading && filtered.length > 0 && (
            <div
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
              data-ocid="scholarships.list"
            >
              {filtered.map((scholarship, index) => (
                <ScholarshipCard
                  key={String(scholarship.id)}
                  scholarship={scholarship}
                  isShortlisted={shortlistSet.has(String(scholarship.id))}
                  isAuthenticated={isAuthenticated}
                  onToggleShortlist={handleToggleShortlist}
                  index={index + 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
