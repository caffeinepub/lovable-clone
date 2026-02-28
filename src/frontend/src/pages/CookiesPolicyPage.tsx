import { motion } from "motion/react";
import { useNavigate } from "@tanstack/react-router";
import { Sparkles, ArrowLeft, Cookie } from "lucide-react";

// ── Section component ──────────────────────────────────────
function Section({
  title,
  children,
  delay = 0,
}: {
  title: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className="mb-10"
    >
      <h2 className="text-xl font-bold font-display text-foreground mb-3 flex items-center gap-2">
        <span
          className="inline-block w-1 h-5 rounded-full"
          style={{ background: "linear-gradient(to bottom, oklch(0.65 0.22 25), oklch(0.55 0.2 340))" }}
          aria-hidden
        />
        {title}
      </h2>
      <div className="text-sm text-muted-foreground leading-relaxed space-y-3">{children}</div>
    </motion.section>
  );
}

// ── Cookie type card ───────────────────────────────────────
function CookieTypeCard({
  name,
  required,
  description,
  examples,
}: {
  name: string;
  required: boolean;
  description: string;
  examples: string[];
}) {
  return (
    <div
      className="rounded-xl p-5 border"
      style={{
        background: required
          ? "oklch(0.97 0.03 25 / 0.4)"
          : "oklch(0.98 0.01 0 / 0.5)",
        borderColor: required
          ? "oklch(0.62 0.22 25 / 0.2)"
          : "oklch(var(--border))",
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm font-bold font-display text-foreground">{name}</span>
        {required && (
          <span
            className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white"
            style={{ background: "linear-gradient(135deg, oklch(0.65 0.22 25), oklch(0.55 0.2 340))" }}
          >
            Required
          </span>
        )}
      </div>
      <p className="text-sm text-muted-foreground mb-3">{description}</p>
      <div className="flex flex-wrap gap-1.5">
        {examples.map((ex) => (
          <span
            key={ex}
            className="px-2 py-0.5 rounded-md text-xs font-mono font-medium text-muted-foreground bg-secondary/70 border border-border"
          >
            {ex}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────
export function CookiesPolicyPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* ── NAV ────────────────────────────────── */}
      <motion.nav
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="fixed top-0 left-0 right-0 z-40 glass-nav"
      >
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          {/* Logo */}
          <button
            type="button"
            onClick={() => void navigate({ to: "/" })}
            className="flex items-center gap-2"
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.65 0.22 25), oklch(0.55 0.2 340))",
              }}
            >
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-bold font-display text-foreground">Lovable</span>
          </button>

          {/* Back button */}
          <button
            type="button"
            onClick={() => void navigate({ to: "/" })}
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
        </div>
      </motion.nav>

      {/* ── CONTENT ──────────────────────────────── */}
      <main className="pt-24 pb-20 px-5">
        <div className="max-w-2xl mx-auto">
          {/* Page header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.65 0.22 25), oklch(0.55 0.2 340))",
                }}
              >
                <Cookie className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black font-display text-foreground leading-tight">
                  Cookies Policy
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Last updated: February 27, 2026
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This Cookies Policy explains how Lovable ("we", "us", or "our") uses cookies and
              similar tracking technologies when you visit or use our platform. By using Lovable,
              you agree to the use of cookies as described in this policy.
            </p>
          </motion.div>

          {/* Sections */}
          <Section title="What Are Cookies?" delay={0.1}>
            <p>
              Cookies are small text files that are placed on your device (computer, tablet, or
              mobile phone) when you visit a website. They are widely used to make websites work
              more efficiently, to provide a better user experience, and to give website owners
              information about how their site is being used.
            </p>
            <p>
              Cookies can be "session cookies" (deleted when you close your browser) or "persistent
              cookies" (remain on your device for a set period or until you delete them). They can
              also be "first-party cookies" (set by us) or "third-party cookies" (set by third
              parties we work with).
            </p>
          </Section>

          <Section title="How We Use Cookies" delay={0.15}>
            <p>We use cookies for the following purposes:</p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>To keep you signed in and remember your session</li>
              <li>To remember your preferences (theme, language, layout)</li>
              <li>To analyze how our platform is used so we can improve it</li>
              <li>To deliver relevant features and personalized experiences</li>
              <li>To ensure the security of your account and prevent fraud</li>
              <li>To understand which marketing channels bring users to our platform</li>
            </ul>
          </Section>

          <Section title="Types of Cookies We Use" delay={0.2}>
            <p className="mb-4">
              Below is a breakdown of the categories of cookies we use on Lovable:
            </p>
            <div className="space-y-4 not-prose">
              <CookieTypeCard
                name="Essential Cookies"
                required
                description="These cookies are strictly necessary for the platform to function. They enable core features like authentication, session management, and security. You cannot opt out of these cookies."
                examples={["session_id", "auth_token", "csrf_token"]}
              />
              <CookieTypeCard
                name="Analytics Cookies"
                required={false}
                description="These cookies help us understand how visitors interact with our platform — which pages are most popular, how long users stay, and where they navigate. This data helps us improve the experience."
                examples={["_ga", "_gid", "plausible_session"]}
              />
              <CookieTypeCard
                name="Preference Cookies"
                required={false}
                description="These cookies remember your personal settings and choices, such as your display theme (light/dark), sidebar state, and notification preferences, so you don't have to reconfigure them each visit."
                examples={["theme", "sidebar_collapsed", "editor_layout"]}
              />
              <CookieTypeCard
                name="Marketing Cookies"
                required={false}
                description="These cookies are used to track visitors across websites so that we can display ads that are relevant to you. They may be set by our advertising partners and used to build a profile of your interests."
                examples={["_fbp", "tt_sessionid", "_gcl_au"]}
              />
            </div>
          </Section>

          <Section title="Third-Party Cookies" delay={0.25}>
            <p>
              Some cookies on our platform are placed by third-party services that appear on our
              pages. We do not control these cookies and they are subject to the privacy policies
              of those third parties. Third parties we may work with include:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>
                <strong className="text-foreground">Google Analytics</strong> — website analytics
                and performance tracking
              </li>
              <li>
                <strong className="text-foreground">Stripe</strong> — secure payment processing
              </li>
              <li>
                <strong className="text-foreground">Intercom</strong> — customer support chat
              </li>
              <li>
                <strong className="text-foreground">Plausible Analytics</strong> — privacy-first
                usage analytics
              </li>
            </ul>
            <p>
              We encourage you to review the privacy policies of these third parties to understand
              how they use your data.
            </p>
          </Section>

          <Section title="Managing Your Cookies" delay={0.3}>
            <p>
              You have the right to decide whether to accept or reject cookies (except essential
              cookies). Here are your options:
            </p>
            <p>
              <strong className="text-foreground">Browser settings:</strong> Most browsers allow
              you to manage cookies through your browser settings. You can set your browser to
              refuse all or some browser cookies, or to alert you when websites set or access
              cookies. If you disable or refuse cookies, please note that some parts of the
              platform may become inaccessible or not function properly.
            </p>
            <p>
              <strong className="text-foreground">Cookie consent:</strong> When you first visit
              Lovable, you may be presented with a cookie consent banner where you can accept or
              decline non-essential cookies.
            </p>
            <p>
              <strong className="text-foreground">Opt-out links:</strong> For analytics and
              marketing cookies, you may be able to opt out directly through the relevant third
              party (e.g., Google Analytics opt-out browser add-on).
            </p>
          </Section>

          <Section title="Changes to This Policy" delay={0.35}>
            <p>
              We may update this Cookies Policy from time to time to reflect changes in technology,
              regulation, or our business practices. When we do, we will revise the "Last updated"
              date at the top of this page. We encourage you to review this policy periodically to
              stay informed about how we use cookies.
            </p>
            <p>
              Continued use of our platform after we make changes to this policy constitutes your
              acceptance of those changes.
            </p>
          </Section>

          <Section title="Contact Us" delay={0.4}>
            <p>
              If you have any questions about our use of cookies or this Cookies Policy, please
              contact us:
            </p>
            <div
              className="mt-3 p-4 rounded-xl"
              style={{
                background: "oklch(0.97 0.03 25 / 0.35)",
                border: "1px solid oklch(0.62 0.22 25 / 0.15)",
              }}
            >
              <p className="font-semibold text-foreground text-sm mb-1">Lovable Support</p>
              <p>
                Email:{" "}
                <a
                  href="mailto:privacy@lovable.dev"
                  className="text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  privacy@lovable.dev
                </a>
              </p>
              <p className="mt-1">
                Website:{" "}
                <button
                  type="button"
                  onClick={() => void navigate({ to: "/" })}
                  className="text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  lovable.dev
                </button>
              </p>
            </div>
          </Section>
        </div>
      </main>

      {/* ── FOOTER ───────────────────────────────── */}
      <footer className="border-t border-border py-8 px-5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-md flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.65 0.22 25), oklch(0.55 0.2 340))",
              }}
            >
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-bold font-display text-foreground">Lovable</span>
          </div>

          <div className="flex items-center gap-6">
            {["Privacy", "Terms", "Docs"].map((link) => (
              <span
                key={link}
                className="text-xs text-muted-foreground cursor-default"
              >
                {link}
              </span>
            ))}
            <button
              type="button"
              onClick={() => void navigate({ to: "/" })}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Back to Home
            </button>
          </div>

        </div>
      </footer>
    </div>
  );
}
