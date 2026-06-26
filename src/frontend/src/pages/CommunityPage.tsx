import AnimatedCard from "@/components/AnimatedCard";
import ComingSoonBadge from "@/components/ComingSoonBadge";
import PageTransition from "@/components/PageTransition";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ExternalLink, MessageSquare, Star, Users } from "lucide-react";
import { useState } from "react";

const forumPosts = [
  {
    id: 1,
    title: "How did you handle the 'Why Us?' essay for Stanford?",
    author: "Priya M.",
    replies: 24,
    timeAgo: "2h ago",
    tag: "Essays",
  },
  {
    id: 2,
    title: "SAT 1450 to 1550 in 6 weeks — here's exactly what I did",
    author: "James K.",
    replies: 41,
    timeAgo: "5h ago",
    tag: "Test Prep",
  },
  {
    id: 3,
    title: "Anyone else applying to both US and UK this cycle?",
    author: "Tanvir A.",
    replies: 17,
    timeAgo: "1d ago",
    tag: "General",
  },
  {
    id: 4,
    title: "MIT waitlisted — should I send a letter of continued interest?",
    author: "Sofia R.",
    replies: 33,
    timeAgo: "1d ago",
    tag: "Waitlist",
  },
  {
    id: 5,
    title: "Financial aid appeal actually worked — tips inside",
    author: "Chen W.",
    replies: 58,
    timeAgo: "2d ago",
    tag: "Finance",
  },
];

const collegeGroups = [
  {
    name: "MIT",
    subreddit: "r/mit",
    members: "28.4k",
    description: "Engineering, research, and campus life at MIT",
    emoji: "🔬",
    url: "https://reddit.com/r/mit",
  },
  {
    name: "Stanford",
    subreddit: "r/stanford",
    members: "31.1k",
    description: "Admits, students, and alumni of Stanford University",
    emoji: "🌳",
    url: "https://reddit.com/r/stanford",
  },
  {
    name: "Harvard",
    subreddit: "r/harvard",
    members: "29.3k",
    description: "Harvard University students and prospective applicants",
    emoji: "🏛️",
    url: "https://reddit.com/r/harvard",
  },
  {
    name: "UCLA",
    subreddit: "r/UCLA",
    members: "42.7k",
    description: "Bruin pride — applications, campus, and beyond",
    emoji: "🐻",
    url: "https://reddit.com/r/UCLA",
  },
  {
    name: "UC Berkeley",
    subreddit: "r/berkeley",
    members: "38.5k",
    description: "UC Berkeley students, applicants, and Cal fans",
    emoji: "🐻‍❄️",
    url: "https://reddit.com/r/berkeley",
  },
  {
    name: "Oxford",
    subreddit: "r/oxford",
    members: "18.2k",
    description: "Admissions, tutorials, and student life at Oxford",
    emoji: "🎓",
    url: "https://reddit.com/r/oxford",
  },
  {
    name: "IIT Delhi",
    subreddit: "r/iitdelhi",
    members: "41.0k",
    description: "JEE prep, campus life, and placements at IITD",
    emoji: "🇮🇳",
    url: "https://reddit.com/r/iitdelhi",
  },
  {
    name: "UWaterloo",
    subreddit: "r/uwaterloo",
    members: "15.8k",
    description: "Co-op, CS, and student life at Waterloo",
    emoji: "🇨🇦",
    url: "https://reddit.com/r/uwaterloo",
  },
];

const testimonials = [
  {
    name: "Arjun Sharma",
    college: "MIT",
    gpa: "3.95 UW",
    sat: "1570",
    major: "Computer Science",
    story:
      "Coming from a small town in India, I focused my essay on building a robotics club from scratch. Showing real impact — 40 students trained — made all the difference.",
  },
  {
    name: "Maya Johnson",
    college: "Stanford",
    gpa: "4.0 UW",
    sat: "1540",
    major: "Biomedical Eng",
    story:
      "I was rejected from 4 other top schools. Stanford loved my research on low-cost diagnostics. Authenticity beat a polished story every time.",
  },
  {
    name: "Riya Kapoor",
    college: "Oxford",
    gpa: "3.88 UW",
    sat: "1490",
    major: "PPE",
    story:
      "Oxford doesn't want a perfect resume — they want intellectual curiosity. My personal statement argued about one book that changed my thinking.",
  },
  {
    name: "Lucas Chen",
    college: "Harvard",
    gpa: "3.92 UW",
    sat: "1560",
    major: "Economics",
    story:
      "I applied three times. The year I got in, I stopped trying to sound impressive and wrote honestly about failing my first business. They loved the self-awareness.",
  },
  {
    name: "Zara Ahmed",
    college: "UC Berkeley",
    gpa: "3.85 UW",
    sat: "1510",
    major: "Data Science",
    story:
      "Berkeley's PIQs reward specificity. I wrote about a single afternoon tutoring my cousin that sparked my love for teaching and data combined.",
  },
  {
    name: "Ethan Park",
    college: "UWaterloo CS",
    gpa: "3.78 UW",
    sat: "N/A",
    major: "Computer Science",
    story:
      "Waterloo evaluates AIF answers heavily. I documented every side project, hackathon win, and open-source contribution — your GitHub is your portfolio.",
  },
];

