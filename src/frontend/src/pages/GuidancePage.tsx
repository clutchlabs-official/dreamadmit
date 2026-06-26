import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import {
  useAiSuggestions,
  useGeminiApiKeyStatus,
  useStudentProfile,
} from "@/hooks/useQueries";
import type { AiSuggestion, StudentProfile } from "@/types";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  CheckCircle,
  ClipboardCopy,
  Lightbulb,
  MessageSquare,
  Sparkles,
  Star,
  User,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).then(() => {
    toast.success("Copied to clipboard!", { duration: 2000 });
  });
}

function BulletItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3 py-2.5 border-b border-border/50 last:border-0">
      <span className="flex-1 text-sm text-foreground leading-relaxed">
        {text}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-7 w-7 shrink-0 text-muted-foreground hover:text-foreground"
        onClick={() => copyToClipboard(text)}
        aria-label="Copy to clipboard"
        data-ocid="guidance.copy_button"
      >
        <ClipboardCopy className="h-3.5 w-3.5" />
      </Button>
    </li>
  );
}

interface SectionCardProps {
  title: string;
  icon: React.ReactNode;
  items: string[];
  colorClass: string;
  bgClass: string;
  ocid: string;
}

function SectionCard({
  title,
  icon,
  items,
  colorClass,
  bgClass,
  ocid,
}: SectionCardProps) {
  if (items.length === 0) return null;
  return (
    <Card className="shadow-sm" data-ocid={ocid}>
      <CardHeader className={`rounded-t-lg ${bgClass} pb-3`}>
        <CardTitle
          className={`flex items-center gap-2.5 text-base font-display ${colorClass}`}
        >
          {icon}
          {title}
          <span className="ml-auto text-xs font-body font-normal opacity-70">
            {items.length} items
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2 pb-3">
        <ul className="divide-y-0">
          {items.map((item, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static ordered list
            <BulletItem key={i} text={item} />
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function ResultsSkeleton() {
  return (
    <div
      className="grid gap-4 md:grid-cols-2"
      data-ocid="guidance.loading_state"
    >
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="shadow-sm">
          <CardHeader className="pb-3">
            <Skeleton className="h-5 w-40" />
          </CardHeader>
          <CardContent className="space-y-2.5">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-4/5" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function hasEmptyFields(profile: StudentProfile): boolean {
  return (
    !profile.gpa ||
    !profile.satScore ||
    !profile.actScore ||
    profile.extracurriculars.length === 0 ||
    profile.workExperience.length === 0
  );
}

export default function GuidancePage() {
  const { isAuthenticated, isLoading: authLoading, login } = useAuth();
  const { data: profile, isLoading: profileLoading } = useStudentProfile();
  const { data: aiConnected, isLoading: aiStatusLoading } =
    useGeminiApiKeyStatus();
  const aiMutation = useAiSuggestions();
  const [result, setResult] = useState<AiSuggestion | null>(null);

  const handleGenerate = () => {
    if (!profile) return;
    aiMutation.mutate(profile, {
      onSuccess: (data) => setResult(data),
      onError: () =>
        toast.error("AI generation failed. Please try again later."),
    });
  };

  if (authLoading || profileLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12" data-ocid="guidance.page">
        <ResultsSkeleton />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div
        className="mx-auto max-w-3xl px-4 py-20 flex flex-col items-center gap-6 text-center"
        data-ocid="guidance.page"
      >
        <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
          <User className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">
            Sign in to get AI guidance
          </h2>
          <p className="text-muted-foreground">
            Log in with Internet Identity to generate personalized college
            admissions advice.
          </p>
        </div>
        <Button
          type="button"
          size="lg"
          onClick={login}
          data-ocid="guidance.login_button"
          className="gap-2"
        >
          <Sparkles className="h-4 w-4" />
          Sign In
        </Button>
      </div>
    );
  }

  if (!profile?.intendedMajor) {
    return (
      <div
        className="mx-auto max-w-3xl px-4 py-20 flex flex-col items-center gap-6 text-center"
        data-ocid="guidance.page"
      >
        <div className="h-16 w-16 rounded-2xl bg-accent/10 flex items-center justify-center">
          <Lightbulb className="h-8 w-8 text-accent" />
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">
            Complete your profile first
          </h2>
          <p className="text-muted-foreground max-w-md">
            Fill in your academic details, intended major, dream college, and
            financial aid preferences so our AI can generate tailored guidance.
          </p>
        </div>
        <Button asChild size="lg" data-ocid="guidance.go_to_profile_button">
          <Link to="/profile">Fill in My Profile</Link>
        </Button>
      </div>
    );
  }

  const showTargetScores = result && hasEmptyFields(profile);

  return (
    <div
      className="mx-auto max-w-3xl px-4 sm:px-6 py-8 space-y-6"
      data-ocid="guidance.page"
    >
      {/* AI not configured banner */}
      {!aiStatusLoading && aiConnected === false && (
        <Card
          className="border-yellow-500/30 bg-yellow-50"
          data-ocid="guidance.ai_not_configured_banner"
        >
          <CardContent className="py-4 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-800">
                AI not configured
              </p>
              <p className="text-xs text-yellow-700">
                Please add your Gemini API key in your profile settings to
                generate personalized guidance.
              </p>
            </div>
            <Button
              asChild
              size="sm"
              variant="outline"
              className="border-yellow-600/40 text-yellow-700 hover:bg-yellow-100"
              data-ocid="guidance.go_to_profile_button"
            >
              <Link to="/profile">Go to Profile</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Page header */}
      <div className="space-y-1">
        <h1 className="font-display text-3xl font-bold text-foreground flex items-center gap-3">
          <Sparkles className="h-7 w-7 text-primary" />
          AI Guidance
        </h1>
        <p className="text-muted-foreground">
          Personalized college admissions advice based on your profile.
        </p>
      </div>

      {/* Profile summary */}
      <Card
        className="bg-muted/40 border-border/50"
        data-ocid="guidance.profile_summary"
      >
        <CardContent className="py-4 flex flex-wrap gap-x-6 gap-y-2">
          {[
            { label: "Dream College", value: profile.dreamCollege },
            { label: "Intended Major", value: profile.intendedMajor },
            { label: "Financial Aid", value: profile.financialAidPreference },
            { label: "Courses", value: String(profile.numberOfCourses) },
            ...(profile.studyCountry
              ? [{ label: "Study Country", value: profile.studyCountry }]
              : []),
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
                {label}
              </p>
              <p className="text-sm font-medium text-foreground capitalize">
                {value}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Generate button */}
      <div className="flex items-center gap-4 flex-wrap">
        <Button
          type="button"
          size="lg"
          onClick={handleGenerate}
          disabled={aiMutation.isPending}
          className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-display"
          data-ocid="guidance.generate_button"
        >
          <Sparkles className="h-4 w-4" />
          {aiMutation.isPending
            ? "Generating…"
            : result
              ? "Regenerate"
              : "Generate Guidance"}
        </Button>
      </div>

      {/* Loading skeleton */}
      {aiMutation.isPending && <ResultsSkeleton />}

      {/* Error state */}
      {aiMutation.isError && (
        <Card
          className="border-destructive/40 bg-destructive/5"
          data-ocid="guidance.error_state"
        >
          <CardContent className="py-4 text-sm text-destructive">
            AI guidance is coming soon — check back shortly!
          </CardContent>
        </Card>
      )}

      {/* Results grid */}
      {result && !aiMutation.isPending && (
        <div
          className="grid gap-4 md:grid-cols-2"
          data-ocid="guidance.results_section"
        >
          <SectionCard
            title="Brainstorming Ideas"
            icon={<Lightbulb className="h-4 w-4" />}
            items={result.brainstormingIdeas}
            colorClass="text-primary"
            bgClass="bg-primary/10"
            ocid="guidance.brainstorming_card"
          />
          <SectionCard
            title="Talking Points"
            icon={<MessageSquare className="h-4 w-4" />}
            items={result.talkingPoints}
            colorClass="text-secondary-foreground"
            bgClass="bg-secondary/30"
            ocid="guidance.talking_points_card"
          />
          <SectionCard
            title="Actionable Advice"
            icon={<CheckCircle className="h-4 w-4" />}
            items={result.actionableAdvice}
            colorClass="text-accent"
            bgClass="bg-accent/10"
            ocid="guidance.actionable_advice_card"
          />
          {showTargetScores && (
            <SectionCard
              title="Target Score Suggestions"
              icon={<Star className="h-4 w-4" />}
              items={result.targetScoreSuggestions}
              colorClass="text-muted-foreground"
              bgClass="bg-muted/50"
              ocid="guidance.target_scores_card"
            />
          )}
        </div>
      )}
    </div>
  );
}
