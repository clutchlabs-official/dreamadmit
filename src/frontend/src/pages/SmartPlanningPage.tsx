import AnimatedCard from "@/components/AnimatedCard";
import PageTransition from "@/components/PageTransition";
import StaggerList from "@/components/StaggerList";
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
import { Textarea } from "@/components/ui/textarea";
import {
  useAchievements,
  useAddAchievement,
  useAddInternship,
  useAddLeadershipRole,
  useAddSummerProgram,
  useAddVolunteerEntry,
  useDeleteAchievement,
  useDeleteInternship,
  useDeleteLeadershipRole,
  useDeleteSummerProgram,
  useDeleteVolunteerEntry,
  useInternships,
  useLeadershipRoles,
  useSummerPrograms,
  useVolunteerEntries,
} from "@/hooks/useQueries";
import type {
  AchievementEntry,
  InternshipEntry,
  LeadershipRole,
  SummerProgram,
  VolunteerEntry,
} from "@/types";
import { SummerProgramStatus } from "@/types";
import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// ─── 4-Year Planner (local state) ────────────────────────────────────────────
const GRADES = ["Grade 9", "Grade 10", "Grade 11", "Grade 12"] as const;
const SLOT_LABELS = [
  "Course 1",
  "Course 2",
  "Activity 1",
  "Activity 2",
  "Goal",
];
type PlannerGrid = Record<string, Record<string, string>>;

function FourYearPlanner() {
  const [grid, setGrid] = useState<PlannerGrid>(() =>
    GRADES.reduce(
      (acc, g) =>
        Object.assign({}, acc, {
          [g]: SLOT_LABELS.reduce(
            (s, l) => Object.assign({}, s, { [l]: "" }),
            {},
          ),
        }),
      {},
    ),
  );

  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">
        Plan your 4 years of high school — courses, activities, and goals per
        grade. Changes are saved locally in your browser.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {GRADES.map((grade, gi) => (
          <AnimatedCard key={grade} delay={gi * 0.08}>
            <Card className="h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-primary flex items-center gap-2">
                  {grade}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {SLOT_LABELS.map((label) => (
                  <div key={label}>
                    <Label className="text-xs text-muted-foreground mb-0.5">
                      {label}
                    </Label>
                    <Input
                      value={grid[grade][label]}
                      onChange={(e) =>
                        setGrid((prev) => ({
                          ...prev,
                          [grade]: { ...prev[grade], [label]: e.target.value },
                        }))
                      }
                      placeholder={`Enter ${label.toLowerCase()}…`}
                      className="h-7 text-xs"
                      data-ocid={`planner.${grade.toLowerCase().replace(" ", "_")}.${label.toLowerCase().replace(" ", "_")}.input`}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </AnimatedCard>
        ))}
      </div>
    </div>
  );
}

// ─── Internship Tracker ───────────────────────────────────────────────────────
function InternshipTracker() {
  const { data: items = [], isLoading } = useInternships();
  const addMutation = useAddInternship();
  const deleteMutation = useDeleteInternship();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    company: "",
    role: "",
    startDate: "",
    endDate: "",
    skills: "",
  });

  const handleSave = async () => {
    if (!form.company || !form.role || !form.startDate) {
      toast.error("Company, role, and start date are required.");
      return;
    }
    try {
      await addMutation.mutateAsync({
        company: form.company,
        role: form.role,
        startDate: form.startDate,
        endDate: form.endDate || null,
        skills: form.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      });
      toast.success("Internship added!");
      setForm({
        company: "",
        role: "",
        startDate: "",
        endDate: "",
        skills: "",
      });
      setOpen(false);
    } catch {
      toast.error("Failed to save internship.");
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Removed.");
    } catch {
      toast.error("Failed to delete.");
    }
  };

  return (
    <SectionShell
      emoji="💼"
      title="Internship Tracker"
      description="Log your internships, roles, and skills gained."
      onAdd={() => setOpen(true)}
      isLoading={isLoading}
      open={open}
      onCancel={() => setOpen(false)}
      form={
        <div className="grid sm:grid-cols-2 gap-3">
          <FieldRow
            label="Company"
            value={form.company}
            onChange={(v) => setForm((p) => ({ ...p, company: v }))}
            ocid="internship.company.input"
          />
          <FieldRow
            label="Role"
            value={form.role}
            onChange={(v) => setForm((p) => ({ ...p, role: v }))}
            ocid="internship.role.input"
          />
          <FieldRow
            label="Start Date"
            type="date"
            value={form.startDate}
            onChange={(v) => setForm((p) => ({ ...p, startDate: v }))}
            ocid="internship.start_date.input"
          />
          <FieldRow
            label="End Date (optional)"
            type="date"
            value={form.endDate}
            onChange={(v) => setForm((p) => ({ ...p, endDate: v }))}
            ocid="internship.end_date.input"
          />
          <div className="sm:col-span-2">
            <FieldRow
              label="Skills (comma-separated)"
              value={form.skills}
              onChange={(v) => setForm((p) => ({ ...p, skills: v }))}
              ocid="internship.skills.input"
            />
          </div>
        </div>
      }
      onSave={handleSave}
      saving={addMutation.isPending}
    >
      <StaggerList
        items={items}
        className="space-y-2"
        renderItem={(item: InternshipEntry, i) => (
          <ItemRow
            key={String(item.id)}
            ocid={`internship.item.${i + 1}`}
            title={`${item.role} @ ${item.company}`}
            subtitle={`${item.startDate}${item.endDate ? ` → ${item.endDate}` : " → Present"}`}
            badges={item.skills.map((s) => s)}
            onDelete={() => handleDelete(item.id)}
            deleting={deleteMutation.isPending}
          />
        )}
      />
    </SectionShell>
  );
}

