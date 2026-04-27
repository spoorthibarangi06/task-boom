import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, ClipboardList, Camera, GanttChartSquare, MessageSquare, Zap, Shield, HardHat, AlertTriangle, MessagesSquare } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SitePulse — Track every task. Finish every site on time." },
      { name: "description", content: "Centralize tasks, daily progress, and photo proof for short-term construction projects. Built for site engineers and contractors." },
      { property: "og:title", content: "SitePulse — Construction project tracking, simplified." },
      { property: "og:description", content: "Stop chasing WhatsApp updates. Track every task and finish every site on time." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <Hero />
      <Problems />
      <Features />
      <HowItWorks />
      <Pricing />
      <FinalCTA />
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-gradient-subtle" />
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:py-28">
        <div className="flex flex-col justify-center">
          <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <span className="flex h-2 w-2 rounded-full bg-success" />
            Built for short-term construction projects
          </div>
          <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Track every task.<br />
            <span className="text-gradient-hero">Finish every site</span><br />
            on time.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            SitePulse replaces scattered WhatsApp updates and missed deadlines with one mobile-first hub for tasks, daily progress, and photo proof — purpose-built for site engineers and contractors.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="h-12 bg-gradient-primary px-7 text-base text-primary-foreground shadow-glow transition hover:opacity-95">
              <Link to="/auth">Start Free <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 px-7 text-base">
              <Link to="/dashboard">View live demo</Link>
            </Button>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            {["No credit card", "14-day Pro trial", "Cancel anytime"].map((t) => (
              <div key={t} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" /> {t}
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 rounded-3xl bg-gradient-hero opacity-30 blur-2xl" />
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-elegant">
            <img
              src={heroImg}
              alt="Construction site at sunset with SitePulse dashboard overlay"
              width={1280}
              height={960}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 hidden rounded-2xl border border-border bg-card p-4 shadow-elegant sm:block">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/15">
                <CheckCircle2 className="h-5 w-5 text-success" />
              </div>
              <div>
                <div className="text-sm font-semibold">Foundation poured</div>
                <div className="text-xs text-muted-foreground">Block A · 2 min ago</div>
              </div>
            </div>
          </div>
          <div className="absolute -top-6 -right-6 hidden rounded-2xl border border-border bg-card p-4 shadow-elegant sm:block">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/20">
                <Camera className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <div className="text-sm font-semibold">12 photos uploaded</div>
                <div className="text-xs text-muted-foreground">Today’s progress</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Problems() {
  const items = [
    { icon: MessagesSquare, title: "Updates buried in WhatsApp", text: "Photos, voice notes and task statuses lost across endless group chats." },
    { icon: AlertTriangle, title: "Deadlines that surprise you", text: "Delays only surface when it’s too late to recover the schedule." },
    { icon: HardHat, title: "No single source of truth", text: "Engineers, supervisors, and workers each track progress differently." },
  ];
  return (
    <section className="border-y border-border bg-secondary/40 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent-foreground">The problem</div>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Construction runs on chaos. It doesn’t have to.</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {items.map((it) => (
            <div key={it.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:shadow-elegant">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-destructive/10">
                <it.icon className="h-5 w-5 text-destructive" />
              </div>
              <h3 className="text-lg font-semibold">{it.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{it.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    { icon: ClipboardList, title: "Project & task management", text: "Spin up a project in seconds. Assign tasks, set deadlines, track Pending → In Progress → Done." },
    { icon: MessageSquare, title: "Daily progress updates", text: "Timestamped notes per task so the whole team knows exactly what shipped today." },
    { icon: Camera, title: "Photo proof of work", text: "Workers snap a photo from their phone. You get verified progress logs." },
    { icon: GanttChartSquare, title: "Timeline at a glance", text: "Visual schedule across the whole project. Delayed tasks light up automatically." },
  ];
  return (
    <section id="features" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">Features</div>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Everything your site needs. Nothing it doesn’t.</h2>
          <p className="mt-4 text-muted-foreground">Designed for crews of 3 to 50, on projects that finish in weeks — not years.</p>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:shadow-elegant">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-primary opacity-0 transition group-hover:opacity-100" />
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-md">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", title: "Create your project", text: "Add the site, set the start and end date, invite your crew." },
    { n: "02", title: "Assign & track tasks", text: "Break work into tasks, assign owners, set deadlines." },
    { n: "03", title: "Update from the field", text: "Workers post notes and photos. You see progress in real time." },
  ];
  return (
    <section id="how" className="border-y border-border bg-gradient-subtle py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent-foreground">How it works</div>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">From kickoff to handover in 3 steps.</h2>
        </div>
        <div className="relative mt-14 grid gap-8 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="relative rounded-2xl border border-border bg-card p-8 shadow-sm">
              <div className="font-display text-5xl font-bold text-gradient-primary">{s.n}</div>
              <h3 className="mt-3 text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-muted-foreground">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const tiers = [
    { name: "Free", price: "$0", desc: "For solo supervisors trying it out.", features: ["1 project", "Up to 5 tasks", "Basic timeline"], cta: "Start free", highlight: false },
    { name: "Pro", price: "$19", desc: "For active site teams.", features: ["Unlimited projects", "Photo proof uploads", "Delay alerts", "Crew of up to 15"], cta: "Start 14-day trial", highlight: true },
    { name: "Premium", price: "$49", desc: "For contractors running multiple sites.", features: ["Everything in Pro", "Multi-site dashboard", "Priority support", "Unlimited crew"], cta: "Talk to sales", highlight: false },
  ];
  return (
    <section id="pricing" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">Pricing</div>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Simple plans. Built for sites that move fast.</h2>
          <p className="mt-4 text-muted-foreground">Per workspace, per month. Cancel any time.</p>
        </div>
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={
                "relative rounded-2xl border bg-card p-8 transition " +
                (t.highlight
                  ? "border-primary shadow-glow lg:-translate-y-2"
                  : "border-border hover:shadow-elegant")
              }
            >
              {t.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-accent px-3 py-1 text-xs font-semibold text-accent-foreground shadow-accent-glow">
                  Most popular
                </div>
              )}
              <div className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{t.name}</div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="font-display text-5xl font-bold">{t.price}</span>
                <span className="text-muted-foreground">/mo</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{t.desc}</p>
              <ul className="mt-6 space-y-3">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" /> {f}
                  </li>
                ))}
              </ul>
              <Button
                asChild
                className={
                  "mt-8 w-full " +
                  (t.highlight ? "bg-gradient-primary text-primary-foreground hover:opacity-95" : "")
                }
                variant={t.highlight ? "default" : "outline"}
              >
                <Link to="/auth">{t.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="px-4 pb-24 sm:px-6">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-hero p-12 text-center shadow-elegant sm:p-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.25),transparent_60%)]" />
        <div className="relative">
          <Zap className="mx-auto h-10 w-10 text-primary-foreground" />
          <h2 className="mt-4 font-display text-3xl font-bold text-primary-foreground sm:text-5xl">
            Get your next site under control today.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/85">
            Join hundreds of contractors finishing projects on time with SitePulse.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="h-12 bg-card px-7 text-base text-foreground hover:bg-card/90">
              <Link to="/auth">Start Free <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 border-primary-foreground/40 bg-transparent px-7 text-base text-primary-foreground hover:bg-primary-foreground/10">
              <Link to="/dashboard">See the dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-card/40">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:px-6">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          <span>© {new Date().getFullYear()} SitePulse. Built for the field.</span>
        </div>
        <div className="flex gap-6">
          <a href="#features" className="hover:text-foreground">Features</a>
          <a href="#pricing" className="hover:text-foreground">Pricing</a>
          <a href="#how" className="hover:text-foreground">How it works</a>
        </div>
      </div>
    </footer>
  );
}
