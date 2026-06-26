import { AdminPanelModal } from "@/components/AdminPanelModal";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import {
  useAlumniMessages,
  useColleges,
  usePostAlumniMessage,
} from "@/hooks/useQueries";
import type { CollegeWithCommunity } from "@/types";
import type { AlumniMessage } from "@/types";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  ExternalLink,
  MessageCircle,
  MessageSquare,
  Send,
  Users,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

function getCommunityLinks(
  college: CollegeWithCommunity | undefined,
): Array<{ label: string; url: string; icon: string }> {
  if (!college) return [];
  const links: Array<{ label: string; url: string; icon: string }> = [];
  if (college.redditUrl) {
    const sub = college.redditUrl.replace(/.*\/r\/([^/]+).*/i, "$1");
    links.push({
      label: `Talk to alumni on r/${sub}`,
      url: college.redditUrl,
      icon: "reddit",
    });
  } else {
    const q = encodeURIComponent(`${college.name} students`);
    links.push({
      label: "Find alumni on Reddit",
      url: `https://www.reddit.com/search/?q=${q}`,
      icon: "reddit",
    });
  }
  if (college.discordUrl) {
    links.push({
      label: "Join student community on Discord",
      url: college.discordUrl,
      icon: "discord",
    });
  }
  return links;
}

function _formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(ts: number): string {
  const d = new Date(ts);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString([], {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function _groupByDate(
  messages: AlumniMessage[],
): Array<{ date: string; messages: AlumniMessage[] }> {
  const groups: Map<string, AlumniMessage[]> = new Map();
  for (const msg of messages) {
    const key = formatDate(Number(msg.timestamp));
    const existing = groups.get(key);
    if (existing) existing.push(msg);
    else groups.set(key, [msg]);
  }
  return Array.from(groups.entries()).map(([date, msgs]) => ({
    date,
    messages: msgs,
  }));
}

export default function AlumniChatCollegePage() {
  const { collegeId } = useParams({ from: "/alumni-chat/$collegeId" });
  const collegeIdBigInt = BigInt(collegeId);
  const { data: messages, isLoading } = useAlumniMessages(collegeIdBigInt);
  const { data: colleges } = useColleges();
  const college = (colleges as CollegeWithCommunity[] | undefined)?.find(
    (c) => String(c.id) === collegeId,
  );
  const communityLinks = getCommunityLinks(college);
  const postMutation = usePostAlumniMessage();
  const [newMessage, setNewMessage] = useState("");
  const [adminModalOpen, setAdminModalOpen] = useState(false);

  const handlePost = async () => {
    const trimmed = newMessage.trim();
    if (!trimmed) return;
    // /admin command: open admin panel without posting
    if (trimmed === "/admin") {
      setNewMessage("");
      setAdminModalOpen(true);
      return;
    }
    await postMutation.mutateAsync({
      collegeId: collegeIdBigInt,
      message: newMessage,
    });
    setNewMessage("");
  };

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <Link
          to="/alumni-chat"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back to Alumni Chat
        </Link>
        <div className="flex items-center gap-3 mt-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <MessageCircle className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            {college
              ? `${college.name} — Alumni Chat`
              : "College Community Chat"}
          </h1>
        </div>
      </div>
      {communityLinks.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {communityLinks.map((link) => (
            <a
              key={link.icon}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              data-ocid={`alumni-chat.${link.icon}_link`}
            >
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5"
              >
                <ExternalLink className="h-3.5 w-3.5" /> {link.label}
              </Button>
            </a>
          ))}
        </div>
      )}
      <div
        className="space-y-3 mb-4 min-h-[200px]"
        data-ocid="alumni-chat.messages_list"
      >
        {isLoading && (
          <div data-ocid="alumni-chat.loading_state">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3 items-start mb-3">
                <div className="h-8 w-8 rounded-full bg-muted animate-pulse shrink-0" />
                <div className="flex-1 space-y-1">
                  <div className="h-3 w-24 bg-muted animate-pulse rounded" />
                  <div className="h-4 w-full bg-muted animate-pulse rounded" />
                </div>
              </div>
            ))}
          </div>
        )}
        {!isLoading &&
          messages &&
          messages.length > 0 &&
          messages.map((msg, i) => (
            <Card
              key={String(msg.messageId)}
              data-ocid={`alumni-chat.message.${i + 1}`}
            >
              <CardContent className="pt-4 flex gap-3">
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback className="text-xs bg-primary/10 text-primary">
                    {msg.authorName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-sm font-medium">{msg.authorName}</p>
                  <p className="text-sm text-muted-foreground mt-0.5 break-words">
                    {msg.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(Number(msg.timestamp)).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        {!isLoading && (!messages || messages.length === 0) && (
          <Card data-ocid="alumni-chat.empty_state">
            <CardContent className="text-center py-10">
              <MessageCircle className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                Be the first to start the conversation!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
      <div className="space-y-2">
        <Textarea
          data-ocid="alumni-chat.message_textarea"
          placeholder="Share your experience or ask a question…"
          className="resize-none min-h-[80px]"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.ctrlKey) handlePost();
            if (
              e.key === "Enter" &&
              !e.shiftKey &&
              !e.ctrlKey &&
              newMessage.trim() === "/admin"
            ) {
              e.preventDefault();
              handlePost();
            }
          }}
        />
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">Ctrl+Enter to post</p>
          <Button
            type="button"
            data-ocid="alumni-chat.post_button"
            disabled={!newMessage.trim() || postMutation.isPending}
            onClick={handlePost}
            className="gap-2"
          >
            <Send className="h-4 w-4" />
            {postMutation.isPending ? "Posting…" : "Post Message"}
          </Button>
        </div>
      </div>

      <AdminPanelModal
        open={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
      />
    </div>
  );
}