const studyGroups = [
  {
    name: "SAT Math Crushers",
    exam: "SAT",
    mode: "Online",
    level: "800 target",
    members: 12,
    schedule: "Tue & Thu 7 PM IST",
  },
  {
    name: "JEE Advanced 2025",
    exam: "JEE",
    mode: "Online",
    level: "Top 1000 aim",
    members: 28,
    schedule: "Daily 6 AM IST",
  },
  {
    name: "IELTS Band 8 Club",
    exam: "IELTS",
    mode: "Online",
    level: "Band 7+ current",
    members: 9,
    schedule: "Mon/Wed/Fri 8 PM",
  },
  {
    name: "ACT Science Sprint",
    exam: "ACT",
    mode: "Online",
    level: "Targeting 34+",
    members: 15,
    schedule: "Sat & Sun 10 AM EST",
  },
];

const successStories = [
  {
    title: "From JEE Dropout to MIT Admit",
    author: "Kiran P.",
    college: "MIT",
    insight:
      "Rejected from all IITs. Pivoted to US apps in 11th grade. Built two open-source tools used by 5,000+ people. Showed depth, not breadth.",
    category: "CS",
  },
  {
    title: "How I Got Full Scholarship to UCL",
    author: "Amara N.",
    college: "UCL London",
    insight:
      "UK apps are 90% your personal statement. Mine was 3 drafts over 6 months. Get brutal feedback from teachers who have read Cambridge rejections.",
    category: "Finance",
  },
  {
    title: "Small-Town Kid, Big Ten Full Ride",
    author: "Brianna T.",
    college: "U Michigan",
    insight:
      "Michigan loves first-gen students. My essay about my mom's factory job won me $80k in merit aid.",
    category: "Merit Aid",
  },
  {
    title: "Getting Into NUS from Outside Singapore",
    author: "Preethi R.",
    college: "NUS Singapore",
    insight:
      "NUS is highly selective for internationals. Perfect CGPA was not enough — my MOE scholarship interview focused on leadership and community service.",
    category: "Asia",
  },
  {
    title: "Oxford After Two Reapplications",
    author: "Daniel F.",
    college: "Oxford",
    insight:
      "I applied twice before getting in. The third time I had a year of independent research under a professor. Oxford rewards genuine academic passion.",
    category: "UK",
  },
  {
    title: "NEET to Ivy: Medicine in the US",
    author: "Sanya M.",
    college: "Yale",
    insight:
      "Indian pre-med students rarely consider the US. I volunteered at a rural clinic. Yale valued my unique cross-cultural healthcare perspective.",
    category: "Medicine",
  },
];