// ─── Volunteer Hours ──────────────────────────────────────────────────────────
function VolunteerHours() {
  const { data: items = [], isLoading } = useVolunteerEntries();
  const addMutation = useAddVolunteerEntry();
  const deleteMutation = useDeleteVolunteerEntry();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ activity: "", hours: "", date: "" });

  const totalHours = items.reduce((sum, v) => sum + Number(v.hours), 0);

  const handleSave = async () => {
    if (!form.activity || !form.hours || !form.date) {
      toast.error("All fields required.");
      return;
    }
    try {
      await addMutation.mutateAsync({
        activity: form.activity,
        hours: Number.parseFloat(form.hours),
        date: form.date,
      });
      toast.success("Volunteer hours logged!");
      setForm({ activity: "", hours: "", date: "" });
      setOpen(false);
    } catch {
      toast.error("Failed to save.");
    }
  };

  return (
    <SectionShell
      emoji="🤝"
      title="Volunteer Hours"
      description={
        <span>
          Track your community service.{" "}
          <span className="font-semibold text-primary">
            Total: {totalHours.toFixed(1)} hrs
          </span>
        </span>
      }
      onAdd={() => setOpen(true)}
      isLoading={isLoading}
      open={open}
      onCancel={() => setOpen(false)}
      form={
        <div className="grid sm:grid-cols-3 gap-3">
          <FieldRow
            label="Activity"
            value={form.activity}
            onChange={(v) => setForm((p) => ({ ...p, activity: v }))}
            ocid="volunteer.activity.input"
          />
          <FieldRow
            label="Hours"
            type="number"
            value={form.hours}
            onChange={(v) => setForm((p) => ({ ...p, hours: v }))}
            ocid="volunteer.hours.input"
          />
          <FieldRow
            label="Date"
            type="date"
            value={form.date}
            onChange={(v) => setForm((p) => ({ ...p, date: v }))}
            ocid="volunteer.date.input"
          />
        </div>
      }
      onSave={handleSave}
      saving={addMutation.isPending}
    >
      <StaggerList
        items={items}
        className="space-y-2"
        renderItem={(item: VolunteerEntry, i) => (
          <ItemRow
            key={String(item.id)}
            ocid={`volunteer.item.${i + 1}`}
            title={item.activity}
            subtitle={`${item.date} · ${Number(item.hours).toFixed(1)} hrs`}
            onDelete={() =>
              deleteMutation
                .mutateAsync(item.id)
                .catch(() => toast.error("Failed to delete."))
            }
            deleting={deleteMutation.isPending}
          />
        )}
      />
    </SectionShell>
  );
}

