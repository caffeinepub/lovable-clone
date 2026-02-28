import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
  Loader2,
  X,
  Check,
  Code2,
  Palette,
  Globe,
  Users,
  Star,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FounderModal } from "../components/FounderModal";

// ─── Animated prompt placeholder ──────────────────────────
const PROMPTS = [
  "Build me a SaaS landing page...",
  "Create a portfolio website...",
  "Make an e-commerce store...",
  "Build a dashboard app...",
  "Design a blog platform...",
  "Create a booking system...",
];

function AnimatedPrompt() {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % PROMPTS.length);
        setVisible(true);
      }, 350);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.span
          key={current}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="text-muted-foreground text-[15px]"
        >
          {PROMPTS[current]}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

// ─── Auth modal ────────────────────────────────────────────
function AuthModal({
  open,
  onClose,
  initialPrompt,
}: {
  open: boolean;
  onClose: () => void;
  initialPrompt: string;
}) {
  const { login, isLoggingIn, loginStatus } = useInternetIdentity();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-50 flex items-center justify-center login-backdrop"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 relative shadow-lg border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Logo */}
            <div className="flex justify-center mb-6">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, oklch(0.65 0.22 25), oklch(0.55 0.2 340))" }}>
                <Sparkles className="w-7 h-7 text-white" />
              </div>
            </div>

            <h2 className="text-xl font-bold font-display text-foreground text-center mb-1">
              Continue building
            </h2>
            {initialPrompt ? (
              <p className="text-sm text-muted-foreground text-center mb-6 line-clamp-2">
                "{initialPrompt}"
              </p>
            ) : (
              <p className="text-sm text-muted-foreground text-center mb-6">
                Sign in to start building with AI
              </p>
            )}

            {loginStatus === "logging-in" ? (
              <div className="flex flex-col items-center gap-3 py-4">
                <div className="w-10 h-10 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                <p className="text-sm text-muted-foreground">Authenticating...</p>
              </div>
            ) : (
              <button
                type="button"
                onClick={login}
                disabled={isLoggingIn}
                className="w-full btn-pink px-6 py-3 text-sm font-semibold flex items-center justify-center gap-2"
              >
                {isLoggingIn ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Shield className="w-4 h-4" />
                )}
                {isLoggingIn ? "Signing in..." : "Sign in with Internet Identity"}
              </button>
            )}

            <p className="text-xs text-muted-foreground/70 text-center mt-4">
              No password needed · Secured by ICP
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Feature card ──────────────────────────────────────────
function FeatureCard({
  icon: Icon,
  title,
  description,
  color,
  delay,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className="lovable-card p-6"
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
        style={{ background: color }}
      >
        <Icon className="w-5 h-5 text-white" />
      </div>
      <h3 className="text-base font-semibold font-display text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </motion.div>
  );
}

// ─── Template preview card ─────────────────────────────────
const SAMPLE_TEMPLATES = [
  { name: "SaaS Landing", category: "Landing Page", color: "oklch(0.96 0.04 25)" },
  { name: "Portfolio Pro", category: "Portfolio", color: "oklch(0.94 0.04 285)" },
  { name: "E-Commerce", category: "E-Commerce", color: "oklch(0.94 0.04 160)" },
  { name: "Blog Platform", category: "Blog", color: "oklch(0.95 0.04 60)" },
  { name: "App Dashboard", category: "Dashboard", color: "oklch(0.94 0.04 200)" },
  { name: "Agency Site", category: "Landing Page", color: "oklch(0.95 0.04 340)" },
];

function TemplateCard({ template }: { template: typeof SAMPLE_TEMPLATES[0] }) {
  return (
    <div className="lovable-card overflow-hidden group cursor-pointer shrink-0 w-56">
      <div
        className="h-32 relative"
        style={{ background: template.color }}
      >
        {/* Mock wireframe */}
        <div className="absolute inset-0 p-3 flex flex-col gap-1.5 opacity-60">
          <div className="h-2 bg-white/50 rounded-full w-2/3" />
          <div className="h-1.5 bg-white/35 rounded-full w-1/2" />
          <div className="mt-1 h-10 bg-white/25 rounded-lg w-full" />
          <div className="grid grid-cols-3 gap-1">
            <div className="h-4 bg-white/20 rounded" />
            <div className="h-4 bg-white/15 rounded" />
            <div className="h-4 bg-white/18 rounded" />
          </div>
        </div>
      </div>
      <div className="p-3">
        <p className="text-sm font-semibold text-foreground font-display">{template.name}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{template.category}</p>
      </div>
    </div>
  );
}

