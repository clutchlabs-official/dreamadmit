import AnimatedCard from "@/components/AnimatedCard";
import ComingSoonBadge from "@/components/ComingSoonBadge";
import PageTransition from "@/components/PageTransition";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type React from "react";
import { useState } from "react";

type Urgency = "High" | "Medium" | "Low";
type Mood = 1 | 2 | 3 | 4 | 5;

const actionPlanTasks = [
  {
    task: "Request letters of recommendation from 2 teachers",
    urgency: "High" as Urgency,
    due: "Jun 10",
  },
  {
    task: "Complete Stanford supplemental essay draft",
    urgency: "High" as Urgency,
    due: "Jun 15",
  },
  {
    task: "Register for August SAT exam",
    urgency: "Medium" as Urgency,
    due: "Jun 20",
  },
  {
    task: "Update your Common App activities list",
    urgency: "Medium" as Urgency,
    due: "Jun 25",
  },
  {
    task: "Research scholarship opportunities in your state",
    urgency: "Low" as Urgency,
    due: "Jul 1",
  },
  {
    task: "Visit 2 college campus virtual tours",
    urgency: "Low" as Urgency,
    due: "Jul 5",
  },
];

const urgencyStyle: Record<Urgency, string> = {
  High: "bg-destructive/15 text-destructive",
  Medium: "bg-primary/15 text-primary",
  Low: "bg-muted text-muted-foreground",
};

const majors = [
  {
    name: "Computer Science",
    emoji: "",
    careers: ["Software Engineer", "Data Scientist", "Product Manager"],
    salary: "$110k–$160k",
    tags: ["Technology", "Math", "Problem Solving"],
  },
  {
    name: "Biology / Pre-Med",
    emoji: "",
    careers: ["Physician", "Researcher", "Genetic Counselor"],
    salary: "$80k–$250k",
    tags: ["Science", "Medicine", "Research"],
  },
  {
    name: "Business Administration",
    emoji: "",
    careers: ["Business Analyst", "Consultant", "Entrepreneur"],
    salary: "$70k–$130k",
    tags: ["Business", "Leadership", "Strategy"],
  },
  {
    name: "Psychology",
    emoji: "",
    careers: ["Therapist", "UX Researcher", "HR Manager"],
    salary: "$55k–$100k",
    tags: ["People", "Behaviour", "Research"],
  },
  {
    name: "Mechanical Engineering",
    emoji: "",
    careers: ["Mechanical Engineer", "Product Designer", "Robotics"],
    salary: "$80k–$130k",
    tags: ["Physics", "Design", "STEM"],
  },
  {
    name: "Political Science",
    emoji: "",
    careers: ["Lawyer", "Policy Analyst", "Diplomat"],
    salary: "$60k–$120k",
    tags: ["Society", "Law", "Writing"],
  },
];

const interestSubjects = [
  "Mathematics",
  "Science",
  "Literature",
  "History",
  "Technology",
  "Art & Design",
  "Business",
  "Medicine",
  "Law",
  "Engineering",
];

const careerPaths: Record<
  string,
  { roles: string[]; salary: string; skills: string[] }
> = {
  "Computer Science": {
    roles: [
      "Software Engineer",
      "ML Engineer",
      "Product Manager",
      "Data Scientist",
      "CTO",
    ],
    salary: "$95k–$180k",
    skills: ["Python", "Algorithms", "System Design", "React", "SQL"],
  },
  "Biology / Pre-Med": {
    roles: [
      "Pre-Med Student",
      "Medical Resident",
      "General Physician",
      "Specialist",
      "Researcher",
    ],
    salary: "$55k–$300k",
    skills: ["Anatomy", "Biochemistry", "Patient Care", "Research Methods"],
  },
  "Business Administration": {
    roles: ["Analyst", "Associate", "Manager", "Director", "C-Suite"],
    salary: "$60k–$200k",
    skills: ["Excel", "Strategy", "Communication", "Finance", "Leadership"],
  },
  Psychology: {
    roles: [
      "Counsellor",
      "Research Assistant",
      "HR Specialist",
      "Therapist",
      "Director of Wellbeing",
    ],
    salary: "$48k–$110k",
    skills: ["Active Listening", "CBT", "Data Analysis", "Empathy"],
  },
  "Mechanical Engineering": {
    roles: [
      "Junior Engineer",
      "Design Engineer",
      "Senior Engineer",
      "Team Lead",
      "Chief Engineer",
    ],
    salary: "$70k–$140k",
    skills: ["CAD", "Thermodynamics", "MATLAB", "Project Management"],
  },
  "Political Science": {
    roles: [
      "Policy Intern",
      "Research Analyst",
      "Adviser",
      "Diplomat",
      "Senator",
    ],
    salary: "$55k–$130k",
    skills: ["Public Speaking", "Research", "Law", "International Relations"],
  },
};