// ─── Awards & Achievements ────────────────────────────────────────────────────
function AchievementsSection() {
  const { data: items = [], isLoading } = useAchievements();
  const addMutation = useAddAchievement();
  const deleteMutation = useDeleteAchievement();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", date: "", description: "" });

  const handleSave = async () => {
    if (!form.name || !form.date) {
      toast.error("Name and date are required.");
      return;
    }
    try {
      await addMutation.mutateAsync(form);
      toast.success("Achievement added!");
      setForm({ name: "", date: "", description: "" });
      setOpen(false);
    } catch {
      toast.error("Failed to save.");
    }
  };

  const sorted = [...items].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <SectionShell
      emoji="🏆"
      title="Awards & Achievements"
      description="Showcase your prizes, honours, and recognition."
      onAdd={() => setOpen(true)}
      isLoading={isLoading}
      open={open}
      onCancel={() => setOpen(false)}
      form={
        <div className="grid sm:grid-cols-2 gap-3">
          <FieldRow
            label="Award / Achievement"
            value={form.name}
            onChange={(v) => setForm((p) => ({ ...p, name: v }))}
            ocid="achievement.name.input"
          />
          <FieldRow
            label="Date"
            type="date"
            value={form.date}
            onChange={(v) => setForm((p) => ({ ...p, date: v }))}
            ocid="achievement.date.input"
          />
          <div className="sm:col-span-2">
            <Label className="text-xs font-medium mb-1 block">
              Description
            </Label>
            <Textarea
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
              placeholder="Describe the achievement…"
              rows={2}
              data-ocid="achievement.description.textarea"
              className="text-sm"
            />
          </div>
        </div>
      }
      onSave={handleSave}
      saving={addMutation.isPending}
    >
      <StaggerList
        items={sorted}
        className="space-y-2"
        renderItem={(item: AchievementEntry, i) => (
          <ItemRow
            key={String(item.id)}
            ocid={`achievement.item.${i + 1}`}
            title={item.name}
            subtitle={`${item.date}${item.description ? ` · ${item.description}` : ""}`}
            onDelete={() =>
              deleteMutation
                .mutateAsync(item.id)
                .catch(() => toast.error("Failed to delete."))
            }
            deleting={deleteMutation.isPending}
          />
        )}
      />
    </SectionShell>
  );
}

// ─── Leadership Roles ─────────────────────────────────────────────────────────
function LeadershipSection() {
  const { data: items = [], isLoading } = useLeadershipRoles();
  const addMutation = useAddLeadershipRole();
  const deleteMutation = useDeleteLeadershipRole();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    organization: "",
    role: "",
    startDate: "",
    endDate: "",
    impact: "",
  });

  const handleSave = async () => {
    if (!form.organization || !form.role || !form.startDate) {
      toast.error("Organisation, role, and start date required.");
      return;
    }
    try {
      await addMutation.mutateAsync({
        ...form,
        endDate: form.endDate || null,
      });
      toast.success("Leadership role saved!");
      setForm({
        organization: "",
        role: "",
        startDate: "",
        endDate: "",
        impact: "",
      });
      setOpen(false);
    } catch {
      toast.error("Failed to save.");
    }
  };

  return (
    <SectionShell
      emoji="👑"
      title="Leadership Roles"
      description="Document every leadership position to strengthen your application."
      onAdd={() => setOpen(true)}
      isLoading={isLoading}
      open={open}
      onCancel={() => setOpen(false)}
      form={
        <div className="grid sm:grid-cols-2 gap-3">
          <FieldRow
            label="Organisation"
            value={form.organization}
            onChange={(v) => setForm((p) => ({ ...p, organization: v }))}
            ocid="leadership.org.input"
          />
          <FieldRow
            label="Role"
            value={form.role}
            onChange={(v) => setForm((p) => ({ ...p, role: v }))}
            ocid="leadership.role.input"
          />
          <FieldRow
            label="Start Date"
            type="date"
            value={form.startDate}
            onChange={(v) => setForm((p) => ({ ...p, startDate: v }))}
            ocid="leadership.start_date.input"
          />
          <FieldRow
            label="End Date (optional)"
            type="date"
            value={form.endDate}
            onChange={(v) => setForm((p) => ({ ...p, endDate: v }))}
            ocid="leadership.end_date.input"
          />
          <div className="sm:col-span-2">
            <Label className="text-xs font-medium mb-1 block">Impact</Label>
            <Textarea
              value={form.impact}
              onChange={(e) =>
                setForm((p) => ({ ...p, impact: e.target.value }))
              }
              placeholder="Describe your impact in this role…"
              rows={2}
              data-ocid="leadership.impact.textarea"
              className="text-sm"
            />
          </div>
        </div>
      }
      onSave={handleSave}
      saving={addMutation.isPending}
    >
      <StaggerList
        items={items}
        className="space-y-2"
        renderItem={(item: LeadershipRole, i) => (
          <ItemRow
            key={String(item.id)}
            ocid={`leadership.item.${i + 1}`}
            title={`${item.role} — ${item.organization}`}
            subtitle={`${item.startDate}${item.endDate ? ` → ${item.endDate}` : " → Present"}${item.impact ? ` · ${item.impact}` : ""}`}
            onDelete={() =>
              deleteMutation
                .mutateAsync(item.id)
                .catch(() => toast.error("Failed to delete."))
            }
            deleting={deleteMutation.isPending}
          />
        )}
      />
    </SectionShell>
  );
}

