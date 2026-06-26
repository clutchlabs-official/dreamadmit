import AnimatedCard from "@/components/AnimatedCard";
import PageTransition from "@/components/PageTransition";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import {
  useAddAnxietyRating,
  useAddCelebrationEvent,
  useAddMoodCheckIn,
  useAnxietyRatings,
  useCelebrationEvents,
  useMoodCheckIns,
} from "@/hooks/useQueries";
import { motion } from "motion/react";
import { useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// ── Types ─────────────────────────────────────────────────────────────────────
interface BurnoutAnswer {
  q: string;
  answer: boolean | null;
}

const MOOD_OPTIONS = [
  { value: 1, emoji: "😔", label: "Struggling" },
  { value: 2, emoji: "😕", label: "Uncertain" },
  { value: 3, emoji: "😐", label: "Neutral" },
  { value: 4, emoji: "🙂", label: "Good" },
  { value: 5, emoji: "😄", label: "Fantastic" },
];

const BURNOUT_QUESTIONS = [
  "Do you feel exhausted even after a full night of sleep?",
  "Have you lost interest in activities you once enjoyed?",
  "Do you feel overwhelmed by your application workload most days?",
  "Are you finding it hard to focus or remember things?",
  "Have you been withdrawing from friends and family lately?",
];

const STRESS_TIPS = [
  {
    emoji: "🫁",
    title: "Box Breathing",
    body: "Inhale for 4 counts, hold for 4, exhale for 4, hold for 4. Repeat 4 times whenever anxiety spikes.",
    color:
      "bg-blue-50/40 border-blue-200/50 dark:bg-blue-950/20 dark:border-blue-800/30",
  },
  {
    emoji: "🗓️",
    title: "Time Blocking",
    body: "Split your day into 90-minute focus blocks with 20-minute breaks. One college task per block — no multitasking.",
    color:
      "bg-violet-50/40 border-violet-200/50 dark:bg-violet-950/20 dark:border-violet-800/30",
  },
  {
    emoji: "📓",
    title: "Daily Journaling",
    body: "Write 3 things you're grateful for each morning. It rewires your brain to notice wins, not just pressure.",
    color:
      "bg-amber-50/40 border-amber-200/50 dark:bg-amber-950/20 dark:border-amber-800/30",
  },
  {
    emoji: "🚶",
    title: "Move Every Hour",
    body: "A 10-minute walk resets your stress hormones better than a snack break. Step outside when the pressure builds.",
    color:
      "bg-green-50/40 border-green-200/50 dark:bg-green-950/20 dark:border-green-800/30",
  },
];

const REJECTION_TIPS = [
  {
    emoji: "💡",
    heading: "A rejection is a redirect.",
    body: "Every successful person has a list of rejections. Your dream college isn't the only path to your dream career — many extraordinary people thrived at their second-choice schools.",
  },
  {
    emoji: "📧",
    heading: "Write a kind email to yourself.",
    body: "Pretend a close friend was rejected. What would you tell them? Write that letter. You deserve the same compassion.",
  },
  {
    emoji: "🔁",
    heading: "Reassess, don't quit.",
    body: "Review your application honestly — what could be stronger? Consider gap year programs, community college transfers, or retaking standardised tests.",
  },
  {
    emoji: "🤝",
    heading: "Lean on your community.",
    body: "Talk to a counsellor, mentor, or trusted adult. Isolation amplifies rejection. Connection shrinks it.",
  },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionHeader({
  emoji,
  title,
  subtitle,
  delay = 0,
}: {
  emoji: string;
  title: string;
  subtitle: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay }}
      className="mb-6"
    >
      <div className="flex items-center gap-3">
        <span className="text-3xl">{emoji}</span>
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">
            {title}
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
        </div>
      </div>
    </motion.div>
  );
}

// ── Mood Check-In ─────────────────────────────────────────────────────────────

