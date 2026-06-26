import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  Bell,
  CheckCircle,
  KeyRound,
  Search,
  Shield,
  Users,
  Video,
  XCircle,
} from "lucide-react";
import { useState } from "react";

const ADMIN_NAME = "M.Divij Vedanth";
const ADMIN_EMAIL = "attic6411@gmail.com";

type UserStatus = "active" | "banned";
type VerificationStatus = "pending" | "approved" | "rejected";
type ContentStatus = "pending" | "approved" | "removed";

interface MockUser {
  id: string;
  name: string;
  email: string;
  joinedDate: string;
  status: UserStatus;
  profileComplete: boolean;
}

interface MockOfficer {
  id: string;
  name: string;
  email: string;
  college: string;
  idType: string;
  submittedDate: string;
  verificationStatus: VerificationStatus;
}

interface MockContent {
  id: string;
  officerName: string;
  college: string;
  type: "tip" | "video";
  preview: string;
  submittedDate: string;
  status: ContentStatus;
}

const MOCK_USERS: MockUser[] = [
  {
    id: "u1",
    name: "Arjun Sharma",
    email: "arjun@example.com",
    joinedDate: "2024-11-03",
    status: "active",
    profileComplete: true,
  },
  {
    id: "u2",
    name: "Priya Nair",
    email: "priya@example.com",
    joinedDate: "2024-12-15",
    status: "active",
    profileComplete: true,
  },
  {
    id: "u3",
    name: "Rohan Mehta",
    email: "rohan@example.com",
    joinedDate: "2025-01-08",
    status: "active",
    profileComplete: false,
  },
  {
    id: "u4",
    name: "Sneha Iyer",
    email: "sneha@example.com",
    joinedDate: "2025-02-20",
    status: "banned",
    profileComplete: true,
  },
  {
    id: "u5",
    name: "Kiran Das",
    email: "kiran@example.com",
    joinedDate: "2025-03-11",
    status: "active",
    profileComplete: false,
  },
];

const MOCK_OFFICERS: MockOfficer[] = [
  {
    id: "o1",
    name: "Dr. Anita Desai",
    email: "anita@mit.edu",
    college: "MIT",
    idType: "Government ID",
    submittedDate: "2025-04-01",
    verificationStatus: "pending",
  },
  {
    id: "o2",
    name: "Prof. Samuel White",
    email: "swhite@stanford.edu",
    college: "Stanford University",
    idType: "Institutional ID",
    submittedDate: "2025-04-05",
    verificationStatus: "pending",
  },
  {
    id: "o3",
    name: "Ms. Fatima Al-Hassan",
    email: "fatima@oxford.edu",
    college: "University of Oxford",
    idType: "Passport",
    submittedDate: "2025-04-10",
    verificationStatus: "approved",
  },
  {
    id: "o4",
    name: "Mr. David Park",
    email: "dpark@uchicago.edu",
    college: "University of Chicago",
    idType: "Driver License",
    submittedDate: "2025-04-12",
    verificationStatus: "pending",
  },
];

const MOCK_CONTENT: MockContent[] = [
  {
    id: "c1",
    officerName: "Dr. Anita Desai",
    college: "MIT",
    type: "tip",
    preview:
      "We value students who demonstrate genuine curiosity through research or independent projects.",
    submittedDate: "2025-04-08",
    status: "pending",
  },
  {
    id: "c2",
    officerName: "Prof. Samuel White",
    college: "Stanford University",
    type: "video",
    preview: "Introduction to our admissions process — 5 min overview",
    submittedDate: "2025-04-09",
    status: "pending",
  },
  {
    id: "c3",
    officerName: "Ms. Fatima Al-Hassan",
    college: "University of Oxford",
    type: "tip",
    preview:
      "The personal statement should focus on intellectual curiosity, not achievements alone.",
    submittedDate: "2025-04-11",
    status: "approved",
  },
];

