import AnimatedCard from "@/components/AnimatedCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const IDEAS = [
  {
    category: "Identity",
    emoji: "🌎",
    prompt: "The moment you realised your identity shaped your perspective",
    points: [
      "Describe a specific moment — not a broad feeling",
      "Show how your background gave you a unique lens",
      "Connect it to how you'll contribute to campus community",
      "Avoid clichés like 'bridging two worlds'",
    ],
  },
  {
    category: "Challenge",
    emoji: "🌊",
    prompt: "A time you faced a real setback and what you did next",
    points: [
      "Be specific about the obstacle — not vague hardship",
      "Focus 30% on the problem, 70% on your response",
      "Show agency: what did YOU decide to do?",
      "What changed in you as a result?",
    ],
  },
  {
    category: "Achievement",
    emoji: "🏆",
    prompt: "An accomplishment that changed how you see yourself",
    points: [
      "Don't just list the achievement — show the journey",
      "Include the failure or struggle before the win",
      "Explain why it matters to you, not how impressive it sounds",
      "What did it reveal about your character?",
    ],
  },
  {
    category: "Community",
    emoji: "🤝",
    prompt: "How you've made a difference in your community",
    points: [
      "Define 'community' broadly — family, team, online, neighbourhood",
      "Show a specific action you took, not just involvement",
      "What did you learn about leadership or empathy?",
      "How will you carry this into college?",
    ],
  },
  {
    category: "Intellectual Curiosity",
    emoji: "🔬",
    prompt: "A topic or idea that you can't stop thinking about",
    points: [
      "Start with the rabbit hole — what pulled you in?",
      "Show depth: what questions does it raise for you?",
      "Connect it to an academic interest or major",
      "Avoid sounding like a textbook — make it personal",
    ],
  },
  {
    category: "Background",
    emoji: "🏠",
    prompt: "A place, object, or tradition that defines your background",
    points: [
      "Use sensory details to paint the scene",
      "Show how this background gave you strengths others may lack",
      "Avoid the 'immigrant story' cliché — zoom into specifics",
      "End with what you're bringing to campus, not what you left behind",
    ],
  },
];

export default function EssayIdeas() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h2 className="font-display text-xl font-bold text-foreground">
          💡 Essay Idea Generator
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Click any prompt to expand talking points you can build your essay
          around.
        </p>
      </div>
      {IDEAS.map((idea, i) => (
        <AnimatedCard key={idea.category} delay={i * 0.07}>
          <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200">
            <button
              type="button"
              className="w-full text-left"
              onClick={() =>
                setExpanded(expanded === idea.category ? null : idea.category)
              }
              data-ocid={`ideas.${idea.category.toLowerCase().replace(/ /g, "_")}.toggle`}
            >
              <div className="flex items-center justify-between p-4 gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{idea.emoji}</span>
                  <div>
                    <Badge variant="outline" className="text-[10px] mb-1">
                      {idea.category}
                    </Badge>
                    <p className="font-medium text-foreground text-sm">
                      {idea.prompt}
                    </p>
                  </div>
                </div>
                {expanded === idea.category ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                )}
              </div>
            </button>
            {expanded === idea.category && (
              <CardContent className="pt-0 pb-4 px-4">
                <div className="pt-3 border-t border-border space-y-2">
                  <p className="text-xs font-semibold text-primary uppercase tracking-wide">
                    Talking Points
                  </p>
                  {idea.points.map((pt) => (
                    <div key={pt} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      <p className="text-sm text-muted-foreground">{pt}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        </AnimatedCard>
      ))}
    </div>
  );
}