const wellnessResources = [
  {
    emoji: "",
    title: "5-Min Mindfulness",
    desc: "Quick breathing exercise from Headspace",
    url: "https://www.headspace.com",
  },
  {
    emoji: "",
    title: "Talk to Someone",
    desc: "Crisis Text Line — text HOME to 741741",
    url: "https://www.crisistextline.org",
  },
  {
    emoji: "",
    title: "College Stress Guide",
    desc: "UHS stress management for applicants",
    url: "https://uhs.berkeley.edu",
  },
];

function WeeklyActionPlan({ isParent }: { isParent: boolean }) {
  return (
    <AnimatedCard delay={0.05}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isParent ? "Your Child's Weekly Plan" : "Your Weekly Action Plan"}
          </CardTitle>
          {isParent && (
            <p className="text-xs text-muted-foreground">
              Read-only parent view — showing student's upcoming tasks
            </p>
          )}
        </CardHeader>
        <CardContent className="space-y-3">
          {actionPlanTasks.map((t, i) => (
            <div
              key={t.task}
              className="flex items-start gap-3 p-3 rounded-xl bg-muted/40 hover:bg-muted/70 transition-colors"
              data-ocid={`ai.action_task.item.${i + 1}`}
            >
              <span className="text-lg mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{t.task}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Due {t.due}
                </p>
              </div>
              <Badge
                className={`text-xs shrink-0 border-none ${urgencyStyle[t.urgency]}`}
              >
                {t.urgency}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </AnimatedCard>
  );
}

function MentalHealthCheckIn({ isParent }: { isParent: boolean }) {
  const [stress, setStress] = useState<Mood>(3);
  const [sleep, setSleep] = useState(7);
  const [confidence, setConfidence] = useState<Mood>(3);
  const [submitted, setSubmitted] = useState(false);

  const overallScore = Math.round((stress + confidence) / 2);
  const emoji = "";
  const label =
    overallScore >= 4
      ? "Doing Great!"
      : overallScore >= 3
        ? "Hanging in There"
        : "Needs Support";

  if (isParent) {
    return (
      <AnimatedCard delay={0.06}>
        <Card className="bg-muted/40">
          <CardContent className="p-6 text-center">
            <div className="text-4xl mb-2" />
            <p className="font-semibold text-foreground">
              Student's check-ins are private
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Mental health responses are not shared in parent mode to maintain
              trust.
            </p>
          </CardContent>
        </Card>
      </AnimatedCard>
    );
  }

  return (
    <AnimatedCard delay={0.06}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CardTitle className="flex items-center gap-2">
              Mental Health Check-In
            </CardTitle>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {!submitted ? (
            <>
              <div>
                <Label className="text-sm font-semibold">
                  How stressed are you feeling? ({stress}/5)
                </Label>
                <Slider
                  min={1}
                  max={5}
                  step={1}
                  value={[stress]}
                  onValueChange={(v) => setStress(v[0] as Mood)}
                  className="mt-2"
                  data-ocid="ai.stress_slider.input"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Very calm</span>
                  <span>Very stressed</span>
                </div>
              </div>
              <div>
                <Label className="text-sm font-semibold">
                  Average sleep last week (hours): {sleep}h
                </Label>
                <Slider
                  min={3}
                  max={10}
                  step={0.5}
                  value={[sleep]}
                  onValueChange={(v) => setSleep(v[0])}
                  className="mt-2"
                  data-ocid="ai.sleep_slider.input"
                />
              </div>
              <div>
                <Label className="text-sm font-semibold">
                  How confident do you feel about your applications? (
                  {confidence}/5)
                </Label>
                <Slider
                  min={1}
                  max={5}
                  step={1}
                  value={[confidence]}
                  onValueChange={(v) => setConfidence(v[0] as Mood)}
                  className="mt-2"
                  data-ocid="ai.confidence_slider.input"
                />
              </div>
              <Button
                onClick={() => setSubmitted(true)}
                data-ocid="ai.checkin_submit.button"
              >
                Submit Check-In
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              <div className="text-center p-6 rounded-xl bg-muted/50">
                <div className="text-5xl mb-2">{emoji}</div>
                <p className="text-lg font-bold text-foreground">{label}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Overall wellness score: {overallScore}/5
                </p>
              </div>
              <div className="grid sm:grid-cols-3 gap-3">
                {wellnessResources.map((r) => (
                  <a
                    key={r.title}
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-colors block"
                  >
                    <div className="text-2xl mb-1">{r.emoji}</div>
                    <p className="text-xs font-semibold text-foreground">
                      {r.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{r.desc}</p>
                  </a>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSubmitted(false)}
                data-ocid="ai.checkin_reset.button"
              >
                Check In Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </AnimatedCard>
  );
}

function DecisionCountdown() {
  const [decisionDate, setDecisionDate] = useState("2026-12-15");
  const today = new Date();
  const target = new Date(decisionDate);
  const daysLeft = Math.ceil(
    (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );
  const arrived = daysLeft <= 0;

  return (
    <AnimatedCard delay={0.07}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Decision Day Countdown
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <Label className="text-xs">Set Your Decision Date</Label>
            <Input
              type="date"
              value={decisionDate}
              onChange={(e) => setDecisionDate(e.target.value)}
              className="mt-1 max-w-xs"
              data-ocid="ai.decision_date.input"
            />
          </div>
          <div className="text-center py-10 px-4 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
            {arrived ? (
              <>
                <div className="text-6xl mb-3 animate-bounce" />
                <h2 className="font-display text-3xl font-bold text-primary">
                  Decision Day!
                </h2>
                <p className="text-muted-foreground mt-2">
                  Today is the day. You’ve worked so hard. Good luck!
                </p>
              </>
            ) : (
              <>
                <div className="text-7xl font-display font-black text-primary mb-2">
                  {daysLeft}
                </div>
                <p className="text-xl font-semibold text-foreground">
                  days to go
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Every day of prep counts. You've got this!
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </AnimatedCard>
  );
}

function WhatIfSimulator() {
  const [sat, setSat] = useState([1200]);
  const [gpa, setGpa] = useState([3.5]);
  const [activities, setActivities] = useState([6]);

  const score = Math.round(
    (sat[0] / 1600) * 40 + (gpa[0] / 4) * 35 + (activities[0] / 10) * 25,
  );
  const opens = [
    { name: "UC Santa Barbara", threshold: 55 },
    { name: "Boston University", threshold: 60 },
    { name: "University of Michigan", threshold: 70 },
    { name: "UCLA", threshold: 78 },
    { name: "Duke University", threshold: 85 },
    { name: "MIT", threshold: 92 },
  ].filter((c) => score >= c.threshold);

  return (
    <AnimatedCard delay={0.08}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            What-If Simulator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-semibold">
                SAT Score: {sat[0]}
              </Label>
              <Slider
                min={800}
                max={1600}
                step={10}
                value={sat}
                onValueChange={setSat}
                className="mt-2"
                data-ocid="ai.whatif_sat.input"
              />
            </div>
            <div>
              <Label className="text-sm font-semibold">
                GPA: {gpa[0].toFixed(1)}
              </Label>
              <Slider
                min={1.0}
                max={4.0}
                step={0.1}
                value={gpa}
                onValueChange={setGpa}
                className="mt-2"
                data-ocid="ai.whatif_gpa.input"
              />
            </div>
            <div>
              <Label className="text-sm font-semibold">
                Extracurricular Rating: {activities[0]}/10
              </Label>
              <Slider
                min={1}
                max={10}
                step={1}
                value={activities}
                onValueChange={setActivities}
                className="mt-2"
                data-ocid="ai.whatif_activities.input"
              />
            </div>
          </div>
          <div className="rounded-xl bg-primary/5 border border-primary/20 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-foreground">
                Admission Profile Score
              </span>
              <span className="text-2xl font-bold text-primary">
                {score}/100
              </span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              {opens.length} colleges become reachable at this profile:
            </p>
            <div className="flex flex-wrap gap-2">
              {opens.length > 0 ? (
                opens.map((c) => (
                  <Badge key={c.name} variant="secondary" className="text-xs">
                    {c.name}
                  </Badge>
                ))
              ) : (
                <p className="text-xs text-muted-foreground">
                  Raise your scores to see colleges unlock.
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </AnimatedCard>
  );
}

function MajorExplorer() {
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [results, setResults] = useState<typeof majors | null>(null);

  function generate() {
    const topSubjects = interestSubjects
      .map((s) => ({ s, r: ratings[s] || 0 }))
      .sort((a, b) => b.r - a.r)
      .slice(0, 3)
      .map((x) => x.s);
    const scored = majors.map((m) => ({
      ...m,
      score: m.tags.filter((t) =>
        topSubjects.some(
          (s) =>
            s.toLowerCase().includes(t.toLowerCase()) ||
            t.toLowerCase().includes(s.toLowerCase()),
        ),
      ).length,
    }));
    setResults(scored.sort((a, b) => b.score - a.score).slice(0, 3));
  }

  return (
    <AnimatedCard delay={0.07}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Major Explorer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {interestSubjects.map((subj) => (
              <div
                key={subj}
                className="flex items-center justify-between p-2 rounded-lg bg-muted/40 border border-border"
              >
                <span className="text-sm text-foreground">{subj}</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setRatings((p) => ({ ...p, [subj]: n }))}
                      className={`text-lg transition-transform hover:scale-110 ${(ratings[subj] || 0) >= n ? "opacity-100" : "opacity-30"}`}
                    >
                      ⭐
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <Button onClick={generate} data-ocid="ai.major_explore.button">
            Find My Best Majors
          </Button>
          {results && (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-muted-foreground uppercase">
                Top Matches
              </p>
              {results.map((m, i) => (
                <div
                  key={m.name}
                  className={`p-4 rounded-xl border ${i === 0 ? "border-primary/30 bg-primary/5" : "border-border bg-muted/30"}`}
                  data-ocid={`ai.major_result.item.${i + 1}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div>
                      <p className="font-semibold text-foreground">{m.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {m.salary}/yr average salary
                      </p>
                    </div>
                    {i === 0 && (
                      <Badge className="ml-auto bg-primary/15 text-primary border-none">
                        #1 Match
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {m.careers.map((c) => (
                      <Badge key={c} variant="outline" className="text-xs">
                        {c}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </AnimatedCard>
  );
}

function CareerPathConnector() {
  const [selected, setSelected] = useState<string | null>(null);
  const path = selected ? careerPaths[selected] : null;

  return (
    <AnimatedCard delay={0.08}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Career Path Connector
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {majors.map((m) => (
              <button
                key={m.name}
                type="button"
                onClick={() => setSelected(m.name)}
                className={`flex items-center gap-2 p-3 rounded-xl border text-left transition-all ${
                  selected === m.name
                    ? "border-primary bg-primary/10"
                    : "border-border bg-muted/30 hover:border-primary/40"
                }`}
                data-ocid={`ai.career_major.button.${majors.indexOf(m) + 1}`}
              >
                <span className="text-sm font-medium text-foreground">
                  {m.name}
                </span>
              </button>
            ))}
          </div>
          {path && selected && (
            <div className="space-y-4 pt-2">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                  Career Progression
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  {path.roles.map((role, i) => (
                    <>
                      <span
                        key={role}
                        className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium"
                      >
                        {role}
                      </span>
                      {i < path.roles.length - 1 && (
                        <span className="text-muted-foreground text-xs">→</span>
                      )}
                    </>
                  ))}
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-[oklch(0.55_0.18_145)]/10 border border-[oklch(0.55_0.18_145)]/20">
                  <p className="text-xs font-semibold text-[oklch(0.42_0.18_145)]">
                    Salary Range
                  </p>
                  <p className="text-lg font-bold text-[oklch(0.42_0.18_145)]">
                    {path.salary}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-muted/50">
                  <p className="text-xs font-semibold text-muted-foreground mb-1">
                    Key Skills
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {path.skills.map((s) => (
                      <Badge key={s} variant="outline" className="text-xs">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </AnimatedCard>
  );
}

function ParentSummary({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex items-center gap-3">
        <span className="text-3xl" />
        <div>
          <p className="font-semibold text-foreground">Parent View</p>
          <p className="text-xs text-muted-foreground">
            You are viewing a read-only summary of your child's progress. Some
            sections are hidden for privacy.
          </p>
        </div>
      </div>
      {children}
    </div>
  );
}

export default function AIAdvisorPage() {
  const [isParent, setIsParent] = useState(false);

  const content = (
    <Tabs defaultValue="plan" className="w-full">
      <TabsList className="flex flex-wrap h-auto gap-1 mb-6 bg-muted/60 p-1">
        <TabsTrigger value="plan" data-ocid="ai.plan.tab">
          Weekly Plan
        </TabsTrigger>
        <TabsTrigger value="mental" data-ocid="ai.mental.tab">
          Wellness
        </TabsTrigger>
        <TabsTrigger value="countdown" data-ocid="ai.countdown.tab">
          Countdown
        </TabsTrigger>
        <TabsTrigger value="whatif" data-ocid="ai.whatif.tab">
          What-If
        </TabsTrigger>
        <TabsTrigger value="major" data-ocid="ai.major.tab">
          Majors
        </TabsTrigger>
        <TabsTrigger value="career" data-ocid="ai.career.tab">
          Careers
        </TabsTrigger>
        <TabsTrigger value="mentor" data-ocid="ai.mentor.tab">
          Mentors <ComingSoonBadge />
        </TabsTrigger>
        <TabsTrigger value="forums" data-ocid="ai.forums.tab">
          Forums <ComingSoonBadge />
        </TabsTrigger>
      </TabsList>
      <TabsContent value="plan">
        <WeeklyActionPlan isParent={isParent} />
      </TabsContent>
      <TabsContent value="mental">
        <MentalHealthCheckIn isParent={isParent} />
      </TabsContent>
      <TabsContent value="countdown">
        <DecisionCountdown />
      </TabsContent>
      <TabsContent value="whatif">
        <WhatIfSimulator />
      </TabsContent>
      <TabsContent value="major">
        <MajorExplorer />
      </TabsContent>
      <TabsContent value="career">
        <CareerPathConnector />
      </TabsContent>
      <TabsContent value="mentor">
        <AnimatedCard delay={0.05}>
          <Card className="text-center py-16">
            <CardContent>
              <span className="text-5xl" />
              <h3 className="font-display text-xl font-bold text-foreground mt-4">
                Mentor Matching
              </h3>
              <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                Get matched with a college student mentor who got into your
                dream school. Coming soon!
              </p>
              <ComingSoonBadge className="mt-4" />
            </CardContent>
          </Card>
        </AnimatedCard>
      </TabsContent>
      <TabsContent value="forums">
        <AnimatedCard delay={0.05}>
          <Card className="text-center py-16">
            <CardContent>
              <span className="text-5xl" />
              <h3 className="font-display text-xl font-bold text-foreground mt-4">
                Student Forums
              </h3>
              <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                Talk to other students applying the same year, share tips, and
                support each other. Coming soon!
              </p>
              <ComingSoonBadge className="mt-4" />
            </CardContent>
          </Card>
        </AnimatedCard>
      </TabsContent>
    </Tabs>
  );

  return (
    <PageTransition className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl" />
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              AI Advisor
            </h1>
            <p className="text-muted-foreground mt-1">
              Your intelligent admissions partner — always one step ahead.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsParent(!isParent)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-medium text-sm transition-all ${
            isParent
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-muted text-muted-foreground border-border hover:border-primary/40"
          }`}
          data-ocid="ai.parent_mode.toggle"
        >
          {isParent ? "Parent Mode: ON" : "Switch to Parent Mode"}
        </button>
      </div>

      {isParent ? <ParentSummary>{content}</ParentSummary> : content}
    </PageTransition>
  );
}
