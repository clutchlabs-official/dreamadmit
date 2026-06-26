import CollegeSearchSelect from "@/components/CollegeSearchSelect";
import EmptyState from "@/components/EmptyState";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useColleges } from "@/hooks/useQueries";
import type { College } from "@/types";
import { FinancialAidTier } from "@/types";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { BarChart3, ExternalLink, PlusCircle, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const AID_TIER_LABEL: Record<FinancialAidTier, string> = {
  [FinancialAidTier.fullRide]: "Full Ride",
  [FinancialAidTier.needBased]: "Need-Based",
  [FinancialAidTier.meritOnly]: "Merit Only",
  [FinancialAidTier.noAid]: "No Aid",
};

const AID_TIER_CLASS: Record<FinancialAidTier, string> = {
  [FinancialAidTier.fullRide]:
    "bg-accent/20 text-accent border-accent/30 font-semibold",
  [FinancialAidTier.needBased]: "bg-primary/15 text-primary border-primary/30",
  [FinancialAidTier.meritOnly]:
    "bg-secondary/40 text-secondary-foreground border-border",
  [FinancialAidTier.noAid]:
    "bg-destructive/15 text-destructive border-destructive/30",
};

const AID_TIER_RANK: Record<FinancialAidTier, number> = {
  [FinancialAidTier.fullRide]: 4,
  [FinancialAidTier.needBased]: 3,
  [FinancialAidTier.meritOnly]: 2,
  [FinancialAidTier.noAid]: 1,
};

function formatTuition(tuition: bigint): string {
  return `${Number(tuition).toLocaleString()}/yr`;
}

type HighlightKey = "tuition" | "acceptanceRate" | "financialAidTier";

function getBestIndex(colleges: College[], key: HighlightKey): number {
  if (colleges.length === 0) return -1;
  if (key === "tuition") {
    const min = Math.min(...colleges.map((c) => Number(c.tuition)));
    return colleges.findIndex((c) => Number(c.tuition) === min);
  }
  if (key === "acceptanceRate") {
    const max = Math.max(...colleges.map((c) => c.acceptanceRate));
    return colleges.findIndex((c) => c.acceptanceRate === max);
  }
  if (key === "financialAidTier") {
    const max = Math.max(
      ...colleges.map((c) => AID_TIER_RANK[c.financialAidTier]),
    );
    return colleges.findIndex((c) => AID_TIER_RANK[c.financialAidTier] === max);
  }
  return -1;
}

function getWorstIndex(colleges: College[], key: HighlightKey): number {
  if (colleges.length === 0) return -1;
  if (key === "tuition") {
    const max = Math.max(...colleges.map((c) => Number(c.tuition)));
    return colleges.findIndex((c) => Number(c.tuition) === max);
  }
  if (key === "acceptanceRate") {
    const min = Math.min(...colleges.map((c) => c.acceptanceRate));
    return colleges.findIndex((c) => c.acceptanceRate === min);
  }
  if (key === "financialAidTier") {
    const min = Math.min(
      ...colleges.map((c) => AID_TIER_RANK[c.financialAidTier]),
    );
    return colleges.findIndex((c) => AID_TIER_RANK[c.financialAidTier] === min);
  }
  return -1;
}

interface TableRowProps {
  label: string;
  children: React.ReactNode[];
  keys: string[];
  className?: string;
}

function TableRow({ label, children, keys, className = "" }: TableRowProps) {
  return (
    <tr className={`border-b border-border last:border-0 ${className}`}>
      <td className="sticky left-0 z-10 bg-muted/60 backdrop-blur-sm px-4 py-3 text-sm font-semibold text-foreground min-w-[130px] w-[130px] border-r border-border">
        {label}
      </td>
      {children.map((child, i) => (
        <td
          key={keys[i]}
          className="px-4 py-3 text-sm text-foreground min-w-[200px] align-top"
        >
          {child}
        </td>
      ))}
    </tr>
  );
}

export default function ComparePage() {
  const { data: allColleges = [], isLoading } = useColleges();
  const navigate = useNavigate();

  // Read ?ids=1,2,3 from URL
  const search = useSearch({ strict: false }) as { ids?: string };
  const urlIds: bigint[] = useMemo(() => {
    if (!search.ids) return [];
    return search.ids
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => BigInt(s));
  }, [search.ids]);

  const [selectedIds, setSelectedIds] = useState<bigint[]>([]);

  // Sync from URL once colleges are loaded
  useEffect(() => {
    if (allColleges.length > 0 && urlIds.length > 0) {
      const valid = urlIds.filter((id) => allColleges.some((c) => c.id === id));
      setSelectedIds(valid.slice(0, 4));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allColleges, urlIds]);

  // Keep URL in sync with selections
  const updateUrl = (ids: bigint[]) => {
    navigate({
      to: "/compare",
      search: ids.length > 0 ? { ids: ids.map(String).join(",") } : {},
      replace: true,
    });
  };

  const selectedColleges = useMemo(
    () =>
      selectedIds
        .map((id) => allColleges.find((c) => c.id === id))
        .filter((c): c is College => Boolean(c)),
    [selectedIds, allColleges],
  );

  const addCollege = (college: College) => {
    if (selectedIds.length >= 4) return;
    const next = [...selectedIds, college.id];
    setSelectedIds(next);
    updateUrl(next);
  };

  const removeCollege = (id: bigint) => {
    const next = selectedIds.filter((sid) => sid !== id);
    setSelectedIds(next);
    updateUrl(next);
  };

  const clearAll = () => {
    setSelectedIds([]);
    updateUrl([]);
  };

  const canAddMore = selectedIds.length < 4;

  // Highlight indices
  const bestTuition = getBestIndex(selectedColleges, "tuition");
  const worstTuition = getWorstIndex(selectedColleges, "tuition");
  const bestAcceptance = getBestIndex(selectedColleges, "acceptanceRate");
  const worstAcceptance = getWorstIndex(selectedColleges, "acceptanceRate");
  const bestAid = getBestIndex(selectedColleges, "financialAidTier");

  return (
    <div className="bg-background min-h-[calc(100vh-4rem)]">
      {/* Page header */}
      <div className="bg-card border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                  Compare Colleges
                </h1>
              </div>
              <p className="text-muted-foreground text-sm pl-[2.75rem]">
                Side-by-side comparison of tuition, acceptance rates, aid &amp;
                more.
              </p>
            </div>
            {selectedColleges.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                data-ocid="compare.clear_all_button"
                className="text-muted-foreground hover:text-destructive gap-1.5 shrink-0"
              >
                <Trash2 className="h-4 w-4" />
                Clear All
              </Button>
            )}
          </div>

          {/* College selector */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {canAddMore ? (
              isLoading ? (
                <div className="text-sm text-muted-foreground">
                  Loading colleges…
                </div>
              ) : (
                <CollegeSearchSelect
                  colleges={allColleges}
                  selectedIds={selectedIds}
                  onSelect={addCollege}
                  disabled={!canAddMore}
                  placeholder={`Add a college (${selectedIds.length}/4)`}
                />
              )
            ) : (
              <div className="text-sm text-muted-foreground bg-muted/50 rounded-md px-3 py-2">
                Maximum 4 colleges selected
              </div>
            )}

            <div className="flex items-center gap-2 flex-wrap">
              {selectedColleges.map((college) => (
                <Badge
                  key={String(college.id)}
                  variant="secondary"
                  className="gap-1.5 pl-3 pr-1.5 py-1 text-xs"
                >
                  <span className="max-w-[160px] truncate">{college.name}</span>
                  <button
                    type="button"
                    onClick={() => removeCollege(college.id)}
                    aria-label={`Remove ${college.name}`}
                    className="hover:text-destructive transition-colors ml-0.5 rounded-sm"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Legend */}
          {selectedColleges.length >= 2 && (
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-sm bg-accent/30 border border-accent/40 inline-block" />
                Best value
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-sm bg-destructive/20 border border-destructive/30 inline-block" />
                Least favorable
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <LoadingSpinner label="Loading college data…" />
        ) : selectedColleges.length < 2 ? (
          <div data-ocid="compare.empty_state">
            <EmptyState
              icon={PlusCircle}
              title="Select at least 2 colleges to compare"
              description="Use the search above to add 2–4 colleges. You can also select colleges from the Colleges page and compare from there."
            />
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <colgroup>
                  <col className="w-[130px]" />
                  {selectedColleges.map((c) => (
                    <col key={String(c.id)} />
                  ))}
                </colgroup>

                {/* Header row */}
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="sticky left-0 z-10 bg-muted/70 backdrop-blur-sm px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground border-r border-border" />
                    {selectedColleges.map((college, idx) => (
                      <th
                        key={String(college.id)}
                        data-ocid={`compare.college_header.${idx + 1}`}
                        className="px-4 py-3 text-left min-w-[200px]"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-display font-bold text-primary text-sm">
                              {college.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="font-display font-semibold text-sm text-foreground leading-tight">
                                {college.name}
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {college.location}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeCollege(college.id)}
                            aria-label={`Remove ${college.name}`}
                            data-ocid={`compare.remove_college_button.${idx + 1}`}
                            className="shrink-0 rounded-md p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {/* Tuition */}
                  <TableRow
                    label="Tuition"
                    keys={selectedColleges.map((c) => String(c.id))}
                  >
                    {selectedColleges.map((college, idx) => (
                      <span
                        key={String(college.id)}
                        className={[
                          "block px-1 py-0.5 rounded font-mono font-medium text-sm",
                          idx === bestTuition
                            ? "text-accent font-bold"
                            : idx === worstTuition
                              ? "text-destructive"
                              : "text-foreground",
                        ].join(" ")}
                      >
                        {idx === bestTuition && (
                          <span className="mr-1 text-xs bg-accent/20 text-accent px-1.5 py-0.5 rounded font-sans">
                            Lowest
                          </span>
                        )}
                        {idx === worstTuition &&
                          selectedColleges.length > 2 && (
                            <span className="mr-1 text-xs bg-destructive/15 text-destructive px-1.5 py-0.5 rounded font-sans">
                              Highest
                            </span>
                          )}
                        {formatTuition(college.tuition)}
                      </span>
                    ))}
                  </TableRow>

                  {/* Acceptance Rate */}
                  <TableRow
                    label="Acceptance Rate"
                    keys={selectedColleges.map((c) => String(c.id))}
                  >
                    {selectedColleges.map((college, idx) => (
                      <span
                        key={String(college.id)}
                        className={[
                          "block font-medium text-sm",
                          idx === bestAcceptance
                            ? "text-accent font-bold"
                            : idx === worstAcceptance
                              ? "text-destructive"
                              : "text-foreground",
                        ].join(" ")}
                      >
                        {idx === bestAcceptance && (
                          <span className="mr-1 text-xs bg-accent/20 text-accent px-1.5 py-0.5 rounded">
                            Highest
                          </span>
                        )}
                        {idx === worstAcceptance &&
                          selectedColleges.length > 2 && (
                            <span className="mr-1 text-xs bg-destructive/15 text-destructive px-1.5 py-0.5 rounded">
                              Lowest
                            </span>
                          )}
                        {(college.acceptanceRate * 100).toFixed(1)}%
                      </span>
                    ))}
                  </TableRow>

                  {/* Financial Aid Tier */}
                  <TableRow
                    label="Financial Aid"
                    keys={selectedColleges.map((c) => String(c.id))}
                  >
                    {selectedColleges.map((college, idx) => (
                      <span
                        key={String(college.id)}
                        className="flex items-center gap-1.5 flex-wrap"
                      >
                        <Badge
                          variant="outline"
                          className={`text-xs ${AID_TIER_CLASS[college.financialAidTier]}`}
                        >
                          {AID_TIER_LABEL[college.financialAidTier]}
                        </Badge>
                        {idx === bestAid && (
                          <span className="text-xs text-accent font-medium">
                            Best
                          </span>
                        )}
                      </span>
                    ))}
                  </TableRow>

                  {/* Majors Offered */}
                  <TableRow
                    label="Majors"
                    keys={selectedColleges.map((c) => String(c.id))}
                  >
                    {selectedColleges.map((college) => (
                      <div
                        key={String(college.id)}
                        className="flex flex-wrap gap-1"
                      >
                        {college.majorsOffered.slice(0, 6).map((major) => (
                          <Badge
                            key={major}
                            variant="secondary"
                            className="text-xs"
                          >
                            {major}
                          </Badge>
                        ))}
                        {college.majorsOffered.length > 6 && (
                          <Badge
                            variant="outline"
                            className="text-xs text-muted-foreground"
                          >
                            +{college.majorsOffered.length - 6} more
                          </Badge>
                        )}
                      </div>
                    ))}
                  </TableRow>

                  {/* Housing */}
                  <TableRow
                    label="Housing"
                    keys={selectedColleges.map((c) => String(c.id))}
                  >
                    {selectedColleges.map((college) => (
                      <span
                        key={String(college.id)}
                        className="text-sm text-foreground leading-relaxed"
                      >
                        {college.housingInfo || (
                          <span className="text-muted-foreground italic">
                            Not available
                          </span>
                        )}
                      </span>
                    ))}
                  </TableRow>

                  {/* Website */}
                  <TableRow
                    label="Website"
                    keys={selectedColleges.map((c) => String(c.id))}
                  >
                    {selectedColleges.map((college) =>
                      college.website ? (
                        <a
                          key={String(college.id)}
                          href={college.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-ocid={`compare.website_link.${selectedColleges.indexOf(college) + 1}`}
                          className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline transition-colors group"
                        >
                          <ExternalLink className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
                          Visit site
                        </a>
                      ) : (
                        <span
                          key={String(college.id)}
                          className="text-sm text-muted-foreground italic"
                        >
                          Not available
                        </span>
                      ),
                    )}
                  </TableRow>
                </tbody>
              </table>
            </div>

            {/* Footer: Add more */}
            {canAddMore && (
              <div className="border-t border-border bg-muted/30 px-4 py-3 flex items-center gap-3">
                <PlusCircle className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-sm text-muted-foreground">
                  You can compare up to 4 colleges.
                </span>
                <CollegeSearchSelect
                  colleges={allColleges}
                  selectedIds={selectedIds}
                  onSelect={addCollege}
                  placeholder="Add another college"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
