import AnimatedCard from "@/components/AnimatedCard";
import PageTransition from "@/components/PageTransition";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink } from "lucide-react";
import { useState } from "react";

// ── Visa Guidance ──────────────────────────────────────────────────────────────
const visaCountries = [
  {
    id: "usa",
    flag: "🇺🇸",
    name: "USA",
    visaType: "F-1 Student Visa",
    applyBefore: "3–4 months before start",
    processingTime: "2–8 weeks",
    documents: [
      "DS-160 online application form",
      "Valid passport (6+ months validity)",
      "I-20 form from your US university",
      "SEVIS fee payment receipt ($350)",
      "Proof of financial support (bank statements)",
      "Academic transcripts & test scores (SAT/ACT, TOEFL/IELTS)",
      "Passport-size photos meeting US visa specifications",
    ],
    tips: [
      "Apply as soon as you receive your I-20 — consulates fill up fast.",
      "Carry all original documents to the interview.",
      "Show strong ties to your home country to demonstrate intent to return.",
      "Practice the 'Why this university?' question out loud.",
    ],
  },
  {
    id: "uk",
    flag: "🇬🇧",
    name: "UK",
    visaType: "Student Visa (formerly Tier 4)",
    applyBefore: "6 weeks before course start",
    processingTime: "3 weeks (standard)",
    documents: [
      "Online Visa Application (UK Visas and Immigration)",
      "Valid passport",
      "Confirmation of Acceptance for Studies (CAS) number",
      "Proof of English language (IELTS 6.0+)",
      "Financial evidence (28 consecutive days of bank statements)",
      "ATAS certificate (if required for your course)",
      "TB test results (select countries)",
    ],
    tips: [
      "Apply online, then attend a biometric appointment.",
      "Funds must be held for 28 consecutive days before applying.",
      "Check if your course requires ATAS clearance (science/engineering).",
      "Use the UKVI priority service for faster processing.",
    ],
  },
  {
    id: "canada",
    flag: "🇨🇦",
    name: "Canada",
    visaType: "Study Permit",
    applyBefore: "3–4 months before start",
    processingTime: "4–12 weeks",
    documents: [
      "Acceptance letter from a Designated Learning Institution (DLI)",
      "Valid passport",
      "Proof of financial support (CAD $10,000+/year)",
      "Proof of English/French proficiency (IELTS, TOEFL, or TEF)",
      "Statement of purpose",
      "Immigration medical exam (select countries)",
      "Biometric data (fee: CAD $85)",
    ],
    tips: [
      "Apply through IRCC online for faster processing.",
      "Co-op students may need a separate work permit.",
      "Post-Graduation Work Permit (PGWP) allows 1–3 years of work after graduation.",
      "Student Direct Stream (SDS) can speed up processing to 20 days.",
    ],
  },
  {
    id: "australia",
    flag: "🇦🇺",
    name: "Australia",
    visaType: "Student Visa (Subclass 500)",
    applyBefore: "3 months before start",
    processingTime: "1–5 months",
    documents: [
      "Confirmation of Enrolment (CoE) from your institution",
      "Valid passport",
      "Overseas Student Health Cover (OSHC) policy",
      "Financial evidence (AUD $21,041/year)",
      "English proficiency results (IELTS 5.5+ or equivalent)",
      "Genuine Temporary Entrant (GTE) statement",
      "Biometric data if required",
    ],
    tips: [
      "Apply online through ImmiAccount — no embassy interview required.",
      "Start your OSHC health cover from your intended arrival date.",
      "The GTE statement is critical — explain why you are a genuine student.",
      "Temporary Graduate Visa (subclass 485) allows 2–4 years post-study work.",
    ],
  },
  {
    id: "germany",
    flag: "🇩🇪",
    name: "Germany",
    visaType: "Student Visa / Residence Permit",
    applyBefore: "3–4 months before start",
    processingTime: "6–12 weeks",
    documents: [
      "Letter of admission from a German university",
      "Valid passport",
      "Blocked account (Sperrkonto) with €11,208 (2024 rate)",
      "Proof of health insurance",
      "Certificate of German or English language proficiency",
      "Curriculum vitae (CV)",
      "Certified copies of academic certificates",
    ],
    tips: [
      "Open a blocked account (Coracle, Fintiba, or Deutsche Bank) early.",
      "Most public universities in Germany are tuition-free.",
      "Book your embassy appointment months in advance — slots are limited.",
      "After graduation, an 18-month job-seeker visa is available.",
    ],
  },
];

