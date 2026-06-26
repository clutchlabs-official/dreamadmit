import type { PortfolioChecklistItem } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useGetPortfolioChecklist,
  useGetSalaryBookmarks,
  useGetSavedCareerPaths,
  useRemoveSalaryBookmark,
  useRemoveSavedCareerPath,
  useSaveCareerPath,
  useSaveSalaryBookmark,
  useUpsertPortfolioChecklist,
} from "@/hooks/useQueries";
import {
  BookOpen,
  Bookmark,
  BookmarkCheck,
  Briefcase,
  Building2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  FlaskConical,
  GlobeIcon,
  GraduationCap,
  Heart,
  Lightbulb,
  Scale,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

// ──────────────────────────────────────────────────────────────
// Static data
// ──────────────────────────────────────────────────────────────
const MAJORS = [
  {
    id: "cs",
    name: "Computer Science",
    emoji: "",
    icon: Lightbulb,
    careers: [
      {
        title: "Software Engineer",
        icon: "🛠️",
        desc: "Build products at tech companies or startups. Median salary: $130k+",
      },
      {
        title: "Data Scientist",
        icon: "📊",
        desc: "Turn data into decisions with ML and statistics. Median: $120k",
      },
      {
        title: "Product Manager",
        icon: "🗺️",
        desc: "Lead cross-functional teams to ship great products. Median: $140k",
      },
      {
        title: "Cybersecurity Analyst",
        icon: "🔐",
        desc: "Protect digital infrastructure from threats. Median: $112k",
      },
      {
        title: "AI/ML Engineer",
        icon: "🤖",
        desc: "Research and deploy machine learning systems. Median: $150k",
      },
    ],
    gradSchoolPct: 28,
    topGradPrograms: [
      "MIT CSAIL",
      "Stanford AI Lab",
      "Carnegie Mellon SCS",
      "UC Berkeley EECS",
    ],
  },
  {
    id: "eng",
    name: "Engineering",
    emoji: "",
    icon: Building2,
    careers: [
      {
        title: "Mechanical Engineer",
        icon: "🔧",
        desc: "Design and test mechanical systems. Median: $95k",
      },
      {
        title: "Electrical Engineer",
        icon: "⚡",
        desc: "Develop circuits, chips, and power systems. Median: $103k",
      },
      {
        title: "Civil Engineer",
        icon: "🏗️",
        desc: "Plan and build infrastructure projects. Median: $88k",
      },
      {
        title: "Aerospace Engineer",
        icon: "🚀",
        desc: "Design aircraft, spacecraft, and propulsion. Median: $122k",
      },
      {
        title: "Biomedical Engineer",
        icon: "🫀",
        desc: "Bridge medicine and engineering for healthcare. Median: $97k",
      },
    ],
    gradSchoolPct: 35,
    topGradPrograms: [
      "MIT School of Engineering",
      "Caltech",
      "Georgia Tech",
      "Michigan Engineering",
    ],
  },
  {
    id: "biz",
    name: "Business",
    emoji: "",
    icon: TrendingUp,
    careers: [
      {
        title: "Investment Banker",
        icon: "🏦",
        desc: "Advise on M&A, IPOs, and capital markets. Median: $150k+",
      },
      {
        title: "Management Consultant",
        icon: "💼",
        desc: "Solve complex problems for Fortune 500 firms. Median: $110k",
      },
      {
        title: "Marketing Manager",
        icon: "📣",
        desc: "Drive brand and demand generation strategy. Median: $135k",
      },
      {
        title: "Financial Analyst",
        icon: "📉",
        desc: "Model and forecast financial performance. Median: $95k",
      },
      {
        title: "Entrepreneur",
        icon: "🚀",
        desc: "Build your own venture from the ground up.",
      },
    ],
    gradSchoolPct: 42,
    topGradPrograms: [
      "Harvard Business School",
      "Wharton",
      "Booth (UChicago)",
      "Kellogg (Northwestern)",
    ],
  },
  {
    id: "med",
    name: "Medicine",
    emoji: "",
    icon: Heart,
    careers: [
      {
        title: "Physician / Doctor",
        icon: "👨‍⚕️",
        desc: "Diagnose and treat patients in clinical settings. Median: $230k+",
      },
      {
        title: "Surgeon",
        icon: "🔬",
        desc: "Perform surgical interventions and procedures. Median: $350k+",
      },
      {
        title: "Pharmacist",
        icon: "💊",
        desc: "Dispense medications and advise on drug use. Median: $128k",
      },
      {
        title: "Nurse Practitioner",
        icon: "🩹",
        desc: "Provide advanced clinical care with autonomy. Median: $122k",
      },
      {
        title: "Public Health Specialist",
        icon: "🌐",
        desc: "Shape health policy and population outcomes. Median: $75k",
      },
    ],
    gradSchoolPct: 85,
    topGradPrograms: [
      "Johns Hopkins Medicine",
      "Harvard Med",
      "Mayo Clinic",
      "UCSF",
    ],
  },
  {
    id: "law",
    name: "Law",
    emoji: "",
    icon: Scale,
    careers: [
      {
        title: "Corporate Lawyer",
        icon: "🏢",
        desc: "Advise companies on deals, compliance, and disputes. Median: $200k+",
      },
      {
        title: "Public Defender / DA",
        icon: "🏛️",
        desc: "Represent individuals in criminal proceedings. Median: $75k",
      },
      {
        title: "IP Attorney",
        icon: "💡",
        desc: "Protect patents, trademarks, and copyrights. Median: $170k",
      },
      {
        title: "Judge",
        icon: "🔨",
        desc: "Preside over legal proceedings in courts. Median: $135k",
      },
      {
        title: "Legal Analyst",
        icon: "📜",
        desc: "Research and draft legal documents and briefs. Median: $80k",
      },
    ],
    gradSchoolPct: 90,
    topGradPrograms: [
      "Yale Law School",
      "Harvard Law",
      "Stanford Law",
      "Columbia Law",
    ],
  },
  {
    id: "arts",
    name: "Arts",
    emoji: "",
    icon: Lightbulb,
    careers: [
      {
        title: "Graphic Designer",
        icon: "🖌️",
        desc: "Create visual identities and digital assets. Median: $58k",
      },
      {
        title: "UX/UI Designer",
        icon: "📱",
        desc: "Design intuitive digital product experiences. Median: $95k",
      },
      {
        title: "Art Director",
        icon: "🎬",
        desc: "Lead creative vision for brands and campaigns. Median: $100k",
      },
      {
        title: "Animator",
        icon: "✨",
        desc: "Create motion graphics for film, games, or ads. Median: $78k",
      },
      {
        title: "Content Creator",
        icon: "🎥",
        desc: "Build audiences across social and media platforms.",
      },
    ],
    gradSchoolPct: 22,
    topGradPrograms: [
      "RISD",
      "Pratt Institute",
      "Parsons School of Design",
      "SVA",
    ],
  },
  {
    id: "psych",
    name: "Psychology",
    emoji: "",
    icon: Lightbulb,
    careers: [
      {
        title: "Clinical Psychologist",
        icon: "🛋️",
        desc: "Diagnose and treat mental health disorders. Median: $102k",
      },
      {
        title: "School Counselor",
        icon: "🏫",
        desc: "Support student well-being and development. Median: $62k",
      },
      {
        title: "UX Researcher",
        icon: "🔍",
        desc: "Study human behavior to improve product design. Median: $110k",
      },
      {
        title: "Human Resources",
        icon: "👥",
        desc: "Manage talent, culture, and people operations. Median: $80k",
      },
      {
        title: "Social Worker",
        icon: "🤝",
        desc: "Advocate for vulnerable individuals and communities. Median: $58k",
      },
    ],
    gradSchoolPct: 52,
    topGradPrograms: [
      "Harvard Dept. of Psychology",
      "Stanford Psychology",
      "UCLA Clinical",
      "Michigan Social Work",
    ],
  },
  {
    id: "econ",
    name: "Economics",
    emoji: "",
    icon: TrendingUp,
    careers: [
      {
        title: "Economist",
        icon: "📐",
        desc: "Research markets, policy, and economic behavior. Median: $105k",
      },
      {
        title: "Policy Analyst",
        icon: "📋",
        desc: "Evaluate and shape government programs. Median: $78k",
      },
      {
        title: "Actuary",
        icon: "🎲",
        desc: "Assess financial risk using statistics. Median: $111k",
      },
      {
        title: "Investment Analyst",
        icon: "📈",
        desc: "Evaluate opportunities for funds and portfolios. Median: $92k",
      },
      {
        title: "Data Analyst",
        icon: "📊",
        desc: "Interpret business data for strategic decisions. Median: $82k",
      },
    ],
    gradSchoolPct: 48,
    topGradPrograms: [
      "MIT Economics",
      "Princeton Econ",
      "LSE",
      "UChicago Economics",
    ],
  },
  {
    id: "edu",
    name: "Education",
    emoji: "",
    icon: BookOpen,
    careers: [
      {
        title: "Teacher / Educator",
        icon: "✏️",
        desc: "Shape young minds in K-12 or higher ed. Median: $60k",
      },
      {
        title: "Curriculum Designer",
        icon: "📐",
        desc: "Develop educational materials and standards. Median: $72k",
      },
      {
        title: "School Administrator",
        icon: "🏫",
        desc: "Lead schools as principal or superintendent. Median: $98k",
      },
      {
        title: "EdTech Specialist",
        icon: "💻",
        desc: "Integrate technology into learning environments. Median: $68k",
      },
      {
        title: "Education Policy Advocate",
        icon: "📜",
        desc: "Drive systemic change in public education. Median: $65k",
      },
    ],
    gradSchoolPct: 60,
    topGradPrograms: [
      "Harvard Graduate School of Education",
      "Vanderbilt Peabody",
      "Teachers College Columbia",
      "Michigan Education",
    ],
  },
  {
    id: "bio",
    name: "Biology",
    emoji: "",
    icon: FlaskConical,
    careers: [
      {
        title: "Research Scientist",
        icon: "🔬",
        desc: "Conduct experiments in academia or industry. Median: $85k",
      },
      {
        title: "Biotech Analyst",
        icon: "💉",
        desc: "Evaluate life sciences companies and pipelines. Median: $90k",
      },
      {
        title: "Environmental Scientist",
        icon: "🌿",
        desc: "Protect ecosystems and natural resources. Median: $76k",
      },
      {
        title: "Physician / PA",
        icon: "🏥",
        desc: "Provide direct patient care with biology foundation. Median: $120k",
      },
      {
        title: "Genetic Counselor",
        icon: "🧬",
        desc: "Advise families on genetic risks and testing. Median: $88k",
      },
    ],
    gradSchoolPct: 68,
    topGradPrograms: [
      "MIT Biology",
      "Harvard MCB",
      "Stanford Bio",
      "Scripps Research",
    ],
  },
];

const SALARY_DATA = [
  { major: "Computer Science", tier: "Elite (T-20)", salary: 145000 },
  { major: "Computer Science", tier: "State Flagship", salary: 115000 },
  { major: "Engineering", tier: "Elite (T-20)", salary: 125000 },
  { major: "Engineering", tier: "State Flagship", salary: 98000 },
  { major: "Business", tier: "Elite (T-20)", salary: 135000 },
  { major: "Business", tier: "State Flagship", salary: 78000 },
  { major: "Medicine", tier: "Elite (T-20)", salary: 240000 },
  { major: "Medicine", tier: "Regional/State", salary: 185000 },
  { major: "Law", tier: "Elite (T-14)", salary: 205000 },
  { major: "Law", tier: "Regional", salary: 72000 },
  { major: "Psychology", tier: "Elite (T-20)", salary: 85000 },
  { major: "Psychology", tier: "State Flagship", salary: 62000 },
  { major: "Economics", tier: "Elite (T-20)", salary: 110000 },
  { major: "Economics", tier: "State Flagship", salary: 80000 },
  { major: "Biology", tier: "Elite (T-20)", salary: 88000 },
  { major: "Biology", tier: "State Flagship", salary: 68000 },
  { major: "Education", tier: "Elite (T-20)", salary: 72000 },
  { major: "Education", tier: "State Flagship", salary: 58000 },
  { major: "Arts", tier: "Elite Art School", salary: 78000 },
  { major: "Arts", tier: "State Flagship", salary: 55000 },
];

const DEFAULT_PORTFOLIO_ITEMS: PortfolioChecklistItem[] = [
  {
    itemKey: "website",
    itemLabel: "Personal Website / Portfolio",
    completed: false,
    updatedAt: BigInt(0),
  },
  {
    itemKey: "github",
    itemLabel: "GitHub Profile (5+ public repos)",
    completed: false,
    updatedAt: BigInt(0),
  },
  {
    itemKey: "project1",
    itemLabel: "Project 1 — Full write-up with results",
    completed: false,
    updatedAt: BigInt(0),
  },
  {
    itemKey: "project2",
    itemLabel: "Project 2 — Full write-up with results",
    completed: false,
    updatedAt: BigInt(0),
  },
  {
    itemKey: "project3",
    itemLabel: "Project 3 — Full write-up with results",
    completed: false,
    updatedAt: BigInt(0),
  },
  {
    itemKey: "casestudy",
    itemLabel: "Case Study or Capstone Document",
    completed: false,
    updatedAt: BigInt(0),
  },
  {
    itemKey: "contact",
    itemLabel: "Contact / About page",
    completed: false,
    updatedAt: BigInt(0),
  },
];

const RESEARCH_LINKS = [
  {
    title: "NSF REU Programs",
    org: "National Science Foundation",
    url: "https://www.nsf.gov/crssprgm/reu/",
    desc: "Research experiences for undergrads across STEM",
  },
  {
    title: "NIH Research Opportunities",
    org: "National Institutes of Health",
    url: "https://www.training.nih.gov/",
    desc: "Biomedical research training at the NIH campus",
  },
  {
    title: "MIT UROP",
    org: "MIT",
    url: "https://urop.mit.edu/",
    desc: "Undergrad research at one of the world's top labs",
  },
  {
    title: "Stanford Research",
    org: "Stanford University",
    url: "https://ughb.stanford.edu/",
    desc: "Undergraduate research and fellowship programs",
  },
  {
    title: "Harvard PRISE",
    org: "Harvard University",
    url: "https://prise.iq.harvard.edu/",
    desc: "Program for Research in Science & Engineering",
  },
  {
    title: "NSF GRFP",
    org: "National Science Foundation",
    url: "https://www.nsfgrfp.org/",
    desc: "Graduate Research Fellowship for future scientists",
  },
];

const STARTUP_COLLEGES = [
  {
    name: "MIT",
    note: "Home of the Media Lab and $3T+ in alumni-founded company value",
  },
  {
    name: "Stanford University",
    note: "Silicon Valley epicenter — Google, Yahoo, HP all started here",
  },
  {
    name: "Harvard University",
    note: "iLab and Rock Center fuel tech and social ventures",
  },
  {
    name: "Carnegie Mellon",
    note: "#1 CS program, deep ties to autonomous vehicles and robotics",
  },
  {
    name: "UC Berkeley",
    note: "LAUNCH accelerator and SkyDeck support early-stage founders",
  },
  {
    name: "Cornell University",
    note: "eLab and Entrepreneurship at Cornell (EatC) programs",
  },
  {
    name: "UPenn (Wharton)",
    note: "Wharton Entrepreneurship is the largest student startup hub",
  },
  {
    name: "University of Michigan",
    note: "Center for Entrepreneurship and $100k Accelerator grants",
  },
  {
    name: "UT Austin",
    note: "SXSW proximity + Texas Venture Labs accelerator",
  },
  {
    name: "Indiana (Kelley)",
    note: "Kelley Entrepreneurship Academy and IU Ventures",
  },
];

const STUDY_ABROAD = [
  {
    region: "Europe",
    emoji: "",
    programs: [
      "Erasmus+",
      "Copenhagen Business School",
      "LSE Summer",
      "Sciences Po Paris",
    ],
    link: "https://erasmus-plus.ec.europa.eu/",
  },
  {
    region: "Asia-Pacific",
    emoji: "",
    programs: [
      "NUS Global Programs",
      "Waseda Tokyo",
      "UNSW Sydney",
      "Yonsei Seoul",
    ],
    link: "https://www.nus.edu.sg/global/student-exchanges",
  },
  {
    region: "Latin America",
    emoji: "",
    programs: [
      "IBERO Mexico City",
      "PUC Chile",
      "FGV Brazil",
      "ITBA Buenos Aires",
    ],
    link: "https://www.studyabroad.com/latin-america",
  },
  {
    region: "Middle East",
    emoji: "",
    programs: [
      "AUB Beirut",
      "AUC Cairo",
      "NYU Abu Dhabi",
      "KAUST Saudi Arabia",
    ],
    link: "https://www.studyabroad.com/middle-east",
  },
  {
    region: "Africa",
    emoji: "",
    programs: ["UCT Cape Town", "Stellenbosch", "Ashesi Ghana", "AUN Nigeria"],
    link: "https://www.studyabroad.com/africa",
  },
  {
    region: "North America",
    emoji: "",
    programs: [
      "McGill Exchange",
      "UBC Vancouver",
      "UNAM Mexico",
      "U of Toronto",
    ],
    link: "https://studyabroad.mcgill.ca/",
  },
];

const LINKEDIN_TIPS = [
  "Use a professional headshot — profiles with photos get 21× more views",
  "Write a compelling headline beyond just your school and major",
  "Craft a summary (About section) in first person with your goals",
  "Add all internships, research, and volunteer experience",
  "List skills and get at least 5 endorsements from classmates",
  "Request recommendations from teachers or supervisors",
  "Join alumni groups for your target colleges and industries",
  "Post or share content related to your field monthly",
  "Connect with recruiters and alumni from your target companies",
  "Use the Open to Work feature for internships",
];

// ──────────────────────────────────────────────────────────────
// Sub-components
// ──────────────────────────────────────────────────────────────
type Major = (typeof MAJORS)[number];

function MajorCard({ major, index }: { major: Major; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const saveCareerPath = useSaveCareerPath();
  const removeCareerPath = useRemoveSavedCareerPath();
  const { data: saved = [] } = useGetSavedCareerPaths();

  const savedIds = new Map(
    saved.map((s) => [`${s.major}::${s.careerTitle}`, s.id]),
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
    >
      <Card className="border-border/60 hover:border-primary/40 transition-all duration-200 hover:shadow-md">
        <CardHeader
          className="cursor-pointer select-none"
          onClick={() => setExpanded((e) => !e)}
          data-ocid={`career.major_card.${index + 1}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{major.emoji}</span>
              <CardTitle className="text-lg font-semibold">
                {major.name}
              </CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {major.careers.length} careers
              </Badge>
              {expanded ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </div>
        </CardHeader>

        {expanded && (
          <CardContent className="pt-0">
            <div className="grid gap-2">
              {major.careers.map((career, ci) => {
                const key = `${major.name}::${career.title}`;
                const savedId = savedIds.get(key);
                const isSaved = savedId !== undefined;
                return (
                  <motion.div
                    key={career.title}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: ci * 0.05 }}
                    className="flex items-start justify-between rounded-lg bg-muted/40 px-3 py-2 gap-3"
                    data-ocid={`career.career_item.${ci + 1}`}
                  >
                    <div className="flex items-start gap-2 min-w-0">
                      <span className="text-base mt-0.5 shrink-0">
                        {career.icon}
                      </span>
                      <div className="min-w-0">
                        <p className="font-medium text-sm text-foreground">
                          {career.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5 break-words">
                          {career.desc}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0 h-7 w-7"
                      aria-label={isSaved ? "Unsave career" : "Save career"}
                      data-ocid={`career.save_button.${ci + 1}`}
                      onClick={() => {
                        if (isSaved && savedId !== undefined) {
                          removeCareerPath.mutate(savedId);
                        } else {
                          saveCareerPath.mutate({
                            major: major.name,
                            careerTitle: career.title,
                            description: career.desc,
                          });
                        }
                      }}
                    >
                      {isSaved ? (
                        <BookmarkCheck className="h-4 w-4 text-primary" />
                      ) : (
                        <Bookmark className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        )}
      </Card>
    </motion.div>
  );
}

function MajorToCareerSection() {
  const [search, setSearch] = useState("");
  const filtered = MAJORS.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Input
          placeholder="Search majors…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
          data-ocid="career.major_search_input"
        />
        <span className="text-sm text-muted-foreground">
          {filtered.length} majors
        </span>
      </div>
      {filtered.length === 0 ? (
        <div
          className="flex flex-col items-center gap-2 py-16 text-muted-foreground"
          data-ocid="career.majors_empty_state"
        >
          <GraduationCap className="h-10 w-10 opacity-40" />
          <p className="text-sm">No majors match your search</p>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {filtered.map((major, i) => (
            <MajorCard key={major.id} major={major} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

function SalarySection() {
  const { data: bookmarks = [], isLoading } = useGetSalaryBookmarks();
  const saveBookmark = useSaveSalaryBookmark();
  const removeBookmark = useRemoveSalaryBookmark();
  const [searchMajor, setSearchMajor] = useState("");

  const filtered = SALARY_DATA.filter((r) =>
    r.major.toLowerCase().includes(searchMajor.toLowerCase()),
  );

  const bookmarkedKeys = new Set(
    bookmarks.map((b) => `${b.major}::${b.collegeOrRegion}`),
  );
  const bookmarkMap = new Map(
    bookmarks.map((b) => [`${b.major}::${b.collegeOrRegion}`, b.id]),
  );

  return (
    <div className="space-y-4">
      <Input
        placeholder="Filter by major…"
        value={searchMajor}
        onChange={(e) => setSearchMajor(e.target.value)}
        className="max-w-xs"
        data-ocid="career.salary_search_input"
      />
      {isLoading ? (
        <div className="space-y-2">
          {["a", "b", "c", "d", "e"].map((id) => (
            <Skeleton key={`salary-skeleton-${id}`} className="h-12 w-full" />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/60">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Major</th>
                <th className="text-left px-4 py-3 font-semibold">
                  College Tier
                </th>
                <th className="text-right px-4 py-3 font-semibold">
                  Median Salary
                </th>
                <th className="text-right px-4 py-3 font-semibold">Save</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => {
                const key = `${row.major}::${row.tier}`;
                const isSaved = bookmarkedKeys.has(key);
                const bookmarkId = bookmarkMap.get(key);
                return (
                  <tr
                    key={key}
                    className="border-t border-border hover:bg-muted/30 transition-colors"
                    data-ocid={`career.salary_row.${i + 1}`}
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      {row.major}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {row.tier}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-semibold text-primary">
                      ${row.salary.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        aria-label={isSaved ? "Remove bookmark" : "Bookmark"}
                        data-ocid={`career.salary_bookmark_button.${i + 1}`}
                        onClick={() => {
                          if (isSaved && bookmarkId !== undefined) {
                            removeBookmark.mutate(bookmarkId);
                          } else {
                            saveBookmark.mutate({
                              major: row.major,
                              collegeOrRegion: row.tier,
                              medianSalary: BigInt(row.salary),
                              notes: "",
                            });
                          }
                        }}
                      >
                        {isSaved ? (
                          <BookmarkCheck className="h-4 w-4 text-primary" />
                        ) : (
                          <Bookmark className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function GradSchoolSection() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {MAJORS.map((major, i) => (
        <motion.div
          key={major.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          data-ocid={`career.grad_card.${i + 1}`}
        >
          <Card className="h-full border-border/60">
            <CardContent className="pt-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{major.emoji}</span>
                <span className="font-semibold text-foreground">
                  {major.name}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-700"
                    style={{ width: `${major.gradSchoolPct}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-primary min-w-[3rem] text-right">
                  {major.gradSchoolPct}%
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                Top grad programs:
              </p>
              <div className="flex flex-wrap gap-1">
                {major.topGradPrograms.map((prog) => (
                  <Badge key={prog} variant="outline" className="text-xs">
                    {prog}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

function LinkedInSection() {
  return (
    <div className="max-w-2xl space-y-2">
      {LINKEDIN_TIPS.map((tip, i) => (
        <motion.div
          key={tip}
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.06 }}
          className="flex items-start gap-3 rounded-lg border border-border/60 bg-card px-4 py-3"
          data-ocid={`career.linkedin_tip.${i + 1}`}
        >
          <span className="text-primary font-bold text-sm min-w-[1.5rem]">
            {i + 1}.
          </span>
          <p className="text-sm text-foreground">{tip}</p>
        </motion.div>
      ))}
    </div>
  );
}

function PortfolioSection() {
  const { data: backendItems, isLoading } = useGetPortfolioChecklist();
  const upsert = useUpsertPortfolioChecklist();

  const items: PortfolioChecklistItem[] =
    backendItems && backendItems.length > 0
      ? backendItems
      : DEFAULT_PORTFOLIO_ITEMS;

  const toggle = (key: string) => {
    const updated = items.map((item) =>
      item.itemKey === key
        ? { ...item, completed: !item.completed, updatedAt: BigInt(Date.now()) }
        : item,
    );
    upsert.mutate(updated);
  };

  const completedCount = items.filter((i) => i.completed).length;

  return (
    <div className="max-w-lg space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-primary"
            animate={{ width: `${(completedCount / items.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <span className="text-sm font-semibold text-primary">
          {completedCount}/{items.length}
        </span>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {["a", "b", "c", "d", "e", "f", "g"].map((id) => (
            <Skeleton
              key={`portfolio-skeleton-${id}`}
              className="h-12 w-full"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item, i) => (
            <motion.div
              key={item.itemKey}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 rounded-lg border border-border/60 bg-card px-4 py-3 cursor-pointer hover:bg-muted/40 transition-colors"
              data-ocid={`career.portfolio_item.${i + 1}`}
            >
              <Checkbox
                checked={item.completed}
                onCheckedChange={() => toggle(item.itemKey)}
                id={`portfolio-${item.itemKey}`}
                data-ocid={`career.portfolio_checkbox.${i + 1}`}
              />
              <span
                className={`text-sm ${
                  item.completed
                    ? "line-through text-muted-foreground"
                    : "text-foreground"
                }`}
              >
                {item.itemLabel}
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function ResearchSection() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {RESEARCH_LINKS.map((r, i) => (
        <motion.div
          key={r.title}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.07 }}
          data-ocid={`career.research_card.${i + 1}`}
        >
          <Card className="h-full border-border/60 hover:border-primary/40 transition-all hover:shadow-md">
            <CardContent className="pt-5 flex flex-col h-full">
              <div className="flex items-start gap-2 mb-2">
                <FlaskConical className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm text-foreground">
                    {r.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{r.org}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground flex-1 mb-4">
                {r.desc}
              </p>
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                data-ocid={`career.research_link.${i + 1}`}
              >
                Visit Program <ExternalLink className="h-3 w-3" />
              </a>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

function EntrepreneurSection() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {STARTUP_COLLEGES.map((college, i) => (
        <motion.div
          key={college.name}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
          className="flex items-start gap-3 rounded-lg border border-border/60 bg-card px-4 py-3 hover:border-primary/40 transition-colors"
          data-ocid={`career.startup_college.${i + 1}`}
        >
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary font-bold text-sm shrink-0">
            {i + 1}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm text-foreground">
              {college.name}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 break-words">
              {college.note}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function StudyAbroadSection() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {STUDY_ABROAD.map((region, i) => (
        <motion.div
          key={region.region}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.07 }}
          data-ocid={`career.study_abroad_card.${i + 1}`}
        >
          <Card className="h-full border-border/60 hover:border-primary/40 transition-all hover:shadow-md">
            <CardContent className="pt-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{region.emoji}</span>
                <p className="font-semibold text-foreground">{region.region}</p>
              </div>
              <div className="flex flex-wrap gap-1 mb-4">
                {region.programs.map((prog) => (
                  <Badge key={prog} variant="secondary" className="text-xs">
                    {prog}
                  </Badge>
                ))}
              </div>
              <a
                href={region.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                data-ocid={`career.study_abroad_link.${i + 1}`}
              >
                Explore Programs <ExternalLink className="h-3 w-3" />
              </a>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Page
// ──────────────────────────────────────────────────────────────
export default function CareerPage() {
  return (
    <div className="min-h-screen bg-background" data-ocid="career.page">
      {/* Hero */}
      <div className="bg-card border-b border-border/60 px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary/10">
              <Briefcase className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">
              Career &amp; Future
            </h1>
          </div>
          <p className="text-muted-foreground text-base max-w-2xl">
            Explore career paths by major, compare salaries, track your
            portfolio, find research opportunities, and plan your future — all
            in one place.
          </p>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="max-w-5xl mx-auto px-6 py-8" data-ocid="career.section">
        <Tabs defaultValue="mapper" className="space-y-6">
          <div className="overflow-x-auto pb-1">
            <TabsList className="inline-flex h-auto gap-1 flex-wrap bg-muted/50 p-1 rounded-xl">
              {[
                { value: "mapper", label: "Major \u2192 Career" },
                { value: "salary", label: "Salary Compare" },
                { value: "grad", label: "Grad School" },
                { value: "linkedin", label: "LinkedIn Tips" },
                { value: "portfolio", label: "Portfolio" },
                { value: "research", label: "Research" },
                { value: "startup", label: "Entrepreneurship" },
                { value: "abroad", label: "Study Abroad" },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="text-xs px-3 py-2 rounded-lg"
                  data-ocid={`career.tab.${tab.value}`}
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="mapper" className="mt-0">
            <SectionWrapper
              icon={<GlobeIcon className="h-5 w-5 text-primary" />}
              title="Major to Career Mapper"
              subtitle="Tap any major to expand its career paths. Bookmark what interests you."
            >
              <MajorToCareerSection />
            </SectionWrapper>
          </TabsContent>

          <TabsContent value="salary" className="mt-0">
            <SectionWrapper
              icon={<TrendingUp className="h-5 w-5 text-primary" />}
              title="Salary Comparison"
              subtitle="Median starting salaries by major and college tier. Bookmark rows for reference."
            >
              <SalarySection />
            </SectionWrapper>
          </TabsContent>

          <TabsContent value="grad" className="mt-0">
            <SectionWrapper
              icon={<GraduationCap className="h-5 w-5 text-primary" />}
              title="Graduate School Probability"
              subtitle="Typical % of graduates who pursue advanced degrees, and top programs by major."
            >
              <GradSchoolSection />
            </SectionWrapper>
          </TabsContent>

          <TabsContent value="linkedin" className="mt-0">
            <SectionWrapper
              icon={<Briefcase className="h-5 w-5 text-primary" />}
              title="LinkedIn Profile Tips"
              subtitle="10 proven steps to make your profile stand out to recruiters."
            >
              <LinkedInSection />
            </SectionWrapper>
          </TabsContent>

          <TabsContent value="portfolio" className="mt-0">
            <SectionWrapper
              icon={<BookOpen className="h-5 w-5 text-primary" />}
              title="Portfolio Builder Checklist"
              subtitle="Track what you've built. Progress is saved to your account."
            >
              <PortfolioSection />
            </SectionWrapper>
          </TabsContent>

          <TabsContent value="research" className="mt-0">
            <SectionWrapper
              icon={<FlaskConical className="h-5 w-5 text-primary" />}
              title="Research Opportunities"
              subtitle="National and university programs that open doors for undergrads."
            >
              <ResearchSection />
            </SectionWrapper>
          </TabsContent>

          <TabsContent value="startup" className="mt-0">
            <SectionWrapper
              icon={<Trophy className="h-5 w-5 text-primary" />}
              title="Entrepreneurship Track"
              subtitle="The 10 best colleges for launching your startup."
            >
              <EntrepreneurSection />
            </SectionWrapper>
          </TabsContent>

          <TabsContent value="abroad" className="mt-0">
            <SectionWrapper
              icon={<GlobeIcon className="h-5 w-5 text-primary" />}
              title="Study Abroad Finder"
              subtitle="Top exchange and semester programs by region."
            >
              <StudyAbroadSection />
            </SectionWrapper>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function SectionWrapper({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3">
        <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-primary/10 shrink-0">
          {icon}
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">{title}</h2>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
}
