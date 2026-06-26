import AnimatedCard from "@/components/AnimatedCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle2, Clock } from "lucide-react";

const ED_PROS = [
  "Admission rates can be 2–3× higher than RD",
  "Shows colleges your genuine first-choice commitment",
  "Decision by December — less stress over winter break",
  "Stronger financial position if accepted",
];
const ED_CONS = [
  "Binding — you MUST attend if accepted",
  "Cannot compare financial aid offers from other schools",
  "Less time to strengthen your application",
  "Only apply if this is unquestionably your top choice",
];
const RD_PROS = [
  "Apply to many schools and compare offers",
  "More time to boost grades, SAT/ACT scores",
  "Full scholarship and aid comparison possible",
  "Less pressure — non-binding decisions",
];
const RD_CONS = [
  "Lower admission rates than ED at same schools",
  "Decisions come in March–April — longer wait",
  "More applications to manage simultaneously",
  "Financial aid often less favourable vs ED",
];

const TIMELINE = [
  {
    month: "Aug–Sep",
    label: "Research",
    note: "Finalise college list, visit campuses",
    emoji: "🔍",
  },
  {
    month: "Oct 1",
    label: "Common App opens",
    note: "Start essays and activity list",
    emoji: "📝",
  },
  {
    month: "Nov 1",
    label: "ED1 deadline",
    note: "Most selective schools",
    emoji: "🚨",
  },
  {
    month: "Dec 15",
    label: "ED1 decisions",
    note: "Accept + withdraw other apps",
    emoji: "📬",
  },
  {
    month: "Jan 1–15",
    label: "ED2 / RD deadline",
    note: "Apply to remaining schools",
    emoji: "📅",
  },
  {
    month: "Mar–Apr",
    label: "RD decisions",
    note: "Compare, decide by May 1",
    emoji: "🎉",
  },
];

export default function EDvsRD() {
  return (
    <div className="space-y-8">
      <h2 className="font-display text-xl font-bold text-foreground">
        ⚡ Early Decision vs Regular Decision Advisor
      </h2>
      <div className="grid sm:grid-cols-2 gap-5">
        <AnimatedCard delay={0}>
          <Card className="border-amber-300/40 bg-amber-50/20 dark:bg-amber-950/10 h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                ⚡ Early Decision (ED)
              </CardTitle>
              <Badge
                variant="outline"
                className="w-fit text-xs text-amber-700 border-amber-400 bg-amber-50 dark:bg-amber-950/30"
              >
                Binding
              </Badge>
            </CardHeader>
            <CardContent className="space-y-2">
              {ED_PROS.map((p) => (
                <div key={p} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  <span className="text-foreground">{p}</span>
                </div>
              ))}
              {ED_CONS.map((c) => (
                <div key={c} className="flex items-start gap-2 text-sm">
                  <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
                  <span className="text-muted-foreground">{c}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </AnimatedCard>
        <AnimatedCard delay={0.1}>
          <Card className="border-blue-300/40 bg-blue-50/20 dark:bg-blue-950/10 h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                📅 Regular Decision (RD)
              </CardTitle>
              <Badge
                variant="outline"
                className="w-fit text-xs text-blue-700 border-blue-400 bg-blue-50 dark:bg-blue-950/30"
              >
                Non-binding
              </Badge>
            </CardHeader>
            <CardContent className="space-y-2">
              {RD_PROS.map((p) => (
                <div key={p} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  <span className="text-foreground">{p}</span>
                </div>
              ))}
              {RD_CONS.map((c) => (
                <div key={c} className="flex items-start gap-2 text-sm">
                  <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
                  <span className="text-muted-foreground">{c}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </AnimatedCard>
      </div>
      <AnimatedCard delay={0.2}>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" /> Application Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative pl-6">
              <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-border" />
              {TIMELINE.map((t, _i) => (
                <div key={t.month} className="relative mb-4 last:mb-0">
                  <div className="absolute -left-4 top-0.5 w-3 h-3 rounded-full bg-primary border-2 border-background" />
                  <div className="flex items-start gap-3">
                    <span className="text-lg leading-none mt-0.5">
                      {t.emoji}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-primary uppercase tracking-wide">
                        {t.month}
                      </p>
                      <p className="font-semibold text-foreground text-sm">
                        {t.label}
                      </p>
                      <p className="text-xs text-muted-foreground">{t.note}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </AnimatedCard>
    </div>
  );
}
