import AnimatedCard from "@/components/AnimatedCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const TEMPLATES = [
  {
    name: "Hero's Journey",
    emoji: "🧞",
    desc: "Challenge → transformation → new identity. Classic arc for overcoming adversity essays.",
    structure: [
      "Set the scene of your ordinary world",
      "Describe the call to challenge",
      "Show the struggle and failure points",
      "Reveal the transformation",
      "Land on who you are now",
    ],
  },
  {
    name: "Obstacle Overcome",
    emoji: "🧱",
    desc: "Zoom in on one barrier. Show agency, resilience, and growth.",
    structure: [
      "Open with the moment of impact",
      "Give just enough backstory",
      "Show your decision point",
      "Describe the action you took",
      "Reflect on the lesson",
    ],
  },
  {
    name: "Identity Moment",
    emoji: "🧳",
    desc: "One specific instant that crystallised who you are or where you're from.",
    structure: [
      "Start in the scene — sensory detail",
      "Introduce the tension of identity",
      "Show your realisation",
      "Connect to your values",
      "Bridge to college goals",
    ],
  },
  {
    name: "Family Impact",
    emoji: "👨‍👩‍👧",
    desc: "Explore how family shaped your worldview, goals, or work ethic.",
    structure: [
      "Tell a specific family story",
      "Show what it taught you",
      "Describe how it drives you",
      "Avoid making it about your parents, not you",
      "End with your independent vision",
    ],
  },
  {
    name: "Cultural Perspective",
    emoji: "🌍",
    desc: "Two cultures, one person. Show the unique vantage point this gives you.",
    structure: [
      "Open with the cultural contrast",
      "Avoid broad generalisations",
      "Focus on one specific experience",
      "Show how it sharpens your thinking",
      "Explain what you'll bring to campus",
    ],
  },
  {
    name: "Social Issue",
    emoji: "⚖️",
    desc: "A cause you care about — shown through personal action, not abstract ideals.",
    structure: [
      "Open with a concrete moment, not stats",
      "Explain why it became personal",
      "Describe what you actually did about it",
      "Show complexity and nuance",
      "Reflect on what's left to do",
    ],
  },
  {
    name: "Career Passion",
    emoji: "🔭",
    desc: "When you realised what you want to build or do in the world.",
    structure: [
      "Start with the spark moment",
      "Describe how you pursued it",
      "Include a failure or detour",
      "Show your current depth of knowledge",
      "Connect to a specific college programme",
    ],
  },
  {
    name: "Leadership",
    emoji: "📌",
    desc: "Leading through uncertainty or conflict, not just holding a title.",
    structure: [
      "Open with the team crisis or challenge",
      "Show your decision process",
      "Describe the moment of action",
      "Reflect on what leadership actually means",
      "What would you do differently?",
    ],
  },
  {
    name: "Innovation",
    emoji: "💡",
    desc: "You noticed a problem and built or designed something to solve it.",
    structure: [
      "Open with the problem you spotted",
      "Explain your thinking process",
      "Show the build, prototype, or experiment",
      "Include what broke and what you fixed",
      "Where does this take you next?",
    ],
  },
  {
    name: "Growth Mindset",
    emoji: "🌱",
    desc: "You used to think X. Something happened. Now you think Y.",
    structure: [
      "State your old belief or habit",
      "Describe the experience that challenged it",
      "Show the internal struggle",
      "Reveal the shift in thinking",
      "Land on the new version of you",
    ],
  },
];

export default function PersonalTemplates() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-xl font-bold text-foreground">
          📚 Personal Statement Templates
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          10 proven essay structures. Click any to see the step-by-step
          skeleton.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {TEMPLATES.map((t, i) => (
          <AnimatedCard key={t.name} delay={i * 0.06}>
            <Card className="h-full hover:shadow-lg transition-shadow duration-200 group">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{t.emoji}</span>
                  <div>
                    <p className="font-bold text-foreground text-sm">
                      {t.name}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                      {t.desc}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <ol className="space-y-1.5">
                  {t.structure.map((step, j) => (
                    <li
                      key={step}
                      className="flex items-start gap-2 text-xs text-muted-foreground"
                    >
                      <span className="w-4 h-4 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        {j + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </AnimatedCard>
        ))}
      </div>
    </div>
  );
}
