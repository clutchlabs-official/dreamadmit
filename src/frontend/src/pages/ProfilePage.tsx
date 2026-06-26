import { FinancialAidPreference, GpaType } from "@/backend";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useGeminiApiKeyStatus, useSetGeminiApiKey } from "@/hooks/useQueries";
import type { StudentProfile } from "@/types";
import { Link } from "@tanstack/react-router";
import {
  Award as AwardIcon,
  BookOpen,
  Edit3,
  Globe,
  GraduationCap,
  Key,
  LogIn,
  Plus,
  Sparkles,
  Trash2,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const COUNTRIES = [
  "US",
  "UK",
  "Canada",
  "Australia",
  "India",
  "Germany",
  "France",
  "Japan",
  "Singapore",
  "UAE",
] as const;

const DEFAULT_PROFILE: StudentProfile = {
  intendedMajor: "",
  dreamCollege: "",
  gpa: undefined,
  satScore: undefined,
  actScore: undefined,
  numberOfCourses: 0n,
  extracurriculars: [],
  workExperience: [],
  financialAidPreference: FinancialAidPreference.none,
  studyCountry: "",
  gpaType: GpaType.unweighted,
  weightedGpa: undefined,
  awards: [],
};

function SectionCard({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
          <div>
            <CardTitle className="font-display text-lg">{title}</CardTitle>
            <CardDescription className="text-sm">{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="pt-6">{children}</CardContent>
    </Card>
  );
}

function TagList({
  items,
  onAdd,
  onRemove,
  placeholder,
  dataPrefix,
}: {
  items: string[];
  onAdd: (val: string) => void;
  onRemove: (idx: number) => void;
  placeholder: string;
  dataPrefix: string;
}) {
  const [input, setInput] = useState("");
  const handleAdd = () => {
    const trimmed = input.trim();
    if (trimmed) {
      onAdd(trimmed);
      setInput("");
    }
  };
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAdd();
            }
          }}
          data-ocid={`${dataPrefix}.input`}
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAdd}
          data-ocid={`${dataPrefix}.add_button`}
          className="shrink-0"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>
      {items.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {items.map((item, idx) => (
            <Badge
              key={item}
              variant="secondary"
              className="flex items-center gap-1.5 py-1 px-2.5 text-sm"
              data-ocid={`${dataPrefix}.item.${idx + 1}`}
            >
              <span className="max-w-[200px] truncate">{item}</span>
              <button
                type="button"
                onClick={() => onRemove(idx)}
                className="ml-0.5 rounded-full text-muted-foreground hover:text-destructive transition-colors"
                aria-label={`Remove ${item}`}
                data-ocid={`${dataPrefix}.delete_button.${idx + 1}`}
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

function ProfileSummary({
  profile,
}: {
  profile: StudentProfile;
}) {
  const aidLabel =
    profile.financialAidPreference === FinancialAidPreference.full
      ? "Full-Tuition Aid"
      : profile.financialAidPreference === FinancialAidPreference.half
        ? "Half-Tuition Aid"
        : "No Financial Aid Needed";

  return (
    <div className="space-y-6" data-ocid="profile.summary">
      <SectionCard
        icon={<GraduationCap className="h-5 w-5" />}
        title="Academic Background"
        description="Your current academic standing and test scores"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <p className="text-sm text-muted-foreground">Unweighted GPA</p>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="font-medium text-foreground">
                {profile.gpa !== undefined ? profile.gpa.toFixed(2) : "—"}
              </p>
              <Badge
                variant="outline"
                className="text-xs px-1.5 py-0 border-primary/40 text-primary bg-primary/5"
                data-ocid="profile.summary.gpa_scale_badge"
              >
                UW
              </Badge>
            </div>
          </div>

          {profile.gpaType === GpaType.weighted && (
            <div>
              <p className="text-sm text-muted-foreground">Weighted GPA</p>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="font-medium text-foreground">
                  {profile.weightedGpa !== undefined
                    ? profile.weightedGpa.toFixed(2)
                    : "—"}
                </p>
                <Badge
                  variant="outline"
                  className="text-xs px-1.5 py-0 border-accent/60 text-accent bg-accent/5"
                  data-ocid="profile.summary.weighted_gpa_badge"
                >
                  W
                </Badge>
              </div>
            </div>
          )}

          <div>
            <p className="text-sm text-muted-foreground">AP/IB Courses</p>
            <p className="font-medium text-foreground">
              {profile.numberOfCourses.toString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">SAT Score</p>
            <p className="font-medium text-foreground">
              {profile.satScore !== undefined
                ? profile.satScore.toString()
                : "—"}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">ACT Score</p>
            <p className="font-medium text-foreground">
              {profile.actScore !== undefined
                ? profile.actScore.toString()
                : "—"}
            </p>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        icon={<BookOpen className="h-5 w-5" />}
        title="Academic Goals & Activities"
        description="Your intended path and what makes you unique"
      >
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <p className="text-sm text-muted-foreground">Intended Major</p>
              <p className="font-medium text-foreground">
                {profile.intendedMajor || "—"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Dream College</p>
              <p className="font-medium text-foreground">
                {profile.dreamCollege || "—"}
              </p>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Study Country</p>
            <p className="font-medium text-foreground">
              {profile.studyCountry || "—"}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Extracurricular Activities
            </p>
            {profile.extracurriculars.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.extracurriculars.map((item, idx) => (
                  <Badge
                    key={`extra-${item}`}
                    variant="secondary"
                    className="py-1 px-2.5 text-sm"
                    data-ocid={`profile.summary.extracurricular.item.${idx + 1}`}
                  >
                    {item}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">—</p>
            )}
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Work Experience
            </p>
            {profile.workExperience.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.workExperience.map((item, idx) => (
                  <Badge
                    key={`work-${item}`}
                    variant="secondary"
                    className="py-1 px-2.5 text-sm"
                    data-ocid={`profile.summary.work.item.${idx + 1}`}
                  >
                    {item}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">—</p>
            )}
          </div>
        </div>
      </SectionCard>

      {(profile.awards ?? []).length > 0 && (
        <SectionCard
          icon={<AwardIcon className="h-5 w-5" />}
          title="Awards & Prizes"
          description="Academic achievements, competitions, and recognitions"
        >
          <div className="space-y-3">
            {(profile.awards ?? []).map((award, idx) => (
              <div
                key={`${award.title}-${idx}`}
                className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 p-4"
                data-ocid={`profile.summary.award.item.${idx + 1}`}
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <AwardIcon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-sm">
                    {award.title}
                  </p>
                  {award.description && (
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {award.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      <SectionCard
        icon={<Wallet className="h-5 w-5" />}
        title="Financial Aid Preference"
        description="Tell us about your financial aid needs"
      >
        <p className="font-medium text-foreground">{aidLabel}</p>
      </SectionCard>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button
          asChild
          size="lg"
          className="flex-1 sm:flex-none sm:min-w-[180px]"
          data-ocid="profile.edit_button"
        >
          <Link to="/profile/edit">
            <Edit3 className="mr-2 h-4 w-4" />
            Edit Profile
          </Link>
        </Button>
        <Button
          variant="outline"
          size="lg"
          asChild
          className="flex-1 sm:flex-none"
          data-ocid="profile.view_guidance_button"
        >
          <Link to="/guidance">
            <Sparkles className="mr-2 h-4 w-4" />
            View AI Guidance
          </Link>
        </Button>
      </div>
    </div>
  );
}

function AiSettingsSection() {
  const { data: isConnected, isLoading: statusLoading } =
    useGeminiApiKeyStatus();
  const setKeyMutation = useSetGeminiApiKey();
  const [apiKey, setApiKey] = useState("");

  const handleSave = async () => {
    if (!apiKey.trim()) {
      toast.error("Please enter a valid API key.");
      return;
    }
    try {
      await setKeyMutation.mutateAsync(apiKey.trim());
      toast.success("API key saved successfully!");
      setApiKey("");
    } catch {
      toast.error("Failed to save API key. Please try again.");
    }
  };

  return (
    <SectionCard
      icon={<Key className="h-5 w-5" />}
      title="AI Settings"
      description="Connect your Gemini API key to enable AI-powered guidance"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">Status:</p>
          {statusLoading ? (
            <Skeleton className="h-5 w-24" />
          ) : isConnected ? (
            <Badge
              variant="outline"
              className="border-green-500/50 text-green-600 bg-green-50"
              data-ocid="profile.ai_status.connected"
            >
              AI Connected
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="border-yellow-500/50 text-yellow-600 bg-yellow-50"
              data-ocid="profile.ai_status.not_configured"
            >
              AI Not Configured
            </Badge>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="geminiApiKey">Gemini API Key</Label>
          <Input
            id="geminiApiKey"
            type="password"
            placeholder="Paste your Gemini API key here"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            data-ocid="profile.api_key.input"
          />
          <p className="text-xs text-muted-foreground">
            Your key is stored securely on the backend and never shared.
          </p>
        </div>

        <Button
          type="button"
          onClick={handleSave}
          disabled={setKeyMutation.isPending || !apiKey.trim()}
          data-ocid="profile.save_api_key_button"
        >
          {setKeyMutation.isPending ? "Saving..." : "Save API Key"}
        </Button>
      </div>
    </SectionCard>
  );
}

function ProfileForm({
  profile,
  onSave,
  isSaving,
}: {
  profile: StudentProfile | null;
  onSave: (form: StudentProfile) => Promise<void>;
  isSaving: boolean;
}) {
  const [form, setForm] = useState<StudentProfile>(profile ?? DEFAULT_PROFILE);
  const [errors, setErrors] = useState<{
    intendedMajor?: string;
    dreamCollege?: string;
    gpa?: string;
    weightedGpa?: string;
  }>({});

  useEffect(() => {
    if (profile) setForm(profile);
  }, [profile]);

  const set = <K extends keyof StudentProfile>(
    key: K,
    value: StudentProfile[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const validate = () => {
    const e: typeof errors = {};
    if (!form.intendedMajor.trim())
      e.intendedMajor = "Intended major is required";
    if (!form.dreamCollege.trim()) e.dreamCollege = "Dream college is required";
    if (form.gpa !== undefined && form.gpa > 4.0)
      e.gpa = "Unweighted GPA must be 4.0 or less";
    if (form.weightedGpa !== undefined && form.weightedGpa > 5.0)
      e.weightedGpa = "Weighted GPA must be 5.0 or less";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    try {
      await onSave(form);
      toast.success("Profile saved! You're on your way to your dream college.");
    } catch {
      toast.error("Failed to save profile. Please try again.");
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSave();
      }}
      className="space-y-6"
      data-ocid="profile.form"
    >
      <SectionCard
        icon={<GraduationCap className="h-5 w-5" />}
        title="Academic Background"
        description="Your current academic standing and test scores"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5 sm:col-span-2">
            <Label>GPA Scale</Label>
            <div className="flex gap-2" data-ocid="profile.gpa_type.toggle">
              {([GpaType.unweighted, GpaType.weighted] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => set("gpaType", type)}
                  data-ocid={`profile.gpa_type.${type}`}
                  className={`flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
                    form.gpaType === type
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  {type === GpaType.unweighted
                    ? "Unweighted (0–4.0)"
                    : "Weighted (0–5.0)"}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="gpa">
              Unweighted GPA{" "}
              <span className="text-muted-foreground text-xs">(0–4.0)</span>
            </Label>
            <Input
              id="gpa"
              type="number"
              min={0}
              max={4.0}
              step={0.01}
              placeholder="e.g. 3.85"
              value={form.gpa ?? ""}
              onChange={(e) => {
                set(
                  "gpa",
                  e.target.value === ""
                    ? undefined
                    : Number.parseFloat(e.target.value),
                );
                setErrors((prev) => ({ ...prev, gpa: undefined }));
              }}
              data-ocid="profile.gpa.input"
            />
            {errors.gpa ? (
              <p
                className="text-xs text-destructive"
                data-ocid="profile.gpa.field_error"
              >
                {errors.gpa}
              </p>
            ) : (
              <p className="text-xs text-accent">
                Leave blank and we'll suggest target scores for you
              </p>
            )}
          </div>

          {form.gpaType === GpaType.weighted && (
            <div className="space-y-1.5">
              <Label htmlFor="weightedGpa">
                Weighted GPA{" "}
                <span className="text-muted-foreground text-xs">(0–5.0)</span>
              </Label>
              <Input
                id="weightedGpa"
                type="number"
                min={0}
                max={5.0}
                step={0.01}
                placeholder="e.g. 4.3"
                value={form.weightedGpa ?? ""}
                onChange={(e) => {
                  set(
                    "weightedGpa",
                    e.target.value === ""
                      ? undefined
                      : Number.parseFloat(e.target.value),
                  );
                  setErrors((prev) => ({ ...prev, weightedGpa: undefined }));
                }}
                data-ocid="profile.weighted_gpa.input"
              />
              {errors.weightedGpa ? (
                <p
                  className="text-xs text-destructive"
                  data-ocid="profile.weighted_gpa.field_error"
                >
                  {errors.weightedGpa}
                </p>
              ) : (
                <p className="text-xs text-accent">
                  Leave blank if not applicable
                </p>
              )}
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="courses">AP/IB Courses Taken</Label>
            <Input
              id="courses"
              type="number"
              min={0}
              placeholder="e.g. 5"
              value={
                form.numberOfCourses === 0n
                  ? ""
                  : form.numberOfCourses.toString()
              }
              onChange={(e) =>
                set(
                  "numberOfCourses",
                  e.target.value === "" ? 0n : BigInt(e.target.value),
                )
              }
              data-ocid="profile.courses.input"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="sat">SAT Score</Label>
            <Input
              id="sat"
              type="number"
              min={400}
              max={1600}
              step={10}
              placeholder="400 – 1600"
              value={
                form.satScore !== undefined ? form.satScore.toString() : ""
              }
              onChange={(e) =>
                set(
                  "satScore",
                  e.target.value === "" ? undefined : BigInt(e.target.value),
                )
              }
              data-ocid="profile.sat.input"
            />
            <p className="text-xs text-accent">
              Leave blank and we'll suggest target scores for you
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="act">ACT Score</Label>
            <Input
              id="act"
              type="number"
              min={1}
              max={36}
              placeholder="1 – 36"
              value={
                form.actScore !== undefined ? form.actScore.toString() : ""
              }
              onChange={(e) =>
                set(
                  "actScore",
                  e.target.value === "" ? undefined : BigInt(e.target.value),
                )
              }
              data-ocid="profile.act.input"
            />
            <p className="text-xs text-accent">
              Leave blank and we'll suggest target scores for you
            </p>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        icon={<BookOpen className="h-5 w-5" />}
        title="Academic Goals & Activities"
        description="Your intended path and what makes you unique"
      >
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <Label htmlFor="major">
                Intended Major
                <span className="text-destructive ml-0.5">*</span>
              </Label>
              <Input
                id="major"
                placeholder="e.g. Computer Science"
                value={form.intendedMajor}
                onChange={(e) => {
                  set("intendedMajor", e.target.value);
                  setErrors((prev) => ({
                    ...prev,
                    intendedMajor: undefined,
                  }));
                }}
                aria-describedby={
                  errors.intendedMajor ? "major-error" : undefined
                }
                data-ocid="profile.major.input"
              />
              {errors.intendedMajor && (
                <p
                  id="major-error"
                  className="text-xs text-destructive"
                  data-ocid="profile.major.field_error"
                >
                  {errors.intendedMajor}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="dreamCollege">
                Dream College
                <span className="text-destructive ml-0.5">*</span>
              </Label>
              <Input
                id="dreamCollege"
                placeholder="e.g. MIT, Stanford, Harvard"
                value={form.dreamCollege}
                onChange={(e) => {
                  set("dreamCollege", e.target.value);
                  setErrors((prev) => ({
                    ...prev,
                    dreamCollege: undefined,
                  }));
                }}
                aria-describedby={
                  errors.dreamCollege ? "college-error" : undefined
                }
                data-ocid="profile.dream_college.input"
              />
              {errors.dreamCollege && (
                <p
                  id="college-error"
                  className="text-xs text-destructive"
                  data-ocid="profile.dream_college.field_error"
                >
                  {errors.dreamCollege}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="studyCountry">Study Country</Label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <select
                id="studyCountry"
                value={form.studyCountry ?? ""}
                onChange={(e) => set("studyCountry", e.target.value)}
                data-ocid="profile.study_country.select"
                className="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
              >
                <option value="">Select a country</option>
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Extracurricular Activities</Label>
            <TagList
              items={form.extracurriculars}
              onAdd={(v) =>
                set("extracurriculars", [...form.extracurriculars, v])
              }
              onRemove={(i) =>
                set(
                  "extracurriculars",
                  form.extracurriculars.filter((_, idx) => idx !== i),
                )
              }
              placeholder="e.g. Robotics Club, Debate Team"
              dataPrefix="profile.extracurricular"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Work Experience</Label>
            <TagList
              items={form.workExperience}
              onAdd={(v) => set("workExperience", [...form.workExperience, v])}
              onRemove={(i) =>
                set(
                  "workExperience",
                  form.workExperience.filter((_, idx) => idx !== i),
                )
              }
              placeholder="e.g. Summer intern at local hospital"
              dataPrefix="profile.work"
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard
        icon={<Wallet className="h-5 w-5" />}
        title="Financial Aid Preference"
        description="Tell us about your financial aid needs"
      >
        <RadioGroup
          value={form.financialAidPreference}
          onValueChange={(v) =>
            set("financialAidPreference", v as FinancialAidPreference)
          }
          className="space-y-3"
          data-ocid="profile.financial_aid.radio"
        >
          {(
            [
              {
                value: FinancialAidPreference.none,
                label: "No Financial Aid Needed",
                desc: "I can cover tuition without assistance",
              },
              {
                value: FinancialAidPreference.half,
                label: "Half-Tuition Aid",
                desc: "I need partial financial support",
              },
              {
                value: FinancialAidPreference.full,
                label: "Full-Tuition Aid",
                desc: "I need full financial assistance to attend",
              },
            ] as const
          ).map(({ value, label, desc }) => (
            <label
              key={value}
              htmlFor={`aid-${value}`}
              className={`flex items-center gap-4 rounded-lg border p-4 cursor-pointer transition-colors ${
                form.financialAidPreference === value
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/40 hover:bg-muted/40"
              }`}
              data-ocid={`profile.financial_aid.${value}`}
            >
              <RadioGroupItem value={value} id={`aid-${value}`} />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground">{label}</p>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            </label>
          ))}
        </RadioGroup>
      </SectionCard>

      <div
        className="flex flex-col sm:flex-row gap-3 pt-2"
        data-ocid="profile.actions"
      >
        <Button
          type="submit"
          size="lg"
          disabled={isSaving}
          className="flex-1 sm:flex-none sm:min-w-[180px]"
          data-ocid="profile.submit_button"
        >
          {isSaving ? "Saving..." : "Save Profile"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          asChild
          className="flex-1 sm:flex-none"
          data-ocid="profile.view_guidance_button"
        >
          <Link to="/guidance">
            <Sparkles className="mr-2 h-4 w-4" />
            View AI Guidance
          </Link>
        </Button>
      </div>
    </form>
  );
}

export default function ProfilePage() {
  const { isAuthenticated, isLoading: authLoading, login } = useAuth();
  const {
    profile,
    isLoading: profileLoading,
    saveProfileAsync,
    isSaving,
  } = useProfile();
  const isLoading = authLoading || profileLoading;

  if (!isAuthenticated && !authLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <Card
          className="w-full max-w-md border-border shadow-lg"
          data-ocid="profile.login_card"
        >
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <GraduationCap className="h-7 w-7 text-primary" />
            </div>
            <CardTitle className="font-display text-2xl">
              Sign In to Continue
            </CardTitle>
            <CardDescription className="mt-1">
              Save your profile and get personalized college admission guidance.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <Button
              className="w-full"
              size="lg"
              onClick={login}
              data-ocid="profile.login_button"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Sign in with Internet Identity
            </Button>
            <p className="mt-4 text-center text-xs text-muted-foreground">
              Secure, private login — no email or password required.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="font-display text-3xl font-bold text-foreground">
            My Profile
          </h1>
          {profile && (
            <Badge
              variant="outline"
              className="text-accent border-accent/50 bg-accent/10"
            >
              <Sparkles className="h-3 w-3 mr-1" />
              Saved
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground">
          {profile
            ? "Review your profile and update it anytime."
            : "Tell us about yourself so we can craft personalized college admission guidance."}
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-6" data-ocid="profile.loading_state">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-border">
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : profile ? (
        <>
          <ProfileSummary profile={profile} />
          <div className="mt-6">
            <AiSettingsSection />
          </div>
        </>
      ) : (
        <ProfileForm
          profile={null}
          onSave={saveProfileAsync}
          isSaving={isSaving}
        />
      )}
    </div>
  );
}
