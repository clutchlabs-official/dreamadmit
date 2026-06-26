import PageTransition from "@/components/PageTransition";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Check } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

interface PlanSection {
  heading: string;
  items: string[];
}

interface PlanTier {
  id: string;
  name: string;
  price: string;
  period?: string;
  badge: string;
  note?: string;
  sections?: PlanSection[];
  simpleFeatures?: string[];
  highlight?: boolean;
}

const PLANS: PlanTier[] = [
  {
    id: "student-pro",
    name: "Student Pro",
    price: "Rs.299",
    period: "/month",
    badge: "For serious applicants",
    sections: [
      {
        heading: "AI Tools",
        items: [
          "Unlimited AI essay reviewer with detailed feedback — grammar, story, impact score",
          "AI college match score with full explanation of why",
          "What if simulator — change your grades and see which colleges open up",
          "AI personal statement rewriter — paste your essay, AI makes it better",
          "AI interview coach — practice with questions specific to your target college",
          "AI major recommender — based on your interests and strengths",
          "AI scholarship matcher — finds scholarships specifically for your profile",
        ],
      },
      {
        heading: "Planning",
        items: [
          "Unlimited college searches",
          "Full application deadline calendar synced to your phone",
          "Weekly personalised action plan — AI tells you exactly what to do this week",
          "Reach match safety sorter — AI automatically sorts your college list",
          "Score improvement roadmap — personalised study plan to hit your target score",
          "Complete extracurricular tracker with impact scoring",
          "Document vault — store all certificates, marksheets, IDs safely",
        ],
      },
      {
        heading: "Support",
        items: [
          "24/7 AI counsellor chat — ask anything about admissions anytime",
          "Parent progress dashboard — parents see your application progress",
          "Application stress checker — mental wellness check in",
          "Priority customer support",
        ],
      },
    ],
  },
  {
    id: "student-premium",
    name: "Student Premium",
    price: "Rs.599",
    period: "/month",
    badge: "Most Popular",
    note: "Everything in Pro, plus:",
    highlight: true,
    sections: [
      {
        heading: "Exclusive AI Features",
        items: [
          "AI admission officer simulator — submit your application and AI reviews it like a real officer",
          "Essay scoring against real admitted students",
          "Acceptance probability updater — updates your chances daily as you improve",
          "AI gap analyser — tells you exactly what is missing from your application",
          "Competitive applicant comparison — how you stack up against other applicants",
          "Red flag detector — spots anything that could hurt your application",
        ],
      },
      {
        heading: "Premium Content",
        items: [
          "Insider college reports — real data on what each college actually looks for",
          "Successful essay examples from admitted students",
          "Interview recordings from students who got in",
          "Scholarship negotiation scripts — how to ask for more money",
          "Waitlist appeal letter AI writer",
          "Deferral response letter AI writer",
          "Financial aid appeal letter AI writer",
        ],
      },
      {
        heading: "Human Support",
        items: [
          "One 30 minute live counsellor call per month",
          "Essay reviewed by a real human counsellor once per month",
          "WhatsApp support — message a real person",
        ],
      },
    ],
  },
  {
    id: "family",
    name: "Family Plan",
    price: "Rs.899",
    period: "/month",
    badge: "For families",
    note: "Everything in Premium, plus:",
    simpleFeatures: [
      "Separate parent dashboard",
      "Parent gets weekly progress report",
      "Family financial aid planning tool",
      "Parent to counsellor direct messaging",
      "Sibling account included",
    ],
  },
  {
    id: "admission-officer",
    name: "Admission Officer",
    price: "Rs.2,999",
    period: "/month per college",
    badge: "For admission officers",
    sections: [
      {
        heading: "AI Admission Officer Tools",
        items: [
          "AI application scorer — automatically scores every application 1-100",
          "AI essay quality rater — rates essays without officer reading them",
          "Fraud document detector — AI spots fake certificates instantly",
          "Diversity balance advisor — AI helps build a balanced class",
          "Yield predictor — AI predicts who will actually enrol if accepted",
          "Interview question generator — personalised questions per applicant",
          "Scholarship recommendation AI — who deserves money most",
          "Waitlist rank AI — automatically ranks waitlisted students",
          "Acceptance letter personaliser — AI writes unique letters for each student",
          "Rejection feedback generator — kind personalised rejection reasons",
        ],
      },
      {
        heading: "Management",
        items: [
          "Full application dashboard",
          "Bulk decision sending",
          "Analytics and reporting",
          "Communication portal",
          "Document verification",
        ],
      },
    ],
  },
  {
    id: "college-enterprise",
    name: "College Enterprise",
    price: "Rs.14,999",
    period: "/month",
    badge: "For colleges",
    simpleFeatures: [
      "Unlimited officer accounts",
      "Full AI suite",
      "Custom branding",
      "Dedicated account manager",
      "API integration with existing systems",
      "Custom reporting",
    ],
  },
];

