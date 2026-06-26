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
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import type { Award, StudentProfile } from "@/types";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Award as AwardIcon,
  BookOpen,
  Globe,
  GraduationCap,
  LogIn,
  Plus,
  Save,
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

export default function EditProfilePage() {
  const { isAuthenticated, isLoading: authLoading, login } = useAuth();
  const {
    profile,
    isLoading: profileLoading,
    saveProfileAsync,
    isSaving,
  } = useProfile();
  const navigate = useNavigate();

  const [form, setForm] = useState<StudentProfile>(DEFAULT_PROFILE);
  const [errors, setErrors] = useState<{
    intendedMajor?: string;
    dreamCollege?: string;
    gpa?: string;
    weightedGpa?: string;
  }>({});
  const [newAward, setNewAward] = useState<{
    title: string;
    description: string;
  }>({ title: "", description: "" });
  const [showAwardForm, setShowAwardForm] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm(profile);
    }
  }, [profile]);

  const isLoading = authLoading || profileLoading;

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

  const addAward = () => {
    if (!newAward.title.trim()) return;
    set("awards", [
      ...(form.awards ?? []),
      {
        title: newAward.title.trim(),
        description: newAward.description.trim(),
      },
    ]);
    setNewAward({ title: "", description: "" });
    setShowAwardForm(false);
  };

  const removeAward = (idx: number) => {
    set(
      "awards",
      (form.awards ?? []).filter((_award, i) => i !== idx),
    );
  };

  const handleSave = async () => {
    if (!validate()) return;
    try {
      await saveProfileAsync(form);
      toast.success("Profile updated successfully!");
      navigate({ to: "/profile" });
    } catch {
      toast.error("Failed to update profile. Please try again.");
    }
  };

  if (!isAuthenticated && !authLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <Card
          className="w-full max-w-md border-border shadow-lg"
          data-ocid="edit_profile.login_card"
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
              data-ocid="edit_profile.login_button"
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
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate({ to: "/profile" })}
          className="mb-2 -ml-2 text-muted-foreground hover:text-foreground"
          data-ocid="edit_profile.back_button"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Profile
        </Button>
        <h1 className="font-display text-3xl font-bold text-foreground">
          Edit Profile
        </h1>
        <p className="text-muted-foreground">
          Update your details to keep your guidance fresh and accurate.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-6" data-ocid="edit_profile.loading_state">
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
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="space-y-6"
          data-ocid="edit_profile.form"
        >
          <SectionCard
            icon={<GraduationCap className="h-5 w-5" />}
            title="Academic Background"
            description="Your current academic standing and test scores"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5 sm:col-span-2">
                <Label>GPA Scale</Label>
                <div
                  className="flex gap-2"
                  data-ocid="edit_profile.gpa_type.toggle"
                >
                  {([GpaType.unweighted, GpaType.weighted] as const).map(
                    (type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => set("gpaType", type)}
                        data-ocid={`edit_profile.gpa_type.${type}`}
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
                    ),
                  )}
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
                  data-ocid="edit_profile.gpa.input"
                />
                {errors.gpa ? (
                  <p
                    className="text-xs text-destructive"
                    data-ocid="edit_profile.gpa.field_error"
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
                    <span className="text-muted-foreground text-xs">
                      (0–5.0)
                    </span>
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
                      setErrors((prev) => ({
                        ...prev,
                        weightedGpa: undefined,
                      }));
                    }}
                    data-ocid="edit_profile.weighted_gpa.input"
                  />
                  {errors.weightedGpa ? (
                    <p
                      className="text-xs text-destructive"
                      data-ocid="edit_profile.weighted_gpa.field_error"
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
                  data-ocid="edit_profile.courses.input"
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
                      e.target.value === ""
                        ? undefined
                        : BigInt(e.target.value),
                    )
                  }
                  data-ocid="edit_profile.sat.input"
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
                      e.target.value === ""
                        ? undefined
                        : BigInt(e.target.value),
                    )
                  }
                  data-ocid="edit_profile.act.input"
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
                    data-ocid="edit_profile.major.input"
                  />
                  {errors.intendedMajor && (
                    <p
                      id="major-error"
                      className="text-xs text-destructive"
                      data-ocid="edit_profile.major.field_error"
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
                    data-ocid="edit_profile.dream_college.input"
                  />
                  {errors.dreamCollege && (
                    <p
                      id="college-error"
                      className="text-xs text-destructive"
                      data-ocid="edit_profile.dream_college.field_error"
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
                    data-ocid="edit_profile.study_country.select"
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
                  dataPrefix="edit_profile.extracurricular"
                />
              </div>

              <div className="space-y-1.5">
                <Label>Work Experience</Label>
                <TagList
                  items={form.workExperience}
                  onAdd={(v) =>
                    set("workExperience", [...form.workExperience, v])
                  }
                  onRemove={(i) =>
                    set(
                      "workExperience",
                      form.workExperience.filter((_, idx) => idx !== i),
                    )
                  }
                  placeholder="e.g. Summer intern at local hospital"
                  dataPrefix="edit_profile.work"
                />
              </div>
            </div>
          </SectionCard>

          <SectionCard
            icon={<AwardIcon className="h-5 w-5" />}
            title="Awards & Prizes"
            description="Highlight academic awards, competitions, and recognitions"
          >
            <div className="space-y-4">
              {(form.awards ?? []).length > 0 && (
                <div className="space-y-3">
                  {(form.awards ?? []).map((award: Award, idx: number) => (
                    <div
                      key={`${award.title}-${idx}`}
                      className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 p-4"
                      data-ocid={`edit_profile.award.item.${idx + 1}`}
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <AwardIcon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground text-sm">
                          {award.title}
                        </p>
                        {award.description && (
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {award.description}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAward(idx)}
                        className="text-muted-foreground hover:text-destructive transition-colors p-1"
                        aria-label={`Remove award: ${award.title}`}
                        data-ocid={`edit_profile.award.delete_button.${idx + 1}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {showAwardForm ? (
                <div
                  className="space-y-3 rounded-lg border border-primary/30 bg-primary/5 p-4"
                  data-ocid="edit_profile.award.form"
                >
                  <div className="space-y-1.5">
                    <Label htmlFor="awardTitle">Award Title</Label>
                    <Input
                      id="awardTitle"
                      placeholder="e.g. National Merit Scholar, Science Olympiad Gold"
                      value={newAward.title}
                      onChange={(e) =>
                        setNewAward((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addAward();
                        }
                      }}
                      data-ocid="edit_profile.award.title.input"
                      autoFocus
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="awardDesc">
                      Description{" "}
                      <span className="text-muted-foreground text-xs">
                        (optional)
                      </span>
                    </Label>
                    <Textarea
                      id="awardDesc"
                      placeholder="Brief description of the award or achievement..."
                      value={newAward.description}
                      onChange={(e) =>
                        setNewAward((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      rows={2}
                      data-ocid="edit_profile.award.description.textarea"
                      className="resize-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      onClick={addAward}
                      disabled={!newAward.title.trim()}
                      data-ocid="edit_profile.award.save_button"
                    >
                      Add Award
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setShowAwardForm(false);
                        setNewAward({ title: "", description: "" });
                      }}
                      data-ocid="edit_profile.award.cancel_button"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAwardForm(true)}
                  data-ocid="edit_profile.award.add_button"
                  className="w-full border-dashed"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Award
                </Button>
              )}
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
              data-ocid="edit_profile.financial_aid.radio"
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
                  data-ocid={`edit_profile.financial_aid.${value}`}
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
            data-ocid="edit_profile.actions"
          >
            <Button
              type="submit"
              size="lg"
              disabled={isSaving}
              className="flex-1 sm:flex-none sm:min-w-[180px]"
              data-ocid="edit_profile.submit_button"
            >
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => navigate({ to: "/profile" })}
              className="flex-1 sm:flex-none"
              data-ocid="edit_profile.cancel_button"
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