const collegeReviews = [
  {
    college: "MIT",
    rating: 4.8,
    text: "Academic pressure is real but the resources are unmatched. TAs are brilliant. Research opportunities start from semester one if you reach out proactively.",
    pros: [
      "World-class research",
      "Incredible alumni network",
      "Huge scholarship pools",
    ],
    cons: [
      "Extremely competitive",
      "Boston winters brutal",
      "Housing lottery stress",
    ],
  },
  {
    college: "Stanford",
    rating: 4.7,
    text: "Stanford culture is collaborative, not cutthroat. The weather, the campus, the startup energy — it's everything the brochures promise.",
    pros: [
      "Entrepreneurship ecosystem",
      "Collaborative culture",
      "Beautiful campus",
    ],
    cons: [
      "Expensive Bay Area housing",
      "Imposter syndrome common",
      "Grade deflation in some depts",
    ],
  },
  {
    college: "Oxford",
    rating: 4.6,
    text: "The tutorial system forces you to think independently. One hour with your tutor every week is more valuable than 10 lectures.",
    pros: ["Tutorial system", "Global prestige", "Historic campus"],
    cons: [
      "Very structured",
      "Social life college-dependent",
      "UK post-study visa complex",
    ],
  },
  {
    college: "UCLA",
    rating: 4.5,
    text: "LA is the city. Networking with entertainment and tech industries right on your doorstep.",
    pros: ["Location in LA", "Massive alumni base", "Diverse student body"],
    cons: [
      "Large intro class sizes",
      "Difficult parking",
      "Competitive major selection",
    ],
  },
  {
    college: "IIT Delhi",
    rating: 4.4,
    text: "IITD placements are legendary. Internships at top global firms start appearing in your 2nd year if your GPA holds.",
    pros: ["Top placements", "Strong peer learning", "Faculty research output"],
    cons: [
      "Very high stress",
      "Limited creative electives",
      "Dorm facilities vary",
    ],
  },
  {
    college: "UWaterloo",
    rating: 4.6,
    text: "Co-op alone is worth the tuition. 6 work terms equals 2 years of real industry experience before you even graduate.",
    pros: [
      "Best co-op program globally",
      "Tech company connections",
      "Affordable vs US schools",
    ],
    cons: [
      "Intense workload",
      "Co-op job search stress",
      "Waterloo city is quiet",
    ],
  },
];

const tagColors: Record<string, string> = {
  Essays: "bg-primary/10 text-primary",
  "Test Prep": "bg-accent/10 text-accent",
  General: "bg-muted text-muted-foreground",
  Waitlist: "bg-yellow-500/10 text-yellow-600",
  Finance: "bg-green-500/10 text-green-600",
};

