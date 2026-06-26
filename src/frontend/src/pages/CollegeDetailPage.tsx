import LoadingSpinner from "@/components/LoadingSpinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  useCollegeMatchScore,
  useColleges,
  useOfficerContent,
  useStudentProfile,
} from "@/hooks/useQueries";
import {
  type AiMatchScore,
  FinancialAidTier,
  OfficerContent,
  OfficerContentType,
} from "@/types";
import type { College } from "@/types";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  BadgePercent,
  Banknote,
  BookOpen,
  Building2,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  DollarSign,
  ExternalLink,
  GitCompare,
  Globe,
  Home,
  Languages,
  Loader2,
  MapPin,
  MessageSquare,
  Sparkles,
  Target,
  Trophy,
  Video,
} from "lucide-react";
import { type ElementType, useMemo, useState } from "react";

const AID_TIER_LABELS: Record<FinancialAidTier, string> = {
  [FinancialAidTier.fullRide]: "Full Ride",
  [FinancialAidTier.needBased]: "Need Based",
  [FinancialAidTier.meritOnly]: "Merit Only",
  [FinancialAidTier.noAid]: "No Aid",
};

const AID_TIER_DESCRIPTIONS: Record<FinancialAidTier, string> = {
  [FinancialAidTier.fullRide]:
    "This college offers full-ride scholarships covering tuition, room, and board for qualifying students.",
  [FinancialAidTier.needBased]:
    "Financial aid is awarded based on demonstrated financial need. Families with lower income qualify for more support.",
  [FinancialAidTier.meritOnly]:
    "Scholarships are awarded based on academic achievement, extracurriculars, and merit — not financial need.",
  [FinancialAidTier.noAid]:
    "This college does not currently offer need-based or merit-based aid packages through this directory.",
};

const AID_BADGE_STYLES: Record<FinancialAidTier, string> = {
  [FinancialAidTier.fullRide]: "bg-accent/15 text-accent border-accent/30",
  [FinancialAidTier.needBased]: "bg-primary/10 text-primary border-primary/30",
  [FinancialAidTier.meritOnly]:
    "bg-secondary/40 text-secondary-foreground border-border",
  [FinancialAidTier.noAid]: "bg-muted text-muted-foreground border-border",
};

interface CountryAdmissionInfo {
  visaPathway: string;
  languageRequirements: string;
  applicationTimeline: string;
  costOfLiving: string;
  admissionRequirements: string;
}

