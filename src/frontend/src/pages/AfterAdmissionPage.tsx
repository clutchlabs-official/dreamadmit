import AnimatedCard from "@/components/AnimatedCard";
import PageTransition from "@/components/PageTransition";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "motion/react";
import { useState } from "react";

// ─────────────── Pre-Arrival Checklist ────────────────────────────────────────
const CHECKLIST_ITEMS = [
  { key: "housing", emoji: "", label: "Housing confirmed" },
  { key: "visa", emoji: "", label: "Student visa obtained" },
  { key: "insurance", emoji: "", label: "Health insurance secured" },
  { key: "banking", emoji: "", label: "Bank account / card set up" },
  { key: "sim", emoji: "", label: "Phone SIM / local number" },
  { key: "campus_id", emoji: "", label: "Campus student ID ready" },
  { key: "flight", emoji: "", label: "Flight booked" },
  { key: "orientation", emoji: "", label: "Orientation registered" },
];

function useChecklist() {
  const stored = (): Record<string, boolean> => {
    try {
      return JSON.parse(
        localStorage.getItem("after_admission_checklist") ?? "{}",
      ) as Record<string, boolean>;
    } catch {
      return {};
    }
  };
  const [checked, setChecked] = useState<Record<string, boolean>>(stored);

  const toggle = (key: string) => {
    setChecked((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      localStorage.setItem("after_admission_checklist", JSON.stringify(next));
      return next;
    });
  };
  return { checked, toggle };
}