export default function CommunityPage() {
  const [reviewFilter, setReviewFilter] = useState("All");
  const [essayName, setEssayName] = useState("");
  const [essayType, setEssayType] = useState("");
  const [essayText, setEssayText] = useState("");

  const filtered =
    reviewFilter === "All"
      ? collegeReviews
      : collegeReviews.filter((r) => r.college === reviewFilter);

  return (
    <PageTransition className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-14">
      <div className="flex items-center gap-3">
        <span className="text-4xl">👥</span>
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Community
          </h1>
          <p className="text-muted-foreground mt-1">
            Connect with students, alumni, and mentors who've been where you
            want to go.
          </p>
        </div>
      </div>

      {/* Student Forums */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">💬</span>
          <h2 className="font-display text-xl font-bold text-foreground">
            Student Forums
          </h2>
        </div>
        <div className="space-y-3 stagger-children">
          {forumPosts.map((post, i) => (
            <AnimatedCard key={post.id} delay={i * 0.07}>
              <Card
                className="hover:shadow-card transition-shadow duration-200"
                data-ocid={`community.forum.item.${i + 1}`}
              >
                <CardContent className="p-4 flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${tagColors[post.tag] ?? "bg-muted text-muted-foreground"}`}
                      >
                        {post.tag}
                      </span>
                    </div>
                    <p className="font-semibold text-sm text-foreground truncate">
                      {post.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      by {post.author} · {post.timeAgo}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {post.replies}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </AnimatedCard>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-3 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            data-ocid="community.forum.join_button"
          >
            Join Discussion
          </Button>
          <ComingSoonBadge />
          <span className="text-xs text-muted-foreground">
            Live discussions coming soon — follow the conversation on Reddit
          </span>
        </div>
      </section>

      {/* College-Specific Groups */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🏫</span>
          <h2 className="font-display text-xl font-bold text-foreground">
            College-Specific Groups
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 bounce-reveal">
          {collegeGroups.map((cg, i) => (
            <AnimatedCard key={cg.name} delay={i * 0.06}>
              <Card
                className="hover:shadow-card transition-shadow duration-200"
                data-ocid={`community.college_group.item.${i + 1}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{cg.emoji}</span>
                    <div>
                      <p className="font-bold text-sm text-foreground">
                        {cg.name}
                      </p>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {cg.members} members
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    {cg.description}
                  </p>
                  <a
                    href={cg.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-ocid={`community.college_group.link.${i + 1}`}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs"
                    >
                      Join {cg.subreddit}{" "}
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </a>
                </CardContent>
              </Card>
            </AnimatedCard>
          ))}
        </div>
      </section>

      {/* Seniors Who Got In */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🎓</span>
          <h2 className="font-display text-xl font-bold text-foreground">
            Seniors Who Got In
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 bounce-reveal">
          {testimonials.map((t, i) => (
            <AnimatedCard key={t.name} delay={i * 0.08}>
              <Card
                className="h-full"
                data-ocid={`community.testimonial.item.${i + 1}`}
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary shrink-0">
                      {t.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-foreground">
                        {t.name}
                      </p>
                      <p className="text-xs text-primary font-medium">
                        ✅ {t.college}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 mb-3 flex-wrap">
                    <Badge variant="secondary" className="text-xs">
                      GPA: {t.gpa}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      SAT: {t.sat}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {t.major}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    "{t.story}"
                  </p>
                </CardContent>
              </Card>
            </AnimatedCard>
          ))}
        </div>
      </section>

      {/* Essay Review Exchange */}
      <section>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">📝</span>
          <h2 className="font-display text-xl font-bold text-foreground">
            Application Review Exchange
          </h2>
          <ComingSoonBadge />
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Submit your essay for peer review — students help students get better.
        </p>
        <AnimatedCard delay={0.1}>
          <Card className="border-dashed border-2 border-primary/30">
            <CardContent className="p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="essay-name" className="text-sm">
                    Your Name
                  </Label>
                  <Input
                    id="essay-name"
                    placeholder="e.g. Arjun Sharma"
                    value={essayName}
                    onChange={(e) => setEssayName(e.target.value)}
                    data-ocid="community.essay_review.name_input"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="essay-type" className="text-sm">
                    Essay Type
                  </Label>
                  <Select value={essayType} onValueChange={setEssayType}>
                    <SelectTrigger
                      id="essay-type"
                      data-ocid="community.essay_review.type_select"
                    >
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="common-app">
                        Common App Personal Statement
                      </SelectItem>
                      <SelectItem value="why-us">
                        Why Us / Why College
                      </SelectItem>
                      <SelectItem value="supplemental">
                        Supplemental Essay
                      </SelectItem>
                      <SelectItem value="scholarship">
                        Scholarship Essay
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="essay-text" className="text-sm">
                  Paste Your Essay
                </Label>
                <Textarea
                  id="essay-text"
                  rows={5}
                  placeholder="Paste your essay draft here for review..."
                  value={essayText}
                  onChange={(e) => setEssayText(e.target.value)}
                  data-ocid="community.essay_review.essay_textarea"
                />
              </div>
              <Button
                type="button"
                disabled
                className="w-full"
                data-ocid="community.essay_review.submit_button"
              >
                Submit for Review — Coming Soon
              </Button>
            </CardContent>
          </Card>
        </AnimatedCard>
      </section>

      {/* Mentor Matching */}
      <section>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">🤝</span>
          <h2 className="font-display text-xl font-bold text-foreground">
            Mentor Matching
          </h2>
          <ComingSoonBadge />
        </div>
        <AnimatedCard delay={0.1}>
          <Card className="bg-accent/5 border-accent/20">
            <CardContent className="p-6">
              <div className="grid sm:grid-cols-3 gap-6 mb-5">
                {[
                  {
                    icon: "🧑‍💻",
                    title: "Matched by Major",
                    desc: "Get matched with someone who studied your exact major",
                  },
                  {
                    icon: "🏫",
                    title: "College Alumni",
                    desc: "Connect with alumni from your dream school",
                  },
                  {
                    icon: "📅",
                    title: "1-on-1 Sessions",
                    desc: "Book private sessions to review your application",
                  },
                ].map((item) => (
                  <div key={item.title} className="text-center">
                    <div className="text-3xl mb-1">{item.icon}</div>
                    <p className="font-semibold text-sm text-foreground">
                      {item.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
              <div className="p-3 rounded-lg bg-background border border-border text-center">
                <p className="text-sm text-muted-foreground">
                  🚀 Mentor matching launches soon — enter your email to be
                  first in line
                </p>
                <div className="flex gap-2 mt-3 max-w-sm mx-auto">
                  <Input
                    placeholder="your@email.com"
                    className="text-sm"
                    data-ocid="community.mentor.email_input"
                  />
                  <Button
                    type="button"
                    size="sm"
                    disabled
                    data-ocid="community.mentor.notify_button"
                  >
                    Notify Me
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </AnimatedCard>
      </section>

      {/* Study Group Finder */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">📚</span>
          <h2 className="font-display text-xl font-bold text-foreground">
            Study Group Finder
          </h2>
        </div>
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="grid sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Test Type</Label>
                <Select>
                  <SelectTrigger data-ocid="community.study_group.test_select">
                    <SelectValue placeholder="SAT / JEE / IELTS" />
                  </SelectTrigger>
                  <SelectContent>
                    {["SAT", "ACT", "JEE", "NEET", "IELTS", "TOEFL", "GRE"].map(
                      (t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Mode</Label>
                <Select>
                  <SelectTrigger data-ocid="community.study_group.mode_select">
                    <SelectValue placeholder="Online / In-Person" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="in-person">In-Person</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Experience Level</Label>
                <Select>
                  <SelectTrigger data-ocid="community.study_group.level_select">
                    <SelectValue placeholder="Beginner / Advanced" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 bounce-reveal">
          {studyGroups.map((sg, i) => (
            <AnimatedCard key={sg.name} delay={i * 0.07}>
              <Card data-ocid={`community.study_group.item.${i + 1}`}>
                <CardContent className="p-4">
                  <p className="font-semibold text-sm text-foreground mb-1">
                    {sg.name}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {sg.exam}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {sg.mode}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">
                    🎯 {sg.level}
                  </p>
                  <p className="text-xs text-muted-foreground mb-2">
                    📅 {sg.schedule}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      <Users className="h-3 w-3 inline mr-0.5" />
                      {sg.members} members
                    </span>
                    <ComingSoonBadge />
                  </div>
                </CardContent>
              </Card>
            </AnimatedCard>
          ))}
        </div>
      </section>

      {/* Success Stories */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🌟</span>
          <h2 className="font-display text-xl font-bold text-foreground">
            Success Stories
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 bounce-reveal">
          {successStories.map((s, i) => (
            <AnimatedCard key={s.title} delay={i * 0.08}>
              <Card
                className="h-full hover:shadow-card transition-shadow duration-200"
                data-ocid={`community.success.item.${i + 1}`}
              >
                <CardContent className="p-5">
                  <Badge variant="outline" className="text-xs mb-3">
                    {s.category}
                  </Badge>
                  <h3 className="font-semibold text-sm text-foreground mb-1">
                    {s.title}
                  </h3>
                  <p className="text-xs text-primary font-medium mb-2">
                    {s.author} · {s.college}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {s.insight}
                  </p>
                  <Button
                    variant="link"
                    size="sm"
                    className="p-0 h-auto text-xs mt-3 text-primary"
                    data-ocid={`community.success.read_more.${i + 1}`}
                  >
                    Read full story →
                  </Button>
                </CardContent>
              </Card>
            </AnimatedCard>
          ))}
        </div>
      </section>

      {/* Anonymous College Reviews */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">⭐</span>
          <h2 className="font-display text-xl font-bold text-foreground">
            Anonymous College Reviews
          </h2>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <Label className="text-sm whitespace-nowrap">
            Filter by college:
          </Label>
          <Select value={reviewFilter} onValueChange={setReviewFilter}>
            <SelectTrigger
              className="w-48"
              data-ocid="community.reviews.filter_select"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Colleges</SelectItem>
              {collegeReviews.map((r) => (
                <SelectItem key={r.college} value={r.college}>
                  {r.college}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 bounce-reveal">
          {filtered.map((r, i) => (
            <AnimatedCard key={`${r.college}-${i}`} delay={i * 0.07}>
              <Card
                className="h-full"
                data-ocid={`community.review.item.${i + 1}`}
              >
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-bold text-sm text-foreground">
                      {r.college}
                    </p>
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-semibold">{r.rating}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                    {r.text}
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="font-medium text-green-600 mb-1">✅ Pros</p>
                      {r.pros.map((p) => (
                        <p key={p} className="text-muted-foreground">
                          • {p}
                        </p>
                      ))}
                    </div>
                    <div>
                      <p className="font-medium text-red-500 mb-1">❌ Cons</p>
                      {r.cons.map((c) => (
                        <p key={c} className="text-muted-foreground">
                          • {c}
                        </p>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedCard>
          ))}
        </div>
      </section>
    </PageTransition>
  );
}
