import AnimatedCard from "@/components/AnimatedCard";
import ComingSoonBadge from "@/components/ComingSoonBadge";
import PageTransition from "@/components/PageTransition";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import {
  ChevronRight,
  FileEdit,
  Lightbulb,
  Mic,
  ScrollText,
  Star,
} from "lucide-react";

const _features = [
  {
    emoji: "📝",
    title: "Essay Reviewer",
    description: "AI grades your essay on grammar, structure, and storytelling",
    path: "/essay-reviewer",
    live: true,
  },
  {
    emoji: "🎤",
    title: "Interview Prep",
    description:
      "Practice with AI-generated mock interview questions per college",
    path: "/interview-prep",
    live: true,
  },
  {
    emoji: "💡",
    title: "Essay Idea Generator",
    description:
      "Stuck on what to write? Get personalised brainstorming prompts",
    path: "/guidance",
    live: true,
  },
  {
    emoji: "📄",
    title: "Personal Statement Templates",
    description:
      "10 different styles: underdog, passion project, cultural identity & more",
    path: "/essay-reviewer",
    live: false,
  },
  {
    emoji: "✂️",
    title: "Word Count Optimizer",
    description: "AI tells you exactly what to cut and what to keep",
    path: "/essay-reviewer",
    live: false,
  },
  {
    emoji: "🏛️",
    title: "Officer Portal Tips",
    description: "Insights directly from admission officers at top colleges",
    path: "/officer-portal",
    live: true,
  },
];

const _tips = [
  { icon: Lightbulb, tip: "Start with a specific moment, not a broad theme." },
  {
    icon: FileEdit,
    tip: "Show, don't tell — use vivid details over adjectives.",
  },
  { icon: Star, tip: "End with what you learned, not what happened." },
  {
    icon: ScrollText,
    tip: "Read aloud to catch awkward phrasing before submitting.",
  },
];

export { default } from "@/pages/essays/EssaysMain";
