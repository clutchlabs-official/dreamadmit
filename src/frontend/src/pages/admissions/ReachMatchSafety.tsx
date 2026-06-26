import AnimatedCard from "@/components/AnimatedCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles } from "lucide-react";
import { useState } from "react";

type Bucket = "reach" | "match" | "safety" | "unsorted";
interface College {
  name: string;
  emoji: string;
  bucket: Bucket;
}

const INITIAL: College[] = [
  { name: "MIT", emoji: "🏛️", bucket: "unsorted" },
  { name: "Stanford University", emoji: "🌲", bucket: "unsorted" },
  { name: "University of Michigan", emoji: "〽️", bucket: "unsorted" },
  { name: "University of Alabama", emoji: "🐘", bucket: "unsorted" },
  { name: "Truman State University", emoji: "🐾", bucket: "unsorted" },
  { name: "Tulane University", emoji: "🌿", bucket: "unsorted" },
];

const AUTO_SORT: Bucket[] = [
  "reach",
  "reach",
  "match",
  "match",
  "safety",
  "safety",
];

const BUCKETS: {
  id: Bucket;
  label: string;
  emoji: string;
  desc: string;
  color: string;
}[] = [
  {
    id: "reach",
    label: "Reach",
    emoji: "🚀",
    desc: "Aim high — acceptance below 20% or above your stats",
    color: "border-red-400/30 bg-red-50/30 dark:bg-red-950/20",
  },
  {
    id: "match",
    label: "Match",
    emoji: "🎯",
    desc: "Your stats fit well — 40–70% acceptance",
    color: "border-amber-400/30 bg-amber-50/30 dark:bg-amber-950/20",
  },
  {
    id: "safety",
    label: "Safety",
    emoji: "🛡️",
    desc: "Strong chance — 70%+ acceptance, well above your stats",
    color: "border-green-400/30 bg-green-50/30 dark:bg-green-950/20",
  },
];

export default function ReachMatchSafety() {
  const [colleges, setColleges] = useState<College[]>(INITIAL);
  const [sorted, setSorted] = useState(false);

  function move(name: string, bucket: Bucket) {
    setColleges((prev) =>
      prev.map((c) => (c.name === name ? { ...c, bucket } : c)),
    );
  }

  function autoSort() {
    setColleges(INITIAL.map((c, i) => ({ ...c, bucket: AUTO_SORT[i] })));
    setSorted(true);
  }

  const unsorted = colleges.filter((c) => c.bucket === "unsorted");

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 className="font-display text-xl font-bold text-foreground">
          🚦 Reach / Match / Safety Sorter
        </h2>
        <Button
          onClick={autoSort}
          size="sm"
          className="gap-2"
          data-ocid="sorter.auto_sort.button"
        >
          <Sparkles className="h-4 w-4" /> AI Auto-Sort
        </Button>
      </div>
      {sorted && (
        <div className="mb-4 p-3 rounded-xl bg-primary/10 border border-primary/20 text-sm text-primary font-medium">
          ✨ AI sorted your list based on acceptance rates and your profile
          stats.
        </div>
      )}
      {unsorted.length > 0 && (
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-3">
            Unsorted colleges — tap a bucket below to move them:
          </p>
          <div className="flex flex-wrap gap-2">
            {unsorted.map((c) => (
              <AnimatedCard key={c.name}>
                <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-3 py-2 text-sm shadow-sm">
                  <span>{c.emoji}</span>
                  <span className="font-medium text-foreground">{c.name}</span>
                  <div className="flex gap-1 ml-2">
                    {BUCKETS.map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => move(c.name, b.id)}
                        className="text-[10px] px-1.5 py-0.5 rounded-full border border-border hover:bg-primary hover:text-primary-foreground transition-colors duration-150"
                        data-ocid={`sorter.${c.name.toLowerCase().replace(/ /g, "_")}.${b.id}`}
                      >
                        {b.emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      )}
      <div className="grid sm:grid-cols-3 gap-4">
        {BUCKETS.map((b) => (
          <AnimatedCard key={b.id}>
            <Card className={`border-2 ${b.color} min-h-[180px]`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <span>{b.emoji}</span> {b.label}
                </CardTitle>
                <p className="text-xs text-muted-foreground">{b.desc}</p>
              </CardHeader>
              <CardContent className="space-y-2">
                {colleges
                  .filter((c) => c.bucket === b.id)
                  .map((c) => (
                    <div
                      key={c.name}
                      className="flex items-center gap-2 p-2 rounded-lg bg-background border border-border text-sm"
                    >
                      <span>{c.emoji}</span>
                      <span className="flex-1 font-medium text-foreground min-w-0 truncate">
                        {c.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => move(c.name, "unsorted")}
                        className="text-muted-foreground hover:text-destructive text-xs transition-colors"
                        data-ocid={`sorter.remove.${c.name.toLowerCase().replace(/ /g, "_")}`}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                {colleges.filter((c) => c.bucket === b.id).length === 0 && (
                  <p
                    className="text-xs text-muted-foreground italic text-center py-4"
                    data-ocid={`sorter.${b.id}.empty_state`}
                  >
                    Drop colleges here
                  </p>
                )}
              </CardContent>
            </Card>
          </AnimatedCard>
        ))}
      </div>
    </div>
  );
}