// ─── Pricing card ──────────────────────────────────────────
function PricingCard({
  tier,
  price,
  description,
  features,
  cta,
  highlighted,
  onCta,
}: {
  tier: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
  onCta: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`relative rounded-2xl p-7 ${
        highlighted
          ? "border-2 border-primary/40 bg-white shadow-pink"
          : "lovable-card"
      }`}
    >
      {highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full text-white"
            style={{ background: "linear-gradient(135deg, oklch(0.65 0.22 25), oklch(0.55 0.2 340))" }}>
            Most Popular
          </span>
        </div>
      )}

      <div className="mb-5">
        <p className="text-sm font-semibold text-muted-foreground mb-2">{tier}</p>
        <div className="flex items-end gap-1 mb-2">
          <span className="text-3xl font-black font-display text-foreground">{price}</span>
          {price !== "Free" && <span className="text-sm text-muted-foreground mb-1">/month</span>}
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <ul className="space-y-2.5 mb-6">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5">
            <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <span className="text-sm text-foreground">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={onCta}
        className={`w-full py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
          highlighted
            ? "btn-pink"
            : "bg-secondary text-foreground hover:bg-muted border border-border"
        }`}
      >
        {cta}
      </button>
    </motion.div>
  );
}

// ─── Main landing page ─────────────────────────────────────
export function LandingPage() {
  const [showAuth, setShowAuth] = useState(false);
  const [showFounder, setShowFounder] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowAuth(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handlePromptSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    setShowAuth(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ── NAV ──────────────────────────────────── */}
      <motion.nav
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="fixed top-0 left-0 right-0 z-40 glass-nav"
      >
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, oklch(0.65 0.22 25), oklch(0.55 0.2 340))" }}>
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-bold font-display text-foreground">Lovable</span>
          </div>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-6">
            {["Pricing", "Docs", "Templates", "Blog"].map((link) => (
              <button
                key={link}
                type="button"
                onClick={() => link === "Pricing" && document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                {link}
              </button>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowAuth(true)}
              className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors hidden sm:block"
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => setShowAuth(true)}
              className="btn-pink px-4 py-2 text-sm"
            >
              Get started
            </button>
          </div>
        </div>
      </motion.nav>

      {/* ── HERO ─────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-5 hero-gradient overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-[600px] h-[600px] rounded-full top-[-100px] right-[-150px] opacity-20"
            style={{ background: "radial-gradient(circle, oklch(0.62 0.22 25 / 0.3), transparent 70%)" }} />
          <div className="absolute w-[400px] h-[400px] rounded-full bottom-[-50px] left-[-100px] opacity-15"
            style={{ background: "radial-gradient(circle, oklch(0.55 0.2 285 / 0.3), transparent 70%)" }} />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-8"
            style={{
              background: "oklch(0.62 0.22 25 / 0.08)",
              border: "1px solid oklch(0.62 0.22 25 / 0.2)",
              color: "oklch(0.55 0.22 25)",
            }}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Introducing AI-powered app generation</span>
            <ChevronRight className="w-3 h-3" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-7xl font-black font-display leading-[1.05] tracking-tight text-foreground mb-6"
          >
            Build software{" "}
            <span className="gradient-text">with AI</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Describe what you want to build, and watch it come to life.
            Ship full-stack apps faster than ever before.
          </motion.p>

          {/* Prompt input */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            className="max-w-2xl mx-auto"
          >
            <form onSubmit={handlePromptSubmit}>
              <div className="prompt-container flex items-center gap-3 px-4 py-3">
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full bg-transparent text-[15px] text-foreground placeholder:text-transparent outline-none"
                    placeholder="placeholder"
                    aria-label="Describe what you want to build"
                  />
                  {!inputValue && (
                    <div className="absolute inset-0 flex items-center pointer-events-none">
                      <AnimatedPrompt />
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn-pink h-9 w-9 flex items-center justify-center rounded-xl shrink-0"
                  aria-label="Start building"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            <p className="text-xs text-muted-foreground/60 mt-3 text-center">
              Loved by 50,000+ developers · Free to get started
            </p>
          </motion.div>

          {/* Floating tags */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-wrap items-center justify-center gap-2 mt-8"
          >
            {["SaaS", "Landing Pages", "Dashboards", "E-commerce", "Portfolios", "Blogs"].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  setInputValue(`Build me a ${tag.toLowerCase()} website`);
                  inputRef.current?.focus();
                }}
                className="px-3 py-1.5 text-xs font-medium rounded-full border border-border bg-white/70 text-muted-foreground hover:border-primary/30 hover:text-foreground transition-colors"
              >
                {tag}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── SOCIAL PROOF ─────────────────────────── */}
      <section className="py-16 px-5 border-y border-border bg-secondary/30">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <p className="text-sm text-muted-foreground font-medium">
              Trusted by developers at world-class companies
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
            {[
              { value: "50K+", label: "Active users" },
              { value: "2M+", label: "Apps created" },
              { value: "99.9%", label: "Uptime" },
              { value: "4.9★", label: "Average rating" },
            ].map(({ value, label }) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-2xl font-black font-display gradient-text mb-1">{value}</div>
                <div className="text-xs text-muted-foreground">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────── */}
      <section className="py-24 px-5">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">How it works</p>
            <h2 className="text-3xl md:text-4xl font-black font-display text-foreground mb-4">
              From idea to production in minutes
            </h2>
            <p className="text-base text-muted-foreground max-w-xl mx-auto">
              Just describe what you want to build. Our AI writes the code, handles deployment, and keeps everything in sync.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Describe your idea",
                description: "Tell us what you want to build in plain English. Add details, share references, or start with a template.",
                icon: Sparkles,
                color: "linear-gradient(135deg, oklch(0.65 0.22 25), oklch(0.55 0.2 340))",
              },
              {
                step: "02",
                title: "AI generates your app",
                description: "Watch as our AI generates a full-stack application, complete with UI, logic, and database in real time.",
                icon: Zap,
                color: "linear-gradient(135deg, oklch(0.55 0.2 285), oklch(0.48 0.18 310))",
              },
              {
                step: "03",
                title: "Ship it",
                description: "Refine with chat, preview instantly, and publish with one click. Your app is live and shareable.",
                icon: Globe,
                color: "linear-gradient(135deg, oklch(0.52 0.18 160), oklch(0.46 0.16 180))",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="lovable-card p-6 relative"
              >
                <span className="absolute top-5 right-5 text-[11px] font-mono font-bold text-muted-foreground/40">
                  {item.step}
                </span>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: item.color }}>
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-base font-semibold font-display text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────── */}
      <section className="py-24 px-5 bg-secondary/20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-black font-display text-foreground mb-4">
              Everything you need to build
            </h2>
            <p className="text-base text-muted-foreground max-w-xl mx-auto">
              Lovable comes packed with tools that make building and shipping software effortless.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: Code2,
                title: "Full-stack generation",
                description: "Frontend, backend, and database all generated from a single prompt.",
                color: "linear-gradient(135deg, oklch(0.65 0.22 25), oklch(0.55 0.2 340))",
              },
              {
                icon: Palette,
                title: "Visual editor",
                description: "Fine-tune your UI with an intuitive visual editor. No code required.",
                color: "linear-gradient(135deg, oklch(0.55 0.2 285), oklch(0.48 0.18 310))",
              },
              {
                icon: Globe,
                title: "One-click deploy",
                description: "Publish to the internet instantly. No DevOps, no configuration.",
                color: "linear-gradient(135deg, oklch(0.52 0.18 160), oklch(0.46 0.16 180))",
              },
              {
                icon: Users,
                title: "Team collaboration",
                description: "Invite teammates, share projects, and build together in real time.",
                color: "linear-gradient(135deg, oklch(0.60 0.2 50), oklch(0.54 0.18 30))",
              },
              {
                icon: Shield,
                title: "Secure by default",
                description: "Built-in auth, data encryption, and security best practices out of the box.",
                color: "linear-gradient(135deg, oklch(0.56 0.2 200), oklch(0.50 0.18 220))",
              },
              {
                icon: Zap,
                title: "Iterative with chat",
                description: "Describe changes in natural language. The AI updates your code instantly.",
                color: "linear-gradient(135deg, oklch(0.58 0.2 340), oklch(0.52 0.18 320))",
              },
            ].map((feat, i) => (
              <FeatureCard key={feat.title} {...feat} delay={i * 0.07} />
            ))}
          </div>
        </div>
      </section>

      {/* ── TEMPLATES SHOWCASE ───────────────────── */}
      <section className="py-24 px-5 overflow-hidden">
        <div className="max-w-5xl mx-auto mb-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl font-black font-display text-foreground mb-3">
              Start from a template
            </h2>
            <p className="text-base text-muted-foreground">
              Get started faster with our curated collection of production-ready templates.
            </p>
          </motion.div>
        </div>

        {/* Horizontal scrolling templates */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex gap-4 overflow-x-auto pb-4 px-5 max-w-6xl mx-auto no-scrollbar"
          style={{ scrollbarWidth: "none" }}
        >
          {SAMPLE_TEMPLATES.map((template) => (
            <TemplateCard key={template.name} template={template} />
          ))}
        </motion.div>

        <div className="text-center mt-8">
          <button
            type="button"
            onClick={() => setShowAuth(true)}
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Browse all templates
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────── */}
      <section className="py-24 px-5 bg-secondary/20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl font-black font-display text-foreground mb-3">
              Loved by builders worldwide
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                quote: "I launched my SaaS in a weekend. What used to take months now takes hours. Lovable completely changed my workflow.",
                author: "Sarah Chen",
                role: "Indie hacker",
                rating: 5,
              },
              {
                quote: "The AI understands exactly what I want to build. It's like having a senior engineer who works at the speed of thought.",
                author: "Marcus Rodriguez",
                role: "Product Manager",
                rating: 5,
              },
              {
                quote: "Our team ships features 10x faster. The collaboration features make it easy to iterate and deploy with confidence.",
                author: "Aisha Patel",
                role: "CTO at Startify",
                rating: 5,
              },
            ].map((testimonial, i) => (
              <motion.div
                key={testimonial.author}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="lovable-card p-6"
              >
                <div className="flex items-center gap-0.5 mb-4">
                  {["s1","s2","s3","s4","s5"].slice(0, testimonial.rating).map((s) => (
                    <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-foreground leading-relaxed mb-5">
                  "{testimonial.quote}"
                </p>
                <div>
                  <p className="text-sm font-semibold text-foreground">{testimonial.author}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────── */}
      <section id="pricing" className="py-24 px-5">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-black font-display text-foreground mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-base text-muted-foreground">
              Start for free. Scale as you grow.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PricingCard
              tier="Free"
              price="Free"
              description="Perfect for experimenting and side projects."
              features={[
                "5 projects",
                "AI chat (limited)",
                "Community templates",
                "Basic publishing",
              ]}
              cta="Get started"
              onCta={() => setShowAuth(true)}
            />
            <PricingCard
              tier="Pro"
              price="$20"
              description="For serious builders and indie hackers."
              features={[
                "Unlimited projects",
                "Unlimited AI chat",
                "All templates",
                "Custom domains",
                "Priority support",
              ]}
              cta="Start free trial"
              highlighted
              onCta={() => setShowAuth(true)}
            />
            <PricingCard
              tier="Teams"
              price="$50"
              description="For teams building together."
              features={[
                "Everything in Pro",
                "Team collaboration",
                "Shared workspaces",
                "SSO & admin controls",
                "Dedicated support",
              ]}
              cta="Contact sales"
              onCta={() => setShowAuth(true)}
            />
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────── */}
      <section className="py-24 px-5">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center rounded-3xl p-12 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, oklch(0.96 0.05 25 / 0.5), oklch(0.95 0.04 285 / 0.3))",
              border: "1px solid oklch(0.62 0.22 25 / 0.15)",
            }}
          >
            <h2 className="text-3xl md:text-4xl font-black font-display text-foreground mb-4">
              Start building for free
            </h2>
            <p className="text-base text-muted-foreground mb-8 max-w-xl mx-auto">
              No credit card required. Get from idea to deployed app in minutes.
            </p>
            <button
              type="button"
              onClick={() => setShowAuth(true)}
              className="btn-pink px-8 py-3.5 text-sm inline-flex items-center gap-2"
            >
              Get started for free
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────── */}
      <footer className="border-t border-border py-8 px-5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, oklch(0.65 0.22 25), oklch(0.55 0.2 340))" }}>
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-bold font-display text-foreground">Lovable</span>
          </div>

          <div className="flex items-center gap-6 flex-wrap justify-center">
            {["Privacy", "Terms", "Docs"].map((link) => (
              <button key={link} type="button" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                {link}
              </button>
            ))}
            <a
              href="/cookies"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Cookies Policy
            </a>
            <button
              type="button"
              onClick={() => setShowFounder(true)}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Meet the Founder
            </button>
          </div>

        </div>
      </footer>

      <AuthModal
        open={showAuth}
        onClose={() => setShowAuth(false)}
        initialPrompt={inputValue}
      />

      <FounderModal
        open={showFounder}
        onClose={() => setShowFounder(false)}
      />
    </div>
  );
}
