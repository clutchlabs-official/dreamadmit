import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  Target,
  Trophy,
} from "lucide-react";
import { motion } from "motion/react";

const features = [
  {
    icon: Target,
    title: "AI College Match",
    description:
      "Get your personalised match score for every college based on your real profile.",
  },
  {
    icon: BookOpen,
    title: "Essay Reviewer",
    description:
      "AI reviews your essays for grammar, structure, and impact with detailed feedback.",
  },
  {
    icon: Trophy,
    title: "Scholarship Finder",
    description:
      "Discover scholarships filtered exactly to your grades, location, and major.",
  },
  {
    icon: GraduationCap,
    title: "Admission Guidance",
    description:
      "Step-by-step action plans so you always know exactly what to do next.",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-gradient-to-br from-primary/10 via-background to-secondary/10 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          className="max-w-3xl mx-auto"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg">
              <GraduationCap className="h-9 w-9 text-primary-foreground" />
            </div>
          </div>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold text-foreground tracking-tight mb-6">
            Dream<span className="text-primary">Admit</span>
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed mb-10 max-w-2xl mx-auto">
            Your college admissions companion — AI guidance, essay tools,
            scholarship finder, and everything you need to get into your dream
            college.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/profile">
              <Button
                size="lg"
                className="gap-2 text-base font-semibold px-8 h-12"
                data-ocid="home.get_started_button"
              >
                Get Started
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/plans">
              <Button
                size="lg"
                variant="outline"
                className="gap-2 text-base font-semibold px-8 h-12"
                data-ocid="home.view_plans_button"
              >
                View Plans
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="bg-muted/30 border-t border-border py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Everything you need, in one place
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Built for students who are serious about getting into their dream
              college.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-card rounded-2xl border border-border p-6 flex flex-col gap-4 hover:shadow-md transition-shadow duration-200"
                data-ocid={`home.feature.${i + 1}`}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                  <feat.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-foreground mb-1.5">
                    {feat.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-background py-20 px-4 text-center border-t border-border">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Ready to start your journey?
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Create your profile and get personalised AI guidance in minutes.
          </p>
          <Link to="/profile">
            <Button
              size="lg"
              className="gap-2 text-base font-semibold px-10 h-12"
              data-ocid="home.cta_button"
            >
              Build My Profile
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
