import AnimatedCard from "@/components/AnimatedCard";
import PageTransition from "@/components/PageTransition";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle2, Copy, Plus, Upload } from "lucide-react";
import { useState } from "react";

const applications = [
  {
    college: "Stanford University",
    status: "Applied",
    deadline: "Jan 2, 2025",
    decision: "Apr 1, 2025",
  },
  {
    college: "MIT",
    status: "Applied",
    deadline: "Jan 1, 2025",
    decision: "Mar 14, 2025",
  },
  {
    college: "Harvard University",
    status: "Deferred",
    deadline: "Nov 1, 2024",
    decision: "Apr 1, 2025",
  },
  {
    college: "UC Berkeley",
    status: "Waitlisted",
    deadline: "Nov 30, 2024",
    decision: "May 1, 2025",
  },
  {
    college: "Yale University",
    status: "Rejected",
    deadline: "Jan 2, 2025",
    decision: "Mar 28, 2025",
  },
  {
    college: "Princeton University",
    status: "Applied",
    deadline: "Jan 1, 2025",
    decision: "Apr 1, 2025",
  },
  {
    college: "Columbia University",
    status: "Accepted",
    deadline: "Jan 1, 2025",
    decision: "Apr 1, 2025",
  },
  {
    college: "Cornell University",
    status: "Applied",
    deadline: "Jan 2, 2025",
    decision: "Apr 1, 2025",
  },
];

const statusColors: Record<string, string> = {
  Applied: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  Waitlisted: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  Deferred: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  Accepted: "bg-green-500/10 text-green-600 border-green-500/20",
  Rejected: "bg-red-500/10 text-red-600 border-red-500/20",
};

const documents = [
  { name: "Transcripts", emoji: "📄", status: "Uploaded", count: 2 },
  { name: "Test Scores", emoji: "📊", status: "Uploaded", count: 1 },
  { name: "Government ID", emoji: "🪹", status: "Uploaded", count: 1 },
  { name: "Certificates", emoji: "🏆", status: "Pending", count: 0 },
  { name: "Letters of Rec", emoji: "✉️", status: "Pending", count: 0 },
  { name: "Financial Docs", emoji: "💰", status: "Expired", count: 1 },
];

const docStatusColor: Record<string, string> = {
  Uploaded: "text-green-600",
  Pending: "text-yellow-600",
  Expired: "text-red-500",
};

const sampleTasks = [
  {
    id: 1,
    text: "Request letter of recommendation from Mr. Sharma",
    due: "Dec 1, 2024",
    priority: "High",
    done: false,
  },
  {
    id: 2,
    text: "Complete Stanford supplemental essays",
    due: "Dec 15, 2024",
    priority: "High",
    done: false,
  },
  {
    id: 3,
    text: "Upload updated transcript to document vault",
    due: "Dec 20, 2024",
    priority: "Medium",
    done: true,
  },
  {
    id: 4,
    text: "Order official SAT score report for MIT",
    due: "Dec 22, 2024",
    priority: "Medium",
    done: false,
  },
  {
    id: 5,
    text: "Book IELTS exam slot for January",
    due: "Dec 10, 2024",
    priority: "High",
    done: false,
  },
  {
    id: 6,
    text: "Research scholarship options for international students",
    due: "Jan 5, 2025",
    priority: "Low",
    done: false,
  },
];

const priorityColors: Record<string, string> = {
  High: "bg-red-500/10 text-red-600",
  Medium: "bg-yellow-500/10 text-yellow-600",
  Low: "bg-green-500/10 text-green-600",
};

const progressGauges = [
  {
    college: "Columbia University",
    profile: 100,
    essays: 100,
    documents: 85,
    testScores: 100,
    total: 97,
  },
  {
    college: "Stanford University",
    profile: 100,
    essays: 60,
    documents: 40,
    testScores: 80,
    total: 70,
  },
  {
    college: "MIT",
    profile: 100,
    essays: 75,
    documents: 60,
    testScores: 100,
    total: 84,
  },
  {
    college: "Harvard University",
    profile: 100,
    essays: 30,
    documents: 20,
    testScores: 80,
    total: 58,
  },
];

const emailTemplates = [
  {
    name: "Follow-up to Admissions",
    desc: "Check status of your application",
    emoji: "📧",
  },
  {
    name: "Waitlist Update Request",
    desc: "Express continued interest after waitlist",
    emoji: "⏳",
  },
  {
    name: "Thank You After Interview",
    desc: "Post-interview thank you note",
    emoji: "🙏",
  },
  {
    name: "Professor Inquiry",
    desc: "Reach out about research opportunities",
    emoji: "🔬",
  },
  {
    name: "Financial Aid Appeal",
    desc: "Request additional financial aid",
    emoji: "💸",
  },
  {
    name: "Enrollment Deposit Delay",
    desc: "Request deadline extension for deposit",
    emoji: "🗓️",
  },
  {
    name: "Withdraw Application",
    desc: "Politely withdraw from a college",
    emoji: "↩️",
  },
  {
    name: "Accept Offer",
    desc: "Formally accept your admission offer",
    emoji: "✅",
  },
];