// ── IELTS / TOEFL Tracker ──────────────────────────────────────────────────────
const scoreTargets = [
  { country: "🇺🇸 USA", toefl: "80+ iBT", ielts: "6.5+" },
  { country: "🇬🇧 UK", toefl: "72+ iBT", ielts: "6.0 – 6.5" },
  { country: "🇨🇦 Canada", toefl: "83+ iBT", ielts: "6.5+" },
  { country: "🇦🇺 Australia", toefl: "79+ iBT", ielts: "6.0 – 6.5" },
  { country: "🇩🇪 Germany", toefl: "88+ iBT", ielts: "6.5+" },
];

const prepResources = [
  {
    name: "British Council",
    emoji: "🇬🇧",
    desc: "Official IELTS prep materials and practice tests",
    url: "https://www.britishcouncil.org",
  },
  {
    name: "ETS (TOEFL)",
    emoji: "📝",
    desc: "Official TOEFL practice tests, tips, and score reporting",
    url: "https://www.ets.org/toefl",
  },
  {
    name: "Magoosh",
    emoji: "🚀",
    desc: "Affordable online prep with video lessons for IELTS & TOEFL",
    url: "https://magoosh.com",
  },
  {
    name: "Cambridge English",
    emoji: "📚",
    desc: "Official Cambridge IELTS practice books and exam prep",
    url: "https://www.cambridge.org/cambridgeenglish",
  },
];

// ── International Scholarships ─────────────────────────────────────────────────
const intlScholarships = [
  {
    name: "Fulbright Foreign Student Program",
    country: "🇺🇸 USA",
    amount: "Full funding",
    gpa: "3.5+",
    nationality: "Non-US",
    major: "All fields",
    deadline: "Feb 2027",
    url: "https://foreign.fulbrightonline.org",
  },
  {
    name: "Chevening Scholarship",
    country: "🇬🇧 UK",
    amount: "$35,000",
    gpa: "3.0+",
    nationality: "Select countries",
    major: "All fields",
    deadline: "Nov 2026",
    url: "https://www.chevening.org/scholarships",
  },
  {
    name: "Vanier Canada Graduate Scholarship",
    country: "🇨🇦 Canada",
    amount: "$50,000 CAD",
    gpa: "3.7+",
    nationality: "International",
    major: "Research-based",
    deadline: "Oct 2026",
    url: "https://vanier.gc.ca/en/home-accueil.html",
  },
  {
    name: "Australia Awards",
    country: "🇦🇺 Australia",
    amount: "Full funding",
    gpa: "3.0+",
    nationality: "Select Indo-Pacific",
    major: "Development focus",
    deadline: "Apr 2027",
    url: "https://www.australiaawards.gov.au",
  },
  {
    name: "DAAD Scholarship (Germany)",
    country: "🇩🇪 Germany",
    amount: "€934/month",
    gpa: "3.5+",
    nationality: "International",
    major: "All fields",
    deadline: "Nov 2026",
    url: "https://www.daad.de/en/study-and-research-in-germany/scholarships",
  },
  {
    name: "Rotary Foundation Global Grant",
    country: "🌍 Global",
    amount: "$30,000",
    gpa: "3.0+",
    nationality: "All",
    major: "Vocational training",
    deadline: "Varies",
    url: "https://www.rotary.org/en/our-programs/scholarships",
  },
  {
    name: "Commonwealth Scholarship",
    country: "🇬🇧 UK",
    amount: "Full funding",
    gpa: "First class",
    nationality: "Commonwealth nations",
    major: "All fields",
    deadline: "Dec 2026",
    url: "https://cscuk.fcdo.gov.uk/scholarships",
  },
  {
    name: "Gates Cambridge Scholarship",
    country: "🇬🇧 UK",
    amount: "Full cost",
    gpa: "3.8+",
    nationality: "Non-UK",
    major: "All fields",
    deadline: "Oct 2026",
    url: "https://www.gatescambridge.org/apply",
  },
  {
    name: "NUS Research Scholarship",
    country: "🇸🇬 Singapore",
    amount: "SGD $2,700/mo",
    gpa: "3.5+",
    nationality: "International",
    major: "STEM & Research",
    deadline: "Dec 2026",
    url: "https://nusgs.nus.edu.sg/scholarships",
  },
  {
    name: "Heinrich Böll Foundation",
    country: "🇩🇪 Germany",
    amount: "€850/month",
    gpa: "3.3+",
    nationality: "International",
    major: "All fields",
    deadline: "Mar 2027",
    url: "https://www.boell.de/en/foundation/scholarships",
  },
];