function FeatureList({
  sections,
  simpleFeatures,
  accentClass,
}: {
  sections?: PlanSection[];
  simpleFeatures?: string[];
  accentClass: string;
}) {
  if (simpleFeatures) {
    return (
      <ul className="space-y-2.5">
        {simpleFeatures.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-sm">
            <Check className={`h-4 w-4 mt-0.5 shrink-0 ${accentClass}`} />
            <span className="text-foreground leading-relaxed">{f}</span>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <div className="space-y-4">
      {sections?.map((section) => (
        <div key={section.heading}>
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
            {section.heading}
          </p>
          <ul className="space-y-2">
            {section.items.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm">
                <Check className={`h-4 w-4 mt-0.5 shrink-0 ${accentClass}`} />
                <span className="text-foreground leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function PlanCard({ plan, index }: { plan: PlanTier; index: number }) {
  const isHighlighted = plan.highlight;
  const accentClass = isHighlighted ? "text-primary" : "text-muted-foreground";

  const handleGetStarted = () => {
    toast.info("Coming soon — payment integration in progress.", {
      duration: 4000,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.45,
        delay: index * 0.07,
        ease: [0.4, 0, 0.2, 1],
      }}
      className="relative flex flex-col h-full"
      data-ocid={`plans.${plan.id}.card`}
    >
      {isHighlighted && (
        <div className="absolute -top-4 left-0 right-0 flex justify-center z-10">
          <span className="inline-flex items-center bg-primary text-primary-foreground text-xs font-bold px-4 py-1.5 rounded-full shadow-md">
            Most Popular
          </span>
        </div>
      )}
      <Card
        className={`flex flex-col h-full transition-all duration-300 ${
          isHighlighted
            ? "border-primary border-2 shadow-lg ring-2 ring-primary/20 bg-card"
            : "border-border bg-card hover:shadow-md"
        }`}
      >
        <CardHeader className="pb-4 pt-7">
          <Badge
            variant="secondary"
            className="text-xs font-medium px-2 py-0.5 w-fit"
          >
            {plan.badge}
          </Badge>
          <h3 className="font-display text-xl font-bold text-foreground mt-2">
            {plan.name}
          </h3>
          <div className="flex items-end gap-1 mt-1">
            <span className="font-display text-3xl font-extrabold text-foreground">
              {plan.price}
            </span>
            {plan.period && (
              <span className="text-muted-foreground text-sm mb-1">
                {plan.period}
              </span>
            )}
          </div>
          {plan.note && (
            <p className="text-sm text-primary font-medium mt-2">{plan.note}</p>
          )}
        </CardHeader>
        <CardContent className="flex flex-col flex-1 gap-4 pt-0">
          <div className="flex-1">
            <FeatureList
              sections={plan.sections}
              simpleFeatures={plan.simpleFeatures}
              accentClass={accentClass}
            />
          </div>
          <Button
            type="button"
            onClick={handleGetStarted}
            variant={isHighlighted ? "default" : "outline"}
            className="w-full mt-2 font-semibold"
            data-ocid={`plans.${plan.id}.get_started_button`}
          >
            Get Started
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function PlansPage() {
  return (
    <PageTransition>
      <div className="bg-card border-b">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-foreground mb-4 tracking-tight">
              Plans
            </h1>
            <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto">
              Choose the plan that fits your journey
            </p>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 items-start"
          data-ocid="plans.grid"
        >
          {PLANS.map((plan, i) => (
            <PlanCard key={plan.id} plan={plan} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-16 text-center"
        >
          <div className="inline-block bg-muted/50 border border-border rounded-2xl px-8 py-6 max-w-xl">
            <p className="font-display text-base font-semibold text-foreground">
              Have questions about which plan is right for you?
            </p>
            <p className="text-muted-foreground text-sm mt-2">
              Payments are not yet active — all plans are currently free to
              explore. Billing will launch soon. Your data and progress are
              always saved.
            </p>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
