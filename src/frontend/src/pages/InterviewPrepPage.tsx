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
import {
  useInterviewQuestions,
  useSubmitInterviewAnswer,
} from "@/hooks/useQueries";
import type { InterviewFeedback, InterviewQuestion } from "@/types";

import { Mic } from "lucide-react";
import { useState } from "react";

function ScoreBadge({ score }: { score: number | bigint }) {
  const s = typeof score === "bigint" ? Number(score) : score;
  let cls = "bg-accent/15 text-accent border-accent/30";
  if (s < 60) cls = "bg-destructive/10 text-destructive border-destructive/30";
  else if (s < 80) cls = "bg-primary/10 text-primary border-primary/30";
  return (
    <Badge className={`border ${cls} font-display text-sm px-2.5`}>
      {s}/100
    </Badge>
  );
}

function QuestionCard({
  q,
  index,
  collegeName,
}: { q: InterviewQuestion; index: number; collegeName: string }) {
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<InterviewFeedback | null>(null);
  const submitMutation = useSubmitInterviewAnswer();

  const handleSubmit = async () => {
    if (!answer.trim()) return;
    const res = await submitMutation.mutateAsync({
      question: q.question,
      answer,
      collegeName,
    });
    setFeedback(res as unknown as InterviewFeedback);
  };

  return (
    <Card data-ocid={`interview-prep.question.${index + 1}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs shrink-0">
            {q.category}
          </Badge>
          <CardTitle className="text-sm leading-snug">{q.question}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Textarea
          data-ocid={`interview-prep.answer_textarea.${index + 1}`}
          placeholder="Type your answer here..."
          className="min-h-[100px] resize-y"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />
        <Button
          type="button"
          size="sm"
          data-ocid={`interview-prep.submit_answer.${index + 1}`}
          disabled={!answer.trim() || submitMutation.isPending}
          onClick={handleSubmit}
        >
          {submitMutation.isPending ? "Evaluating…" : "Get Feedback"}
        </Button>
        {feedback && (
          <div
            className="pt-2 space-y-2"
            data-ocid={`interview-prep.feedback.${index + 1}`}
          >
            <div className="flex items-center gap-2">
              <ScoreBadge score={feedback.score} />
              <p className="text-sm text-muted-foreground">
                {feedback.feedback}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function InterviewPrepPage() {
  const [college, setCollege] = useState("");
  const [major, setMajor] = useState("");
  const [started, setStarted] = useState(false);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const questionsMutation = useInterviewQuestions();

  const handleStart = async () => {
    setStarted(true);
    setIsLoading(true);
    try {
      const res = await questionsMutation.mutateAsync({
        collegeName: college,
        major,
      });
      setQuestions(res);
    } catch {
      setQuestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Mic className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            Interview Prep
          </h1>
        </div>
        <p className="text-muted-foreground">
          Practice AI-generated interview questions specific to your target
          college and major.
        </p>
      </div>
      {!started && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Set Up Practice Session</CardTitle>
            <CardDescription>
              Enter your target college and major to get tailored questions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="ip-college">Target College</Label>
                <input
                  id="ip-college"
                  data-ocid="interview-prep.college_input"
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  placeholder="e.g. MIT"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ip-major">Major</Label>
                <input
                  id="ip-major"
                  data-ocid="interview-prep.major_input"
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  placeholder="e.g. Computer Science"
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                />
              </div>
            </div>
            <Button
              type="button"
              data-ocid="interview-prep.start_button"
              disabled={
                !college.trim() || !major.trim() || questionsMutation.isPending
              }
              onClick={handleStart}
              className="w-full"
            >
              {questionsMutation.isPending
                ? "Loading…"
                : "Start Practice Session"}
            </Button>
          </CardContent>
        </Card>
      )}
      {started && isLoading && (
        <div data-ocid="interview-prep.loading_state" className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="h-4 bg-muted animate-pulse rounded w-3/4 mb-3" />
                <div className="h-20 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {started && !isLoading && questions && questions.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {questions.length} questions for <strong>{college}</strong>
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setStarted(false)}
              data-ocid="interview-prep.reset_button"
            >
              Change Setup
            </Button>
          </div>
          {questions.map((q, i) => (
            <QuestionCard
              key={q.question}
              q={q}
              index={i}
              collegeName={college}
            />
          ))}
        </div>
      )}
      {started && !isLoading && (!questions || questions.length === 0) && (
        <Card data-ocid="interview-prep.empty_state">
          <CardContent className="pt-6 text-center py-12">
            <Mic className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              No questions available. Try a different college or major.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
