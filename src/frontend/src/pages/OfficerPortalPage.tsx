import { createActor } from "@/backend";
import type {
  AdmissionOfficer,
  OfficerContent,
  OfficerContentInput,
  OfficerProfile,
  OfficerVerificationStatus,
} from "@/backend";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import {
  useColleges,
  useMyOfficerProfile,
  useOfficerContent,
  usePostOfficerContent,
  useRegisterOfficer,
} from "@/hooks/useQueries";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  BarChart3,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Info,
  Lock,
  Mail,
  MapPin,
  MessageSquare,
  Play,
  Send,
  ShieldCheck,
  Tv2,
  UploadCloud,
  UserCog,
  Users,
  Video,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

const CONTENT_TYPE_META: Record<
  string,
  { label: string; icon: React.ReactNode; badgeClass: string }
> = {
  tip: {
    label: "Tip",
    icon: <MessageSquare className="h-3 w-3" />,
    badgeClass: "bg-accent/20 text-accent-foreground border-accent/30",
  },
  insight: {
    label: "Insight",
    icon: <Info className="h-3 w-3" />,
    badgeClass: "bg-primary/20 text-primary border-primary/30",
  },
  video: {
    label: "Video",
    icon: <Video className="h-3 w-3" />,
    badgeClass: "bg-chart-5/20 text-foreground border-chart-5/30",
  },
  announcement: {
    label: "Announcement",
    icon: <Tv2 className="h-3 w-3" />,
    badgeClass: "bg-destructive/15 text-destructive border-destructive/30",
  },
};

const MOCK_APPLICATIONS = [
  {
    id: 1,
    name: "Arjun Mehta",
    major: "Computer Science",
    gpa: 3.9,
    sat: 1520,
    status: "pending",
    country: "India",
    essays: 2,
  },
  {
    id: 2,
    name: "Sofia Chen",
    major: "Data Science",
    gpa: 4.0,
    sat: 1580,
    status: "pending",
    country: "USA",
    essays: 2,
  },
  {
    id: 3,
    name: "Liam O'Brien",
    major: "Business Admin",
    gpa: 3.7,
    sat: 1430,
    status: "pending",
    country: "Ireland",
    essays: 1,
  },
  {
    id: 4,
    name: "Priya Nair",
    major: "Biomedical Eng",
    gpa: 3.85,
    sat: 1490,
    status: "pending",
    country: "India",
    essays: 2,
  },
  {
    id: 5,
    name: "Marcus Williams",
    major: "Psychology",
    gpa: 3.6,
    sat: 1380,
    status: "pending",
    country: "USA",
    essays: 2,
  },
  {
    id: 6,
    name: "Emma Fischer",
    major: "Economics",
    gpa: 3.95,
    sat: 1560,
    status: "pending",
    country: "Germany",
    essays: 2,
  },
];

const MONTHLY_APPS = [
  { month: "Jan", applications: 42 },
  { month: "Feb", applications: 67 },
  { month: "Mar", applications: 120 },
  { month: "Apr", applications: 98 },
  { month: "May", applications: 145 },
  { month: "Jun", applications: 87 },
];

const DIVERSITY_DATA = [
  { name: "Domestic", value: 60, color: "#6366f1" },
  { name: "International", value: 20, color: "#8b5cf6" },
  { name: "First-Gen", value: 15, color: "#a78bfa" },
  { name: "Transfer", value: 5, color: "#c4b5fd" },
];

const GEO_DATA = [
  { region: "California", count: 38 },
  { region: "Texas", count: 27 },
  { region: "India", count: 22 },
  { region: "New York", count: 19 },
  { region: "UK", count: 14 },
];