function OverviewStats() {
  const totalUsers = MOCK_USERS.length;
  const pendingOfficers = MOCK_OFFICERS.filter(
    (o) => o.verificationStatus === "pending",
  ).length;
  const activeUsers = MOCK_USERS.filter((u) => u.status === "active").length;
  const pendingContent = MOCK_CONTENT.filter(
    (c) => c.status === "pending",
  ).length;

  const stats = [
    {
      label: "Total Users",
      value: totalUsers,
      sub: `${activeUsers} active`,
      icon: Users,
    },
    {
      label: "Pending Officer Verifications",
      value: pendingOfficers,
      sub: "awaiting review",
      icon: Shield,
    },
    {
      label: "Active Profiles",
      value: MOCK_USERS.filter((u) => u.profileComplete).length,
      sub: "fully completed",
      icon: CheckCircle,
    },
    {
      label: "Content Awaiting Review",
      value: pendingContent,
      sub: "tips and videos",
      icon: Video,
    },
  ];

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      data-ocid="admin.overview.section"
    >
      {stats.map((s) => (
        <Card key={s.label} className="border border-border bg-card">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                  {s.label}
                </p>
                <p className="text-3xl font-display font-bold text-foreground mt-1">
                  {s.value}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.sub}</p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <s.icon className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function UserManagementTab() {
  const [users, setUsers] = useState<MockUser[]>(MOCK_USERS);
  const [search, setSearch] = useState("");

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  const toggle = (id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "active" ? "banned" : "active" }
          : u,
      ),
    );
  };

  return (
    <div className="space-y-4" data-ocid="admin.users.section">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
          data-ocid="admin.users.search_input"
        />
      </div>
      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-foreground">
                Name
              </th>
              <th className="text-left px-4 py-3 font-semibold text-foreground hidden sm:table-cell">
                Email
              </th>
              <th className="text-left px-4 py-3 font-semibold text-foreground hidden md:table-cell">
                Joined
              </th>
              <th className="text-left px-4 py-3 font-semibold text-foreground">
                Status
              </th>
              <th className="text-right px-4 py-3 font-semibold text-foreground">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((u, i) => (
              <tr
                key={u.id}
                className="bg-card hover:bg-muted/20 transition-colors"
                data-ocid={`admin.users.item.${i + 1}`}
              >
                <td className="px-4 py-3 font-medium text-foreground">
                  {u.name}
                </td>
                <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                  {u.email}
                </td>
                <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                  {u.joinedDate}
                </td>
                <td className="px-4 py-3">
                  <Badge
                    variant={u.status === "active" ? "default" : "destructive"}
                    className="text-xs"
                  >
                    {u.status === "active" ? "Active" : "Banned"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <Button
                    type="button"
                    size="sm"
                    variant={u.status === "active" ? "destructive" : "outline"}
                    onClick={() => toggle(u.id)}
                    data-ocid={`admin.users.toggle_button.${i + 1}`}
                  >
                    {u.status === "active" ? "Ban" : "Unban"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div
            className="text-center py-10 text-muted-foreground"
            data-ocid="admin.users.empty_state"
          >
            No users found.
          </div>
        )}
      </div>
    </div>
  );
}

function OfficerVerificationTab() {
  const [officers, setOfficers] = useState<MockOfficer[]>(MOCK_OFFICERS);

  const update = (id: string, status: VerificationStatus) => {
    setOfficers((prev) =>
      prev.map((o) => (o.id === id ? { ...o, verificationStatus: status } : o)),
    );
  };

  const pending = officers.filter((o) => o.verificationStatus === "pending");
  const reviewed = officers.filter((o) => o.verificationStatus !== "pending");

  return (
    <div className="space-y-6" data-ocid="admin.officers.section">
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">
          Pending Verification ({pending.length})
        </h3>
        <div className="space-y-3">
          {pending.length === 0 && (
            <p
              className="text-sm text-muted-foreground"
              data-ocid="admin.officers.empty_state"
            >
              No pending verifications.
            </p>
          )}
          {pending.map((o, i) => (
            <div
              key={o.id}
              className="flex items-start gap-4 rounded-lg border border-border bg-card p-4"
              data-ocid={`admin.officers.item.${i + 1}`}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/10 shrink-0">
                <Shield className="h-5 w-5 text-amber-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground text-sm">
                  {o.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {o.email} — {o.college}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  ID type: {o.idType} — Submitted: {o.submittedDate}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="gap-1.5 border-green-600 text-green-700 hover:bg-green-50"
                  onClick={() => update(o.id, "approved")}
                  data-ocid={`admin.officers.approve_button.${i + 1}`}
                >
                  <CheckCircle className="h-3.5 w-3.5" /> Approve
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="gap-1.5 border-red-500 text-red-600 hover:bg-red-50"
                  onClick={() => update(o.id, "rejected")}
                  data-ocid={`admin.officers.reject_button.${i + 1}`}
                >
                  <XCircle className="h-3.5 w-3.5" /> Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {reviewed.length > 0 && (
        <div>
          <Separator className="mb-4" />
          <h3 className="text-sm font-semibold text-foreground mb-3">
            Reviewed ({reviewed.length})
          </h3>
          <div className="space-y-2">
            {reviewed.map((o) => (
              <div
                key={o.id}
                className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-4 py-3"
              >
                <Badge
                  variant={
                    o.verificationStatus === "approved"
                      ? "default"
                      : "destructive"
                  }
                  className="text-xs capitalize"
                >
                  {o.verificationStatus}
                </Badge>
                <span className="text-sm font-medium text-foreground">
                  {o.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {o.college}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ContentModerationTab() {
  const [items, setItems] = useState<MockContent[]>(MOCK_CONTENT);

  const update = (id: string, status: ContentStatus) => {
    setItems((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
  };

  const pending = items.filter((c) => c.status === "pending");
  const reviewed = items.filter((c) => c.status !== "pending");

  return (
    <div className="space-y-6" data-ocid="admin.content.section">
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">
          Awaiting Review ({pending.length})
        </h3>
        {pending.length === 0 && (
          <p
            className="text-sm text-muted-foreground"
            data-ocid="admin.content.empty_state"
          >
            No content pending review.
          </p>
        )}
        <div className="space-y-3">
          {pending.map((c, i) => (
            <div
              key={c.id}
              className="rounded-lg border border-border bg-card p-4"
              data-ocid={`admin.content.item.${i + 1}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs capitalize">
                      {c.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {c.officerName} — {c.college}
                    </span>
                  </div>
                  <p className="text-sm text-foreground">{c.preview}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Submitted: {c.submittedDate}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="gap-1.5 border-green-600 text-green-700 hover:bg-green-50"
                    onClick={() => update(c.id, "approved")}
                    data-ocid={`admin.content.approve_button.${i + 1}`}
                  >
                    <CheckCircle className="h-3.5 w-3.5" /> Approve
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="gap-1.5 border-red-500 text-red-600 hover:bg-red-50"
                    onClick={() => update(c.id, "removed")}
                    data-ocid={`admin.content.remove_button.${i + 1}`}
                  >
                    <XCircle className="h-3.5 w-3.5" /> Remove
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {reviewed.length > 0 && (
        <div>
          <Separator className="mb-4" />
          <h3 className="text-sm font-semibold text-foreground mb-3">
            Reviewed ({reviewed.length})
          </h3>
          <div className="space-y-2">
            {reviewed.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-4 py-3"
              >
                <Badge
                  variant={c.status === "approved" ? "default" : "destructive"}
                  className="text-xs capitalize"
                >
                  {c.status}
                </Badge>
                <span className="text-sm text-foreground">
                  {c.preview.slice(0, 60)}…
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function AnnouncementsTab() {
  const [message, setMessage] = useState("");
  const [published, setPublished] = useState<{ id: number; text: string }[]>(
    [],
  );
  const [nextId, setNextId] = useState(1);
  const [success, setSuccess] = useState(false);

  const post = () => {
    if (!message.trim()) return;
    setPublished((prev) => [{ id: nextId, text: message.trim() }, ...prev]);
    setNextId((n) => n + 1);
    setMessage("");
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="space-y-5" data-ocid="admin.announcements.section">
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Post a site-wide message that appears at the top of the app for all
          users.
        </p>
        <Textarea
          placeholder="Type your announcement here…"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className="resize-none"
          data-ocid="admin.announcements.textarea"
        />
        <div className="flex items-center gap-3">
          <Button
            type="button"
            onClick={post}
            disabled={!message.trim()}
            data-ocid="admin.announcements.submit_button"
          >
            <Bell className="mr-2 h-4 w-4" />
            Post Announcement
          </Button>
          {success && (
            <span
              className="text-sm text-green-600 font-medium"
              data-ocid="admin.announcements.success_state"
            >
              Announcement posted.
            </span>
          )}
        </div>
      </div>
      {published.length > 0 && (
        <div>
          <Separator className="mb-4" />
          <h3 className="text-sm font-semibold text-foreground mb-3">
            Posted ({published.length})
          </h3>
          <div className="space-y-2">
            {published.map((item, i) => (
              <div
                key={item.id}
                className="rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm text-foreground"
                data-ocid={`admin.announcements.item.${i + 1}`}
              >
                {item.text}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CredentialsTab() {
  return (
    <div className="space-y-4" data-ocid="admin.credentials.section">
      <p className="text-sm text-muted-foreground">
        These are the hardcoded admin credentials for this installation. Only
        this account can access this panel.
      </p>
      <div className="rounded-lg border border-border bg-muted/30 p-5 space-y-3">
        <div className="flex items-center gap-3">
          <KeyRound className="h-4 w-4 text-primary shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">
              Admin Name
            </p>
            <p className="text-sm font-mono font-semibold text-foreground mt-0.5">
              {ADMIN_NAME}
            </p>
          </div>
        </div>
        <Separator />
        <div className="flex items-center gap-3">
          <KeyRound className="h-4 w-4 text-primary shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">
              Admin Email
            </p>
            <p className="text-sm font-mono font-semibold text-foreground mt-0.5">
              {ADMIN_EMAIL}
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3">
        <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
        <p className="text-xs text-amber-800">
          This page is not linked from anywhere in the app. Access it only
          through the /admin command in Alumni Chat.
        </p>
      </div>
    </div>
  );
}

export default function SecretAdminPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background" data-ocid="secret_admin.page">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Shield className="h-4.5 w-4.5 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-display font-bold text-foreground">
                Admin Control Center
              </h1>
            </div>
            <p className="text-sm text-muted-foreground">
              DreamAdmit — Restricted Access
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => navigate({ to: "/" })}
            data-ocid="secret_admin.exit_button"
          >
            Exit
          </Button>
        </div>

        {/* Stats */}
        <OverviewStats />

        <div className="mt-8">
          <Tabs defaultValue="users">
            <TabsList className="mb-6 flex-wrap h-auto gap-1">
              <TabsTrigger value="users" data-ocid="secret_admin.users.tab">
                User Management
              </TabsTrigger>
              <TabsTrigger
                value="officers"
                data-ocid="secret_admin.officers.tab"
              >
                Officer Verification
              </TabsTrigger>
              <TabsTrigger value="content" data-ocid="secret_admin.content.tab">
                Content Moderation
              </TabsTrigger>
              <TabsTrigger
                value="announcements"
                data-ocid="secret_admin.announcements.tab"
              >
                Announcements
              </TabsTrigger>
              <TabsTrigger
                value="credentials"
                data-ocid="secret_admin.credentials.tab"
              >
                Admin Credentials
              </TabsTrigger>
            </TabsList>

            <Card className="border border-border bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold text-foreground">
                  <TabsContent value="users" className="mt-0">
                    User Management
                  </TabsContent>
                  <TabsContent value="officers" className="mt-0">
                    Officer Verification
                  </TabsContent>
                  <TabsContent value="content" className="mt-0">
                    Content Moderation
                  </TabsContent>
                  <TabsContent value="announcements" className="mt-0">
                    System Announcements
                  </TabsContent>
                  <TabsContent value="credentials" className="mt-0">
                    Admin Credentials
                  </TabsContent>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TabsContent value="users" className="mt-0">
                  <UserManagementTab />
                </TabsContent>
                <TabsContent value="officers" className="mt-0">
                  <OfficerVerificationTab />
                </TabsContent>
                <TabsContent value="content" className="mt-0">
                  <ContentModerationTab />
                </TabsContent>
                <TabsContent value="announcements" className="mt-0">
                  <AnnouncementsTab />
                </TabsContent>
                <TabsContent value="credentials" className="mt-0">
                  <CredentialsTab />
                </TabsContent>
              </CardContent>
            </Card>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
