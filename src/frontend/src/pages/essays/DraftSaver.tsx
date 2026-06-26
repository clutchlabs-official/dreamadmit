import AnimatedCard from "@/components/AnimatedCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, RotateCcw } from "lucide-react";

const DRAFTS = [
  {
    title: "Common App Personal Statement",
    wordCount: 612,
    date: "May 28, 2026",
    version: "v3",
    excerpt:
      "The first time I disassembled a transistor radio at age nine, I didn't know I was beginning a decade-long conversation with electricity...",
    status: "Polishing",
    statusColor:
      "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300",
  },
  {
    title: "MIT \u2014 Why MIT Supplement",
    wordCount: 98,
    date: "May 22, 2026",
    version: "v2",
    excerpt:
      "MIT's PRIMES programme and Professor Erik Demaine's computational origami research are the specific threads I want to pull on...",
    status: "First Draft",
    statusColor:
      "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300",
  },
  {
    title: "Stanford \u2014 Roommate Essay",
    wordCount: 243,
    date: "May 19, 2026",
    version: "v1",
    excerpt:
      "Fair warning: I keep a spreadsheet of every book I've read since 2021, sorted by 'moments that changed my mind'. You'll find me annotating...",
    status: "Complete",
    statusColor:
      "bg-green-100 text-green-700 border-green-200 dark:bg-green-950/40 dark:text-green-300",
  },
];

export default function DraftSaver() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="font-display text-xl font-bold text-foreground">
          💾 Multiple Draft Saver
        </h2>
        <Button size="sm" data-ocid="drafts.new.button">
          + New Draft
        </Button>
      </div>
      <div className="space-y-4">
        {DRAFTS.map((d, i) => (
          <AnimatedCard key={d.title} delay={i * 0.08}>
            <Card
              className="hover:shadow-md transition-shadow duration-200"
              data-ocid={`drafts.item.${i + 1}`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between flex-wrap gap-2">
                  <div className="min-w-0">
                    <CardTitle className="text-sm truncate">
                      {d.title}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {d.wordCount} words · Last saved {d.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="outline" className="text-[10px]">
                      {d.version}
                    </Badge>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${d.statusColor}`}
                    >
                      {d.status}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <p className="text-xs text-muted-foreground italic leading-relaxed line-clamp-2">
                  {d.excerpt}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-xs"
                    data-ocid={`drafts.view.${i + 1}.button`}
                  >
                    <Eye className="h-3.5 w-3.5" /> View
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 text-xs"
                    data-ocid={`drafts.restore.${i + 1}.button`}
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> Restore
                  </Button>
                </div>
              </CardContent>
            </Card>
          </AnimatedCard>
        ))}
      </div>
    </div>
  );
}