function formatDate(ts: bigint): string {
  return new Date(Number(ts)).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function calcAiScore(app: (typeof MOCK_APPLICATIONS)[0]): number {
  const gpaScore = (app.gpa / 4.0) * 40;
  const satScore = ((app.sat - 400) / (1600 - 400)) * 40;
  const essayBonus = app.essays * 5;
  const intlBonus = app.country !== "USA" ? 5 : 0;
  return Math.min(
    100,
    Math.round(gpaScore + satScore + essayBonus + intlBonus),
  );
}

function verificationBadge(status: OfficerVerificationStatus) {
  if (status === "verified")
    return (
      <Badge className="bg-green-500/10 text-green-600 border-green-500/30 gap-1">
        <CheckCircle2 className="h-3 w-3" /> Verified
      </Badge>
    );
  if (status === "rejected")
    return (
      <Badge className="bg-destructive/10 text-destructive border-destructive/30 gap-1">
        <AlertCircle className="h-3 w-3" /> Rejected
      </Badge>
    );
  return (
    <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/30 gap-1">
      <Clock className="h-3 w-3" /> Verification Pending
    </Badge>
  );
}

export default function OfficerPortalPage() {
  const { isAuthenticated } = useAuth();
  const { data: profile, isLoading } = useMyOfficerProfile();

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="rounded-full bg-primary/10 p-5 w-fit mx-auto mb-4">
          <Lock className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-2xl font-display font-bold mb-2">
          Admission Officer Portal
        </h2>
        <p className="text-muted-foreground">
          Sign in with Internet Identity to access the officer portal.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        data-ocid="officer-portal.loading_state"
        className="mx-auto max-w-4xl px-4 py-10 space-y-4"
      >
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <UserCog className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            🎓 Officer Portal
          </h1>
        </div>
        <p className="text-muted-foreground pl-[52px]">
          Manage applications, communicate with prospects, and track analytics.
        </p>
      </motion.div>

      {!profile ? (
        <RegistrationStep />
      ) : (
        <div className="space-y-6">
          <OfficerProfileBanner profile={profile} />
          <MainDashboard officerProfile={profile} />
        </div>
      )}
    </div>
  );
}

// Legacy helpers removed — OfficerPortalPage now handles auth/loading directly.

