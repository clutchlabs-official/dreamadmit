import AnimatedCard from "@/components/AnimatedCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const OPTIONS = [
  {
    emoji: "💼",
    title: "Work & Gain Experience",
    desc: "Get a job or internship in your field of interest. Demonstrates maturity and purpose to admissions committees when you reapply.",
    badge: "Recommended",
    badgeColor: "bg-primary/10 text-primary border-primary/20",
    ideas: [
      "Corporate internship",
      "Research assistant",
      "Tech apprenticeship",
      "Startup role",
    ],
  },
  {
    emoji: "🌍",
    title: "Travel & Cultural Immersion",
    desc: "Live abroad, learn a language, volunteer with international organisations. Compelling material for reapplication essays.",
    badge: "High Impact",
    badgeColor: "bg-accent/10 text-accent border-accent/20",
    ideas: [
      "Language immersion programs",
      "WWOOFing (organic farming)",
      "Backpacking with a purpose",
      "Cultural exchange program",
    ],
  },
  {
    emoji: "🏫",
    title: "Community College",
    desc: "Take relevant coursework to boost your academic profile. Some credits may transfer. Shows academic seriousness.",
    badge: "GPA Booster",
    badgeColor:
      "bg-green-500/10 text-green-700 border-green-300 dark:text-green-400",
    ideas: [
      "Pre-med prerequisite courses",
      "Calculus / Physics",
      "Writing & communication",
      "Business intro courses",
    ],
  },
  {
    emoji: "🤝",
    title: "Volunteer & Service",
    desc: "Commit to a structured volunteer programme. AmeriCorps, Peace Corps (after college), or local NGOs all count as meaningful service.",
    badge: "Character Builder",
    badgeColor:
      "bg-blue-500/10 text-blue-700 border-blue-300 dark:text-blue-400",
    ideas: [
      "AmeriCorps City Year",
      "Habitat for Humanity",
      "Local food bank",
      "Teaching English abroad",
    ],
  },
  {
    emoji: "🚀",
    title: "Launch a Project",
    desc: "Build something — an app, a nonprofit, a YouTube channel, a small business. Unique projects make outstanding reapplication essays.",
    badge: "Stand-Out",
    badgeColor:
      "bg-purple-500/10 text-purple-700 border-purple-300 dark:text-purple-400",
    ideas: [
      "Open source project",
      "Start a tutoring service",
      "Create a community programme",
      "Write and publish content",
    ],
  },
  {
    emoji: "📚",
    title: "Structured Gap Programs",
    desc: "Formal gap year programs like Dynamy, City Year, or Americorps are recognised by admissions offices and may defer your acceptance.",
    badge: "Structured",
    badgeColor:
      "bg-orange-500/10 text-orange-700 border-orange-300 dark:text-orange-400",
    ideas: [
      "Dynamy Internship Year",
      "Global Citizen Year",
      "Princeton Bridge Year",
      "Americorps VISTA",
    ],
  },
];

export default function GapYear() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-foreground mb-1">
          🌱 Gap Year Guidance
        </h2>
        <p className="text-sm text-muted-foreground">
          Not getting in anywhere right now isn't the end — it's a reset. Here
          are six paths that lead to stronger reapplications.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {OPTIONS.map((o, i) => (
          <AnimatedCard key={o.title} delay={i * 0.07}>
            <Card className="h-full hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{o.emoji}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${o.badgeColor}`}
                  >
                    {o.badge}
                  </span>
                </div>
                <h3 className="font-semibold text-foreground text-sm">
                  {o.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {o.desc}
                </p>
                <ul className="space-y-1">
                  {o.ideas.map((idea) => (
                    <li
                      key={idea}
                      className="text-xs text-muted-foreground flex items-center gap-1.5"
                    >
                      <span className="w-1 h-1 rounded-full bg-primary shrink-0" />
                      {idea}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </AnimatedCard>
        ))}
      </div>
    </div>
  );
}
