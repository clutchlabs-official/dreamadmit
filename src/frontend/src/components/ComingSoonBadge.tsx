import { Lock } from "lucide-react";

interface ComingSoonBadgeProps {
  label?: string;
  className?: string;
}

export default function ComingSoonBadge({
  label = "Coming Soon",
  className = "",
}: ComingSoonBadgeProps) {
  return (
    <span className={`badge-coming-soon ${className}`}>
      <Lock className="h-2.5 w-2.5" />
      {label}
    </span>
  );
}