// ─── Summer Programs ──────────────────────────────────────────────────────────
const STATUS_LABELS: Record<string, string> = {
  interested: "Interested",
  applied: "Applied",
  accepted: "Accepted",
  completed: "Completed",
  rejected: "Rejected",
};

function SummerProgramsSection() {
  const { data: items = [], isLoading } = useSummerPrograms();
  const addMutation = useAddSummerProgram();
  const deleteMutation = useDeleteSummerProgram();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    provider: "",
    date: "",
    status: "interested" as SummerProgramStatus,
  });

  const handleSave = async () => {
    if (!form.name || !form.provider || !form.date) {
      toast.error("Name, provider, and date required.");
      return;
    }
    try {
      await addMutation.mutateAsync(form);
      toast.success("Summer programme added!");
      setForm({
        name: "",
        provider: "",
        date: "",
        status: SummerProgramStatus.interested,
      });
      setOpen(false);
    } catch {
      toast.error("Failed to save.");
    }
  };

  return (
    <SectionShell
      emoji="☀️"
      title="Summer Programs"
      description="Track programs, research camps, and pre-college experiences."
      onAdd={() => setOpen(true)}
      isLoading={isLoading}
      open={open}
      onCancel={() => setOpen(false)}
      form={
        <div className="grid sm:grid-cols-2 gap-3">
          <FieldRow
            label="Programme Name"
            value={form.name}
            onChange={(v) => setForm((p) => ({ ...p, name: v }))}
            ocid="summer.name.input"
          />
          <FieldRow
            label="Provider / Organisation"
            value={form.provider}
            onChange={(v) => setForm((p) => ({ ...p, provider: v }))}
            ocid="summer.provider.input"
          />
          <FieldRow
            label="Date"
            type="date"
            value={form.date}
            onChange={(v) => setForm((p) => ({ ...p, date: v }))}
            ocid="summer.date.input"
          />
          <div>
            <Label className="text-xs font-medium mb-1 block">Status</Label>
            <Select
              value={form.status}
              onValueChange={(v) =>
                setForm((p) => ({
                  ...p,
                  status: v as SummerProgramStatus,
                }))
              }
            >
              <SelectTrigger
                data-ocid="summer.status.select"
                className="h-8 text-sm"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(STATUS_LABELS).map(([val, label]) => (
                  <SelectItem key={val} value={val}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      }
      onSave={handleSave}
      saving={addMutation.isPending}
    >
      <StaggerList
        items={items}
        className="space-y-2"
        renderItem={(item: SummerProgram, i) => (
          <ItemRow
            key={String(item.id)}
            ocid={`summer.item.${i + 1}`}
            title={item.name}
            subtitle={`${item.provider} · ${item.date}`}
            badges={[
              STATUS_LABELS[
                Object.keys(item.status)[0] as keyof typeof STATUS_LABELS
              ] ?? "",
            ]}
            onDelete={() =>
              deleteMutation
                .mutateAsync(item.id)
                .catch(() => toast.error("Failed to delete."))
            }
            deleting={deleteMutation.isPending}
          />
        )}
      />
    </SectionShell>
  );
}

// ─── Shared helpers ───────────────────────────────────────────────────────────
interface SectionShellProps {
  title: string;
  description: React.ReactNode;
  onAdd: () => void;
  isLoading: boolean;
  open: boolean;
  emoji?: string;
  onCancel: () => void;
  form: React.ReactNode;
  onSave: () => void;
  saving: boolean;
  children: React.ReactNode;
}

function SectionShell({
  title,
  description,
  onAdd,
  isLoading,
  open,
  onCancel,
  form,
  onSave,
  saving,
  children,
}: SectionShellProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl" />
          <div>
            <h2 className="font-display text-lg font-bold text-foreground">
              {title}
            </h2>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>
        {!open && (
          <Button
            type="button"
            size="sm"
            onClick={onAdd}
            data-ocid={`${title.toLowerCase().replace(/ /g, "_")}.add_button`}
            className="gap-1.5 shrink-0"
          >
            + Add
          </Button>
        )}
      </div>

      {open && (
        <AnimatedCard>
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="pt-4 space-y-3">
              {form}
              <div className="flex gap-2 pt-1">
                <Button
                  type="button"
                  size="sm"
                  onClick={onSave}
                  disabled={saving}
                  data-ocid={`${title.toLowerCase().replace(/ /g, "_")}.save_button`}
                >
                  {saving && (
                    <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                  )}
                  Save
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onCancel}
                  data-ocid={`${title.toLowerCase().replace(/ /g, "_")}.cancel_button`}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </AnimatedCard>
      )}

      {isLoading ? (
        <div
          className="flex items-center gap-2 py-6 justify-center"
          data-ocid={`${title.toLowerCase().replace(/ /g, "_")}.loading_state`}
        >
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Loading…</span>
        </div>
      ) : (
        children
      )}
    </div>
  );
}