function MoodCheckInSection() {
  const { data: checkIns = [], isLoading } = useMoodCheckIns();
  const addMood = useAddMoodCheckIn();
  const [selected, setSelected] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const todayEntry = checkIns.find((c) => c.date === today);

  const handleSave = async () => {
    if (!selected) return;
    const moodOption = MOOD_OPTIONS.find((m) => m.value === selected);
    await addMood.mutateAsync({
      date: today,
      mood: BigInt(selected),
      moodEmoji: moodOption?.emoji ?? "😐",
      note,
    });
    setSaved(true);
    setNote("");
    setTimeout(() => setSaved(false), 3000);
  };

  // Build last-30-days calendar dots
  const last30 = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    const dateStr = d.toISOString().split("T")[0];
    const entry = checkIns.find((c) => c.date === dateStr);
    return { dateStr, mood: entry ? Number(entry.mood) : null };
  });

  const moodColor = (mood: number | null) => {
    if (mood === null) return "bg-muted";
    if (mood >= 5) return "bg-green-400";
    if (mood >= 4) return "bg-emerald-400";
    if (mood >= 3) return "bg-yellow-400";
    if (mood >= 2) return "bg-orange-400";
    return "bg-red-400";
  };

  return (
    <div className="space-y-5">
      {/* Today's check-in */}
      {todayEntry ? (
        <AnimatedCard className="rounded-2xl border border-border bg-card p-5">
          <p className="text-sm font-semibold text-muted-foreground mb-1">
            Today's mood
          </p>
          <div className="flex items-center gap-3">
            <span className="text-4xl">{todayEntry.moodEmoji}</span>
            <div>
              <p className="text-foreground font-medium">
                {MOOD_OPTIONS.find((m) => m.value === Number(todayEntry.mood))
                  ?.label ?? "Logged"}
              </p>
              {todayEntry.note && (
                <p className="text-sm text-muted-foreground mt-0.5">
                  {todayEntry.note}
                </p>
              )}
            </div>
            <Badge
              variant="secondary"
              className="ml-auto"
              data-ocid="mental.mood_logged.badge"
            >
              Logged ✓
            </Badge>
          </div>
        </AnimatedCard>
      ) : (
        <AnimatedCard className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
          <p className="text-sm font-semibold text-foreground mb-4">
            How are you feeling right now?
          </p>
          <div
            className="flex gap-3 flex-wrap"
            data-ocid="mental.mood_selector"
          >
            {MOOD_OPTIONS.map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => setSelected(m.value)}
                data-ocid={`mental.mood.${m.value}`}
                className={[
                  "flex flex-col items-center gap-1 rounded-xl px-4 py-3 border-2 transition-all duration-200",
                  selected === m.value
                    ? "border-primary bg-primary/10 scale-110"
                    : "border-border hover:border-primary/40 hover:bg-muted",
                ].join(" ")}
              >
                <span className="text-3xl">{m.emoji}</span>
                <span className="text-xs text-muted-foreground">{m.label}</span>
              </button>
            ))}
          </div>
          {selected && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-4 space-y-3"
            >
              <Textarea
                placeholder="Optional: what's on your mind today? (private)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="resize-none text-sm"
                rows={2}
                data-ocid="mental.mood_note.textarea"
              />
              <Button
                onClick={handleSave}
                disabled={addMood.isPending}
                data-ocid="mental.mood_save.button"
                className="gap-2"
              >
                {addMood.isPending
                  ? "Saving…"
                  : saved
                    ? "Saved! 🎉"
                    : "Save Check-In"}
              </Button>
            </motion.div>
          )}
        </AnimatedCard>
      )}

      {/* 30-day calendar */}
      {!isLoading && (
        <AnimatedCard
          delay={0.1}
          className="rounded-2xl border border-border bg-card p-5"
        >
          <p className="text-sm font-semibold text-muted-foreground mb-3">
            Last 30 days
          </p>
          <div className="flex flex-wrap gap-1.5">
            {last30.map((day) => (
              <div
                key={day.dateStr}
                title={`${day.dateStr}: ${day.mood !== null ? MOOD_OPTIONS.find((m) => m.value === day.mood)?.label : "No entry"}`}
                className={`h-5 w-5 rounded-sm ${moodColor(day.mood)} opacity-80 transition-opacity hover:opacity-100 cursor-default`}
              />
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-3">
            {MOOD_OPTIONS.map((m) => (
              <div
                key={m.value}
                className="flex items-center gap-1.5 text-xs text-muted-foreground"
              >
                <div className={`h-3 w-3 rounded-sm ${moodColor(m.value)}`} />
                {m.emoji} {m.label}
              </div>
            ))}
          </div>
        </AnimatedCard>
      )}
    </div>
  );
}

// ── Anxiety Tracker ───────────────────────────────────────────────────────────

function AnxietyTrackerSection() {
  const { data: ratings = [] } = useAnxietyRatings();
  const addRating = useAddAnxietyRating();
  const [confidence, setConfidence] = useState(5);
  const [worry, setWorry] = useState(5);
  const [submitted, setSubmitted] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const handleLog = async () => {
    await addRating.mutateAsync({
      date: today,
      confidenceScore: BigInt(confidence),
      worryScore: BigInt(worry),
    });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  // Build 14-day trend
  const last14 = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    const dateStr = d.toISOString().split("T")[0];
    const entry = ratings.find((r) => r.date === dateStr);
    return {
      date: dateStr.slice(5), // MM-DD
      confidence: entry ? Number(entry.confidenceScore) : null,
      worry: entry ? Number(entry.worryScore) : null,
    };
  });

  return (
    <div className="space-y-5">
      <AnimatedCard className="rounded-2xl border border-border bg-card p-5">
        <p className="text-sm font-semibold text-foreground mb-5">
          How are you feeling today? Move the sliders honestly — this is just
          for you.
        </p>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-foreground">
                💪 Confidence
              </span>
              <span className="text-sm font-bold text-primary">
                {confidence}/10
              </span>
            </div>
            <Slider
              min={1}
              max={10}
              step={1}
              value={[confidence]}
              onValueChange={([v]) => setConfidence(v)}
              data-ocid="mental.confidence_slider"
            />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-foreground">
                😟 Worry
              </span>
              <span className="text-sm font-bold text-destructive">
                {worry}/10
              </span>
            </div>
            <Slider
              min={1}
              max={10}
              step={1}
              value={[worry]}
              onValueChange={([v]) => setWorry(v)}
              data-ocid="mental.worry_slider"
            />
          </div>
        </div>
        <Button
          onClick={handleLog}
          disabled={addRating.isPending}
          className="mt-5 gap-2"
          data-ocid="mental.anxiety_log.button"
        >
          {addRating.isPending
            ? "Saving…"
            : submitted
              ? "Logged! ✓"
              : "Log Today's Levels"}
        </Button>
      </AnimatedCard>

      {/* Trend chart */}
      {ratings.length > 0 && (
        <AnimatedCard
          delay={0.1}
          className="rounded-2xl border border-border bg-card p-5"
        >
          <p className="text-sm font-semibold text-muted-foreground mb-4">
            14-day trend
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={last14}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              />
              <YAxis
                domain={[0, 10]}
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Line
                type="monotone"
                dataKey="confidence"
                stroke="oklch(0.48 0.22 264)"
                strokeWidth={2}
                dot={false}
                name="Confidence"
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="worry"
                stroke="oklch(0.58 0.24 25)"
                strokeWidth={2}
                dot={false}
                name="Worry"
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex gap-5 mt-2">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <div className="h-2 w-6 rounded-full bg-primary" /> Confidence
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <div className="h-2 w-6 rounded-full bg-destructive" /> Worry
            </div>
          </div>
        </AnimatedCard>
      )}
    </div>
  );
}