function RegistrationStep() {
  const { data: colleges, isLoading: collegesLoading } = useColleges();
  const registerMutation = useRegisterOfficer();
  const [selectedCollegeId, setSelectedCollegeId] = useState<string>("");
  const [officerName, setOfficerName] = useState("");

  const handleRegister = async () => {
    const id = selectedCollegeId ? BigInt(selectedCollegeId) : null;
    if (!id || !officerName.trim()) {
      toast.error("Please select a college and enter your name.");
      return;
    }
    try {
      await registerMutation.mutateAsync({
        collegeId: id,
        name: officerName.trim(),
      });
      toast.success("Officer profile created! Welcome to the portal.");
    } catch {
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-xl mx-auto py-8 px-4"
      data-ocid="officer_registration.page"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="rounded-lg bg-primary/10 p-3">
          <Building2 className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-display font-bold text-foreground">
            Register as Admission Officer
          </h2>
          <p className="text-muted-foreground text-sm">
            Complete your profile to access the full officer portal
          </p>
        </div>
      </div>
      <Card className="border-border/60">
        <CardContent className="pt-6 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="officer-name">Your Name</Label>
            <Input
              id="officer-name"
              placeholder="e.g. Dr. Priya Sharma"
              value={officerName}
              onChange={(e) => setOfficerName(e.target.value)}
              data-ocid="officer_registration.name_input"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Your College</Label>
            {collegesLoading ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <Select
                value={selectedCollegeId}
                onValueChange={setSelectedCollegeId}
              >
                <SelectTrigger data-ocid="officer_registration.college_select">
                  <SelectValue placeholder="Select a college" />
                </SelectTrigger>
                <SelectContent>
                  {(colleges ?? []).map((c) => (
                    <SelectItem key={String(c.id)} value={String(c.id)}>
                      {c.name} — {c.country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <div className="rounded-lg bg-yellow-500/10 border border-yellow-500/20 p-3 text-sm text-muted-foreground flex items-start gap-2">
            <Clock className="h-4 w-4 mt-0.5 shrink-0 text-yellow-600" />
            After registration you will need to upload a government ID. You can
            use the portal while your verification is pending.
          </div>
          <Button
            onClick={handleRegister}
            disabled={
              registerMutation.isPending ||
              !selectedCollegeId ||
              !officerName.trim()
            }
            className="w-full"
            data-ocid="officer_registration.submit_button"
          >
            {registerMutation.isPending
              ? "Registering…"
              : "Complete Registration"}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function OfficerProfileBanner({ profile }: { profile: AdmissionOfficer }) {
  const { actor } = useActor(createActor);
  const officerProfileQuery = useQuery<OfficerProfile | null>({
    queryKey: ["officerProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getOfficerProfile();
    },
    enabled: !!actor,
  });
  const verificationStatus: OfficerVerificationStatus =
    officerProfileQuery.data?.verificationStatus ??
    ("pending" as OfficerVerificationStatus);

  return (
    <Card className="bg-primary/5 border-primary/20">
      <CardContent className="pt-4 flex flex-wrap items-center gap-4 justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="font-semibold">{profile.name}</p>
            <p className="text-sm text-muted-foreground">Admission Officer</p>
            <div className="mt-1">{verificationBadge(verificationStatus)}</div>
          </div>
        </div>
        <IDVerificationUpload
          currentStatus={verificationStatus}
          officerName={profile.name}
        />
      </CardContent>
    </Card>
  );
}

function IDVerificationUpload({
  currentStatus,
  officerName,
}: { currentStatus: OfficerVerificationStatus; officerName: string }) {
  const { actor } = useActor(createActor);
  const [filename, setFilename] = useState("");
  const [title, setTitle] = useState("");

  const submitMutation = useMutation({
    mutationFn: async (govIdFilename: string) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.submitOfficerProfile(
        officerName,
        title || "Admission Officer",
        govIdFilename,
      );
    },
    onSuccess: () =>
      toast.success("ID submitted for verification! Status: Pending review."),
    onError: () => toast.error("Submission failed. Please try again."),
  });

  if (currentStatus === "verified") {
    return (
      <div className="flex items-center gap-2 text-sm text-green-600">
        <ShieldCheck className="h-4 w-4" />
        <span>Identity Verified</span>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col gap-2 min-w-[260px]"
      data-ocid="officer.id_upload_section"
    >
      <Label className="text-xs text-muted-foreground">
        🪪 Upload Government ID (Passport / Driver License / National ID)
      </Label>
      <Input
        placeholder="Your title (e.g. Director of Admissions)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="h-8 text-sm"
        data-ocid="officer.id_title_input"
      />
      <div className="flex gap-2">
        <Input
          type="file"
          accept="image/*,.pdf"
          className="h-8 text-xs"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) setFilename(f.name);
          }}
          data-ocid="officer.id_file_input"
        />
        <Button
          size="sm"
          disabled={!filename || submitMutation.isPending}
          onClick={() => submitMutation.mutate(filename)}
          data-ocid="officer.id_upload_button"
        >
          <UploadCloud className="h-3.5 w-3.5 mr-1" /> Submit
        </Button>
      </div>
    </div>
  );
}

function MainDashboard({
  officerProfile,
}: { officerProfile: AdmissionOfficer }) {
  return (
    <Tabs defaultValue="applications" data-ocid="officer_dashboard.tabs">
      <TabsList className="mb-4 grid grid-cols-4 w-full">
        <TabsTrigger
          value="applications"
          data-ocid="officer_dashboard.applications_tab"
        >
          <FileText className="h-4 w-4 mr-1.5" />
          Applications
        </TabsTrigger>
        <TabsTrigger
          value="communication"
          data-ocid="officer_dashboard.communication_tab"
        >
          <Mail className="h-4 w-4 mr-1.5" />
          Communication
        </TabsTrigger>
        <TabsTrigger
          value="analytics"
          data-ocid="officer_dashboard.analytics_tab"
        >
          <BarChart3 className="h-4 w-4 mr-1.5" />
          Analytics
        </TabsTrigger>
        <TabsTrigger
          value="recruitment"
          data-ocid="officer_dashboard.recruitment_tab"
        >
          <Users className="h-4 w-4 mr-1.5" />
          Recruitment
        </TabsTrigger>
      </TabsList>
      <TabsContent value="applications">
        <ApplicationsTab officerProfile={officerProfile} />
      </TabsContent>
      <TabsContent value="communication">
        <CommunicationTab />
      </TabsContent>
      <TabsContent value="analytics">
        <AnalyticsTab />
      </TabsContent>
      <TabsContent value="recruitment">
        <RecruitmentTab />
      </TabsContent>
    </Tabs>
  );
}

type AppStatus = "pending" | "accepted" | "waitlisted" | "rejected";

function ApplicationsTab({
  officerProfile,
}: { officerProfile: AdmissionOfficer }) {
  const [appStatuses, setAppStatuses] = useState<Record<number, AppStatus>>(
    Object.fromEntries(
      MOCK_APPLICATIONS.map((a) => [a.id, "pending" as AppStatus]),
    ),
  );
  const [showScores, setShowScores] = useState(false);
  const [bulkView, setBulkView] = useState(false);

  const { data: existingContent, isLoading: contentLoading } =
    useOfficerContent(officerProfile.collegeId);
  const postContentMutation = usePostOfficerContent();
  const { data: colleges } = useColleges();
  const collegeName =
    colleges?.find((c) => c.id === officerProfile.collegeId)?.name ??
    `College #${String(officerProfile.collegeId)}`;

  const [form, setForm] = useState({
    contentType: "tip",
    title: "",
    body: "",
    videoUrl: "",
  });

  const handlePost = async () => {
    if (!form.title.trim() || !form.body.trim()) {
      toast.error("Title and body are required.");
      return;
    }
    const input: OfficerContentInput = {
      collegeId: officerProfile.collegeId,
      contentType: form.contentType as OfficerContentInput["contentType"],
      title: form.title.trim(),
      body: form.body.trim(),
      ...(form.contentType === "video" && form.videoUrl.trim()
        ? { videoUrl: form.videoUrl.trim() }
        : {}),
    };
    try {
      await postContentMutation.mutateAsync(input);
      toast.success("Content posted!");
      setForm({ contentType: "tip", title: "", body: "", videoUrl: "" });
    } catch {
      toast.error("Failed to post.");
    }
  };

  return (
    <div className="space-y-6" data-ocid="officer_dashboard.applications_panel">
      <div className="flex flex-wrap gap-2">
        <Button
          variant={showScores ? "default" : "outline"}
          size="sm"
          onClick={() => setShowScores((s) => !s)}
          data-ocid="officer_dashboard.ai_scorer_button"
        >
          🤖 {showScores ? "Hide AI Scores" : "Show AI Scores"}
        </Button>
        <Button
          variant={bulkView ? "default" : "outline"}
          size="sm"
          onClick={() => setBulkView((s) => !s)}
          data-ocid="officer_dashboard.bulk_reviewer_button"
        >
          📋 {bulkView ? "List View" : "Bulk Reviewer"}
        </Button>
      </div>

      {bulkView && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          data-ocid="officer_dashboard.bulk_reviewer_panel"
        >
          {MOCK_APPLICATIONS.slice(0, 3).map((app, idx) => (
            <BulkAppCard
              key={app.id}
              app={app}
              index={idx + 1}
              status={appStatuses[app.id]}
              aiScore={showScores ? calcAiScore(app) : null}
              onStatusChange={(s) =>
                setAppStatuses((prev) => ({ ...prev, [app.id]: s }))
              }
            />
          ))}
        </motion.div>
      )}

      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          All Applications ({MOCK_APPLICATIONS.length})
        </h3>
        <div className="divide-y divide-border/40 rounded-xl border border-border/60 overflow-hidden">
          {MOCK_APPLICATIONS.map((app, idx) => (
            <ApplicationRow
              key={app.id}
              app={app}
              index={idx + 1}
              status={appStatuses[app.id]}
              aiScore={showScores ? calcAiScore(app) : null}
              onStatusChange={(s) =>
                setAppStatuses((prev) => ({ ...prev, [app.id]: s }))
              }
            />
          ))}
        </div>
      </div>

      <Card
        className="border-border/60"
        data-ocid="officer_dashboard.post_form"
      >
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            Post Content to Students
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label>Content Type</Label>
              <Select
                value={form.contentType}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, contentType: v }))
                }
              >
                <SelectTrigger data-ocid="officer_dashboard.content_type_select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tip">💡 Tip</SelectItem>
                  <SelectItem value="insight">🔍 Insight</SelectItem>
                  <SelectItem value="video">🎥 Video Link</SelectItem>
                  <SelectItem value="announcement">📢 Announcement</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Title</Label>
              <Input
                placeholder="e.g. What we look for in applicants"
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                data-ocid="officer_dashboard.title_input"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Body</Label>
            <Textarea
              placeholder="Share advice, insight, or an announcement…"
              value={form.body}
              onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
              className="min-h-[100px] resize-none"
              data-ocid="officer_dashboard.body_textarea"
            />
          </div>
          {form.contentType === "video" && (
            <div className="flex flex-col gap-2">
              <Label>Video URL</Label>
              <Input
                placeholder="https://youtube.com/watch?v=…"
                value={form.videoUrl}
                onChange={(e) =>
                  setForm((f) => ({ ...f, videoUrl: e.target.value }))
                }
                data-ocid="officer_dashboard.video_url_input"
              />
            </div>
          )}
          <div className="rounded-lg bg-accent/10 border border-accent/20 p-3 text-sm text-muted-foreground flex items-start gap-2">
            <Info className="h-4 w-4 mt-0.5 shrink-0 text-accent" />
            Content will appear on the{" "}
            <span className="font-medium text-foreground">{collegeName}</span>{" "}
            detail page for students.
          </div>
          <Button
            onClick={handlePost}
            disabled={
              postContentMutation.isPending ||
              !form.title.trim() ||
              !form.body.trim()
            }
            data-ocid="officer_dashboard.submit_button"
          >
            {postContentMutation.isPending ? "Posting…" : "Post Content"}
          </Button>
        </CardContent>
      </Card>

      <div data-ocid="officer_dashboard.content_list">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Your Posted Content
        </h3>
        {contentLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : !existingContent || existingContent.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 py-10 text-center gap-2"
            data-ocid="officer_dashboard.empty_state"
          >
            <FileText className="h-7 w-7 text-muted-foreground/40" />
            <p className="text-muted-foreground">No content posted yet</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {existingContent.map((item, idx) => (
              <ContentCard key={String(item.id)} item={item} index={idx + 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ApplicationRow({
  app,
  index,
  status,
  aiScore,
  onStatusChange,
}: {
  app: (typeof MOCK_APPLICATIONS)[0];
  index: number;
  status: AppStatus;
  aiScore: number | null;
  onStatusChange: (s: AppStatus) => void;
}) {
  const statusColors: Record<AppStatus, string> = {
    pending: "bg-muted text-muted-foreground",
    accepted: "bg-green-500/10 text-green-600",
    waitlisted: "bg-yellow-500/10 text-yellow-600",
    rejected: "bg-destructive/10 text-destructive",
  };
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 bg-card hover:bg-muted/30 transition-colors"
      data-ocid={`officer_dashboard.application_row.item.${index}`}
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary shrink-0">
        {app.name.charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{app.name}</p>
        <p className="text-xs text-muted-foreground">
          {app.major} · GPA {app.gpa} · SAT {app.sat} ·{" "}
          <MapPin className="inline h-2.5 w-2.5" /> {app.country}
        </p>
      </div>
      {aiScore !== null && (
        <div
          className={`text-sm font-bold px-2 py-0.5 rounded-full ${aiScore >= 80 ? "bg-green-500/10 text-green-600" : aiScore >= 60 ? "bg-yellow-500/10 text-yellow-600" : "bg-red-500/10 text-red-600"}`}
          data-ocid={`officer_dashboard.ai_score.item.${index}`}
        >
          🤖 {aiScore}
        </div>
      )}
      <Badge className={`text-xs shrink-0 ${statusColors[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
      <Select
        value={status}
        onValueChange={(v) => onStatusChange(v as AppStatus)}
      >
        <SelectTrigger
          className="w-32 h-7 text-xs"
          data-ocid={`officer_dashboard.status_select.item.${index}`}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pending">⏳ Pending</SelectItem>
          <SelectItem value="accepted">✅ Accept</SelectItem>
          <SelectItem value="waitlisted">🟡 Waitlist</SelectItem>
          <SelectItem value="rejected">❌ Reject</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

function BulkAppCard({
  app,
  index,
  status,
  aiScore,
  onStatusChange,
}: {
  app: (typeof MOCK_APPLICATIONS)[0];
  index: number;
  status: AppStatus;
  aiScore: number | null;
  onStatusChange: (s: AppStatus) => void;
}) {
  return (
    <Card
      className="border-border/60"
      data-ocid={`officer_dashboard.bulk_card.item.${index}`}
    >
      <CardContent className="pt-4 space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
            {app.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm truncate">{app.name}</p>
            <p className="text-xs text-muted-foreground">{app.country}</p>
          </div>
        </div>
        <div className="text-xs space-y-1 text-muted-foreground">
          <div className="flex justify-between">
            <span>Major</span>
            <span className="font-medium text-foreground">{app.major}</span>
          </div>
          <div className="flex justify-between">
            <span>GPA</span>
            <span className="font-medium text-foreground">{app.gpa}</span>
          </div>
          <div className="flex justify-between">
            <span>SAT</span>
            <span className="font-medium text-foreground">{app.sat}</span>
          </div>
          {aiScore !== null && (
            <div className="flex justify-between">
              <span>AI Score</span>
              <span
                className={`font-bold ${aiScore >= 80 ? "text-green-600" : aiScore >= 60 ? "text-yellow-600" : "text-red-600"}`}
              >
                {aiScore}/100
              </span>
            </div>
          )}
        </div>
        <Select
          value={status}
          onValueChange={(v) => onStatusChange(v as AppStatus)}
        >
          <SelectTrigger
            className="h-8 text-xs w-full"
            data-ocid={`officer_dashboard.bulk_status_select.item.${index}`}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">⏳ Pending</SelectItem>
            <SelectItem value="accepted">✅ Accept</SelectItem>
            <SelectItem value="waitlisted">🟡 Waitlist</SelectItem>
            <SelectItem value="rejected">❌ Reject</SelectItem>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}

function CommunicationTab() {
  const [emailForm, setEmailForm] = useState({
    to: "all",
    subject: "",
    body: "",
  });
  const [acceptTemplate, setAcceptTemplate] = useState(
    "Dear {studentName},\n\nWe are thrilled to inform you that your application to {major} has been reviewed and we are delighted to offer you {decision}.\n\nYour academic achievement stood out to our admissions committee. We look forward to welcoming you to our campus.\n\nWarm regards,\nThe Admissions Office",
  );
  const [rejectTemplate, setRejectTemplate] = useState(
    "Dear {studentName},\n\nThank you for your interest in our {major} program. After careful consideration, we regret to inform you that we are unable to offer you {decision} at this time.\n\nWe encourage you to continue pursuing your academic goals.\n\nWarm regards,\nThe Admissions Office",
  );

  const handleSendEmail = () => {
    if (!emailForm.subject.trim() || !emailForm.body.trim()) {
      toast.error("Subject and body are required.");
      return;
    }
    toast.success("📧 Queued! Email will be sent to all applicants.");
    setEmailForm((f) => ({ ...f, subject: "", body: "" }));
  };

  return (
    <div
      className="space-y-6"
      data-ocid="officer_dashboard.communication_panel"
    >
      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Send className="h-4 w-4 text-primary" />📨 Mass Email Composer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label>To</Label>
            <Select
              value={emailForm.to}
              onValueChange={(v) => setEmailForm((f) => ({ ...f, to: v }))}
            >
              <SelectTrigger data-ocid="officer_communication.to_select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Applicants</SelectItem>
                <SelectItem value="accepted">Accepted Students</SelectItem>
                <SelectItem value="waitlisted">Waitlisted Students</SelectItem>
                <SelectItem value="rejected">Rejected Students</SelectItem>
                <SelectItem value="international">
                  International Applicants
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Subject</Label>
            <Input
              placeholder="e.g. Important update regarding your application"
              value={emailForm.subject}
              onChange={(e) =>
                setEmailForm((f) => ({ ...f, subject: e.target.value }))
              }
              data-ocid="officer_communication.subject_input"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Message</Label>
            <Textarea
              placeholder="Compose your message here…"
              value={emailForm.body}
              onChange={(e) =>
                setEmailForm((f) => ({ ...f, body: e.target.value }))
              }
              className="min-h-[120px] resize-none"
              data-ocid="officer_communication.body_textarea"
            />
          </div>
          <Button
            onClick={handleSendEmail}
            data-ocid="officer_communication.send_button"
          >
            <Send className="h-4 w-4 mr-2" /> Send Email
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />✅ Acceptance
              Letter Template
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-muted-foreground">
              Variables: <code>{"{studentName}"}</code>,{" "}
              <code>{"{major}"}</code>, <code>{"{decision}"}</code>
            </p>
            <Textarea
              value={acceptTemplate}
              onChange={(e) => setAcceptTemplate(e.target.value)}
              className="min-h-[200px] text-xs resize-none font-mono"
              data-ocid="officer_communication.acceptance_template_textarea"
            />
            <Button
              size="sm"
              variant="outline"
              className="w-full"
              onClick={() => toast.success("Acceptance template saved!")}
              data-ocid="officer_communication.acceptance_template_save_button"
            >
              Save Template
            </Button>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-destructive" />❌ Rejection
              Letter Template
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-muted-foreground">
              Variables: <code>{"{studentName}"}</code>,{" "}
              <code>{"{major}"}</code>, <code>{"{decision}"}</code>
            </p>
            <Textarea
              value={rejectTemplate}
              onChange={(e) => setRejectTemplate(e.target.value)}
              className="min-h-[200px] text-xs resize-none font-mono"
              data-ocid="officer_communication.rejection_template_textarea"
            />
            <Button
              size="sm"
              variant="outline"
              className="w-full"
              onClick={() => toast.success("Rejection template saved!")}
              data-ocid="officer_communication.rejection_template_save_button"
            >
              Save Template
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AnalyticsTab() {
  return (
    <div className="space-y-6" data-ocid="officer_dashboard.analytics_panel">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Applications", value: "559", emoji: "📋" },
          { label: "Acceptance Rate", value: "18.4%", emoji: "🎯" },
          { label: "International Apps", value: "112", emoji: "🌍" },
        ].map((stat) => (
          <Card key={stat.label} className="border-border/60">
            <CardContent className="pt-4 text-center">
              <p className="text-3xl mb-1">{stat.emoji}</p>
              <p className="text-2xl font-display font-bold text-primary">
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border/60">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" />📈 Monthly Application
            Trend (Jan – Jun)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={MONTHLY_APPS}
              margin={{ top: 4, right: 8, bottom: 0, left: -16 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="currentColor"
                strokeOpacity={0.1}
              />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                  background: "hsl(var(--card))",
                  borderColor: "hsl(var(--border))",
                }}
              />
              <Bar
                dataKey="applications"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">🌈 Diversity Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={DIVERSITY_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {DIVERSITY_DATA.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    fontSize: 12,
                    borderRadius: 8,
                    background: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                  }}
                  formatter={(value: number) => [`${value}%`, ""]}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 11 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">
              <MapPin className="inline h-3.5 w-3.5 mr-1 text-primary" />📍
              Geographic Distribution (Top 5)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={GEO_DATA}
                layout="vertical"
                margin={{ top: 4, right: 16, bottom: 0, left: 16 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="currentColor"
                  strokeOpacity={0.1}
                  horizontal={false}
                />
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis
                  type="category"
                  dataKey="region"
                  tick={{ fontSize: 10 }}
                  width={70}
                />
                <Tooltip
                  contentStyle={{
                    fontSize: 12,
                    borderRadius: 8,
                    background: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                  }}
                />
                <Bar
                  dataKey="count"
                  fill="hsl(var(--accent))"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function RecruitmentTab() {
  const [profile, setProfile] = useState({
    collegeName: "",
    description: "",
    major1: "",
    major2: "",
    major3: "",
    housing: "",
  });
  const [visit, setVisit] = useState({
    date: "",
    visitorName: "",
    visitorEmail: "",
  });

  const handleSaveProfile = () => {
    if (!profile.collegeName.trim()) {
      toast.error("College name is required.");
      return;
    }
    localStorage.setItem("officerCollegeProfile", JSON.stringify(profile));
    toast.success("🏫 College profile saved!");
  };

  const handleScheduleVisit = () => {
    if (
      !visit.date ||
      !visit.visitorName.trim() ||
      !visit.visitorEmail.trim()
    ) {
      toast.error("Please fill in all visit details.");
      return;
    }
    toast.success(
      `📅 Visit Scheduled! ${visit.visitorName} on ${new Date(visit.date).toLocaleDateString()}.`,
    );
    setVisit({ date: "", visitorName: "", visitorEmail: "" });
  };

  return (
    <div className="space-y-6" data-ocid="officer_dashboard.recruitment_panel">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />🏫 College Profile
              Builder
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-col gap-1.5">
              <Label>College Name</Label>
              <Input
                placeholder="e.g. Stanford University"
                value={profile.collegeName}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, collegeName: e.target.value }))
                }
                data-ocid="officer_recruitment.college_name_input"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Description</Label>
              <Textarea
                placeholder="Describe what makes your college unique…"
                value={profile.description}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, description: e.target.value }))
                }
                className="min-h-[80px] resize-none text-sm"
                data-ocid="officer_recruitment.college_description_textarea"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(["major1", "major2", "major3"] as const).map((key, i) => (
                <div key={key} className="flex flex-col gap-1.5">
                  <Label className="text-xs">Top Major {i + 1}</Label>
                  <Input
                    placeholder={["CS", "Business", "Biology"][i]}
                    value={profile[key]}
                    onChange={(e) =>
                      setProfile((p) => ({ ...p, [key]: e.target.value }))
                    }
                    className="text-sm"
                    data-ocid={`officer_recruitment.major${i + 1}_input`}
                  />
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Housing Options</Label>
              <Input
                placeholder="e.g. On-campus dorms, off-campus apartments"
                value={profile.housing}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, housing: e.target.value }))
                }
                data-ocid="officer_recruitment.housing_input"
              />
            </div>
            <Button
              onClick={handleSaveProfile}
              className="w-full"
              data-ocid="officer_recruitment.save_profile_button"
            >
              Save College Profile
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />📅 Campus Visit
              Scheduler
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-col gap-1.5">
              <Label>Visit Date</Label>
              <Input
                type="date"
                value={visit.date}
                onChange={(e) =>
                  setVisit((v) => ({ ...v, date: e.target.value }))
                }
                min={new Date().toISOString().split("T")[0]}
                data-ocid="officer_recruitment.visit_date_input"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Visitor Name</Label>
              <Input
                placeholder="e.g. Rahul Sharma"
                value={visit.visitorName}
                onChange={(e) =>
                  setVisit((v) => ({ ...v, visitorName: e.target.value }))
                }
                data-ocid="officer_recruitment.visitor_name_input"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Visitor Email</Label>
              <Input
                type="email"
                placeholder="e.g. rahul@email.com"
                value={visit.visitorEmail}
                onChange={(e) =>
                  setVisit((v) => ({ ...v, visitorEmail: e.target.value }))
                }
                data-ocid="officer_recruitment.visitor_email_input"
              />
            </div>
            <div className="rounded-lg bg-primary/5 border border-primary/20 p-3 text-xs text-muted-foreground">
              <Info className="inline h-3.5 w-3.5 mr-1 text-primary" />
              Visitor will receive a confirmation with campus directions and
              schedule.
            </div>
            <Button
              onClick={handleScheduleVisit}
              className="w-full"
              data-ocid="officer_recruitment.schedule_visit_button"
            >
              <Calendar className="h-4 w-4 mr-2" /> Schedule Visit
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ContentCard({ item, index }: { item: OfficerContent; index: number }) {
  const meta = CONTENT_TYPE_META[item.contentType] ?? CONTENT_TYPE_META.tip;
  return (
    <Card
      className="border-border/60 hover:border-border transition-colors"
      data-ocid={`officer_dashboard.content_list.item.${index}`}
    >
      <CardContent className="pt-4 pb-4">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <Badge
                variant="outline"
                className={`text-xs flex items-center gap-1 ${meta.badgeClass}`}
              >
                {meta.icon}
                {meta.label}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {formatDate(item.timestamp)}
              </span>
            </div>
            <h3 className="font-semibold text-foreground truncate">
              {item.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {item.body}
            </p>
            {item.videoUrl && (
              <a
                href={item.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-2 text-xs text-primary hover:underline"
                data-ocid={`officer_dashboard.content_list.item.${index}.link`}
              >
                <Play className="h-3 w-3" /> Watch video
              </a>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