// ── Cost of Living ─────────────────────────────────────────────────────────────
const cityLiving = [
  {
    city: "🗽 New York City",
    country: "USA",
    housing: 1800,
    food: 450,
    transport: 130,
    entertainment: 200,
    total: 2580,
  },
  {
    city: "🎡 London",
    country: "UK",
    housing: 1600,
    food: 380,
    transport: 180,
    entertainment: 175,
    total: 2335,
  },
  {
    city: "🍁 Toronto",
    country: "Canada",
    housing: 1400,
    food: 350,
    transport: 120,
    entertainment: 150,
    total: 2020,
  },
  {
    city: "🦘 Sydney",
    country: "Australia",
    housing: 1500,
    food: 400,
    transport: 140,
    entertainment: 160,
    total: 2200,
  },
  {
    city: "🍺 Berlin",
    country: "Germany",
    housing: 900,
    food: 280,
    transport: 90,
    entertainment: 120,
    total: 1390,
  },
  {
    city: "🦁 Singapore",
    country: "Singapore",
    housing: 1200,
    food: 350,
    transport: 100,
    entertainment: 180,
    total: 1830,
  },
  {
    city: "🏙️ Dubai",
    country: "UAE",
    housing: 1300,
    food: 300,
    transport: 150,
    entertainment: 200,
    total: 1950,
  },
  {
    city: "⛩️ Tokyo",
    country: "Japan",
    housing: 900,
    food: 260,
    transport: 95,
    entertainment: 140,
    total: 1395,
  },
];

// ── Housing Platforms ─────────────────────────────────────────────────────────
const housingPlatforms = [
  {
    name: "Uniplaces",
    emoji: "🏠",
    desc: "Student-focused housing in 30+ European cities. Verified listings, flexible contracts.",
    price: "€350 – €1,200/mo",
    url: "https://www.uniplaces.com",
  },
  {
    name: "HousingAnywhere",
    emoji: "🌍",
    desc: "Rooms, studios, and apartments in 400+ cities worldwide for international students.",
    price: "$400 – $1,800/mo",
    url: "https://housinganywhere.com",
  },
  {
    name: "SpareRoom",
    emoji: "🛋️",
    desc: "UK's biggest flatmate-finder. Great for London, Manchester, Edinburgh student rooms.",
    price: "£400 – £1,000/mo",
    url: "https://www.spareroom.co.uk",
  },
  {
    name: "Collegiate AC",
    emoji: "🎓",
    desc: "Premium purpose-built student accommodation in the UK with on-site amenities.",
    price: "£150 – £300/week",
    url: "https://www.collegiateac.co.uk",
  },
  {
    name: "UniAcco",
    emoji: "🏡",
    desc: "Global student housing portal for USA, UK, Canada, and Australia. 1M+ listings.",
    price: "$500 – $2,000/mo",
    url: "https://uniacco.com",
  },
];

// ── Currency Converter ────────────────────────────────────────────────────────
const RATES: Record<string, number> = {
  USD: 1,
  GBP: 0.79,
  CAD: 1.36,
  AUD: 1.53,
  EUR: 0.92,
  INR: 83.5,
  SGD: 1.34,
  AED: 3.67,
  JPY: 154.5,
};
const currencies = [
  "USD",
  "GBP",
  "CAD",
  "AUD",
  "EUR",
  "INR",
  "SGD",
  "AED",
  "JPY",
];

