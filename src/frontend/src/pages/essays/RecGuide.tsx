import AnimatedCard from "@/components/AnimatedCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Copy } from "lucide-react";
import { useState } from "react";

const CHECKLIST = [
  "Ask in person first — don't cold-email your teacher",
  "Give at least 6 weeks notice before the deadline",
  "Share your resume and activity list with them",
  "Tell them which colleges you're applying to and why",
  "Share your personal statement draft so they can align themes",
  "Mention specific moments from their class that shaped you",
  "Ask them to speak to your academic ability AND character",
  "Follow up one week before the deadline with a gentle reminder",
];

const EMAIL_TEMPLATE = `Subject: Request for a College Recommendation Letter

Dear [Teacher Name],

I hope you're doing well. I'm applying to college this fall and I would be truly honoured if you would write a recommendation letter for me.

I've chosen to ask you because [specific reason — mention a class moment, project, or how they inspired you].

To make this as easy as possible, I've attached:
• My resume and activity list
• A draft of my personal statement
• A list of the colleges I'm applying to and their deadlines

The earliest deadline is [Date]. I would be grateful if you could submit by [1 week before].

Please let me know if you have any questions or need anything else from me.

Thank you so much for your time and support.

Warm regards,
[Your Name]`;

export default function RecGuide() {
  const [checked, setChecked] = useState<number[]>([]);
  const [copied, setCopied] = useState(false);

  function toggle(i: number) {
    setChecked((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i],
    );
  }

  async function copyEmail() {
    await navigator.clipboard.writeText(EMAIL_TEMPLATE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl font-bold text-foreground">
        👨‍🏫 Teacher Recommendation Guide
      </h2>
      <AnimatedCard>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              What to ask your teacher to include
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {CHECKLIST.map((item, i) => (
              <button
                key={item}
                type="button"
                onClick={() => toggle(i)}
                className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-muted/60 transition-colors text-left"
                data-ocid={`rec.checklist.${i + 1}`}
              >
                <CheckCircle2
                  className={`h-4 w-4 mt-0.5 shrink-0 transition-colors ${checked.includes(i) ? "text-primary" : "text-muted-foreground/40"}`}
                />
                <span
                  className={`text-sm ${checked.includes(i) ? "line-through text-muted-foreground" : "text-foreground"}`}
                >
                  {item}
                </span>
              </button>
            ))}
          </CardContent>
        </Card>
      </AnimatedCard>
      <AnimatedCard delay={0.12}>
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">✉️ Email Template</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={copyEmail}
                className="gap-1.5 text-xs"
                data-ocid="rec.copy_email.button"
              >
                <Copy className="h-3.5 w-3.5" /> {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <pre className="text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed bg-muted/50 rounded-xl p-4 border border-border font-mono">
              {EMAIL_TEMPLATE}
            </pre>
          </CardContent>
        </Card>
      </AnimatedCard>
    </div>
  );
}