function FieldRow({
  label,
  value,
  onChange,
  type = "text",
  ocid,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  ocid?: string;
}) {
  return (
    <div>
      <Label className="text-xs font-medium mb-1 block">{label}</Label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={
          type === "date" ? undefined : `Enter ${label.toLowerCase()}…`
        }
        data-ocid={ocid}
        className="h-8 text-sm"
      />
    </div>
  );
}

function ItemRow({
  title,
  subtitle,
  badges = [],
  onDelete,
  deleting,
  ocid,
}: {
  title: string;
  subtitle: string;
  badges?: string[];
  onDelete: () => void;
  deleting: boolean;
  ocid: string;
}) {
  return (
    <div
      data-ocid={ocid}
      className="flex items-start gap-3 p-3 rounded-xl border border-border bg-card hover:bg-muted/40 transition-colors"
    >
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-foreground truncate">{title}</p>
        <p className="text-xs text-muted-foreground truncate mt-0.5">
          {subtitle}
        </p>
        {badges.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {badges
              .filter(Boolean)
              .slice(0, 6)
              .map((b) => (
                <Badge key={b} variant="secondary" className="text-xs py-0">
                  {b}
                </Badge>
              ))}
          </div>
        )}
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
        onClick={onDelete}
        disabled={deleting}
        data-ocid={`${ocid}.delete_button`}
        aria-label="Delete"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

// ─── Tab config ───────────────────────────────────────────────────────────────
const TABS = [
  { id: "planner", label: "4-Year Planner", comp: FourYearPlanner },
  { id: "internships", label: "Internships", comp: InternshipTracker },
  { id: "volunteer", label: "Volunteer", comp: VolunteerHours },
  { id: "achievements", label: "Awards", comp: AchievementsSection },
  { id: "leadership", label: "Leadership", comp: LeadershipSection },
  { id: "summer", label: "Summer", comp: SummerProgramsSection },
] as const;

// ─── Page ─────────────────────────────────────────────────────────────────────
import type React from "react";

export default function SmartPlanningPage() {
  const [active, setActive] = useState<string>("planner");

  return (
    <PageTransition className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 flex items-center gap-3">
        <span className="text-4xl" />
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Smart Planning
          </h1>
          <p className="text-muted-foreground mt-1">
            Your 4-year roadmap — internships, volunteering, awards, leadership,
            and summer programmes all in one place.
          </p>
        </div>
      </div>

      <Tabs value={active} onValueChange={setActive}>
        <TabsList className="flex flex-wrap h-auto gap-1 mb-8 bg-muted/60 p-1.5 rounded-2xl">
          {TABS.map((t) => (
            <TabsTrigger
              key={t.id}
              value={t.id}
              data-ocid={`smart_planning.${t.id}.tab`}
              className="text-xs sm:text-sm rounded-xl transition-all duration-200"
            >
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {TABS.map((t) => (
          <TabsContent key={t.id} value={t.id}>
            <AnimatedCard>
              <Card>
                <CardContent className="pt-6">
                  <t.comp />
                </CardContent>
              </Card>
            </AnimatedCard>
          </TabsContent>
        ))}
      </Tabs>
    </PageTransition>
  );
}
