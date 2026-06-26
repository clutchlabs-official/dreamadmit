import AnimatedCard from "@/components/AnimatedCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Star, TrendingUp } from "lucide-react";

const gems = [
  {
    name: "University of Tulsa",
    location: "Tulsa, OK",
    emoji: "🦅",
    acceptance: "69%",
    avgGPA: "3.7",
    match: 88,
    tags: ["Strong Aid", "Hidden Gem", "STEM Focus"],
    note: "Full-tuition scholarships for top 10% students. Tiny class sizes, research access from day one.",
  },
  {
    name: "Truman State University",
    location: "Kirksville, MO",
    emoji: "🐾",
    acceptance: "72%",
    avgGPA: "3.8",
    match: 91,
    tags: ["Hidden Gem", "Liberal Arts", "Affordable"],
    note: "Missouri's only public liberal arts university. Alumni go to top grad schools at Yale, Michigan.",
  },
  {
    name: "University of Alabama",
    location: "Tuscaloosa, AL",
    emoji: "🐘",
    acceptance: "80%",
    avgGPA: "3.5",
    match: 85,
    tags: ["Strong Aid", "Merit Scholarships"],
    note: "Out-of-state students with 3.5+ GPA often pay less than in-state rates thanks to merit packages.",
  },
  {
    name: "Wofford College",
    location: "Spartanburg, SC",
    emoji: "🌟",
    acceptance: "66%",
    avgGPA: "3.6",
    match: 82,
    tags: ["Hidden Gem", "Small Class", "Strong Aid"],
    note: "97% job/grad placement rate. Strong alumni network, personal faculty relationships.",
  },
  {
    name: "Hendrix College",
    location: "Conway, AR",
    emoji: "🔮",
    acceptance: "78%",
    avgGPA: "3.5",
    match: 87,
    tags: ["Hidden Gem", "Affordable", "Liberal Arts"],
    note: "Every student completes a project — research, service, or creative work. Super distinctive for grad apps.",
  },
  {
    name: "Kettering University",
    location: "Flint, MI",
    emoji: "⚙️",
    acceptance: "62%",
    avgGPA: "3.6",
    match: 90,
    tags: ["STEM Focus", "Co-op Required", "Hidden Gem"],
    note: "Co-op program means you graduate with 2.5 years of real engineering experience. Top employer partnerships.",
  },
];

export default function HiddenGems() {
  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Star className="h-5 w-5 text-accent" />
        <h2 className="font-display text-xl font-bold text-foreground">
          Hidden Gem Colleges
        </h2>
        <Badge variant="secondary" className="text-xs">
          Lesser-known, high-value picks
        </Badge>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {gems.map((g, i) => (
          <AnimatedCard key={g.name} delay={i * 0.08}>
            <Card className="h-full hover:shadow-lg transition-all duration-300 border-border group">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-3xl">{g.emoji}</span>
                  <div className="flex items-center gap-1 bg-primary/10 text-primary rounded-full px-2.5 py-0.5">
                    <TrendingUp className="h-3.5 w-3.5" />
                    <span className="text-xs font-bold">{g.match}% match</span>
                  </div>
                </div>
                <h3 className="font-semibold text-foreground text-sm leading-tight">
                  {g.name}
                </h3>
                <p className="text-xs text-muted-foreground">{g.location}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground">Acceptance </span>
                    <span className="font-semibold text-foreground">
                      {g.acceptance}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Avg GPA </span>
                    <span className="font-semibold text-foreground">
                      {g.avgGPA}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {g.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-[10px] px-1.5 py-0"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {g.note}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200"
                  data-ocid={`gems.${i + 1}.button`}
                >
                  Learn More
                </Button>
              </CardContent>
            </Card>
          </AnimatedCard>
        ))}
      </div>
    </div>
  );
}
