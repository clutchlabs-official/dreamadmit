import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@tanstack/react-router";
import { X } from "lucide-react";
import { useState } from "react";

interface AdminPanelModalProps {
  open: boolean;
  onClose: () => void;
}

export function AdminPanelModal({ open, onClose }: AdminPanelModalProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const ADMIN_NAME = "M.Divij Vedanth";
  const ADMIN_EMAIL = "attic6411@gmail.com";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) return;
    setIsSubmitting(true);
    const nameMatch = fullName.trim() === ADMIN_NAME;
    const emailMatch = email.trim().toLowerCase() === ADMIN_EMAIL;
    setIsSubmitting(false);
    setFullName("");
    setEmail("");
    onClose();
    if (nameMatch && emailMatch) {
      navigate({ to: "/secret-admin" });
    } else {
      navigate({ to: "/" });
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) onClose();
      }}
    >
      <DialogContent
        className="max-w-md w-full rounded-2xl border border-border bg-card p-0 overflow-hidden"
        data-ocid="admin.dialog"
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-2 relative">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-muted hover:bg-muted/80 transition-colors"
            data-ocid="admin.close_button"
          >
            <X className="h-4 w-4" />
          </button>
          <DialogHeader>
            <DialogTitle className="text-base font-display font-semibold text-foreground sr-only">
              Verification
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Please enter your details to continue.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="admin-fullname" className="text-sm font-medium">
              Full Name
            </Label>
            <Input
              id="admin-fullname"
              type="text"
              placeholder="Your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoComplete="name"
              data-ocid="admin.fullname_input"
              className="focus-visible:ring-indigo-500"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="admin-email" className="text-sm font-medium">
              Email Address
            </Label>
            <Input
              id="admin-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              data-ocid="admin.email_input"
              className="focus-visible:ring-indigo-500"
            />
          </div>

          <div className="pt-1 flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
              data-ocid="admin.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isSubmitting}
              data-ocid="admin.submit_button"
            >
              {isSubmitting ? "Verifying…" : "Continue"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
