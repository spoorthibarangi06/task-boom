import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, QrCode, HeartPulse, Smartphone, Lock, Zap, Stethoscope, Users, FileHeart } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Emergency Health ID — Your medical info, instantly accessible." },
      { name: "description", content: "Create a free emergency QR code that gives first responders instant access to your blood group, allergies, conditions, and emergency contacts." },
      { property: "og:title", content: "Emergency Health ID — Save lives with one scan." },
      { property: "og:description", content: "Your medical information. Instantly accessible in emergencies." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <Hero />
      <Features />
      <HowItWorks />
      <Benefits />
      <Security />
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
          <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
            <HeartPulse className="h-3.5 w-3.5" />
            Built for life-saving moments
          </div>
          <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Your medical info.<br />
            <span className="text-gradient-hero">Instantly accessible</span><br />
            in emergencies.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            One free QR code that lets paramedics, doctors, and good samaritans see your blood group, allergies, conditions, and emergency contacts — without needing an app or a login.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="h-12 bg-gradient-primary px-7 text-base text-primary-foreground shadow-glow transition hover:opacity-95">
              <Link to="/auth">Create Emergency ID <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 px-7 text-base">
              <a href="#how">How it works</a>
            </Button>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            {["Free forever", "No app required", "Works from any phone camera"].map((t) => (
              <div key={t} className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" /> {t}
              </div>
            ))}
          </div>
        </div>

        <PhoneMockup />
      </div>
    </section>
  );
}

function PhoneMockup() {
  return (
    <div className="relative mx-auto">
      <div className="absolute -inset-6 rounded-[3rem] bg-gradient-hero opacity-30 blur-2xl" />
      <div className="relative mx-auto w-[300px] rounded-[2.5rem] border-[10px] border-foreground/90 bg-foreground/90 shadow-elegant">
        <div className="overflow-hidden rounded-[1.75rem] bg-card">
          <div className="bg-gradient-primary px-5 py-4 text-primary-foreground">
            <div className="flex items-center gap-2 text-xs opacity-80">
              <HeartPulse className="h-3.5 w-3.5" /> EMERGENCY MEDICAL PROFILE
            </div>
            <div className="mt-1 text-lg font-semibold">Sarah Mitchell</div>
            <div className="text-xs opacity-80">Age 34 · Organ donor</div>
          </div>
          <div className="p-5">
            <div className="rounded-xl bg-background p-3 ring-1 ring-border">
              <QRCodeSVG value="https://emergency-id.example/e/demo" size={200} className="mx-auto" />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg bg-accent/10 p-2">
                <div className="text-[10px] uppercase text-accent">Blood</div>
                <div className="font-semibold text-foreground">O+</div>
              </div>
              <div className="rounded-lg bg-muted p-2">
                <div className="text-[10px] uppercase text-muted-foreground">Allergies</div>
                <div className="font-semibold text-foreground">Penicillin</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Features() {
  const features = [
    { icon: QrCode, title: "Personal QR Code", text: "A unique QR that opens your emergency profile instantly — no app, no login." },
    { icon: FileHeart, title: "Medical Records", text: "Blood group, allergies, conditions, medications, and organ donor status in one place." },
    { icon: Users, title: "Emergency Contacts", text: "Family and next-of-kin numbers responders can call in seconds." },
    { icon: Lock, title: "You Stay in Control", text: "Edit, update or revoke your emergency profile anytime from your private dashboard." },
  ];
  return (
    <section id="features" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">Features</div>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Everything responders need. Nothing they don't.</h2>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="group rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:shadow-elegant">
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
    { n: "01", icon: HeartPulse, title: "Create your profile", text: "Sign up free and fill in your essential medical information." },
    { n: "02", icon: QrCode, title: "Get your QR code", text: "Download, print, or save it to your phone wallet and lock screen." },
    { n: "03", icon: Smartphone, title: "Scan in emergencies", text: "Any responder scans the QR — your medical profile opens instantly." },
  ];
  return (
    <section id="how" className="border-y border-border bg-gradient-subtle py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent">How it works</div>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">From signup to saved life in 3 steps.</h2>
        </div>
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="relative rounded-2xl border border-border bg-card p-7 shadow-sm">
              <div className="absolute -top-4 left-7 rounded-full bg-gradient-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                {s.n}
              </div>
              <s.icon className="mb-4 h-7 w-7 text-primary" />
              <h3 className="text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Benefits() {
  const items = [
    { icon: Zap, title: "Seconds matter", text: "Responders get critical info instantly instead of searching wallets, phones, or family." },
    { icon: Stethoscope, title: "Fewer medical errors", text: "Allergies and medications are surfaced before any treatment is administered." },
    { icon: Users, title: "Peace of mind for families", text: "Loved ones with chronic conditions, allergies, or memory loss are never alone." },
  ];
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">Benefits</div>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Built to save the time that saves lives.</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {items.map((b) => (
            <div key={b.title} className="rounded-2xl border border-border bg-card p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15">
                <b.icon className="h-5 w-5 text-accent" />
              </div>
              <h3 className="text-lg font-semibold">{b.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{b.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Security() {
  return (
    <section id="security" className="border-y border-border bg-secondary/40 py-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2">
        <div>
          <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">Security & privacy</div>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Your data. Your control. Always.</h2>
          <p className="mt-4 text-muted-foreground">
            We split your profile into two views: an emergency view that contains only what's needed to help you, and a private dashboard that only you can edit when signed in.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { icon: Lock, title: "Encrypted storage", text: "All medical data is stored in a secure encrypted database." },
            { icon: ShieldCheck, title: "Unguessable links", text: "Your QR points to a random, non-sequential URL." },
            { icon: HeartPulse, title: "Minimal data shown", text: "Only emergency-relevant fields appear publicly." },
            { icon: Smartphone, title: "Works offline-ready", text: "Save your profile to your phone for instant access." },
          ].map((s) => (
            <div key={s.title} className="rounded-2xl border border-border bg-card p-5">
              <s.icon className="mb-3 h-5 w-5 text-primary" />
              <div className="text-sm font-semibold">{s.title}</div>
              <div className="mt-1 text-xs text-muted-foreground">{s.text}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-4xl rounded-3xl bg-gradient-hero px-8 py-16 text-center text-primary-foreground shadow-elegant sm:px-12">
        <h2 className="font-display text-3xl font-bold sm:text-4xl">Create your Emergency Health ID in 2 minutes.</h2>
        <p className="mx-auto mt-3 max-w-xl text-base opacity-90">Free forever. No credit card. Just a QR that could save your life.</p>
        <Button asChild size="lg" className="mt-8 h-12 bg-background px-8 text-base text-foreground hover:bg-background/90">
          <Link to="/auth">Get my QR code <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </Button>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-sm text-muted-foreground sm:flex-row sm:px-6">
        <div className="flex items-center gap-2">
          <HeartPulse className="h-4 w-4 text-accent" />
          <span>© {new Date().getFullYear()} Emergency Health ID</span>
        </div>
        <div className="flex gap-5">
          <a href="#features" className="hover:text-foreground">Features</a>
          <a href="#security" className="hover:text-foreground">Privacy</a>
          <Link to="/auth" className="hover:text-foreground">Sign in</Link>
        </div>
      </div>
    </footer>
  );
}
