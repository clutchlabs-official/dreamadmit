import AnimatedCard from "@/components/AnimatedCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy } from "lucide-react";
import { useState } from "react";

const WAITLIST_TIPS = [
  {
    emoji: "📧",
    title: "Send an LOCI within 48 hours",
    desc: "A Letter of Continued Interest shows the admissions office you're still committed.",
  },
  {
    emoji: "📊",
    title: "Send updated grades or scores",
    desc: "If your latest test score or GPA improved, send it as additional material.",
  },
  {
    emoji: "🌟",
    title: "Add new achievements",
    desc: "Won an award or leadership role after applying? Submit it as an update letter.",
  },
  {
    emoji: "☎️",
    title: "Call or visit if possible",
    desc: "Express interest directly. Admissions officers remember names they can match to files.",
  },
  {
    emoji: "📋",
    title: "Accept another offer by May 1",
    desc: "Never leave yourself without a backup. Pay a deposit at your best current offer.",
  },
  {
    emoji: "🎯",
    title: "Know the stats",
    desc: "Most waitlists convert 5–15% of students. Have a great backup plan.",
  },
];

const DEFERRAL_STEPS = [
  {
    emoji: "💌",
    step: "1",
    title: "Write a Deferral Letter",
    desc: "Tell them you still want to attend, share updates since your application.",
  },
  {
    emoji: "📚",
    step: "2",
    title: "Boost your application",
    desc: "Improve grades, take an extra course, pursue a new leadership role.",
  },
  {
    emoji: "📬",
    step: "3",
    title: "Send mid-year grades",
    desc: "Request your school counselor to send updated transcripts in January.",
  },
  {
    emoji: "🔍",
    step: "4",
    title: "Visit if possible",
    desc: "An on-campus visit or admissions office meeting can strengthen your case.",
  },
  {
    emoji: "🎯",
    step: "5",
    title: "Apply elsewhere too",
    desc: "Treat deferral as a signal to strengthen your full list — add more targets.",
  },
];

const LOCI_TEMPLATE = `Dear [College] Admissions Committee,

I am writing to confirm my continued and enthusiastic interest in attending [College] in the Class of [Year]. Being deferred/waitlisted has only strengthened my commitment to joining your community.

Since submitting my application, I am pleased to share the following updates:
• [Update 1: new grade, award, leadership role]
• [Update 2: new project, experience, or score]

[College] remains my first choice because [specific reason related to a programme, professor, or campus resource]. I am confident I would make a meaningful contribution to [specific club, research area, or community].

Thank you for your continued consideration. I look forward to hearing from you.

Sincerely,
[Your Name]`;

export default function WaitlistDeferral() {
  const [copied, setCopied] = useState(false);

  async function copyTemplate() {
    await navigator.clipboard.writeText(LOCI_TEMPLATE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl font-bold text-foreground">
        📋 Waitlist & Deferral Strategy
      </h2>
      <Tabs defaultValue="waitlist">
        <TabsList className="mb-4">
          <TabsTrigger value="waitlist" data-ocid="waitlist.tab">
            📋 Waitlisted
          </TabsTrigger>
          <TabsTrigger value="deferral" data-ocid="deferral.tab">
            ⏳ Deferred
          </TabsTrigger>
          <TabsTrigger value="template" data-ocid="template.tab">
            ✉️ LOCI Template
          </TabsTrigger>
        </TabsList>
        <TabsContent value="waitlist">
          <div className="grid sm:grid-cols-2 gap-4">
            {WAITLIST_TIPS.map((t, i) => (
              <AnimatedCard key={t.title} delay={i * 0.07}>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/40 border border-border hover:bg-muted/70 transition-colors">
                  <span className="text-2xl shrink-0">{t.emoji}</span>
                  <div>
                    <p className="font-semibold text-sm text-foreground">
                      {t.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      {t.desc}
                    </p>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="deferral">
          <div className="space-y-3">
            {DEFERRAL_STEPS.map((s, i) => (
              <AnimatedCard key={s.step} delay={i * 0.08}>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/40 border border-border">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
                    {s.step}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground flex items-center gap-1.5">
                      <span>{s.emoji}</span>
                      {s.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="template">
          <AnimatedCard>
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">
                    ✉️ Letter of Continued Interest Template
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyTemplate}
                    className="gap-1.5 text-xs"
                    data-ocid="template.copy.button"
                  >
                    <Copy className="h-3.5 w-3.5" />{" "}
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <pre className="text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed bg-muted/50 rounded-xl p-4 border border-border font-mono">
                  {LOCI_TEMPLATE}
                </pre>
              </CardContent>
            </Card>
          </AnimatedCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