const acceptanceLetters = [
  {
    college: "Columbia University",
    program: "BS Computer Science",
    deadline: "May 1, 2025",
    emoji: "🗽",
  },
  {
    college: "Boston University",
    program: "BA Economics",
    deadline: "May 1, 2025",
    emoji: "🏙️",
  },
  {
    college: "UC San Diego",
    program: "BS Data Science",
    deadline: "Jun 1, 2025",
    emoji: "🌊",
  },
];

const rejections = [
  {
    college: "Yale University",
    date: "Mar 28, 2025",
    notes:
      "Strong GPA but essays lacked specificity. Will improve Why Yale section.",
    reflection:
      "Research the school more deeply, mention specific courses and professors",
  },
  {
    college: "Duke University",
    date: "Mar 30, 2025",
    notes: "Interviewed well but test scores were below median. Retaking SAT.",
    reflection: "Target 1500+ on next attempt, consider test-optional schools",
  },
  {
    college: "Northwestern",
    date: "Apr 2, 2025",
    notes:
      "My extracurriculars were broad but not deep — too many clubs, not enough impact.",
    reflection: "Quality over quantity — pick 3 activities and show leadership",
  },
  {
    college: "Brown University",
    date: "Apr 1, 2025",
    notes:
      "Open curriculum essay was weak. Did not demonstrate genuine interest in Brown's model.",
    reflection:
      "Visit campus or attend virtual events before writing Why Us essays",
  },
];

