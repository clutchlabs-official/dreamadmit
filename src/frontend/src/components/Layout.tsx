import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useQueryClient } from "@tanstack/react-query";
import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { GraduationCap, LogIn, LogOut, Menu } from "lucide-react";
import { useState } from "react";

type NavItem = {
  label: string;
  path: string;
  comingSoon?: boolean;
};

type NavSection = {
  section: string;
  path: string;
  items: NavItem[];
  comingSoon?: boolean;
};

const navSections: NavSection[] = [
  {
    section: "Admissions",
    path: "/admissions-hub",
    items: [
      { label: "Colleges", path: "/colleges" },
      { label: "Compare", path: "/compare" },
      { label: "Deadlines", path: "/deadlines" },
    ],
  },
  {
    section: "Essays",
    path: "/essays",
    items: [
      { label: "Essay Reviewer", path: "/essay-reviewer" },
      { label: "Interview Prep", path: "/interview-prep" },
      { label: "Officer Portal", path: "/officer-portal" },
    ],
  },
  {
    section: "Finance",
    path: "/finance-hub",
    items: [
      { label: "Scholarships", path: "/scholarships" },
      { label: "Calculator", path: "/calculator" },
    ],
  },
  {
    section: "Test Prep",
    path: "/test-prep",
    items: [
      { label: "AI Guidance", path: "/guidance" },
      { label: "Extracurriculars", path: "/extracurriculars" },
      { label: "Course Finder", path: "/course-finder" },
    ],
  },
  {
    section: "AI Advisor",
    path: "/ai-advisor",
    items: [],
  },
  {
    section: "Community",
    path: "/community",
    items: [{ label: "Alumni Chat", path: "/alumni-chat" }],
  },
  {
    section: "Tracking",
    path: "/tracking",
    items: [
      { label: "Documents", path: "/documents" },
      { label: "Profile", path: "/profile" },
      { label: "After Admission", path: "/after-admission" },
    ],
  },
  {
    section: "Smart Planning",
    path: "/smart-planning",
    items: [],
  },
  {
    section: "International",
    path: "/international",
    items: [],
  },
  {
    section: "Career & Future",
    path: "/career",
    items: [],
  },
  {
    section: "Mental Health",
    path: "/mental-health",
    items: [],
  },
  {
    section: "Plans",
    path: "/plans",
    items: [],
  },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-0.5">
      {navSections.map((sec) => {
        const isActive =
          currentPath === sec.path ||
          currentPath.startsWith(`${sec.path}/`) ||
          sec.items.some(
            (i) =>
              currentPath === i.path || currentPath.startsWith(`${i.path}/`),
          );
        const isExpanded = expandedSection === sec.section;

        return (
          <div key={sec.section}>
            <div className="flex items-center gap-1">
              <Link
                to={sec.path}
                onClick={() => {
                  setExpandedSection(isExpanded ? null : sec.section);
                  onNavigate?.();
                }}
                data-ocid={`nav.${sec.section.toLowerCase().replace(/ /g, "_")}.link`}
                className={[
                  "flex flex-1 items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition-colors duration-200",
                  isActive
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                ].join(" ")}
              >
                <span>{sec.section}</span>
                {sec.comingSoon && (
                  <span className="badge-coming-soon ml-auto">Soon</span>
                )}
              </Link>
            </div>
            {isActive && sec.items.length > 0 && (
              <div className="ml-4 mt-0.5 flex flex-col gap-0.5 stagger-children">
                {sec.items.map((item) => {
                  const subActive =
                    currentPath === item.path ||
                    currentPath.startsWith(`${item.path}/`);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={onNavigate}
                      data-ocid={`nav.${item.label.toLowerCase().replace(/ /g, "_")}.link`}
                      className={[
                        "flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-colors duration-200",
                        subActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      ].join(" ")}
                    >
                      {item.label}
                      {item.comingSoon && (
                        <span className="badge-coming-soon ml-auto">Soon</span>
                      )}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function AuthButton({ compact = false }: { compact?: boolean }) {
  const { login, clear, isAuthenticated, isInitializing, isLoggingIn } =
    useInternetIdentity();
  const queryClient = useQueryClient();

  const handleAuth = () => {
    if (isAuthenticated) {
      clear();
      queryClient.clear();
    } else {
      login();
    }
  };

  const disabled = isInitializing || isLoggingIn;

  return (
    <Button
      variant={isAuthenticated ? "outline" : "default"}
      size={compact ? "sm" : "default"}
      onClick={handleAuth}
      disabled={disabled}
      data-ocid="nav.auth_button"
      className="gap-2"
    >
      {isAuthenticated ? (
        <>
          <LogOut className="h-4 w-4" />
          {!compact && "Sign Out"}
        </>
      ) : (
        <>
          <LogIn className="h-4 w-4" />
          {!compact && (isInitializing ? "Loading…" : "Sign In")}
        </>
      )}
      {compact && (isInitializing ? "…" : isAuthenticated ? "Out" : "In")}
    </Button>
  );
}

function DesktopNav() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <div className="flex items-center gap-0.5">
      {navSections.map((sec) => {
        const isActive =
          currentPath === sec.path ||
          currentPath.startsWith(`${sec.path}/`) ||
          sec.items.some(
            (i) =>
              currentPath === i.path || currentPath.startsWith(`${i.path}/`),
          );
        return (
          <Link
            key={sec.section}
            to={sec.path}
            data-ocid={`nav.${sec.section.toLowerCase().replace(/ /g, "_")}.link`}
            className={[
              "flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-semibold transition-colors duration-200",
              isActive
                ? "bg-primary/15 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            ].join(" ")}
          >
            <span className="hidden lg:inline">{sec.section}</span>
            {sec.comingSoon && <span className="badge-coming-soon">Soon</span>}
          </Link>
        );
      })}
    </div>
  );
}

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Sticky header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border shadow-subtle">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <Link
              to="/"
              data-ocid="nav.logo.link"
              className="flex items-center gap-2.5 shrink-0 group"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary transition-transform duration-200 group-hover:scale-105">
                <GraduationCap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-display text-lg font-bold text-foreground">
                Dream<span className="text-primary">Admit</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <nav
              className="hidden md:flex items-center gap-1"
              aria-label="Main navigation"
            >
              <DesktopNav />
            </nav>

            {/* Desktop auth */}
            <div className="hidden md:block">
              <AuthButton />
            </div>

            {/* Mobile hamburger */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label="Open navigation menu"
                  data-ocid="nav.mobile_menu_button"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 bg-card pt-8">
                <div className="flex items-center gap-2.5 mb-8 px-1">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                    <GraduationCap className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span className="font-display text-lg font-bold text-foreground">
                    Dream<span className="text-primary">Admit</span>
                  </span>
                </div>
                <nav
                  className="flex flex-col gap-1"
                  aria-label="Mobile navigation"
                >
                  <NavLinks onNavigate={() => setMobileOpen(false)} />
                </nav>
                <div className="mt-8 px-1">
                  <AuthButton />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-auto">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} DreamAdmit. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
