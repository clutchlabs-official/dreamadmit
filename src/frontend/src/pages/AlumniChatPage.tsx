import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useColleges } from "@/hooks/useQueries";
import type { CollegeWithCommunity } from "@/types";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Building2,
  MessageCircle,
  MessageSquare,
  Users,
} from "lucide-react";

const COLLEGE_COLORS = [
  "bg-primary/10 text-primary",
  "bg-accent/10 text-accent",
  "bg-secondary text-secondary-foreground",
  "bg-muted text-muted-foreground",
];

function _CollegeChatCard({
  college,
  index,
}: { college: CollegeWithCommunity; index: number }) {
  const colorClass = COLLEGE_COLORS[index % COLLEGE_COLORS.length];
  const initials = college.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

  // Derive Reddit URL: use college-specific subreddit if available, else generic /r/college
  const redditHref = college.redditUrl ?? "https://www.reddit.com/r/college";
  const redditLabel = college.redditUrl
    ? `Join r/${college.redditUrl.replace(/.*\/r\/([^/]+).*/i, "$1")}`
    : "Visit on Reddit";

  return (
    <div
      className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
      data-ocid={`alumni.college_card.${index + 1}`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${colorClass}`}
        >
          {initials}
        </div>
        <div className="min-w-0">
          <h3 className="font-display font-semibold text-foreground truncate">
            {college.name}
          </h3>
          <p className="text-xs text-muted-foreground truncate">
            {college.location}
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <Link
          to="/alumni-chat/$collegeId"
          params={{ collegeId: String(college.id) }}
          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium h-8 px-3 hover:bg-primary/90 transition-colors"
          data-ocid={`alumni.open_chat.${index + 1}`}
        >
          <MessageSquare className="h-3.5 w-3.5" />
          Chat Room
        </Link>
        <a
          href={redditHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1 rounded-lg border border-border text-muted-foreground text-xs font-medium h-8 px-2.5 hover:bg-muted hover:text-foreground transition-colors"
          data-ocid={`alumni.reddit_link.${index + 1}`}
          aria-label={`Talk to alumni from ${college.name} on Reddit`}
        >
          {redditLabel}
        </a>
        {college.discordUrl && (
          <a
            href={college.discordUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1 rounded-lg border border-border text-muted-foreground text-xs font-medium h-8 px-2.5 hover:bg-muted hover:text-foreground transition-colors"
            data-ocid={`alumni.discord_link.${index + 1}`}
            aria-label={`Join the ${college.name} student Discord`}
          >
            Discord
          </a>
        )}
      </div>
    </div>
  );
}

export default function AlumniChatPage() {
  const { data: colleges, isLoading } = useColleges();

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <MessageCircle className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            Alumni Chat
          </h1>
        </div>
        <p className="text-muted-foreground">
          Connect with alumni and current students at any college.
        </p>
      </div>
      {isLoading && (
        <div
          data-ocid="alumni-chat.loading_state"
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      )}
      {!isLoading && colleges && colleges.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(colleges as CollegeWithCommunity[]).map((c) => (
            <Card
              key={String(c.id)}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{c.name}</CardTitle>
                <CardDescription>
                  {c.location}, {c.country}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" /> Alumni community
                  </span>
                  <div className="flex items-center gap-1.5">
                    {c.redditUrl && (
                      <a
                        href={c.redditUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-ocid={`alumni-chat.reddit_link.${c.id}`}
                        aria-label={`Talk to alumni from ${c.name} on Reddit`}
                      >
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          className="gap-1 text-xs h-7 px-2"
                        >
                          r/{c.redditUrl.replace(/.*\/r\/([^/]+).*/i, "$1")}
                        </Button>
                      </a>
                    )}
                    {c.discordUrl && (
                      <a
                        href={c.discordUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-ocid={`alumni-chat.discord_link.${c.id}`}
                        aria-label={`Join the ${c.name} student Discord`}
                      >
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          className="gap-1 text-xs h-7 px-2"
                        >
                          Discord
                        </Button>
                      </a>
                    )}
                    <Link
                      to="/alumni-chat/$collegeId"
                      params={{ collegeId: String(c.id) }}
                    >
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="gap-1.5"
                        data-ocid={`alumni-chat.enter_chat_button.${c.id}`}
                      >
                        <MessageCircle className="h-3.5 w-3.5" /> Join Chat
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {!isLoading && (!colleges || colleges.length === 0) && (
        <Card data-ocid="alumni-chat.empty_state">
          <CardContent className="text-center py-16">
            <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No colleges available.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