export default function TrackingPage() {
  const [tasks, setTasks] = useState(sampleTasks);
  const [newTask, setNewTask] = useState("");
  const [copied, setCopied] = useState<number | null>(null);

  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );
  };

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: newTask,
        due: "TBD",
        priority: "Medium",
        done: false,
      },
    ]);
    setNewTask("");
  };

  const handleCopy = (i: number) => {
    setCopied(i);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <PageTransition className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-14">
      <div className="flex items-center gap-3">
        <span className="text-4xl">📱</span>
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Tracking & Organisation
          </h1>
          <p className="text-muted-foreground mt-1">
            Every application, document, task, and deadline in one place.
          </p>
        </div>
      </div>

      {/* Application Status Tracker */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🎯</span>
          <h2 className="font-display text-xl font-bold text-foreground">
            Application Status Tracker
          </h2>
        </div>
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>University</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Decision Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((app, i) => (
                  <TableRow
                    key={app.college}
                    data-ocid={`tracking.app_status.item.${i + 1}`}
                  >
                    <TableCell className="font-medium text-sm">
                      {app.college}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full border ${statusColors[app.status]}`}
                      >
                        {app.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {app.deadline}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {app.decision}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      {/* Document Vault */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">📁</span>
          <h2 className="font-display text-xl font-bold text-foreground">
            Document Vault
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 bounce-reveal">
          {documents.map((doc, i) => (
            <AnimatedCard key={doc.name} delay={i * 0.07}>
              <Card data-ocid={`tracking.document.item.${i + 1}`}>
                <CardContent className="p-4 text-center">
                  <div className="text-3xl mb-2">{doc.emoji}</div>
                  <p className="text-xs font-semibold text-foreground mb-1">
                    {doc.name}
                  </p>
                  <p
                    className={`text-xs font-medium ${docStatusColor[doc.status]}`}
                  >
                    {doc.status}
                  </p>
                  {doc.count > 0 && (
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {doc.count} file{doc.count > 1 ? "s" : ""}
                    </p>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-2 text-xs"
                    data-ocid={`tracking.document.upload_button.${i + 1}`}
                  >
                    <Upload className="h-3 w-3 mr-1" /> Upload
                  </Button>
                </CardContent>
              </Card>
            </AnimatedCard>
          ))}
        </div>
      </section>

      {/* Task Manager */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">✅</span>
          <h2 className="font-display text-xl font-bold text-foreground">
            Task Manager
          </h2>
        </div>
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Add a new task..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTask()}
                data-ocid="tracking.tasks.input"
              />
              <Button
                type="button"
                onClick={addTask}
                data-ocid="tracking.tasks.add_button"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2 stagger-children">
              {tasks.map((task, i) => (
                <div
                  key={task.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${task.done ? "bg-muted/40 opacity-60" : "bg-card"}`}
                  data-ocid={`tracking.task.item.${i + 1}`}
                >
                  <Checkbox
                    id={`task-${task.id}`}
                    checked={task.done}
                    onCheckedChange={() => toggleTask(task.id)}
                    className="mt-0.5"
                    data-ocid={`tracking.task.checkbox.${i + 1}`}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm ${task.done ? "line-through text-muted-foreground" : "text-foreground"}`}
                    >
                      {task.text}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        Due {task.due}
                      </span>
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${priorityColors[task.priority]}`}
                      >
                        {task.priority}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Progress Gauges */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">📊</span>
          <h2 className="font-display text-xl font-bold text-foreground">
            Application Progress
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 bounce-reveal">
          {progressGauges.map((pg, i) => (
            <AnimatedCard key={pg.college} delay={i * 0.08}>
              <Card data-ocid={`tracking.progress.item.${i + 1}`}>
                <CardContent className="p-4">
                  <p className="font-semibold text-sm text-foreground mb-3 truncate">
                    {pg.college}
                  </p>
                  <div className="flex justify-center mb-4">
                    <div className="relative w-20 h-20">
                      <svg
                        viewBox="0 0 36 36"
                        className="w-20 h-20 -rotate-90"
                        role="img"
                        aria-label="Progress circle"
                      >
                        <title>Progress circle</title>
                        <circle
                          cx="18"
                          cy="18"
                          r="15.9"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          className="text-muted/40"
                        />
                        <circle
                          cx="18"
                          cy="18"
                          r="15.9"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          className="text-primary"
                          strokeDasharray={`${pg.total} 100`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-foreground">
                        {pg.total}%
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    {[
                      { label: "Profile", val: pg.profile },
                      { label: "Essays", val: pg.essays },
                      { label: "Documents", val: pg.documents },
                      { label: "Test Scores", val: pg.testScores },
                    ].map(({ label, val }) => (
                      <div
                        key={label}
                        className="flex items-center justify-between"
                      >
                        <span className="text-muted-foreground">{label}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full rounded-full bg-primary"
                              style={{ width: `${val}%` }}
                            />
                          </div>
                          <span className="text-foreground font-medium w-8 text-right">
                            {val}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </AnimatedCard>
          ))}
        </div>
      </section>

      {/* Email Template Library */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">📧</span>
          <h2 className="font-display text-xl font-bold text-foreground">
            Email Template Library
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 bounce-reveal">
          {emailTemplates.map((et, i) => (
            <AnimatedCard key={et.name} delay={i * 0.06}>
              <Card
                className="hover:shadow-card transition-shadow"
                data-ocid={`tracking.email_template.item.${i + 1}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-2xl">{et.emoji}</span>
                      <p className="font-semibold text-xs text-foreground mt-1">
                        {et.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {et.desc}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(i)}
                      className="shrink-0"
                      data-ocid={`tracking.email_template.copy_button.${i + 1}`}
                    >
                      {copied === i ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </AnimatedCard>
          ))}
        </div>
      </section>

      {/* Acceptance Letter Vault */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🎉</span>
          <h2 className="font-display text-xl font-bold text-foreground">
            Acceptance Letter Vault
          </h2>
        </div>
        <Card className="mb-4 border-dashed border-2 border-primary/30">
          <CardContent className="p-6 text-center">
            <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm font-medium text-foreground">
              Upload your acceptance letters
            </p>
            <p className="text-xs text-muted-foreground mb-3">
              PDF or image files supported
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              data-ocid="tracking.acceptance_vault.upload_button"
            >
              <Upload className="h-3 w-3 mr-1" /> Choose File
            </Button>
          </CardContent>
        </Card>
        <div className="grid sm:grid-cols-3 gap-4 bounce-reveal">
          {acceptanceLetters.map((al, i) => (
            <AnimatedCard key={al.college} delay={i * 0.1}>
              <Card
                className="bg-green-500/5 border-green-500/20"
                data-ocid={`tracking.acceptance.item.${i + 1}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{al.emoji}</span>
                    <div>
                      <p className="font-bold text-sm text-foreground">
                        {al.college}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {al.program}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    Deposit deadline: {al.deadline}
                  </p>
                  <Button
                    type="button"
                    size="sm"
                    className="w-full text-xs"
                    data-ocid={`tracking.acceptance.celebrate_button.${i + 1}`}
                  >
                    🎊 Celebrate!
                  </Button>
                </CardContent>
              </Card>
            </AnimatedCard>
          ))}
        </div>
      </section>

      {/* Rejection Analysis */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🔍</span>
          <h2 className="font-display text-xl font-bold text-foreground">
            Rejection Analysis
          </h2>
        </div>
        <Card className="mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Log a Rejection</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">College Name</Label>
                <Input
                  placeholder="e.g. Yale University"
                  data-ocid="tracking.rejection.college_input"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Decision Date</Label>
                <Input type="date" data-ocid="tracking.rejection.date_input" />
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <Label className="text-xs">Your Reflection</Label>
              <Input
                placeholder="What would you do differently?"
                data-ocid="tracking.rejection.notes_input"
              />
            </div>
            <Button
              type="button"
              size="sm"
              className="mt-3"
              data-ocid="tracking.rejection.log_button"
            >
              Log Rejection
            </Button>
          </CardContent>
        </Card>
        <div className="grid sm:grid-cols-2 gap-4 bounce-reveal">
          {rejections.map((r, i) => (
            <AnimatedCard key={r.college} delay={i * 0.08}>
              <Card data-ocid={`tracking.rejection.item.${i + 1}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-bold text-sm text-foreground">
                      {r.college}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {r.date}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {r.notes}
                  </p>
                  <div className="p-2 rounded-lg bg-muted/50">
                    <p className="text-xs font-medium text-foreground mb-0.5">
                      💡 Next Step
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {r.reflection}
                    </p>
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