// ── Work Permit ────────────────────────────────────────────────────────────────
const workPermits = [
  {
    country: "🇺🇸 USA",
    onCampus: "20 hrs/week",
    offCampus: "CPT/OPT required",
    postGradVisa: "OPT / H-1B",
    duration: "1–3 years",
  },
  {
    country: "🇬🇧 UK",
    onCampus: "20 hrs/week",
    offCampus: "Included in student visa",
    postGradVisa: "Graduate Visa",
    duration: "2–3 years",
  },
  {
    country: "🇨🇦 Canada",
    onCampus: "Unlimited on-campus",
    offCampus: "20 hrs/week",
    postGradVisa: "PGWP",
    duration: "1–3 years",
  },
  {
    country: "🇦🇺 Australia",
    onCampus: "Unlimited",
    offCampus: "48 hrs/fortnight",
    postGradVisa: "Subclass 485",
    duration: "2–4 years",
  },
  {
    country: "🇩🇪 Germany",
    onCampus: "120 full days/yr",
    offCampus: "120 full days/yr",
    postGradVisa: "Job Seeker Visa",
    duration: "18 months",
  },
];

// ── Cultural Guide ────────────────────────────────────────────────────────────
const culturalGuide = [
  {
    emoji: "📖",
    title: "Academic Culture",
    tips: [
      "Participate actively in class — professors value discussion.",
      "Office hours are for everyone, not just struggling students.",
      "Cite every source; plagiarism policies are strictly enforced.",
      "Group projects are graded on individual contribution.",
      "Read syllabi on day one — know all deadlines before week two.",
    ],
  },
  {
    emoji: "🤝",
    title: "Social Norms",
    tips: [
      "Small talk about weather and sports is a genuine social opener.",
      "Personal space is larger than in many cultures — about an arm's length.",
      "Being direct is not rude; vague answers can be misread as agreement.",
      "RSVPing yes and not showing up is considered disrespectful.",
      "Tipping culture varies: 18–20% in the US, less so in Europe.",
    ],
  },
  {
    emoji: "🍜",
    title: "Food & Dining",
    tips: [
      "Cook at home as much as possible — eating out daily is expensive.",
      "Campus dining plans often offer the cheapest meal option per credit.",
      "Asian grocery stores are usually cheaper than supermarkets for staples.",
      "Many cities have weekly farmer's markets with fresh produce at low cost.",
      "Learn 5 quick recipes before arriving — instant noodles gets old fast.",
    ],
  },
  {
    emoji: "🏥",
    title: "Healthcare",
    tips: [
      "Register with a GP or campus health centre within your first two weeks.",
      "Carry your health insurance card and policy number at all times.",
      "Most universities offer free or low-cost counselling sessions.",
      "Prescription medication rules differ — bring a 3-month supply with documentation.",
      "Urgent care clinics are cheaper than ER visits for non-emergency needs.",
    ],
  },
  {
    emoji: "💳",
    title: "Banking & Finance",
    tips: [
      "Open a local bank account within your first week to avoid foreign transaction fees.",
      "Wise is the cheapest way to send money internationally.",
      "Build credit early — get a student credit card and pay it in full monthly.",
      "Track expenses with a free app (YNAB, Mint, or Revolut) from day one.",
      "Notify your home bank before travel to avoid fraud blocks on your card.",
    ],
  },
  {
    emoji: "💙",
    title: "Homesickness",
    tips: [
      "Schedule weekly video calls with family at a fixed time to maintain routine.",
      "Join at least one club or society in your first month.",
      "Feeling homesick is normal — it typically peaks at 4–6 weeks and then eases.",
      "Cook a favourite meal from home when you're feeling low.",
      "Find a study buddy — shared struggle builds fast friendships.",
    ],
  },
];

// ── Sub-components ─────────────────────────────────────────────────────────────