const COUNTRY_ADMISSION_DATA: Record<string, CountryAdmissionInfo> = {
  US: {
    visaPathway:
      "F-1 Student Visa: Obtain an I-20 from the college, pay the SEVIS fee, and schedule a visa interview at the nearest US embassy or consulate.",
    languageRequirements:
      "TOEFL iBT 80+ or IELTS 6.5+ typically required. Top-tier colleges often expect TOEFL 100+ or IELTS 7.0+.",
    applicationTimeline:
      "Early Decision/Action: Nov 1. Regular Decision: Jan 1–15. Decisions released March–April. Confirm enrollment by May 1.",
    costOfLiving:
      "Varies widely by city. Urban areas (NYC, SF) average $1,500–2,500/month. Smaller college towns range $800–1,400/month including housing, food, and transport.",
    admissionRequirements:
      "Typical competitive profile: GPA 3.5+, SAT 1300+ or ACT 28+, strong extracurriculars, and compelling essays.",
  },
  UK: {
    visaPathway:
      "Student Route (Tier 4) Visa: Requires a Confirmation of Acceptance for Studies (CAS) from the university and proof of funds.",
    languageRequirements:
      "IELTS 6.0–7.5 depending on the course. Most universities require IELTS 6.5 overall with no band below 6.0.",
    applicationTimeline:
      "UCAS deadline for most courses: Jan 31. Oxford/Cambridge and medicine: Oct 15. Offers typically by end of March.",
    costOfLiving:
      "London: ~£1,200–1,500/month. Other cities: ~£900–1,200/month. Includes rent, utilities, food, and travel.",
    admissionRequirements:
      "A-Levels or equivalent required. Competitive courses often ask for AAA or A*AA. Personal statement and reference are critical.",
  },
  Canada: {
    visaPathway:
      "Study Permit: Requires a Letter of Acceptance, proof of funds, and a clean criminal record. Some applicants need a medical exam.",
    languageRequirements:
      "IELTS 6.5+ or TOEFL iBT 80+ for English programs. French programs may require TEF/TCF scores.",
    applicationTimeline:
      "Major intakes: September (primary) and January. Apply 8–12 months in advance. Some programs have rolling admissions.",
    costOfLiving:
      "Toronto/Vancouver: ~CAD 1,500–2,200/month. Smaller cities: ~CAD 1,000–1,500/month. Includes housing, food, and transport.",
    admissionRequirements:
      "High school diploma with strong grades in relevant subjects. GPA equivalents vary by province and institution.",
  },
  Australia: {
    visaPathway:
      "Subclass 500 Student Visa: Requires a Confirmation of Enrolment (CoE), proof of funds, and Overseas Student Health Cover (OSHC).",
    languageRequirements:
      "IELTS 6.5+ (no band less than 6.0) or equivalent. Some courses require higher scores.",
    applicationTimeline:
      "Semester 1 (Feb/Mar) and Semester 2 (July). Apply by Oct–Nov for Semester 1 and by April–May for Semester 2.",
    costOfLiving:
      "Sydney/Melbourne: ~AUD 1,800–2,500/month. Other cities: ~AUD 1,200–1,800/month. Includes rent, food, and transport.",
    admissionRequirements:
      "Australian Tertiary Admission Rank (ATAR) or equivalent international qualifications. Some courses require portfolios or interviews.",
  },
  India: {
    visaPathway:
      "Student Visa (subclass based on duration): Requires admission letter, proof of financial support, and academic documents attested by the relevant authorities.",
    languageRequirements:
      "Most programs are taught in English. Some institutions may require English proficiency proof (IELTS/TOEFL) for international students.",
    applicationTimeline:
      "Academic year typically starts in July–August. Entrance exams (JEE, NEET, etc.) held between Jan–May. Apply through centralized counseling or directly.",
    costOfLiving:
      "Metro cities (Delhi, Mumbai, Bangalore): ~₹25,000–45,000/month. Smaller cities: ~₹15,000–25,000/month including rent and food.",
    admissionRequirements:
      "Class 12 board exam scores or equivalent. Competitive programs require national/state-level entrance exam ranks.",
  },
  Germany: {
    visaPathway:
      "National Visa for Study Purposes: Requires university admission letter, blocked account (€11,208/year), health insurance, and biometric passport photos.",
    languageRequirements:
      "German-taught programs: DSH-2 or TestDaF 4. English-taught programs: IELTS 6.5+ or TOEFL iBT 90+.",
    applicationTimeline:
      "Winter semester (Oct): Apply by July 15. Summer semester (Apr): Apply by Jan 15. Some universities have earlier deadlines.",
    costOfLiving:
      "€850–1,100/month on average. Munich/Frankfurt are higher (~€1,000–1,300). Includes rent, food, health insurance, and transport.",
    admissionRequirements:
      "Abitur or equivalent. Some programs require a preparatory foundation course (Studienkolleg) for non-EU qualifications.",
  },
  France: {
    visaPathway:
      "Long-Stay Student Visa (VLS-TS): Requires Campus France approval (Etudes en France), admission letter, proof of funds (~€615/month), and accommodation proof.",
    languageRequirements:
      "French-taught: DELF B2 or DALF C1. English-taught: IELTS 6.5+ or TOEFL iBT 90+.",
    applicationTimeline:
      "Main intake: September. Apply via Etudes en France by early spring. Some grandes écoles have earlier deadlines (Jan–Mar).",
    costOfLiving:
      "Paris: ~€1,000–1,400/month. Other cities: ~€700–1,000/month. Includes rent, food, and transport. CAF housing aid may reduce costs.",
    admissionRequirements:
      "Baccalauréat or equivalent. Competitive programs (prépa, grandes écoles) require entrance exams and interviews.",
  },
  Japan: {
    visaPathway:
      "Student Visa (留学): Requires Certificate of Eligibility (CoE) issued by the Immigration Bureau via the accepting school, plus proof of funds and academic records.",
    languageRequirements:
      "Japanese-taught: JLPT N2 or N1. English-taught (G30/SGU): TOEFL iBT 80+ or IELTS 6.0+.",
    applicationTimeline:
      "April intake (primary): Apply Sep–Nov. September intake: Apply Mar–May. Some universities have rolling admissions for English programs.",
    costOfLiving:
      "Tokyo: ~¥120,000–180,000/month. Osaka/Kyoto: ~¥90,000–130,000/month. Includes rent, food, and transport. Part-time work permitted up to 28 hrs/week.",
    admissionRequirements:
      "Completion of 12 years of formal education. University entrance exams (EJU) required for Japanese-taught programs. Recommendation letters and statement of purpose are important.",
  },
  Singapore: {
    visaPathway:
      "Student's Pass (STP): Applied via SOLAR system after receiving an In-Principle Approval (IPA) letter from the institution. Medical exam required upon arrival.",
    languageRequirements:
      "IELTS 6.5+ or TOEFL iBT 90+ for most programs. Some local universities accept alternative English proficiency assessments.",
    applicationTimeline:
      "August intake (primary): Apply Oct–Mar. January intake: Apply Jul–Sep. Highly competitive; apply as early as possible.",
    costOfLiving:
      "~SGD 1,200–2,000/month. Includes shared accommodation, food, and public transport. On-campus housing is limited and competitive.",
    admissionRequirements:
      "Strong high school results or equivalent. Local universities (NUS, NTU, SMU) often require entrance interviews and aptitude tests.",
  },
  UAE: {
    visaPathway:
      "Student Residence Visa: Sponsored by the university. Requires admission letter, medical fitness test, and Emirates ID application.",
    languageRequirements:
      "English-taught: IELTS 6.0+ or TOEFL iBT 80+. Arabic-taught programs require Arabic proficiency proof.",
    applicationTimeline:
      "Fall (Sep) and Spring (Jan) intakes. Apply 3–6 months in advance. Some institutions offer rolling admissions.",
    costOfLiving:
      "Dubai/Abu Dhabi: ~AED 3,500–5,500/month. Sharjah/Ajman: ~AED 2,500–3,500/month. Includes rent, food, and transport.",
    admissionRequirements:
      "High school diploma with minimum GPA requirements varying by institution. Some programs require entrance exams or interviews.",
  },
};