function PreArrivalChecklist() {
  const { checked, toggle } = useChecklist();
  const doneCount = CHECKLIST_ITEMS.filter((i) => checked[i.key]).length;
  const total = CHECKLIST_ITEMS.length;
  const pct = Math.round((doneCount / total) * 100);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {doneCount} / {total} done
        </p>
        <Badge
          variant="outline"
          className={pct === 100 ? "border-green-500 text-green-600" : ""}
        >
          {pct === 100 ? "All done!" : `${pct}% complete`}
        </Badge>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
      <div className="grid sm:grid-cols-2 gap-3 pt-1">
        {CHECKLIST_ITEMS.map((item, i) => (
          <motion.label
            key={item.key}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            htmlFor={`checklist-${item.key}`}
            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
              checked[item.key]
                ? "border-primary/40 bg-primary/5"
                : "border-border bg-card hover:bg-muted/40"
            }`}
            data-ocid={`after_admission.checklist.item.${i + 1}`}
          >
            <Checkbox
              id={`checklist-${item.key}`}
              checked={!!checked[item.key]}
              onCheckedChange={() => toggle(item.key)}
              data-ocid={`after_admission.checkbox.${i + 1}`}
            />
            <span
              className={`text-sm font-medium ${
                checked[item.key]
                  ? "line-through text-muted-foreground"
                  : "text-foreground"
              }`}
            >
              {item.label}
            </span>
          </motion.label>
        ))}
      </div>
    </div>
  );
}

// ─────────────── Packing List Generator ──────────────────────────────────────
type Country = "us" | "uk" | "canada" | "australia" | "india" | "germany";
type Climate = "tropical" | "temperate" | "cold";

const BASE_PACKING = [
  "Passport & visa documents",
  "Admission letter & enrollment form",
  "Prescription medications (3-month supply)",
  "Universal travel adapter",
  "Laptop & charger",
  "Textbooks / e-reader",
  "Toiletries (1-week supply)",
  "Credit / debit card",
  "Luggage locks",
];

const CLIMATE_PACKING: Record<Climate, string[]> = {
  tropical: [
    "Lightweight cotton T-shirts (x10)",
    "Shorts & light trousers",
    "Compact umbrella / rain poncho",
    "Sunglasses & sunscreen SPF 50+",
    "Breathable sneakers",
  ],
  temperate: [
    "T-shirts (x8) + long-sleeve shirts (x4)",
    "Light jacket / hoodie",
    "Jeans / chinos (x3)",
    "Socks & underwear (x10)",
    "Versatile sneakers + 1 formal pair",
  ],
  cold: [
    "Heavy winter coat",
    "Scarf, gloves & woollen hat",
    "Insulated waterproof boots",
    "Thermal base layers",
    "Touch-screen gloves for phone use",
  ],
};

const COUNTRY_EXTRAS: Record<Country, string[]> = {
  us: [
    "Insurance card & healthcare provider info",
    "Social Security Number documents",
  ],
  uk: ["BRP collection letter", "200 GBP cash for first week"],
  canada: ["SIN application docs", "Proof of enrolment for CRA"],
  australia: ["High-SPF sunscreen (very important!)", "Insect repellent"],
  india: [
    "Familiar snacks from home (comfort!)",
    "Power bank (load-shedding areas)",
  ],
  germany: [
    "Anmeldung registration docs",
    "Deutschlandticket (student transport)",
  ],
};

function PackingListGenerator() {
  const [country, setCountry] = useState<Country>("us");
  const [climate, setClimate] = useState<Climate>("temperate");
  const [copied, setCopied] = useState(false);

  const list = [
    ...BASE_PACKING,
    ...CLIMATE_PACKING[climate],
    ...COUNTRY_EXTRAS[country],
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(list.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-36">
          <span className="text-xs font-medium text-muted-foreground mb-1 block">
            Destination Country
          </span>
          <Select
            value={country}
            onValueChange={(v) => setCountry(v as Country)}
          >
            <SelectTrigger data-ocid="after_admission.packing.country_select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="us">United States</SelectItem>
              <SelectItem value="uk">United Kingdom</SelectItem>
              <SelectItem value="canada">Canada</SelectItem>
              <SelectItem value="australia">Australia</SelectItem>
              <SelectItem value="india">India</SelectItem>
              <SelectItem value="germany">Germany</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 min-w-36">
          <span className="text-xs font-medium text-muted-foreground mb-1 block">
            Climate
          </span>
          <Select
            value={climate}
            onValueChange={(v) => setClimate(v as Climate)}
          >
            <SelectTrigger data-ocid="after_admission.packing.climate_select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tropical">Tropical / Hot</SelectItem>
              <SelectItem value="temperate">Temperate / Mild</SelectItem>
              <SelectItem value="cold">Cold / Winter</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="rounded-xl border border-border bg-muted/30 p-4">
        <ul className="space-y-1.5">
          {list.map((item, i) => (
            <motion.li
              key={item}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className="flex items-center gap-2 text-sm text-foreground"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0" />
              {item}
            </motion.li>
          ))}
        </ul>
      </div>
      <Button
        type="button"
        variant="outline"
        onClick={handleCopy}
        data-ocid="after_admission.packing.copy_button"
        className="gap-2"
      >
        {copied ? "Copied!" : "Copy List"}
      </Button>
    </div>
  );
}

// ─────────────── First Week Survival Guide ────────────────────────────────────
const FIRST_WEEK = [
  {
    day: "Day 1",
    emoji: "",
    title: "Move In",
    tips: [
      "Pick up your room key from the housing office",
      "Unpack essentials first — bedding, toiletries, chargers",
      "Introduce yourself to neighbours on your floor",
      "Find the nearest grocery store or campus dining hall",
    ],
  },
  {
    day: "Day 2",
    emoji: "",
    title: "Orientation",
    tips: [
      "Arrive early — seats fill up fast!",
      "Bring a notepad for important dates and department contacts",
      "Collect your student ID card if not done already",
      "Connect your college email to your phone",
    ],
  },
  {
    day: "Day 3",
    emoji: "",
    title: "Campus Tour",
    tips: [
      "Locate your classrooms before the first day of lectures",
      "Find the library — you'll spend a lot of time there!",
      "Identify the student health centre and nearest pharmacy",
      "Grab a campus map (physical + app)",
    ],
  },
  {
    day: "Day 4",
    emoji: "",
    title: "Register for Courses",
    tips: [
      "Log into your student portal with your new credentials",
      "Check prerequisites for every course",
      "Meet your academic advisor if you're unsure",
      "Add courses to your waitlist as backup",
    ],
  },
  {
    day: "Day 5",
    emoji: "",
    title: "Meet Your Dorm Neighbours",
    tips: [
      "Knock on doors and introduce yourself — most people are just as nervous",
      "Exchange contact numbers for emergencies",
      "Suggest a group dinner in the dining hall",
      "Follow your dorm's social media or WhatsApp group",
    ],
  },
];

function FirstWeekGuide() {
  const [activeDay, setActiveDay] = useState(0);
  const day = FIRST_WEEK[activeDay];

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {FIRST_WEEK.map((d, i) => (
          <Button
            key={d.day}
            type="button"
            variant={activeDay === i ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveDay(i)}
            data-ocid={`after_admission.week.day_${i + 1}.tab`}
            className="gap-1"
          >
            {d.day}
          </Button>
        ))}
      </div>
      <motion.div
        key={activeDay}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-xl border border-border bg-muted/30 p-5"
      >
        <h3 className="font-display font-bold text-lg text-foreground mb-3">
          {day.day} — {day.title}
        </h3>
        <ul className="space-y-2">
          {day.tips.map((tip, i) => (
            <li
              key={tip}
              className="flex items-start gap-2 text-sm text-foreground"
            >
              <span className="mt-1 text-primary font-bold text-xs bg-primary/10 rounded-full w-5 h-5 flex items-center justify-center shrink-0">
                {i + 1}
              </span>
              {tip}
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}

// ─────────────── Course Registration Guide ───────────────────────────────────
const COURSE_STEPS = [
  {
    step: 1,
    title: "Get your portal credentials",
    tip: "Your college email inbox should have a welcome message with login details.",
  },
  {
    step: 2,
    title: "Meet your academic advisor",
    tip: "They'll review your intended major and suggest first-semester courses tailored to you.",
  },
  {
    step: 3,
    title: "Check degree requirements",
    tip: "Download your program's course catalogue and mark required vs elective courses.",
  },
  {
    step: 4,
    title: "Build a draft schedule",
    tip: "Use tools like Rate My Professor to check instructor reviews before picking sections.",
  },
  {
    step: 5,
    title: "Register on your assigned date",
    tip: "Registration opens in waves — upperclassmen first. Set a calendar reminder!",
  },
  {
    step: 6,
    title: "Add yourself to waitlists",
    tip: "Waitlists move quickly in week 1 as students drop courses. Attend the first class anyway.",
  },
  {
    step: 7,
    title: "Confirm enrolment & pay fees",
    tip: "Check your portal for payment or fee confirmation deadlines to avoid being dropped.",
  },
];

function CourseRegistrationGuide() {
  return (
    <div className="space-y-3">
      {COURSE_STEPS.map((s, i) => (
        <motion.div
          key={s.step}
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.06 }}
          className="flex gap-4 p-4 rounded-xl border border-border bg-card hover:bg-muted/30 transition-colors"
          data-ocid={`after_admission.course_reg.step.${i + 1}`}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
            {s.step}
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm">{s.title}</p>
            <p className="text-muted-foreground text-xs mt-0.5">{s.tip}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ─────────────── Club Finder Tips ────────────────────────────────────────────
const CLUBS = [
  {
    emoji: "",
    cat: "Academic",
    tip: "Check department notice boards and attend the first club fair — usually Week 2.",
  },
  {
    emoji: "",
    cat: "Sports",
    tip: "Most colleges have intramural leagues with no tryouts needed — great for casual play.",
  },
  {
    emoji: "",
    cat: "Cultural",
    tip: "International student associations host cultural nights — perfect for making friends fast.",
  },
  {
    emoji: "",
    cat: "Volunteer",
    tip: "Service learning clubs count toward community hours and look great on grad school apps.",
  },
  {
    emoji: "",
    cat: "Arts",
    tip: "Drama, music, and art societies welcome beginners. Show up, no portfolio needed.",
  },
  {
    emoji: "",
    cat: "Business",
    tip: "Entrepreneurship and consulting clubs often bring in recruiters from top companies.",
  },
];

function ClubFinderTips() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {CLUBS.map((club, i) => (
        <motion.div
          key={club.cat}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.07, ease: [0.34, 1.56, 0.64, 1] }}
          className="p-4 rounded-xl border border-border bg-card hover:border-primary/40 hover:shadow-sm transition-all duration-200"
          data-ocid={`after_admission.clubs.item.${i + 1}`}
        >
          <p className="font-semibold text-foreground text-sm mb-1">
            {club.cat} Clubs
          </p>
          <p className="text-muted-foreground text-xs leading-relaxed">
            {club.tip}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

// ─────────────── Professor Email Templates ───────────────────────────────────
const TEMPLATES = [
  {
    label: "General Introduction",
    emoji: "",
    subject: "Introduction from a New Student — [Course Name]",
    body: "Dear Professor [Last Name],\n\nMy name is [Your Name] and I am a first-year student enrolled in your [Course Name] course (Section [XX], [Semester/Year]).\n\nI am excited to be joining your class and look forward to learning from you. Please let me know if there is anything I can do to prepare before our first session.\n\nThank you for your time.\n\nBest regards,\n[Your Full Name]\n[Student ID] | [Email Address]",
  },
  {
    label: "Research Inquiry",
    emoji: "",
    subject: "Interest in Research Opportunities — [Your Major]",
    body: "Dear Professor [Last Name],\n\nI am [Your Name], a [Year] student majoring in [Major] at [University Name]. I recently read your paper on [Topic/Lab Area] and found it incredibly inspiring.\n\nI am reaching out to inquire whether you have any openings for an undergraduate research assistant in your lab. I am comfortable with [relevant skills] and would be happy to contribute [X hours/week].\n\nI have attached my CV for your reference. I would welcome the chance to speak with you at your convenience.\n\nThank you for considering my request.\n\nSincerely,\n[Your Full Name]\n[Student ID] | [Phone Number]",
  },
];

function ProfessorEmailTemplates() {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-4">
      {TEMPLATES.map((tpl) => (
        <div
          key={tpl.label}
          className="rounded-xl border border-border overflow-hidden"
        >
          <div className="flex items-center justify-between px-4 py-3 bg-muted/40">
            <span className="font-semibold text-sm text-foreground flex items-center gap-2">
              {tpl.label}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() =>
                handleCopy(tpl.label, `Subject: ${tpl.subject}\n\n${tpl.body}`)
              }
              data-ocid={`after_admission.email.copy_${tpl.label.toLowerCase().replace(/ /g, "_")}.button`}
              className="gap-1 text-xs"
            >
              {copied === tpl.label ? "Copied" : "Copy"}
            </Button>
          </div>
          <div className="px-4 py-3 bg-card">
            <p className="text-xs font-semibold text-muted-foreground mb-1">
              Subject:
            </p>
            <p className="text-xs text-foreground mb-3">{tpl.subject}</p>
            <pre className="text-xs text-foreground whitespace-pre-wrap font-body leading-relaxed">
              {tpl.body}
            </pre>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────── Banking Setup Guide ─────────────────────────────────────────
const BANKING = [
  {
    country: "United States",
    key: "us",
    docs: [
      "Passport",
      "Student visa (F-1/J-1)",
      "College I-20 or DS-2019",
      "Campus address",
    ],
    tip: "You don't need an SSN to open a student account — Chase, Bank of America, and Wells Fargo all accept your college ID and I-20.",
    bank: "Chase / Bank of America",
  },
  {
    country: "United Kingdom",
    key: "uk",
    docs: [
      "Passport",
      "BRP (Biometric Residence Permit)",
      "College enrolment letter",
      "UK address proof",
    ],
    tip: "Monzo and Starling are app-based banks that open accounts within 24 hours with minimal paperwork — ideal for new arrivals.",
    bank: "Monzo / Starling / Barclays",
  },
  {
    country: "Canada",
    key: "canada",
    docs: [
      "Passport",
      "Study permit",
      "College acceptance letter",
      "SIN (apply at Service Canada)",
    ],
    tip: "Apply for your Social Insurance Number (SIN) on arrival — you need it to work on campus and file taxes.",
    bank: "TD / RBC / Scotiabank",
  },
  {
    country: "Australia",
    key: "australia",
    docs: [
      "Passport",
      "Student visa (subclass 500)",
      "CoE (Confirmation of Enrolment)",
    ],
    tip: "Commonwealth Bank and ANZ have dedicated student accounts with zero monthly fees. Open before you arrive using the app.",
    bank: "Commonwealth Bank / ANZ",
  },
  {
    country: "India",
    key: "india",
    docs: ["Aadhaar card", "PAN card", "College ID", "Address proof"],
    tip: "SBI and HDFC have zero-balance student accounts. For UPI payments, set up PhonePe or Google Pay right away.",
    bank: "SBI / HDFC / Kotak",
  },
];

function BankingSetupGuide() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      {BANKING.map((b) => (
        <div
          key={b.key}
          className="rounded-xl border border-border overflow-hidden"
        >
          <button
            type="button"
            onClick={() => setOpen(open === b.key ? null : b.key)}
            className="flex w-full items-center justify-between px-4 py-3 bg-card hover:bg-muted/30 transition-colors text-left"
            data-ocid={`after_admission.banking.${b.key}.toggle`}
            aria-expanded={open === b.key}
          >
            <span className="font-semibold text-sm text-foreground">
              {b.country}
            </span>
            <motion.span
              animate={{ rotate: open === b.key ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-muted-foreground"
            >
              ▾
            </motion.span>
          </button>
          {open === b.key && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="px-4 pb-4 pt-2 bg-muted/20 border-t border-border"
            >
              <p className="text-xs font-semibold text-muted-foreground mb-2">
                Documents required:
              </p>
              <ul className="space-y-1 mb-3">
                {b.docs.map((doc) => (
                  <li
                    key={doc}
                    className="flex items-center gap-2 text-sm text-foreground"
                  >
                    <span className="text-primary">✓</span> {doc}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-muted-foreground italic mb-1">
                {b.tip}
              </p>
              <Badge variant="secondary" className="text-xs mt-1">
                Recommended: {b.bank}
              </Badge>
            </motion.div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─────────────── Roommate Finder Guide ───────────────────────────────────────
const ROOMMATE_QUESTIONS = [
  "What's your typical sleep and wake-up time?",
  "Do you prefer silence when studying or some background noise?",
  "How often do you plan to clean shared spaces?",
  "Are you okay with music or TV on in the room?",
  "Will you frequently have guests / friends over?",
  "Do you prefer a warm room or a cooler one?",
  "Are you okay sharing food or do you prefer to keep things separate?",
  "Are you a light or heavy sleeper?",
];

const ROOMMATE_TIPS = [
  {
    emoji: "",
    tip: "Set house rules early — agree on quiet hours, cleaning, and guests in Week 1.",
  },
  {
    emoji: "",
    tip: "Write a roommate agreement — your RA or housing office may have a template.",
  },
  {
    emoji: "",
    tip: "Address small issues immediately — don't let them build into bigger conflicts.",
  },
  {
    emoji: "",
    tip: "Create a shared group chat for quick daily communication.",
  },
];

function RoommateFinderGuide() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(
      ROOMMATE_QUESTIONS.map((q, i) => `${i + 1}. ${q}`).join("\n"),
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-foreground">
            Questions to ask your roommate
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopy}
            data-ocid="after_admission.roommate.copy_button"
            className="gap-1 text-xs"
          >
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
        <ul className="space-y-2">
          {ROOMMATE_QUESTIONS.map((q, i) => (
            <motion.li
              key={q}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="flex items-start gap-2 text-sm text-foreground p-2.5 rounded-lg bg-muted/30 border border-border"
              data-ocid={`after_admission.roommate.question.${i + 1}`}
            >
              <span className="text-primary font-bold text-xs mt-0.5">
                {i + 1}.
              </span>
              {q}
            </motion.li>
          ))}
        </ul>
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground mb-3">Pro tips</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {ROOMMATE_TIPS.map((tip) => (
            <div
              key={tip.tip}
              className="flex items-start gap-3 p-3 rounded-xl border border-border bg-card"
            >
              <p className="text-xs text-muted-foreground leading-relaxed">
                {tip.tip}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────── Section Wrapper ─────────────────────────────────────────────
interface SectionProps {
  id: string;
  emoji: string;
  title: string;
  description: string;
  delay?: number;
  children: React.ReactNode;
}

function Section({
  id,
  title,
  description,
  delay = 0,
  children,
}: Omit<SectionProps, "emoji"> & { emoji?: string }) {
  return (
    <AnimatedCard delay={delay}>
      <Card data-ocid={`after_admission.${id}.section`}>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 font-display text-xl">
            <div>
              <div className="text-foreground">{title}</div>
              <p className="font-body text-sm font-normal text-muted-foreground mt-0.5">
                {description}
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </AnimatedCard>
  );
}

// ─────────────── Main Page ────────────────────────────────────────────────────
export default function AfterAdmissionPage() {
  return (
    <PageTransition className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Hero */}
      <div className="mb-10 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="font-display text-4xl font-bold text-foreground mb-3"
        >
          You Got In — Now What?
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="text-muted-foreground text-lg max-w-xl mx-auto"
        >
          Everything you need to prepare for your first day, from packing to
          professors. You've earned this — let's make sure you show up ready.
        </motion.p>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        <Section
          id="checklist"
          emoji=""
          title="Pre-Arrival Checklist"
          description="Tick off everything before you board that flight!"
          delay={0}
        >
          <PreArrivalChecklist />
        </Section>

        <Section
          id="packing"
          emoji=""
          title="Packing List Generator"
          description="Customised packing list based on your destination and climate."
          delay={0.05}
        >
          <PackingListGenerator />
        </Section>

        <Section
          id="first_week"
          emoji=""
          title="First Week Survival Guide"
          description="Day-by-day guide to nailing your first week on campus."
          delay={0.1}
        >
          <FirstWeekGuide />
        </Section>

        <Section
          id="course_reg"
          emoji=""
          title="Course Registration Guide"
          description="Step-by-step walkthrough for picking and locking in your classes."
          delay={0.15}
        >
          <CourseRegistrationGuide />
        </Section>

        <Section
          id="clubs"
          emoji=""
          title="Club Finder Tips"
          description="Find your people — tips for every type of club and society."
          delay={0.2}
        >
          <ClubFinderTips />
        </Section>

        <Section
          id="emails"
          emoji=""
          title="Professor Introduction Email Templates"
          description="Copy-ready emails for your first professor outreach."
          delay={0.25}
        >
          <ProfessorEmailTemplates />
        </Section>

        <Section
          id="banking"
          emoji=""
          title="Banking Setup Guide"
          description="How to open a bank account in your destination country."
          delay={0.3}
        >
          <BankingSetupGuide />
        </Section>

        <Section
          id="roommate"
          emoji=""
          title="Roommate Finder Guide"
          description="Questions to ask and tips for building a great roommate relationship."
          delay={0.35}
        >
          <RoommateFinderGuide />
        </Section>
      </div>

      {/* Footer encouragement */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="mt-10 text-center p-8 rounded-2xl bg-primary/5 border border-primary/20"
      >
        <p className="font-display text-xl font-bold text-foreground mb-2">
          You're going to be amazing.
        </p>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          Millions of students felt exactly as nervous as you do right now.
          Every single one of them figured it out — and so will you.
        </p>
      </motion.div>
    </PageTransition>
  );
}
