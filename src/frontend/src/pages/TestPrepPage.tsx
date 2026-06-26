import AnimatedCard from "@/components/AnimatedCard";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink } from "lucide-react";
import { useState } from "react";

const mockTests = [
  {
    name: "Khan Academy SAT",
    emoji: "📚",
    desc: "Free official SAT prep with College Board",
    url: "https://www.khanacademy.org/sat",
    tag: "SAT",
  },
  {
    name: "College Board Practice",
    emoji: "🎓",
    desc: "8 full-length official SAT practice tests",
    url: "https://satsuite.collegeboard.org/sat/practice",
    tag: "SAT",
  },
  {
    name: "ACT Official Prep",
    emoji: "🎯",
    desc: "Free practice tests from the makers of the ACT",
    url: "https://www.act.org/content/act/en/products-and-services/the-act/test-preparation.html",
    tag: "ACT",
  },
  {
    name: "JEE Official Mock",
    emoji: "🔬",
    desc: "NTA official mock test portal for JEE Main",
    url: "https://nta.ac.in/",
    tag: "JEE",
  },
  {
    name: "NEET NTA Practice",
    emoji: "🦷",
    desc: "NTA official mock tests for NEET UG",
    url: "https://nta.ac.in/",
    tag: "NEET",
  },
  {
    name: "Princeton Review",
    emoji: "🏆",
    desc: "Timed practice tests with scoring breakdowns",
    url: "https://www.princetonreview.com/college/free-sat-practice-test",
    tag: "SAT/ACT",
  },
];

const apCourses = [
  {
    name: "AP Calculus BC",
    difficulty: "Hard",
    credit: "Up to 8 credits",
    majors: "STEM, Engineering, Economics",
  },
  {
    name: "AP Physics C",
    difficulty: "Hard",
    credit: "Up to 8 credits",
    majors: "Physics, Engineering",
  },
  {
    name: "AP Chemistry",
    difficulty: "Hard",
    credit: "Up to 4 credits",
    majors: "Pre-Med, Chemistry, Biology",
  },
  {
    name: "AP Computer Science A",
    difficulty: "Medium",
    credit: "Up to 4 credits",
    majors: "CS, Software Engineering",
  },
  {
    name: "AP Biology",
    difficulty: "Medium",
    credit: "Up to 4 credits",
    majors: "Pre-Med, Biology, Ecology",
  },
  {
    name: "AP US History",
    difficulty: "Medium",
    credit: "Up to 4 credits",
    majors: "History, Political Science, Law",
  },
  {
    name: "AP English Literature",
    difficulty: "Medium",
    credit: "Up to 4 credits",
    majors: "English, Journalism, Education",
  },
  {
    name: "AP Psychology",
    difficulty: "Easy",
    credit: "Up to 3 credits",
    majors: "Psychology, Social Work",
  },
  {
    name: "AP Statistics",
    difficulty: "Medium",
    credit: "Up to 4 credits",
    majors: "Math, Data Science, Business",
  },
  {
    name: "AP Macroeconomics",
    difficulty: "Easy",
    credit: "Up to 3 credits",
    majors: "Economics, Business, Policy",
  },
  {
    name: "IB Mathematics HL",
    difficulty: "Hard",
    credit: "Varies by university",
    majors: "STEM, Engineering",
  },
  {
    name: "IB Physics HL",
    difficulty: "Hard",
    credit: "Varies by university",
    majors: "Physics, Engineering",
  },
  {
    name: "IB Chemistry SL",
    difficulty: "Medium",
    credit: "Varies by university",
    majors: "Chemistry, Pre-Med",
  },
  {
    name: "IB Economics HL",
    difficulty: "Medium",
    credit: "Varies by university",
    majors: "Economics, Business, Finance",
  },
  {
    name: "IB Theory of Knowledge",
    difficulty: "Easy",
    credit: "Core requirement",
    majors: "All majors — philosophy component",
  },
];

const subjects = [
  { name: "Math", score: 72 },
  { name: "Reading", score: 85 },
  { name: "Science", score: 61 },
  { name: "Writing", score: 79 },
  { name: "English", score: 88 },
  { name: "History", score: 67 },
];

const difficultyColor: Record<string, string> = {
  Easy: "bg-[oklch(0.55_0.18_145)]/15 text-[oklch(0.42_0.18_145)]",
  Medium: "bg-primary/15 text-primary",
  Hard: "bg-destructive/15 text-destructive",
};