function VisaGuidance() {
  const [activeCountry, setActiveCountry] = useState("usa");
  const visa = visaCountries.find((c) => c.id === activeCountry)!;
  return (
    <AnimatedCard delay={0.05}>
      <div className="flex flex-wrap gap-2 mb-4">
        {visaCountries.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setActiveCountry(c.id)}
            data-ocid={`intl.visa_country.${c.id}.tab`}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
              activeCountry === c.id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {c.flag} {c.name}
          </button>
        ))}
      </div>
      <Card className="border-primary/20 bg-card">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{visa.flag}</span>
            <div>
              <CardTitle className="text-lg">{visa.visaType}</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Apply {visa.applyBefore} · Processing: {visa.processingTime}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              📋 Required Documents
            </p>
            <ul className="space-y-2">
              {visa.documents.map((doc) => (
                <li
                  key={doc}
                  className="flex items-start gap-2 text-sm text-foreground"
                >
                  <span className="text-primary mt-0.5 shrink-0">✓</span>
                  {doc}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              💡 Top Tips
            </p>
            <ul className="space-y-3">
              {visa.tips.map((tip) => (
                <li
                  key={tip}
                  className="flex items-start gap-2 text-sm text-foreground"
                >
                  <span className="text-primary shrink-0">→</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </AnimatedCard>
  );
}

function IELTSTOEFLTracker() {
  const [entries, setEntries] = useState([
    { date: "2026-03-10", test: "TOEFL iBT", score: "78" },
    { date: "2026-04-22", test: "IELTS Academic", score: "6.0" },
  ]);
  const [newDate, setNewDate] = useState("");
  const [newTest, setNewTest] = useState("TOEFL iBT");
  const [newScore, setNewScore] = useState("");

  const addEntry = () => {
    if (!newDate || !newScore) return;
    setEntries((prev) => [
      ...prev,
      { date: newDate, test: newTest, score: newScore },
    ]);
    setNewDate("");
    setNewScore("");
  };

  return (
    <AnimatedCard delay={0.05}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📊 Score Log
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-38"
                data-ocid="intl.score_date.input"
              />
              <select
                value={newTest}
                onChange={(e) => setNewTest(e.target.value)}
                className="border border-input rounded-md px-3 py-1.5 text-sm bg-background text-foreground"
                data-ocid="intl.score_test.select"
              >
                <option>TOEFL iBT</option>
                <option>IELTS Academic</option>
                <option>IELTS General</option>
                <option>Duolingo English Test</option>
                <option>PTE Academic</option>
              </select>
              <Input
                placeholder="Score (e.g. 95 or 7.5)"
                value={newScore}
                onChange={(e) => setNewScore(e.target.value)}
                className="w-44"
                data-ocid="intl.score_value.input"
              />
              <Button onClick={addEntry} data-ocid="intl.add_score.button">
                Add Score
              </Button>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 font-semibold">Date</th>
                  <th className="text-left py-2 font-semibold">Test</th>
                  <th className="text-right py-2 font-semibold text-primary">
                    Score
                  </th>
                </tr>
              </thead>
              <tbody>
                {entries.map((e) => (
                  <tr
                    key={`${e.date}-${e.test}`}
                    className="border-b border-border/50 hover:bg-muted/30"
                  >
                    <td className="py-2 text-muted-foreground">{e.date}</td>
                    <td className="py-2 text-foreground">{e.test}</td>
                    <td className="py-2 text-right font-bold text-primary">
                      {e.score}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🎯 Score Requirements by Country
            </CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 font-semibold">Country</th>
                  <th className="text-center py-2 font-semibold">TOEFL iBT</th>
                  <th className="text-center py-2 font-semibold">IELTS Band</th>
                </tr>
              </thead>
              <tbody>
                {scoreTargets.map((s) => (
                  <tr
                    key={s.country}
                    className="border-b border-border/50 hover:bg-muted/30"
                  >
                    <td className="py-2 font-medium">{s.country}</td>
                    <td className="py-2 text-center text-primary font-semibold">
                      {s.toefl}
                    </td>
                    <td className="py-2 text-center text-accent font-semibold">
                      {s.ielts}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {prepResources.map((r, idx) => (
            <AnimatedCard key={r.name} delay={idx * 0.07}>
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
                data-ocid={`intl.prep_resource.item.${idx + 1}`}
              >
                <Card className="h-full hover:shadow-card hover:border-primary/30 transition-all duration-200">
                  <CardContent className="p-4">
                    <div className="text-2xl mb-2">{r.emoji}</div>
                    <p className="font-semibold text-sm text-foreground">
                      {r.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {r.desc}
                    </p>
                    <div className="flex items-center gap-1 mt-2 text-xs text-primary">
                      <ExternalLink className="h-3 w-3" /> Visit
                    </div>
                  </CardContent>
                </Card>
              </a>
            </AnimatedCard>
          ))}
        </div>
      </div>
    </AnimatedCard>
  );
}

function InternationalScholarships() {
  return (
    <AnimatedCard delay={0.05}>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {intlScholarships.map((s, idx) => (
          <AnimatedCard key={s.name} delay={idx * 0.05}>
            <Card className="h-full hover:shadow-card transition-all duration-200 hover:border-primary/30">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-sm text-foreground leading-tight">
                      {s.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {s.country}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-xs shrink-0">
                    {s.amount}
                  </Badge>
                </div>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p>
                    🎓 GPA:{" "}
                    <span className="text-foreground font-medium">{s.gpa}</span>
                  </p>
                  <p>
                    🌏 Eligibility:{" "}
                    <span className="text-foreground font-medium">
                      {s.nationality}
                    </span>
                  </p>
                  <p>
                    📚 Major:{" "}
                    <span className="text-foreground font-medium">
                      {s.major}
                    </span>
                  </p>
                  <p>
                    📅 Deadline:{" "}
                    <span className="text-primary font-semibold">
                      {s.deadline}
                    </span>
                  </p>
                </div>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  data-ocid={`intl.scholarship.item.${idx + 1}`}
                >
                  <a href={s.url} target="_blank" rel="noopener noreferrer">
                    Apply <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </AnimatedCard>
        ))}
      </div>
    </AnimatedCard>
  );
}

function CostOfLiving() {
  return (
    <AnimatedCard delay={0.05}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🌆 Monthly Cost of Living by City (USD)
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Estimates for a single student. Costs vary by lifestyle.
          </p>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 font-semibold">City</th>
                <th className="text-right py-2 font-semibold">Housing</th>
                <th className="text-right py-2 font-semibold">Food</th>
                <th className="text-right py-2 font-semibold">Transport</th>
                <th className="text-right py-2 font-semibold">Entertainment</th>
                <th className="text-right py-2 font-semibold text-primary">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {cityLiving.map((c) => (
                <tr
                  key={c.city}
                  className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                >
                  <td className="py-3 font-medium text-foreground">{c.city}</td>
                  <td className="py-3 text-right text-muted-foreground">
                    ${c.housing.toLocaleString()}
                  </td>
                  <td className="py-3 text-right text-muted-foreground">
                    ${c.food}
                  </td>
                  <td className="py-3 text-right text-muted-foreground">
                    ${c.transport}
                  </td>
                  <td className="py-3 text-right text-muted-foreground">
                    ${c.entertainment}
                  </td>
                  <td className="py-3 text-right font-bold text-primary">
                    ${c.total.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </AnimatedCard>
  );
}

function HousingFinder() {
  return (
    <AnimatedCard delay={0.05}>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {housingPlatforms.map((p, idx) => (
          <AnimatedCard key={p.name} delay={idx * 0.07}>
            <Card className="h-full hover:shadow-card transition-all duration-200 hover:border-primary/30">
              <CardContent className="p-5 flex flex-col gap-3">
                <div className="text-3xl">{p.emoji}</div>
                <div>
                  <p className="font-semibold text-foreground">{p.name}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {p.desc}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <Badge variant="secondary" className="text-xs">
                    {p.price}
                  </Badge>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary flex items-center gap-1 hover:underline"
                    data-ocid={`intl.housing.item.${idx + 1}`}
                  >
                    Visit <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </CardContent>
            </Card>
          </AnimatedCard>
        ))}
      </div>
    </AnimatedCard>
  );
}

function CurrencyConverter() {
  const [amount, setAmount] = useState("10000");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");

  const convert = () => {
    const num = Number.parseFloat(amount);
    if (Number.isNaN(num)) return "—";
    const inUSD = num / RATES[fromCurrency];
    const result = inUSD * RATES[toCurrency];
    return result.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  return (
    <AnimatedCard delay={0.05}>
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            💱 Currency Converter
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Approximate rates for tuition planning. Not live rates.
          </p>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <Label className="text-xs font-semibold">Amount</Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 text-lg font-semibold"
              data-ocid="intl.currency_amount.input"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-semibold">From</Label>
              <Select value={fromCurrency} onValueChange={setFromCurrency}>
                <SelectTrigger
                  className="mt-1"
                  data-ocid="intl.currency_from.select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-semibold">To</Label>
              <Select value={toCurrency} onValueChange={setToCurrency}>
                <SelectTrigger
                  className="mt-1"
                  data-ocid="intl.currency_to.select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="rounded-xl bg-primary/5 border border-primary/20 p-5 text-center">
            <p className="text-xs text-muted-foreground mb-1">
              {amount} {fromCurrency} ≈
            </p>
            <p className="text-4xl font-bold text-primary">{convert()}</p>
            <p className="text-sm text-muted-foreground mt-1">{toCurrency}</p>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Rates: 1 USD = {RATES[toCurrency]} {toCurrency}. Fixed reference
            rates.
          </p>
        </CardContent>
      </Card>
    </AnimatedCard>
  );
}

function WorkPermits() {
  return (
    <AnimatedCard delay={0.05}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            💼 Work Permit Rules by Country
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 font-semibold">Country</th>
                <th className="text-left py-2 font-semibold">On-Campus</th>
                <th className="text-left py-2 font-semibold">Off-Campus</th>
                <th className="text-left py-2 font-semibold">Post-Grad Visa</th>
                <th className="text-center py-2 font-semibold">Duration</th>
              </tr>
            </thead>
            <tbody>
              {workPermits.map((w) => (
                <tr
                  key={w.country}
                  className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                >
                  <td className="py-3 font-medium text-foreground">
                    {w.country}
                  </td>
                  <td className="py-3 text-muted-foreground text-xs">
                    {w.onCampus}
                  </td>
                  <td className="py-3 text-muted-foreground text-xs">
                    {w.offCampus}
                  </td>
                  <td className="py-3">
                    <Badge variant="secondary" className="text-xs">
                      {w.postGradVisa}
                    </Badge>
                  </td>
                  <td className="py-3 text-center text-primary font-semibold text-xs">
                    {w.duration}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </AnimatedCard>
  );
}

function CulturalAdjustment() {
  return (
    <AnimatedCard delay={0.05}>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {culturalGuide.map((g, idx) => (
          <AnimatedCard key={g.title} delay={idx * 0.07}>
            <Card className="h-full hover:shadow-card transition-all duration-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <span className="text-2xl">{g.emoji}</span> {g.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {g.tips.map((tip) => (
                    <li
                      key={tip}
                      className="flex items-start gap-2 text-sm text-foreground"
                    >
                      <span className="text-primary shrink-0 mt-0.5">•</span>
                      <span className="text-muted-foreground leading-relaxed">
                        {tip}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </AnimatedCard>
        ))}
      </div>
    </AnimatedCard>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────────
export default function InternationalPage() {
  return (
    <PageTransition className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 flex items-center gap-3">
        <span className="text-4xl">🌍</span>
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            International Students
          </h1>
          <p className="text-muted-foreground mt-1">
            Visas, language tests, scholarships, housing, costs — everything you
            need to study abroad.
          </p>
        </div>
      </div>

      <Tabs defaultValue="visa" className="w-full">
        <TabsList className="flex flex-wrap h-auto gap-1 mb-6 bg-muted/60 p-1">
          <TabsTrigger value="visa" data-ocid="intl.visa.tab">
            🛃 Visa Guide
          </TabsTrigger>
          <TabsTrigger value="ielts" data-ocid="intl.ielts.tab">
            📝 IELTS/TOEFL
          </TabsTrigger>
          <TabsTrigger value="scholarships" data-ocid="intl.scholarships.tab">
            🎓 Scholarships
          </TabsTrigger>
          <TabsTrigger value="costs" data-ocid="intl.costs.tab">
            🌆 Cost of Living
          </TabsTrigger>
          <TabsTrigger value="housing" data-ocid="intl.housing.tab">
            🏠 Housing
          </TabsTrigger>
          <TabsTrigger value="currency" data-ocid="intl.currency.tab">
            💱 Currency
          </TabsTrigger>
          <TabsTrigger value="work" data-ocid="intl.work.tab">
            💼 Work Permit
          </TabsTrigger>
          <TabsTrigger value="culture" data-ocid="intl.culture.tab">
            🤝 Cultural Guide
          </TabsTrigger>
        </TabsList>

        <TabsContent value="visa">
          <VisaGuidance />
        </TabsContent>
        <TabsContent value="ielts">
          <IELTSTOEFLTracker />
        </TabsContent>
        <TabsContent value="scholarships">
          <InternationalScholarships />
        </TabsContent>
        <TabsContent value="costs">
          <CostOfLiving />
        </TabsContent>
        <TabsContent value="housing">
          <HousingFinder />
        </TabsContent>
        <TabsContent value="currency">
          <CurrencyConverter />
        </TabsContent>
        <TabsContent value="work">
          <WorkPermits />
        </TabsContent>
        <TabsContent value="culture">
          <CulturalAdjustment />
        </TabsContent>
      </Tabs>
    </PageTransition>
  );
}
