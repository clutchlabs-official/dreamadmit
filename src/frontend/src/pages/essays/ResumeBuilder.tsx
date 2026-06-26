import AnimatedCard from "@/components/AnimatedCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface ResumeEntry {
  title: string;
  org: string;
  dates: string;
  desc: string;
}
interface ResumeState {
  work: ResumeEntry[];
  volunteer: ResumeEntry[];
  projects: ResumeEntry[];
}

const BLANK_ENTRY: ResumeEntry = { title: "", org: "", dates: "", desc: "" };

const TEMPLATES = [
  {
    name: "Classic",
    emoji: "📜",
    desc: "Clean one-column layout. Works for every college.",
  },
  {
    name: "Modern Two-Column",
    emoji: "🗳️",
    desc: "Skills sidebar on left, experience on right. Eye-catching.",
  },
];

const SECTION_LABELS: {
  key: keyof ResumeState;
  label: string;
  emoji: string;
}[] = [
  { key: "work", label: "Work Experience", emoji: "💼" },
  { key: "volunteer", label: "Volunteer", emoji: "🤝" },
  { key: "projects", label: "Projects", emoji: "💡" },
];

export default function ResumeBuilder() {
  const [resume, setResume] = useState<ResumeState>({
    work: [],
    volunteer: [],
    projects: [],
  });

  function addEntry(section: keyof ResumeState) {
    setResume((r) => ({
      ...r,
      [section]: [...r[section], { ...BLANK_ENTRY }],
    }));
  }

  function updateEntry(
    section: keyof ResumeState,
    idx: number,
    field: keyof ResumeEntry,
    val: string,
  ) {
    setResume((r) => ({
      ...r,
      [section]: r[section].map((e, i) =>
        i === idx ? { ...e, [field]: val } : e,
      ),
    }));
  }

  function removeEntry(section: keyof ResumeState, idx: number) {
    setResume((r) => ({
      ...r,
      [section]: r[section].filter((_, i) => i !== idx),
    }));
  }

  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl font-bold text-foreground">
        📋 Resume Builder
      </h2>
      <div className="grid sm:grid-cols-2 gap-4 mb-2">
        {TEMPLATES.map((t) => (
          <AnimatedCard key={t.name}>
            <Card
              className="cursor-pointer hover:shadow-md transition-shadow border-primary/20 hover:border-primary/60"
              data-ocid={`resume.template.${t.name.toLowerCase().replace(/ /g, "_")}`}
            >
              <CardContent className="p-4 flex items-center gap-3">
                <span className="text-2xl">{t.emoji}</span>
                <div>
                  <p className="font-semibold text-sm text-foreground">
                    {t.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{t.desc}</p>
                </div>
                <Badge variant="outline" className="ml-auto text-[10px]">
                  Select
                </Badge>
              </CardContent>
            </Card>
          </AnimatedCard>
        ))}
      </div>
      {SECTION_LABELS.map(({ key, label, emoji }) => (
        <AnimatedCard key={key}>
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-1.5">
                  <span>{emoji}</span>
                  {label}
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addEntry(key)}
                  className="gap-1 text-xs h-7"
                  data-ocid={`resume.${key}.add.button`}
                >
                  <Plus className="h-3.5 w-3.5" /> Add
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {resume[key].length === 0 && (
                <p
                  className="text-xs text-muted-foreground italic"
                  data-ocid={`resume.${key}.empty_state`}
                >
                  No entries yet. Click Add to start.
                </p>
              )}
              {resume[key].map((entry, idx) => (
                <div
                  key={entry.title ?? idx}
                  className="grid sm:grid-cols-2 gap-3 p-3 rounded-xl border border-border bg-muted/30"
                  data-ocid={`resume.${key}.item.${idx + 1}`}
                >
                  <div className="space-y-1">
                    <Label className="text-[10px]">Title / Role</Label>
                    <Input
                      value={entry.title}
                      onChange={(e) =>
                        updateEntry(key, idx, "title", e.target.value)
                      }
                      placeholder="Software Intern"
                      className="h-7 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px]">Organisation</Label>
                    <Input
                      value={entry.org}
                      onChange={(e) =>
                        updateEntry(key, idx, "org", e.target.value)
                      }
                      placeholder="Company or School"
                      className="h-7 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px]">Dates</Label>
                    <Input
                      value={entry.dates}
                      onChange={(e) =>
                        updateEntry(key, idx, "dates", e.target.value)
                      }
                      placeholder="Jun 2024 – Aug 2024"
                      className="h-7 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px]">Description</Label>
                    <Textarea
                      value={entry.desc}
                      onChange={(e) =>
                        updateEntry(key, idx, "desc", e.target.value)
                      }
                      rows={2}
                      placeholder="What you did and its impact"
                      className="text-xs"
                    />
                  </div>
                  <div className="sm:col-span-2 flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeEntry(key, idx)}
                      className="h-7 text-xs text-destructive gap-1"
                      data-ocid={`resume.${key}.delete.${idx + 1}.button`}
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Remove
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </AnimatedCard>
      ))}
    </div>
  );
}
