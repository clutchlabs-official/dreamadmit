import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  useExtracurricularRecommendations,
  useStudentProfile,
} from "@/hooks/useQueries";
import type { ExtracurricularRecommendation } from "@/types";
import { Star } from "lucide-react";
import { useState } from "react";

export default function ExtracurricularsPage() {
  const { data: profile } = useStudentProfile();
  const [recommendations, setRecommendations] = useState<
    ExtracurricularRecommendation[]
  >([]);
  const getMutation = useExtracurricularRecommendations();

  const handleGet = async () => {
    if (!profile) return;
    const res = await getMutation.mutateAsync(profile);
    setRecommendations(res);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Star className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            Extracurriculars
          </h1>
        </div>
        <p className="text-muted-foreground">
          Get AI-powered activity suggestions that strengthen your college
          application.
        </p>
      </div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Personalized Recommendations</CardTitle>
          <CardDescription>
            {profile
              ? `Based on: ${profile.intendedMajor || "undeclared"} at ${profile.dreamCollege || "your dream college"}`
              : "Complete your profile first."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            type="button"
            data-ocid="extracurriculars.get_recommendations_button"
            disabled={!profile || getMutation.isPending}
            onClick={handleGet}
            className="w-full"
          >
            {getMutation.isPending
              ? "Getting Recommendations…"
              : "Get Recommendations"}
          </Button>
        </CardContent>
      </Card>
      {getMutation.isPending && (
        <div data-ocid="extracurriculars.loading_state" className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="h-4 w-1/2 bg-muted animate-pulse rounded mb-2" />
                <div className="h-3 w-full bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {getMutation.isError && (
        <Card
          className="border-destructive/50 bg-destructive/5"
          data-ocid="extracurriculars.error_state"
        >
          <CardContent className="pt-6">
            <p className="text-destructive text-sm">
              Failed to get recommendations. Please try again.
            </p>
          </CardContent>
        </Card>
      )}
      {recommendations.length > 0 && (
        <div
          className="space-y-4"
          data-ocid="extracurriculars.recommendations_list"
        >
          <p className="text-sm text-muted-foreground">
            {recommendations.length} recommendations
          </p>
          {recommendations.map((rec, i) => (
            <Card
              key={rec.activity}
              data-ocid={`extracurriculars.recommendation.${i + 1}`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base">{rec.activity}</CardTitle>
                  <Badge variant="secondary" className="shrink-0 text-xs">
                    {rec.impact}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{rec.reason}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {!profile && getMutation.isIdle && (
        <Card data-ocid="extracurriculars.empty_state">
          <CardContent className="text-center py-12">
            <Star className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              Complete your profile to get personalized activity suggestions.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
