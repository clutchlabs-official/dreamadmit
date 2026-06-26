import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useReviewEssay } from "@/hooks/useQueries";
import type { EssayReview } from "@/types";
import { FileText } from "lucide-react";
import { useState } from "react";

export default function EssayReviewerPage() {
  const [essay, setEssay] = useState("");
  const [college, setCollege] = useState("");
  const [result, setResult] = useState<EssayReview | null>(null);
  const reviewMutation = useReviewEssay();

  const handleReview = async () => {
    if (!essay.trim()) return;
    const res = await reviewMutation.mutateAsync({
      essay,
      collegeName: college || "General",
    });
    setResult(res);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            Essay Reviewer
          </h1>
        </div>
        <p className="text-muted-foreground">
          Paste your application essay and get AI-powered feedback with a grade,
          strengths, and improvement areas.
        </p>
      </div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Submit Your Essay</CardTitle>
          <CardDescription>
            Optionally name your target college for tailored feedback.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="college-name">Target College (optional)</Label>
            <input
              id="college-name"
              data-ocid="essay-reviewer.college_input"
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="e.g. MIT, Harvard"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="essay-text">Essay Text</Label>
            <Textarea
              id="essay-text"
              data-ocid="essay-reviewer.essay_textarea"
              placeholder="Paste your application essay here..."
              className="min-h-[280px] resize-y"
              value={essay}
              onChange={(e) => setEssay(e.target.value)}
            />
          </div>
          <Button
            type="button"
            data-ocid="essay-reviewer.submit_button"
            disabled={!essay.trim() || reviewMutation.isPending}
            onClick={handleReview}
            className="w-full"
          >
            {reviewMutation.isPending ? "Analyzing…" : "Review My Essay"}
          </Button>
        </CardContent>
      </Card>
      {reviewMutation.isError && (
        <Card
          className="border-destructive/50 bg-destructive/5"
          data-ocid="essay-reviewer.error_state"
        >
          <CardContent className="pt-6">
            <p className="text-destructive text-sm">
              Failed to review essay. Please try again.
            </p>
          </CardContent>
        </Card>
      )}
      {result && (
        <Card data-ocid="essay-reviewer.success_state">
          <CardHeader>
            <CardTitle>Review Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Grade</p>
                <span className="text-3xl font-bold text-primary">
                  {result.grade}
                </span>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Score</p>
                <Badge variant="default" className="text-base px-3 py-1">
                  {Number(result.overallScore)}/10
                </Badge>
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">Feedback</p>
                <p className="text-sm">{result.feedback}</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="border-green-200 dark:border-green-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-green-700 dark:text-green-400">
                    ✓ Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {result.strengths.map((s) => (
                      <li key={s} className="text-sm">
                        • {s}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card className="border-amber-200 dark:border-amber-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-amber-700 dark:text-amber-400">
                    → Improvements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {result.improvements.map((imp) => (
                      <li key={imp} className="text-sm">
                        • {imp}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
