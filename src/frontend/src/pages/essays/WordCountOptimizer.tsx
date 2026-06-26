import AnimatedCard from "@/components/AnimatedCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Scissors, TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";

const FILLER_PHRASES = [
  "in order to",
  "the fact that",
  "it is important to note",
  "due to the fact",
  "in my opinion",
  "I believe that",
  "at the end of the day",
  "needless to say",
];
const POWER_PHRASES = [
  "built",
  "created",
  "led",
  "designed",
  "launched",
  "solved",
  "discovered",
  "challenged",
  "transformed",
  "founded",
];

function analyse(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const lowerText = text.toLowerCase();
  const fillers = FILLER_PHRASES.filter((p) => lowerText.includes(p));
  const keepers = POWER_PHRASES.filter((p) => lowerText.includes(p));
  return { words, fillers, keepers };
}

export default function WordCountOptimizer() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<ReturnType<typeof analyse> | null>(null);

  function run() {
    if (text.trim().length < 30) return;
    setResult(analyse(text));
  }

  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl font-bold text-foreground">
        ✂️ Word Count Optimizer
      </h2>
      <AnimatedCard>
        <div className="space-y-3">
          <Textarea
            rows={8}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your essay here and click Analyse..."
            data-ocid="wordcount.essay.textarea"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {text.trim().split(/\s+/).filter(Boolean).length} words
            </span>
            <Button
              size="sm"
              onClick={run}
              className="gap-1.5"
              data-ocid="wordcount.analyse.button"
            >
              <Scissors className="h-4 w-4" /> Analyse
            </Button>
          </div>
        </div>
      </AnimatedCard>
      {result && (
        <div className="grid sm:grid-cols-3 gap-4">
          <AnimatedCard>
            <Card className="text-center border-primary/20 bg-primary/5">
              <CardContent className="pt-5 pb-5">
                <p className="text-3xl font-bold text-foreground">
                  {result.words}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Total Words
                </p>
              </CardContent>
            </Card>
          </AnimatedCard>
          <AnimatedCard delay={0.08}>
            <Card className="border-red-200 bg-red-50/40 dark:bg-red-950/20 h-full">
              <CardHeader className="pb-1">
                <CardTitle className="text-sm flex items-center gap-1.5 text-red-600 dark:text-red-400">
                  <TrendingDown className="h-4 w-4" /> Cut These
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {result.fillers.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">
                    No filler phrases found — great!
                  </p>
                ) : (
                  <ul className="space-y-1">
                    {result.fillers.map((f) => (
                      <li
                        key={f}
                        className="text-xs text-red-600 dark:text-red-400 font-mono bg-red-100/60 dark:bg-red-950/30 px-2 py-0.5 rounded"
                      >
                        &ldquo;{f}&rdquo;
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </AnimatedCard>
          <AnimatedCard delay={0.16}>
            <Card className="border-green-200 bg-green-50/40 dark:bg-green-950/20 h-full">
              <CardHeader className="pb-1">
                <CardTitle className="text-sm flex items-center gap-1.5 text-green-600 dark:text-green-400">
                  <TrendingUp className="h-4 w-4" /> Keep These
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {result.keepers.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">
                    Add strong action verbs to power up your essay.
                  </p>
                ) : (
                  <ul className="space-y-1">
                    {result.keepers.map((k) => (
                      <li
                        key={k}
                        className="text-xs text-green-600 dark:text-green-400 font-mono bg-green-100/60 dark:bg-green-950/30 px-2 py-0.5 rounded"
                      >
                        &ldquo;{k}&rdquo;
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </AnimatedCard>
        </div>
      )}
    </div>
  );
}
