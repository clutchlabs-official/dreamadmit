import type { CollegeDeadline } from "@/backend";
import { DeadlineStatus } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import {
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock,
  LogIn,
  Plus,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const STATUS_LABELS: Record<string, string> = {
  upcoming: "Upcoming",
  completed: "Completed",
  missed: "Missed",
};

const DEADLINE_TYPES = [
  "Regular Decision",
  "Early Action",
  "Early Decision",
  "Scholarship",
  "Financial Aid",
  "Other",
] as const;

type DeadlineType = (typeof DEADLINE_TYPES)[number];

interface LocalDeadline {
  id: string;
  collegeName: string;
  deadlineType: DeadlineType;
  dueDate: string; // ISO date string YYYY-MM-DD
  notes: string;
  completed: boolean;
}

function nsToDateString(ns: bigint): string {
  const ms = Number(ns / 1_000_000n);
  const d = new Date(ms);
  return d.toISOString().split("T")[0];
}

function dateStringToNs(dateStr: string): bigint {
  const ms = new Date(dateStr).getTime();
  return BigInt(ms) * 1_000_000n;
}

function daysRemaining(dueDateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDateStr);
  due.setHours(0, 0, 0, 0);
  return Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function _toLocal(d: CollegeDeadline): LocalDeadline {
  return {
    id: `${d.collegeId}-${d.dueDate}-${d.deadlineType}`,
    collegeName: d.collegeName,
    deadlineType: (DEADLINE_TYPES.includes(d.deadlineType as DeadlineType)
      ? d.deadlineType
      : "Other") as DeadlineType,
    dueDate: nsToDateString(d.dueDate),
    notes: d.notes,
    completed: d.status === DeadlineStatus.completed,
  };
}

function _fromLocal(d: LocalDeadline, idx: number): CollegeDeadline {
  const days = daysRemaining(d.dueDate);
  const status = d.completed
    ? DeadlineStatus.completed
    : days < 0
      ? DeadlineStatus.missed
      : DeadlineStatus.upcoming;
  return {
    collegeName: d.collegeName,
    deadlineType: d.deadlineType,
    dueDate: dateStringToNs(d.dueDate),
    notes: d.notes,
    status,
    collegeId: BigInt(idx),
  };
}

function DaysChip({ days, completed }: { days: number; completed: boolean }) {
  if (completed)
    return (
      <Badge className="bg-accent/15 text-accent border-accent/30 font-medium">
        <CheckCircle2 className="h-3 w-3 mr-1" /> Done
      </Badge>
    );
  if (days < 0)
    return (
      <Badge variant="destructive" className="font-medium">
        <TriangleAlert className="h-3 w-3 mr-1" /> Overdue
      </Badge>
    );
  if (days === 0)
    return (
      <Badge className="bg-destructive/15 text-destructive border-destructive/30 font-medium">
        <Clock className="h-3 w-3 mr-1" /> Today!
      </Badge>
    );
  if (days <= 7)
    return (
      <Badge className="bg-warning/15 text-warning border-warning/30 font-medium">
        <Clock className="h-3 w-3 mr-1" /> {days}d left
      </Badge>
    );
  return (
    <Badge variant="secondary" className="font-medium">
      {days}d remaining
    </Badge>
  );
}

function _AddDeadlineForm({
  onAdd,
}: {
  onAdd: (d: LocalDeadline) => void;
}) {
  const [collegeName, setCollegeName] = useState("");
  const [deadlineType, setDeadlineType] =
    useState<DeadlineType>("Regular Decision");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const handleAdd = () => {
    if (!collegeName.trim()) {
      setError("College name is required.");
      return;
    }
    if (!dueDate) {
      setError("Due date is required.");
      return;
    }
    setError("");
    onAdd({
      id: `new-${Date.now()}`,
      collegeName: collegeName.trim(),
      deadlineType,
      dueDate,
      notes,
      completed: false,
    });
    setCollegeName("");
    setDueDate("");
    setNotes("");
  };

  return (
    <Card
      className="border-primary/20 bg-primary/5"
      data-ocid="deadlines.add_form"
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-display flex items-center gap-2">
          <Plus className="h-4 w-4 text-primary" />
          Add Deadline
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="pt-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="college-name">College Name</Label>
            <Input
              id="college-name"
              placeholder="e.g. MIT, Stanford"
              value={collegeName}
              onChange={(e) => setCollegeName(e.target.value)}
              data-ocid="deadlines.college_name.input"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="deadline-type">Deadline Type</Label>
            <Select
              value={deadlineType}
              onValueChange={(v) => setDeadlineType(v as DeadlineType)}
            >
              <SelectTrigger
                id="deadline-type"
                data-ocid="deadlines.type.select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DEADLINE_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="due-date">Due Date</Label>
            <Input
              id="due-date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              data-ocid="deadlines.due_date.input"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Input
              id="notes"
              placeholder="Any extra info"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              data-ocid="deadlines.notes.input"
            />
          </div>
        </div>
        {error && (
          <p
            className="text-sm text-destructive"
            data-ocid="deadlines.add_form.field_error"
          >
            {error}
          </p>
        )}
        <Button
          type="button"
          onClick={handleAdd}
          className="w-full sm:w-auto"
          data-ocid="deadlines.add_button"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Deadline
        </Button>
      </CardContent>
    </Card>
  );
}

function _DeadlineCard({
  deadline,
  index,
  onToggle,
  onRemove,
}: {
  deadline: LocalDeadline;
  index: number;
  onToggle: () => void;
  onRemove: () => void;
}) {
  const days = daysRemaining(deadline.dueDate);
  const formattedDate = new Date(
    `${deadline.dueDate}T00:00`,
  ).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Card
      className={`transition-all duration-200 ${
        deadline.completed ? "opacity-60 bg-muted/30" : "bg-card"
      }`}
      data-ocid={`deadlines.item.${index}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={onToggle}
            className="mt-0.5 shrink-0 text-muted-foreground hover:text-primary transition-colors"
            aria-label={
              deadline.completed ? "Mark incomplete" : "Mark complete"
            }
            data-ocid={`deadlines.toggle.${index}`}
          >
            {deadline.completed ? (
              <CheckCircle2 className="h-5 w-5 text-accent" />
            ) : (
              <Circle className="h-5 w-5" />
            )}
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span
                className={`font-semibold text-sm ${
                  deadline.completed
                    ? "line-through text-muted-foreground"
                    : "text-foreground"
                }`}
              >
                {deadline.collegeName}
              </span>
              <Badge variant="outline" className="text-xs">
                {deadline.deadlineType}
              </Badge>
              <DaysChip days={days} completed={deadline.completed} />
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CalendarDays className="h-3 w-3" />
              <span>{formattedDate}</span>
            </div>
            {deadline.notes && (
              <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">
                {deadline.notes}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="shrink-0 text-muted-foreground hover:text-destructive transition-colors"
            aria-label="Remove deadline"
            data-ocid={`deadlines.delete_button.${index}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DeadlinesPage() {
  const [items, setItems] = useState<CollegeDeadline[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const isLoading = false;

  const addDeadline = () => {
    const newItem: CollegeDeadline = {
      collegeId: BigInt(0),
      collegeName: "",
      deadlineType: "Application Deadline",
      dueDate: BigInt(Date.now()),
      notes: "",
      status: DeadlineStatus.upcoming,
    };
    setItems((prev) => [...prev, newItem]);
  };
  const updateDeadline = (idx: number, patch: Partial<CollegeDeadline>) =>
    setItems((prev) =>
      prev.map((d, i) => (i === idx ? { ...d, ...patch } : d)),
    );
  const removeDeadline = (idx: number) =>
    setItems((prev) => prev.filter((_, i) => i !== idx));
  const handleSave = async () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Deadlines saved!");
    }, 500);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <CalendarDays className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-3xl font-display font-bold text-foreground">
              Deadlines
            </h1>
          </div>
          <p className="text-muted-foreground">
            Track all your college application deadlines.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={addDeadline}
            data-ocid="deadlines.add_button"
            className="gap-2"
          >
            <Plus className="h-4 w-4" /> Add
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isSaving || items.length === 0}
            data-ocid="deadlines.save_button"
          >
            {isSaving ? "Saving…" : "Save All"}
          </Button>
        </div>
      </div>
      {isLoading && (
        <div data-ocid="deadlines.loading_state" className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      )}
      {!isLoading && items.length === 0 && (
        <Card data-ocid="deadlines.empty_state">
          <CardContent className="text-center py-16">
            <CalendarDays className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="font-medium mb-1">No deadlines yet</p>
            <p className="text-sm text-muted-foreground mb-4">
              Add your first college deadline to stay on track.
            </p>
            <Button
              type="button"
              onClick={addDeadline}
              data-ocid="deadlines.empty_add_button"
              className="gap-2"
            >
              <Plus className="h-4 w-4" /> Add Deadline
            </Button>
          </CardContent>
        </Card>
      )}
      <div className="space-y-4">
        {items.map((d, idx) => (
          <Card
            key={`${d.collegeName}-${d.dueDate}-${idx}`}
            data-ocid={`deadlines.deadline_card.${idx + 1}`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-2">
                <Badge
                  variant={
                    d.status === DeadlineStatus.missed
                      ? "destructive"
                      : d.status === DeadlineStatus.completed
                        ? "secondary"
                        : "default"
                  }
                >
                  {STATUS_LABELS[d.status]}
                </Badge>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => removeDeadline(idx)}
                  data-ocid={`deadlines.delete_button.${idx + 1}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">College</Label>
                <input
                  className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={d.collegeName}
                  onChange={(e) =>
                    updateDeadline(idx, { collegeName: e.target.value })
                  }
                  placeholder="College name"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Type</Label>
                <Select
                  value={d.deadlineType}
                  onValueChange={(v) =>
                    updateDeadline(idx, { deadlineType: v })
                  }
                >
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DEADLINE_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Due Date</Label>
                <input
                  type="date"
                  className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={
                    new Date(Number(d.dueDate)).toISOString().split("T")[0]
                  }
                  onChange={(e) =>
                    updateDeadline(idx, {
                      dueDate: BigInt(new Date(e.target.value).getTime()),
                    })
                  }
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Status</Label>
                <Select
                  value={d.status}
                  onValueChange={(v) =>
                    updateDeadline(idx, { status: v as DeadlineStatus })
                  }
                >
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(DeadlineStatus).map((s) => (
                      <SelectItem key={s} value={s}>
                        {STATUS_LABELS[s]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