const AID_ICON_STYLES: Record<FinancialAidTier, string> = {
  [FinancialAidTier.fullRide]: "bg-accent/15 text-accent",
  [FinancialAidTier.needBased]: "bg-primary/10 text-primary",
  [FinancialAidTier.meritOnly]: "bg-secondary/40 text-secondary-foreground",
  [FinancialAidTier.noAid]: "bg-muted text-muted-foreground",
};

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: ElementType;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-muted/50 border border-border px-4 py-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-lg font-semibold text-foreground font-display">
          {value}
        </p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  title,
  text,
}: {
  icon: ElementType;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

function MatchScoreSection({ college }: { college: College }) {
  const { data: profile } = useStudentProfile();
  const matchMutation = useCollegeMatchScore();
  const [matchResult, setMatchResult] = useState<AiMatchScore | null>(null);
  const [expanded, setExpanded] = useState(false);

  const handleCalculate = async () => {
    if (!profile) return;
    const result = await matchMutation.mutateAsync({
      collegeId: college.id,
      collegeName: college.name,
      profile,
    });
    setMatchResult(result);
    setExpanded(true);
  };

  const score = matchResult?.score ?? 0;
  const scoreColor =
    score >= 70
      ? {
          ring: "ring-emerald-500",
          text: "text-emerald-600 dark:text-emerald-400",
          bg: "bg-emerald-50 dark:bg-emerald-950/30",
          label: "Strong Match",
          bar: "bg-emerald-500",
        }
      : score >= 40
        ? {
            ring: "ring-amber-500",
            text: "text-amber-600 dark:text-amber-400",
            bg: "bg-amber-50 dark:bg-amber-950/30",
            label: "Moderate Match",
            bar: "bg-amber-500",
          }
        : {
            ring: "ring-destructive",
            text: "text-destructive",
            bg: "bg-destructive/5",
            label: "Reach School",
            bar: "bg-destructive",
          };

  return (
    <Card
      className="border-border"
      data-ocid="college_detail.match_score_section"
    >
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 font-display text-lg">
          <Target className="h-5 w-5 text-primary" />
          College Match Score
        </CardTitle>
        {!profile && (
          <p className="text-sm text-muted-foreground">
            Complete your student profile to get a personalized match score.
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {!matchResult ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">
                Find out how well your profile matches {college.name}'s
                requirements. Our AI analyzes your GPA, test scores,
                extracurriculars, and more.
              </p>
            </div>
            <Button
              type="button"
              onClick={handleCalculate}
              disabled={!profile || matchMutation.isPending}
              className="shrink-0 gap-2"
              data-ocid="college_detail.calculate_match_button"
            >
              {matchMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Target className="h-4 w-4" />
              )}
              {matchMutation.isPending ? "Calculating…" : "Calculate My Match"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Score Display */}
            <div
              className={`flex items-center gap-6 rounded-xl p-4 ${scoreColor.bg}`}
            >
              <div
                className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-full ring-4 ${scoreColor.ring} bg-card`}
              >
                <div className="text-center">
                  <p
                    className={`text-2xl font-bold font-display ${scoreColor.text}`}
                  >
                    {score}%
                  </p>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={`text-lg font-semibold font-display ${scoreColor.text}`}
                >
                  {scoreColor.label}
                </p>
                <div className="w-full h-2 rounded-full bg-muted mt-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${scoreColor.bar}`}
                    style={{ width: `${score}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">
                  Based on your current profile
                </p>
              </div>
            </div>

            {/* Reasoning */}
            <div>
              <button
                type="button"
                className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                onClick={() => setExpanded((v) => !v)}
                data-ocid="college_detail.match_reasoning_toggle"
              >
                {expanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
                {expanded ? "Hide" : "Show"} AI Reasoning
              </button>
              {expanded && (
                <div className="mt-3 p-4 rounded-lg bg-muted/50 border border-border">
                  <p className="text-sm text-foreground leading-relaxed">
                    {matchResult.reasoning}
                  </p>
                </div>
              )}
            </div>

            {/* Recalculate */}
            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCalculate}
                disabled={matchMutation.isPending}
                className="gap-2 text-xs"
                data-ocid="college_detail.recalculate_match_button"
              >
                {matchMutation.isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Target className="h-3.5 w-3.5" />
                )}
                Recalculate
              </Button>
            </div>
          </div>
        )}
        {matchMutation.isError && (
          <div
            className="flex items-center gap-2 text-sm text-destructive"
            data-ocid="college_detail.match_error_state"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            Failed to calculate match score. Please try again.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

const CONTENT_TYPE_CONFIG: Record<
  OfficerContentType,
  { icon: ElementType; label: string; color: string }
> = {
  [OfficerContentType.tip]: {
    icon: BookOpen,
    label: "Tip",
    color: "bg-primary/10 text-primary",
  },
  [OfficerContentType.insight]: {
    icon: MessageSquare,
    label: "Insight",
    color: "bg-accent/15 text-accent",
  },
  [OfficerContentType.video]: {
    icon: Video,
    label: "Video",
    color: "bg-secondary/40 text-secondary-foreground",
  },
  [OfficerContentType.announcement]: {
    icon: Trophy,
    label: "Announcement",
    color: "bg-muted text-muted-foreground",
  },
};

function OfficerContentSection({ collegeId }: { collegeId: bigint }) {
  const { data: items = [], isLoading } = useOfficerContent(collegeId);

  if (isLoading) return null;
  if (items.length === 0) return null;

  const tips = items.filter(
    (i) =>
      i.contentType === OfficerContentType.tip ||
      i.contentType === OfficerContentType.insight ||
      i.contentType === OfficerContentType.announcement,
  );
  const videos = items.filter(
    (i) => i.contentType === OfficerContentType.video,
  );

  return (
    <Card
      className="border-border"
      data-ocid="college_detail.officer_content_section"
    >
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 font-display text-lg">
          <Trophy className="h-5 w-5 text-primary" />
          From Admission Officers
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Tips, insights, and resources directly from admission officers at{" "}
          {items[0] ? "this college" : ""}.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Tips & Insights */}
        {tips.length > 0 && (
          <div className="space-y-3">
            {tips.map((item) => {
              const cfg = CONTENT_TYPE_CONFIG[item.contentType];
              const Icon = cfg.icon;
              return (
                <div
                  key={String(item.id)}
                  className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 p-4"
                  data-ocid={`college_detail.officer_item.${item.id}`}
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${cfg.color}`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-foreground">
                        {item.title}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {cfg.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.body}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Videos */}
        {videos.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">
              Video Resources
            </p>
            {videos.map((item) => (
              <div
                key={String(item.id)}
                className="rounded-lg border border-border bg-muted/30 overflow-hidden"
                data-ocid={`college_detail.officer_video.${item.id}`}
              >
                {item.videoUrl && (
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    {item.videoUrl.includes("youtube") ||
                    item.videoUrl.includes("youtu.be") ? (
                      <iframe
                        src={item.videoUrl
                          .replace("watch?v=", "embed/")
                          .replace("youtu.be/", "youtube.com/embed/")}
                        title={item.title}
                        className="w-full h-full"
                        allowFullScreen
                      />
                    ) : (
                      <a
                        href={item.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center gap-2 text-primary hover:underline"
                        data-ocid={`college_detail.officer_video_link.${item.id}`}
                      >
                        <Video className="h-10 w-10" />
                        <span className="text-sm font-medium">Watch Video</span>
                      </a>
                    )}
                  </div>
                )}
                <div className="p-4">
                  <p className="text-sm font-semibold text-foreground">
                    {item.title}
                  </p>
                  {item.body && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.body}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function CollegeDetail({ college }: { college: College }) {
  const [addedToCompare, setAddedToCompare] = useState(false);
  const tuitionNum = Number(college.tuition);

  const intlInfo = useMemo(() => {
    const data = COUNTRY_ADMISSION_DATA[college.country];
    if (!data) return null;
    return data;
  }, [college.country]);

  const handleAddToCompare = () => {
    const existing: string[] = JSON.parse(
      sessionStorage.getItem("compareIds") ?? "[]",
    );
    const idStr = String(college.id);
    if (!existing.includes(idStr)) {
      const updated = [...existing, idStr].slice(0, 4);
      sessionStorage.setItem("compareIds", JSON.stringify(updated));
    }
    setAddedToCompare(true);
    setTimeout(() => setAddedToCompare(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero header */}
      <div className="bg-card border-b border-border">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
          <Link
            to="/colleges"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
            data-ocid="college_detail.back_link"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Colleges
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-start gap-3 mb-2">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div className="min-w-0">
                  <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground leading-tight">
                    {college.name}
                  </h1>
                  <p className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
                    <MapPin className="h-4 w-4 shrink-0" />
                    {college.location}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap mt-3">
                <Badge
                  variant="outline"
                  className={`text-sm font-semibold ${AID_BADGE_STYLES[college.financialAidTier]}`}
                  data-ocid="college_detail.aid_tier_badge"
                >
                  {AID_TIER_LABELS[college.financialAidTier]}
                </Badge>
                {college.website && (
                  <a
                    href={college.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                    data-ocid="college_detail.website_link"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Visit Website
                  </a>
                )}
              </div>
            </div>

            <Button
              type="button"
              onClick={handleAddToCompare}
              variant={addedToCompare ? "default" : "outline"}
              className="shrink-0 gap-2"
              data-ocid="college_detail.add_to_compare_button"
            >
              <GitCompare className="h-4 w-4" />
              {addedToCompare ? "Added!" : "Add to Comparison"}
            </Button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Match Score — prominent, near the top */}
        <MatchScoreSection college={college} />

        {/* Key stats */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          data-ocid="college_detail.stats_section"
        >
          <StatCard
            icon={DollarSign}
            label="Annual Tuition"
            value={`${tuitionNum.toLocaleString()}`}
            sub="Per academic year"
          />
          <StatCard
            icon={BadgePercent}
            label="Acceptance Rate"
            value={`${college.acceptanceRate.toFixed(1)}%`}
            sub="Of applicants admitted"
          />
        </div>

        <Separator />

        {/* Officer Content */}
        <OfficerContentSection collegeId={college.id} />

        {/* About / Housing */}
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 font-display text-lg">
              <Home className="h-5 w-5 text-primary" />
              About &amp; Housing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground leading-relaxed">
              {college.housingInfo ||
                "Housing information not available for this college."}
            </p>
          </CardContent>
        </Card>

        {/* Majors */}
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 font-display text-lg">
              <Sparkles className="h-5 w-5 text-primary" />
              Majors Offered
            </CardTitle>
          </CardHeader>
          <CardContent>
            {college.majorsOffered.length > 0 ? (
              <div
                className="flex flex-wrap gap-2"
                data-ocid="college_detail.majors_list"
              >
                {college.majorsOffered.map((major) => (
                  <Badge
                    key={major}
                    variant="secondary"
                    className="text-sm font-normal py-1 px-3"
                  >
                    {major}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No majors listed.</p>
            )}
          </CardContent>
        </Card>

        {/* Financial Aid Details */}
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 font-display text-lg">
              <DollarSign className="h-5 w-5 text-primary" />
              Financial Aid Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${AID_ICON_STYLES[college.financialAidTier]}`}
              >
                <DollarSign className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-foreground mb-1">
                  {AID_TIER_LABELS[college.financialAidTier]}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {AID_TIER_DESCRIPTIONS[college.financialAidTier]}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* International Admission Info */}
        {intlInfo && (
          <Card
            className="border-border"
            data-ocid="college_detail.intl_info_card"
          >
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 font-display text-lg">
                <Globe className="h-5 w-5 text-primary" />
                International Admission Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <InfoRow
                icon={ClipboardList}
                title="Visa Pathway"
                text={intlInfo.visaPathway}
              />
              <InfoRow
                icon={Languages}
                title="Language Requirements"
                text={intlInfo.languageRequirements}
              />
              <InfoRow
                icon={CalendarDays}
                title="Application Timeline"
                text={intlInfo.applicationTimeline}
              />
              <InfoRow
                icon={Banknote}
                title="Cost of Living"
                text={intlInfo.costOfLiving}
              />
              <InfoRow
                icon={Sparkles}
                title="Admission Requirements"
                text={intlInfo.admissionRequirements}
              />
            </CardContent>
          </Card>
        )}

        {/* Bottom CTA */}
        <div className="flex items-center justify-between pt-2">
          <Link
            to="/colleges"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="college_detail.bottom_back_link"
          >
            <ArrowLeft className="h-4 w-4" />
            All Colleges
          </Link>
          <Button
            type="button"
            onClick={handleAddToCompare}
            variant={addedToCompare ? "default" : "outline"}
            className="gap-2"
            data-ocid="college_detail.bottom_add_compare_button"
          >
            <GitCompare className="h-4 w-4" />
            {addedToCompare ? "Added!" : "Add to Comparison"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function CollegeDetailPage() {
  const { id } = useParams({ from: "/colleges/$id" });
  const { data: colleges = [], isLoading, isError } = useColleges();

  if (isLoading) {
    return (
      <div
        className="min-h-screen bg-background"
        data-ocid="college_detail.loading_state"
      >
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
          <LoadingSpinner label="Loading college details…" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className="min-h-screen bg-background flex items-center justify-center"
        data-ocid="college_detail.error_state"
      >
        <div className="text-center">
          <p className="text-destructive font-medium">
            Failed to load college details.
          </p>
          <Link
            to="/colleges"
            className="text-primary text-sm hover:underline mt-2 block"
          >
            Back to Colleges
          </Link>
        </div>
      </div>
    );
  }

  const college = colleges.find((c) => String(c.id) === id);

  if (!college) {
    return (
      <div
        className="min-h-screen bg-background flex items-center justify-center"
        data-ocid="college_detail.empty_state"
      >
        <div className="text-center">
          <p className="font-display text-xl font-semibold text-foreground mb-2">
            College not found
          </p>
          <p className="text-muted-foreground text-sm mb-4">
            The college you&apos;re looking for doesn&apos;t exist in our
            directory.
          </p>
          <Button asChild>
            <Link to="/colleges">Browse All Colleges</Link>
          </Button>
        </div>
      </div>
    );
  }

  return <CollegeDetail college={college} />;
}