// ── Celebration Tracker ───────────────────────────────────────────────────────

function CelebrationTrackerSection() {
  const { data: events = [] } = useCelebrationEvents();
  const addEvent = useAddCelebrationEvent();
  const [win, setWin] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const handleAdd = async () => {
    if (!win.trim()) return;
    await addEvent.mutateAsync({ date: today, description: win.trim() });
    setWin("");
  };

  return (
    <div className="space-y-5">
      <AnimatedCard className="rounded-2xl border border-border bg-card p-5">
        <p className="text-sm text-muted-foreground mb-3">
          Every win counts — big or tiny. Log it so you can look back and see
          how far you've come. 🎉
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="What are you celebrating today?"
            value={win}
            onChange={(e) => setWin(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
            data-ocid="mental.celebration_input"
          />
          <Button
            type="button"
            onClick={handleAdd}
            disabled={addEvent.isPending || !win.trim()}
            data-ocid="mental.celebration_add.button"
            className="gap-1"
          >
            🎉 Add
          </Button>
        </div>
      </AnimatedCard>

      {events.length > 0 ? (
        <div className="space-y-2">
          {events
            .slice()
            .sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
            .slice(0, 12)
            .map((ev, i) => (
              <motion.div
                key={String(ev.id)}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                className="flex items-start gap-3 rounded-xl border border-border bg-card px-4 py-3"
                data-ocid={`mental.celebration.item.${i + 1}`}
              >
                <span className="text-xl mt-0.5">🏆</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground break-words">
                    {ev.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {ev.date}
                  </p>
                </div>
              </motion.div>
            ))}
        </div>
      ) : (
        <div
          className="text-center py-10 text-muted-foreground text-sm"
          data-ocid="mental.celebrations.empty_state"
        >
          <span className="text-4xl mb-2 block">🌱</span>
          Your wins will appear here. Start small — finishing an essay draft
          counts!
        </div>
      )}
    </div>
  );
}

// ── Burnout Self-Assessment ───────────────────────────────────────────────────

function BurnoutAssessmentSection() {
  const [answers, setAnswers] = useState<BurnoutAnswer[]>(
    BURNOUT_QUESTIONS.map((q) => ({ q, answer: null })),
  );
  const [result, setResult] = useState<"low" | "medium" | "high" | null>(null);

  const toggle = (i: number, val: boolean) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], answer: next[i].answer === val ? null : val };
      return next;
    });
    setResult(null);
  };

  const compute = () => {
    const yesCount = answers.filter((a) => a.answer === true).length;
    if (yesCount <= 1) setResult("low");
    else if (yesCount <= 3) setResult("medium");
    else setResult("high");
  };

  const allAnswered = answers.every((a) => a.answer !== null);

  const resultConfig = {
    low: {
      label: "Low Burnout Risk",
      color: "text-green-700 dark:text-green-400",
      bg: "bg-green-50/60 border-green-200 dark:bg-green-950/20 dark:border-green-800/30",
      emoji: "✅",
      message:
        "You're managing well! Keep up your healthy habits and check in with yourself regularly.",
    },
    medium: {
      label: "Moderate Burnout Risk",
      color: "text-amber-700 dark:text-amber-400",
      bg: "bg-amber-50/60 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800/30",
      emoji: "⚠️",
      message:
        "Pay attention to your energy levels. Add more breaks, talk to someone you trust, and reduce your task load this week.",
    },
    high: {
      label: "High Burnout Risk",
      color: "text-red-700 dark:text-red-400",
      bg: "bg-red-50/60 border-red-200 dark:bg-red-950/20 dark:border-red-800/30",
      emoji: "🚨",
      message:
        "Please reach out — to a counsellor, teacher, parent, or trusted friend. You deserve support, not just more productivity tips. Taking a break is productive.",
    },
  };

  return (
    <div className="space-y-4">
      <AnimatedCard className="rounded-2xl border border-border bg-card p-5">
        <p className="text-sm text-muted-foreground mb-5">
          Answer honestly — no one else will see this. It's just for you. 💙
        </p>
        <div className="space-y-4">
          {BURNOUT_QUESTIONS.map((q, i) => (
            <div
              key={q}
              className="space-y-2"
              data-ocid={`mental.burnout.q${i + 1}`}
            >
              <p className="text-sm font-medium text-foreground">
                {i + 1}. {q}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => toggle(i, true)}
                  data-ocid={`mental.burnout.q${i + 1}.yes`}
                  className={[
                    "px-4 py-1.5 rounded-lg text-sm font-medium border-2 transition-all duration-200",
                    answers[i].answer === true
                      ? "border-red-400 bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-300"
                      : "border-border hover:border-muted-foreground text-muted-foreground",
                  ].join(" ")}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => toggle(i, false)}
                  data-ocid={`mental.burnout.q${i + 1}.no`}
                  className={[
                    "px-4 py-1.5 rounded-lg text-sm font-medium border-2 transition-all duration-200",
                    answers[i].answer === false
                      ? "border-green-400 bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-300"
                      : "border-border hover:border-muted-foreground text-muted-foreground",
                  ].join(" ")}
                >
                  No
                </button>
              </div>
            </div>
          ))}
        </div>
        <Button
          onClick={compute}
          disabled={!allAnswered}
          className="mt-6"
          data-ocid="mental.burnout_check.button"
        >
          Check My Burnout Risk
        </Button>
      </AnimatedCard>

      {result && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <div
            className={`rounded-2xl border p-5 ${resultConfig[result].bg}`}
            data-ocid="mental.burnout_result.card"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{resultConfig[result].emoji}</span>
              <h3
                className={`font-display text-lg font-bold ${resultConfig[result].color}`}
              >
                {resultConfig[result].label}
              </h3>
            </div>
            <p className="text-sm text-foreground leading-relaxed">
              {resultConfig[result].message}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function MentalHealthPage() {
  const { isAuthenticated } = useAuth();

  const sections = [
    {
      emoji: "🌤️",
      title: "Daily Mood Check-In",
      subtitle:
        "A moment to pause and notice how you're feeling. Consistency matters more than perfection.",
      content: <MoodCheckInSection />,
    },
    {
      emoji: "📊",
      title: "Anxiety Tracker",
      subtitle:
        "Track your confidence and worry levels over time. Noticing patterns is the first step.",
      content: <AnxietyTrackerSection />,
    },
    {
      emoji: "🏆",
      title: "Celebration Tracker",
      subtitle:
        "You're doing more than you realise. Celebrate every win, no matter how small.",
      content: <CelebrationTrackerSection />,
    },
    {
      emoji: "🔥",
      title: "Burnout Self-Assessment",
      subtitle:
        "Answer 5 honest questions to understand your current risk level.",
      content: <BurnoutAssessmentSection />,
    },
    {
      emoji: "🧘",
      title: "Stress Management",
      subtitle:
        "Simple, evidence-backed strategies to stay grounded during application season.",
      content: (
        <div className="grid sm:grid-cols-2 gap-4">
          {STRESS_TIPS.map((tip, i) => (
            <AnimatedCard key={tip.title} delay={i * 0.08}>
              <div className={`rounded-2xl border p-5 h-full ${tip.color}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{tip.emoji}</span>
                  <h3 className="font-display text-base font-semibold text-foreground">
                    {tip.title}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {tip.body}
                </p>
              </div>
            </AnimatedCard>
          ))}
        </div>
      ),
    },
    {
      emoji: "💜",
      title: "Rejection Recovery Guide",
      subtitle:
        "Rejection is not the end. It's a chapter, not the whole story.",
      content: (
        <div className="space-y-4">
          {REJECTION_TIPS.map((tip, i) => (
            <AnimatedCard key={tip.heading} delay={i * 0.1}>
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
                <div className="flex items-start gap-3">
                  <span className="text-2xl mt-0.5 shrink-0">{tip.emoji}</span>
                  <div>
                    <h3 className="font-display text-base font-semibold text-foreground mb-1">
                      {tip.heading}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {tip.body}
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedCard>
          ))}
        </div>
      ),
    },
  ];

  return (
    <PageTransition className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Hero header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10 rounded-3xl bg-gradient-to-br from-primary/10 via-accent/5 to-transparent border border-primary/20 p-7"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-3xl shrink-0">
            🧠
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              Mental Health &amp; Wellness
            </h1>
            <p className="text-muted-foreground mt-1 leading-relaxed">
              The college process is a marathon, not a sprint. How you take care
              of yourself matters just as much as your application.
            </p>
          </div>
        </div>
        {!isAuthenticated && (
          <div className="mt-4 rounded-xl bg-muted/50 border border-border px-4 py-3 text-sm text-muted-foreground">
            💡 Sign in to save your mood check-ins, anxiety logs, and
            celebrations across sessions.
          </div>
        )}
      </motion.div>

      {/* Staggered sections */}
      <div className="space-y-14">
        {sections.map((sec, i) => (
          <motion.section
            key={sec.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.07 }}
            data-ocid={`mental.${sec.title.toLowerCase().replace(/[^a-z0-9]/g, "_")}.section`}
          >
            <SectionHeader
              emoji={sec.emoji}
              title={sec.title}
              subtitle={sec.subtitle}
            />
            {sec.content}
          </motion.section>
        ))}
      </div>

      {/* Footer affirmation */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-16 text-center text-muted-foreground text-sm"
      >
        <p className="text-lg mb-1">💙</p>
        <p>You are more than your application. You are enough, right now.</p>
      </motion.div>
    </PageTransition>
  );
}