type ScoreEntry = { date: string; section: string; score: string };

function ScorePredictor() {
  const [test, setTest] = useState("SAT");
  const [current, setCurrent] = useState(1050);
  const [target, setTarget] = useState(1400);
  const [testDate, setTestDate] = useState("");

  const tests: Record<
    string,
    { max: number; avg: number; colleges: { name: string; min: number }[] }
  > = {
    SAT: {
      max: 1600,
      avg: 1050,
      colleges: [
        { name: "Harvard", min: 1580 },
        { name: "UCLA", min: 1380 },
        { name: "UT Austin", min: 1250 },
        { name: "UMass Amherst", min: 1150 },
      ],
    },
    ACT: {
      max: 36,
      avg: 20,
      colleges: [
        { name: "MIT", min: 35 },
        { name: "Duke", min: 34 },
        { name: "Purdue", min: 28 },
        { name: "Ohio State", min: 24 },
      ],
    },
    JEE: {
      max: 300,
      avg: 90,
      colleges: [
        { name: "IIT Bombay", min: 250 },
        { name: "IIT Delhi", min: 240 },
        { name: "BITS Pilani", min: 200 },
      ],
    },
    NEET: {
      max: 720,
      avg: 450,
      colleges: [
        { name: "AIIMS Delhi", min: 700 },
        { name: "JIPMER", min: 680 },
        { name: "Kasturba Medical", min: 600 },
      ],
    },
  };
  const info = tests[test];
  const likelihood = Math.min(100, Math.round((current / target) * 100));
  const opened = info.colleges.filter((c) => current >= c.min);

  return (
    <AnimatedCard delay={0.05}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🎯 Score Predictor
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <Label className="text-xs">Exam</Label>
              <Select value={test} onValueChange={setTest}>
                <SelectTrigger
                  className="mt-1"
                  data-ocid="testprep.predictor_exam.select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["SAT", "ACT", "JEE", "NEET"].map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Current Score</Label>
              <Input
                type="number"
                value={current}
                onChange={(e) => setCurrent(Number(e.target.value))}
                className="mt-1"
                data-ocid="testprep.predictor_current.input"
              />
            </div>
            <div>
              <Label className="text-xs">Target Score</Label>
              <Input
                type="number"
                value={target}
                onChange={(e) => setTarget(Number(e.target.value))}
                className="mt-1"
                data-ocid="testprep.predictor_target.input"
              />
            </div>
            <div>
              <Label className="text-xs">Test Date</Label>
              <Input
                type="date"
                value={testDate}
                onChange={(e) => setTestDate(e.target.value)}
                className="mt-1"
                data-ocid="testprep.predictor_date.input"
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-3 pt-2">
            <div className="text-center p-4 rounded-xl bg-primary/10">
              <p className="text-3xl font-bold text-primary">{likelihood}%</p>
              <p className="text-xs text-muted-foreground mt-1">
                Likelihood of reaching target
              </p>
            </div>
            <div className="text-center p-4 rounded-xl bg-muted">
              <p className="text-3xl font-bold text-foreground">
                {target - current > 0 ? `+${target - current}` : "✓"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Points needed
              </p>
            </div>
            <div className="text-center p-4 rounded-xl bg-[oklch(0.55_0.18_145)]/10">
              <p className="text-3xl font-bold text-[oklch(0.42_0.18_145)]">
                {opened.length}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Colleges you can reach now
              </p>
            </div>
          </div>
          {opened.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                Colleges within reach
              </p>
              <div className="flex flex-wrap gap-2">
                {opened.map((c) => (
                  <Badge key={c.name} variant="secondary">
                    {c.name} ≥{c.min}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </AnimatedCard>
  );
}

function StudyPlanGenerator() {
  const [targetScore, setTargetScore] = useState(1400);
  const [days, setDays] = useState(60);
  const [hoursDay, setHoursDay] = useState(2);
  const [generated, setGenerated] = useState(false);

  const weeks = Math.floor(days / 7);
  const totalHours = days * hoursDay;

  const plan = [
    {
      week: "Week 1–2",
      focus: "Diagnostic & Foundation",
      tasks: [
        "Take a full diagnostic test",
        "Identify weak sections",
        "Review core math formulas",
      ],
    },
    {
      week: "Week 3–4",
      focus: "Section Deep-Dives",
      tasks: [
        "Math: algebra + advanced topics",
        "Reading: passage strategies",
        "Grammar: error patterns",
      ],
    },
    {
      week: "Week 5–6",
      focus: "Timed Practice",
      tasks: [
        "2 full-length timed tests",
        "Review every mistake",
        "Track score on each section",
      ],
    },
    {
      week: "Week 7–8",
      focus: "Final Sprint",
      tasks: [
        "Focus on highest-impact areas",
        "1 full test under real conditions",
        "Light review 48hrs before exam",
      ],
    },
  ];

  return (
    <AnimatedCard delay={0.07}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📚 Study Plan Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-3 gap-3">
            <div>
              <Label className="text-xs">Target Score</Label>
              <Input
                type="number"
                value={targetScore}
                onChange={(e) => setTargetScore(Number(e.target.value))}
                className="mt-1"
                data-ocid="testprep.plan_target.input"
              />
            </div>
            <div>
              <Label className="text-xs">Days Until Test</Label>
              <Input
                type="number"
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="mt-1"
                data-ocid="testprep.plan_days.input"
              />
            </div>
            <div>
              <Label className="text-xs">Hours/Day</Label>
              <Input
                type="number"
                value={hoursDay}
                onChange={(e) => setHoursDay(Number(e.target.value))}
                className="mt-1"
                data-ocid="testprep.plan_hours.input"
              />
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 rounded-xl bg-muted/50">
            <div className="text-center">
              <p className="text-xl font-bold text-primary">{weeks}</p>
              <p className="text-xs text-muted-foreground">Weeks</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-foreground">{totalHours}</p>
              <p className="text-xs text-muted-foreground">Total Hours</p>
            </div>
            <Button
              size="sm"
              onClick={() => setGenerated(true)}
              data-ocid="testprep.generate_plan.button"
            >
              Generate Plan
            </Button>
          </div>
          {generated && (
            <div className="space-y-3">
              {plan.slice(0, Math.ceil(weeks / 2) + 1).map((w, i) => (
                <div
                  key={w.week}
                  className={`p-3 rounded-xl border ${i === 0 ? "border-primary/30 bg-primary/5" : "border-border bg-muted/30"}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-primary">
                      {w.week}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {w.focus}
                    </Badge>
                  </div>
                  <ul className="space-y-1">
                    {w.tasks.map((t) => (
                      <li
                        key={t}
                        className="text-xs text-muted-foreground flex items-center gap-1"
                      >
                        <span>•</span>
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </AnimatedCard>
  );
}

function MockTestLinks() {
  return (
    <AnimatedCard delay={0.06}>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockTests.map((t, i) => (
          <Card
            key={t.name}
            className="hover:shadow-md transition-shadow"
            data-ocid={`testprep.mock_test.item.${i + 1}`}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <span className="text-3xl">{t.emoji}</span>
                <Badge variant="outline" className="text-xs">
                  {t.tag}
                </Badge>
              </div>
              <h3 className="font-semibold text-sm text-foreground mb-1">
                {t.name}
              </h3>
              <p className="text-xs text-muted-foreground mb-3">{t.desc}</p>
              <Button asChild variant="outline" size="sm" className="w-full">
                <a
                  href={t.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-ocid={`testprep.mock_test_link.button.${i + 1}`}
                >
                  Open <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </AnimatedCard>
  );
}

function ScoreTracker() {
  const [entries, setEntries] = useState<ScoreEntry[]>([
    { date: "2026-03-01", section: "Math", score: "620" },
    { date: "2026-04-01", section: "Math", score: "680" },
    { date: "2026-05-01", section: "Reading", score: "590" },
  ]);
  const [newEntry, setNewEntry] = useState<ScoreEntry>({
    date: "",
    section: "",
    score: "",
  });

  return (
    <AnimatedCard delay={0.08}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📈 Score Improvement Tracker
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Input
              type="date"
              className="w-36"
              value={newEntry.date}
              onChange={(e) =>
                setNewEntry((p) => ({ ...p, date: e.target.value }))
              }
              data-ocid="testprep.score_date.input"
            />
            <Input
              placeholder="Section (e.g. Math)"
              className="w-36"
              value={newEntry.section}
              onChange={(e) =>
                setNewEntry((p) => ({ ...p, section: e.target.value }))
              }
              data-ocid="testprep.score_section.input"
            />
            <Input
              placeholder="Score"
              type="number"
              className="w-28"
              value={newEntry.score}
              onChange={(e) =>
                setNewEntry((p) => ({ ...p, score: e.target.value }))
              }
              data-ocid="testprep.score_value.input"
            />
            <Button
              size="sm"
              onClick={() => {
                if (newEntry.date && newEntry.section && newEntry.score) {
                  setEntries((p) => [...p, newEntry]);
                  setNewEntry({ date: "", section: "", score: "" });
                }
              }}
              data-ocid="testprep.add_score.button"
            >
              Add
            </Button>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 font-semibold">Date</th>
                <th className="text-left py-2 font-semibold">Section</th>
                <th className="text-right py-2 font-semibold text-primary">
                  Score
                </th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e, i) => (
                <tr
                  key={`${e.date}-${e.section}`}
                  className="border-b border-border/50 hover:bg-muted/30"
                  data-ocid={`testprep.score_entry.item.${i + 1}`}
                >
                  <td className="py-2 text-muted-foreground">{e.date}</td>
                  <td className="py-2 text-foreground">{e.section}</td>
                  <td className="py-2 text-right font-bold text-primary">
                    {e.score}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </AnimatedCard>
  );
}

function SubjectStrength() {
  return (
    <AnimatedCard delay={0.07}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🧪 Subject Strength Analyser
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {subjects.map((s) => (
            <div key={s.name}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-foreground">{s.name}</span>
                <span
                  className={
                    s.score < 70
                      ? "text-destructive font-semibold"
                      : "text-primary font-semibold"
                  }
                >
                  {s.score}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${s.score < 70 ? "bg-destructive" : s.score < 80 ? "bg-primary" : "bg-[oklch(0.55_0.18_145)]"}`}
                  style={{ width: `${s.score}%` }}
                />
              </div>
              {s.score < 70 && (
                <p className="text-xs text-destructive mt-0.5">
                  ⚠️ Weak area — prioritise in study plan
                </p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </AnimatedCard>
  );
}

function GradeCalculator() {
  const [items, setItems] = useState([
    { name: "Midterm", weight: 30, grade: 87 },
    { name: "Homework", weight: 20, grade: 95 },
    { name: "Final", weight: 40, grade: 0 },
    { name: "Participation", weight: 10, grade: 100 },
  ]);

  const weightedSum = items.reduce(
    (acc, i) => acc + (i.grade * i.weight) / 100,
    0,
  );
  const totalWeight = items.reduce((acc, i) => acc + i.weight, 0);
  const gpa = Math.min(4.0, (weightedSum / totalWeight) * 0.04).toFixed(2);

  return (
    <AnimatedCard delay={0.09}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📊 Grade Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 font-semibold">Assignment</th>
                <th className="text-right py-2 font-semibold">Weight (%)</th>
                <th className="text-right py-2 font-semibold">Grade</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={item.name} className="border-b border-border/50">
                  <td className="py-2 text-foreground">{item.name}</td>
                  <td className="py-2 text-right text-muted-foreground">
                    {item.weight}%
                  </td>
                  <td className="py-2 text-right">
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={item.grade}
                      onChange={(e) =>
                        setItems((prev) =>
                          prev.map((it, idx) =>
                            idx === i
                              ? { ...it, grade: Number(e.target.value) }
                              : it,
                          ),
                        )
                      }
                      className="w-20 h-7 text-xs text-right inline-block"
                      data-ocid={`testprep.grade_input.input.${i + 1}`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 rounded-xl bg-primary/10">
              <p className="text-2xl font-bold text-primary">
                {weightedSum.toFixed(1)}%
              </p>
              <p className="text-xs text-muted-foreground">Weighted Grade</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-muted">
              <p className="text-2xl font-bold text-foreground">{gpa} GPA</p>
              <p className="text-xs text-muted-foreground">
                Unweighted Estimate
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </AnimatedCard>
  );
}

function ExtracurricularScorer() {
  const [activities, setActivities] = useState([
    { name: "Student Council President", impact: 9 },
    { name: "Varsity Soccer Captain", impact: 7 },
    { name: "Robotics Club", impact: 8 },
    { name: "Volunteer Tutoring", impact: 6 },
  ]);

  const avg = activities.reduce((a, b) => a + b.impact, 0) / activities.length;
  const impactLabel =
    avg >= 8
      ? "Exceptional"
      : avg >= 6
        ? "Strong"
        : avg >= 4
          ? "Moderate"
          : "Needs Work";

  return (
    <AnimatedCard delay={0.08}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🏆 Extracurricular Impact Scorer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {activities.map((act, i) => (
            <div key={act.name}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-foreground">
                  {act.name}
                </span>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={1}
                    max={10}
                    value={act.impact}
                    onChange={(e) =>
                      setActivities((prev) =>
                        prev.map((a, idx) =>
                          idx === i
                            ? { ...a, impact: Number(e.target.value) }
                            : a,
                        ),
                      )
                    }
                    className="w-16 h-7 text-xs text-center"
                    data-ocid={`testprep.activity_score.input.${i + 1}`}
                  />
                  <span className="text-xs text-muted-foreground">/10</span>
                </div>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${act.impact * 10}%` }}
                />
              </div>
            </div>
          ))}
          <div className="rounded-xl bg-primary/5 border border-primary/20 p-4 flex items-center justify-between">
            <div>
              <p className="font-semibold text-foreground">
                Overall Impact Score
              </p>
              <p className="text-xs text-muted-foreground">
                Based on rated activities
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">
                {avg.toFixed(1)}/10
              </p>
              <Badge variant="secondary">{impactLabel}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </AnimatedCard>
  );
}

function APAdvisor() {
  return (
    <AnimatedCard delay={0.07}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📚 AP/IB Course Advisor
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 font-semibold">Course</th>
                <th className="text-center py-2 font-semibold">Difficulty</th>
                <th className="text-left py-2 font-semibold">Credit Value</th>
                <th className="text-left py-2 font-semibold">Best For</th>
              </tr>
            </thead>
            <tbody>
              {apCourses.map((c, i) => (
                <tr
                  key={c.name}
                  className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                  data-ocid={`testprep.ap_course.item.${i + 1}`}
                >
                  <td className="py-2 font-medium text-foreground">{c.name}</td>
                  <td className="py-2 text-center">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${difficultyColor[c.difficulty]}`}
                    >
                      {c.difficulty}
                    </span>
                  </td>
                  <td className="py-2 text-muted-foreground text-xs">
                    {c.credit}
                  </td>
                  <td className="py-2 text-muted-foreground text-xs">
                    {c.majors}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </AnimatedCard>
  );
}

export default function TestPrepPage() {
  return (
    <PageTransition className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 flex items-center gap-3">
        <span className="text-4xl">📊</span>
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Test Prep & Academics
          </h1>
          <p className="text-muted-foreground mt-1">
            Hit your target score with personalised tools, trackers, and study
            resources.
          </p>
        </div>
      </div>

      <Tabs defaultValue="predictor" className="w-full">
        <TabsList className="flex flex-wrap h-auto gap-1 mb-6 bg-muted/60 p-1">
          <TabsTrigger value="predictor" data-ocid="testprep.predictor.tab">
            🎯 Score Predictor
          </TabsTrigger>
          <TabsTrigger value="plan" data-ocid="testprep.plan.tab">
            📚 Study Plan
          </TabsTrigger>
          <TabsTrigger value="mocks" data-ocid="testprep.mocks.tab">
            🧪 Mock Tests
          </TabsTrigger>
          <TabsTrigger value="tracker" data-ocid="testprep.tracker.tab">
            📈 Score Tracker
          </TabsTrigger>
          <TabsTrigger value="strength" data-ocid="testprep.strength.tab">
            🧪 Strengths
          </TabsTrigger>
          <TabsTrigger value="grades" data-ocid="testprep.grades.tab">
            📊 GPA Calc
          </TabsTrigger>
          <TabsTrigger
            value="extracurricular"
            data-ocid="testprep.extracurricular.tab"
          >
            🏆 Activities
          </TabsTrigger>
          <TabsTrigger value="ap" data-ocid="testprep.ap.tab">
            📚 AP/IB Advisor
          </TabsTrigger>
        </TabsList>

        <TabsContent value="predictor">
          <ScorePredictor />
        </TabsContent>
        <TabsContent value="plan">
          <StudyPlanGenerator />
        </TabsContent>
        <TabsContent value="mocks">
          <MockTestLinks />
        </TabsContent>
        <TabsContent value="tracker">
          <ScoreTracker />
        </TabsContent>
        <TabsContent value="strength">
          <SubjectStrength />
        </TabsContent>
        <TabsContent value="grades">
          <GradeCalculator />
        </TabsContent>
        <TabsContent value="extracurricular">
          <ExtracurricularScorer />
        </TabsContent>
        <TabsContent value="ap">
          <APAdvisor />
        </TabsContent>
      </Tabs>
    </PageTransition>
  );
}
