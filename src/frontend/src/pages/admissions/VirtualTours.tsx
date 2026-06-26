import AnimatedCard from "@/components/AnimatedCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Play } from "lucide-react";

const TOURS = [
  {
    name: "MIT",
    location: "Cambridge, MA",
    emoji: "🏛️",
    tagline: "World's #1 STEM university",
    acceptanceRate: "4%",
    youtubeUrl: "https://www.youtube.com/results?search_query=MIT+campus+tour",
    websiteUrl: "https://www.mit.edu/visit/",
    tags: ["STEM", "Research", "No sports teams"],
  },
  {
    name: "Stanford University",
    location: "Palo Alto, CA",
    emoji: "🌲",
    tagline: "Silicon Valley's home base",
    acceptanceRate: "4%",
    youtubeUrl:
      "https://www.youtube.com/results?search_query=Stanford+campus+virtual+tour",
    websiteUrl: "https://visit.stanford.edu/",
    tags: ["Tech", "Entrepreneurship", "Warm Weather"],
  },
  {
    name: "Harvard University",
    location: "Cambridge, MA",
    emoji: "🎓",
    tagline: "Oldest university in the US",
    acceptanceRate: "3.4%",
    youtubeUrl:
      "https://www.youtube.com/results?search_query=Harvard+campus+tour",
    websiteUrl: "https://www.harvard.edu/on-campus/visit-harvard/",
    tags: ["Ivy League", "Law", "Medicine"],
  },
  {
    name: "UC Berkeley",
    location: "Berkeley, CA",
    emoji: "🐻",
    tagline: "Top public university in the world",
    acceptanceRate: "11%",
    youtubeUrl:
      "https://www.youtube.com/results?search_query=UC+Berkeley+campus+tour",
    websiteUrl: "https://visit.berkeley.edu/",
    tags: ["Public", "Research", "Activism"],
  },
  {
    name: "University of Michigan",
    location: "Ann Arbor, MI",
    emoji: "〽️",
    tagline: "Top public Big Ten powerhouse",
    acceptanceRate: "17%",
    youtubeUrl:
      "https://www.youtube.com/results?search_query=University+of+Michigan+campus+tour",
    websiteUrl: "https://admissions.umich.edu/visit",
    tags: ["Big Ten", "Business", "Engineering"],
  },
  {
    name: "NYU",
    location: "New York, NY",
    emoji: "🗽",
    tagline: "The city is your campus",
    acceptanceRate: "12%",
    youtubeUrl:
      "https://www.youtube.com/results?search_query=NYU+New+York+University+campus+tour",
    websiteUrl:
      "https://www.nyu.edu/admissions/undergraduate-admissions/visit-nyu.html",
    tags: ["Urban", "Arts", "Global"],
  },
  {
    name: "UCLA",
    location: "Los Angeles, CA",
    emoji: "🏖️",
    tagline: "Excellence in the sunshine",
    acceptanceRate: "9%",
    youtubeUrl: "https://www.youtube.com/results?search_query=UCLA+campus+tour",
    websiteUrl: "https://visit.ucla.edu/",
    tags: ["Public", "Film", "Sports"],
  },
  {
    name: "University of Toronto",
    location: "Toronto, Canada",
    emoji: "🍁",
    tagline: "Canada's best university",
    acceptanceRate: "43%",
    youtubeUrl:
      "https://www.youtube.com/results?search_query=University+of+Toronto+campus+tour",
    websiteUrl: "https://www.utoronto.ca/campus-life/visiting-uoft",
    tags: ["International", "Research", "Affordable"],
  },
];

export default function VirtualTours() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-foreground mb-1">
          🎥 Virtual Campus Tours
        </h2>
        <p className="text-sm text-muted-foreground">
          Explore campuses from anywhere. Click the YouTube icon to watch tours
          or the campus icon for official visit pages.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {TOURS.map((t, i) => (
          <AnimatedCard key={t.name} delay={i * 0.06}>
            <Card className="h-full hover:shadow-lg transition-all duration-300 group overflow-hidden">
              <div className="h-20 bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20 flex items-center justify-center">
                <span className="text-5xl group-hover:scale-110 transition-transform duration-300">
                  {t.emoji}
                </span>
              </div>
              <CardContent className="p-4 space-y-2">
                <div>
                  <h3 className="font-bold text-foreground text-sm leading-tight">
                    {t.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">{t.location}</p>
                </div>
                <p className="text-xs text-foreground/70 italic">{t.tagline}</p>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">
                    Acceptance:
                  </span>
                  <span className="text-xs font-semibold text-foreground">
                    {t.acceptanceRate}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {t.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-[9px] px-1 py-0"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2 pt-1">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="flex-1 h-7 text-[11px] gap-1"
                    data-ocid={`tours.${i + 1}.youtube.button`}
                  >
                    <a
                      href={t.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Play className="h-3 w-3" /> Tour
                    </a>
                  </Button>
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="flex-1 h-7 text-[11px] gap-1"
                    data-ocid={`tours.${i + 1}.visit.button`}
                  >
                    <a
                      href={t.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-3 w-3" /> Visit
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </AnimatedCard>
        ))}
      </div>
    </div>
  );
}
