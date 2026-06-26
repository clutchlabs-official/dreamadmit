import AnimatedCard from "@/components/AnimatedCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

const COLLEGE_SUPPLEMENTS: Record<
  string,
  { prompt: string; suggestion: string }[]
> = {
  mit: [
    {
      prompt: "Why MIT? (100 words)",
      suggestion:
        "Reference a specific lab, professor, or research group. Show you know MIT's hacker culture and STEM ethos.",
    },
    {
      prompt: "Describe your background, identity, or community. (200 words)",
      suggestion:
        "Show the intersection of your identity and intellectual curiosity.",
    },
  ],
  stanford: [
    {
      prompt:
        "What is the most significant challenge that society faces today? (250 words)",
      suggestion:
        "Tie your answer to your specific academic interests and future vision.",
    },
    {
      prompt: "How did you spend your last two summers? (250 words)",
      suggestion:
        "Show depth — not just list events. Focus on what you learned.",
    },
    {
      prompt:
        "Roommate essay — what would you want your roommate to know? (250 words)",
      suggestion: "Be fun and personal. Show your quirks and values.",
    },
  ],
  harvard: [
    {
      prompt:
        "Write a brief description of your intellectual interests. (150 words)",
      suggestion:
        "Reference a Harvard professor, course, or research centre related to your interests.",
    },
    {
      prompt: "Future plans and why Harvard? (150 words)",
      suggestion:
        "Mention a specific Harvard resource — lab, joint degree, extracurricular organisation.",
    },
  ],
  columbia: [
    {
      prompt: "Why Columbia? (200 words)",
      suggestion:
        "Reference the Core Curriculum specifically and how it aligns with your intellectual breadth.",
    },
    {
      prompt: "What list would you put Columbia on? (75 words)",
      suggestion:
        "Be creative and playful — this is a chance to show personality.",
    },
  ],
};

const DEFAULT_SUGGESTIONS = [
  {
    prompt: "Why [College]? (250 words)",
    suggestion:
      "Research a specific programme, faculty member, club, or tradition unique to this school. Generic answers fail here.",
  },
  {
    prompt: "Diversity contribution (200 words)",
    suggestion:
      "Share how your background, perspective, or experience will enrich the campus community.",
  },
  {
    prompt: "Extracurricular deep dive (150 words)",
    suggestion:
      "Pick your most meaningful activity and explain the depth of your commitment and what you built.",
  },
];

export default function SupplementalHelper() {
  const [input, setInput] = useState("");
  const [college, setCollege] = useState<string | null>(null);

  function search() {
    const key = input
      .toLowerCase()
      .replace(/university|college|of|the|\s+/g, " ")
      .trim()
      .split(" ")[0];
    setCollege(COLLEGE_SUPPLEMENTS[key] ? key : "default");
  }

  const prompts =
    college === "default"
      ? DEFAULT_SUGGESTIONS
      : college
        ? COLLEGE_SUPPLEMENTS[college]
        : null;

  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl font-bold text-foreground">
        🏛️ Supplemental Essay Helper
      </h2>
      <AnimatedCard>
        <div className="flex gap-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && search()}
            placeholder="Enter college name (e.g. MIT, Stanford, Harvard...)"
            className="flex-1"
            data-ocid="supplemental.college.input"
          />
          <Button
            onClick={search}
            size="sm"
            className="gap-1.5"
            data-ocid="supplemental.search.button"
          >
            <Search className="h-4 w-4" /> Show Prompts
          </Button>
        </div>
      </AnimatedCard>
      {prompts && (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-foreground">
            {college === "default"
              ? "General Supplemental Prompts"
              : `Typical prompts for ${input}`}
          </p>
          {prompts.map((p, i) => (
            <AnimatedCard key={p.prompt} delay={i * 0.07}>
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="text-[10px] border-primary/30 text-primary"
                    >
                      Prompt {i + 1}
                    </Badge>
                    {p.prompt}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    ✨ <span className="font-medium">Strategy:</span>{" "}
                    {p.suggestion}
                  </p>
                </CardContent>
              </Card>
            </AnimatedCard>
          ))}
        </div>
      )}
    </div>
  );
}
