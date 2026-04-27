import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { HardHat, ArrowLeft } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApp, type Role } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in to SitePulse" },
      { name: "description", content: "Log in or create your SitePulse account to start tracking construction projects." },
    ],
  }),
  component: AuthPage,
});

const signupSchema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(80),
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(100),
  role: z.enum(["admin", "engineer", "worker"]),
});

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(1, "Password is required").max(100),
});

function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("demo@sitepulse.app");
  const [password, setPassword] = useState("demo1234");
  const [role, setRole] = useState<Role>("engineer");
  const { login } = useApp();
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "signup") {
      const r = signupSchema.safeParse({ name, email, password, role });
      if (!r.success) return toast.error(r.error.issues[0].message);
      login({ id: crypto.randomUUID(), name: r.data.name, email: r.data.email, role: r.data.role });
      toast.success(`Welcome, ${r.data.name.split(" ")[0]}!`);
    } else {
      const r = loginSchema.safeParse({ email, password });
      if (!r.success) return toast.error(r.error.issues[0].message);
      login({ id: crypto.randomUUID(), name: r.data.email.split("@")[0], email: r.data.email, role: "engineer" });
      toast.success("Signed in");
    }
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="relative grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-gradient-hero lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.2),transparent_55%)]" />
        <div className="relative flex h-full flex-col justify-between p-12 text-primary-foreground">
          <Link to="/" className="flex items-center gap-2.5 w-fit">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-foreground/20 backdrop-blur">
              <HardHat className="h-5 w-5" />
            </div>
            <span className="font-display text-lg font-bold">SitePulse</span>
          </Link>
          <div>
            <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground/70">From the field</div>
            <p className="font-display text-3xl leading-snug">
              “We finished the warehouse two weeks early. SitePulse killed our WhatsApp chaos overnight.”
            </p>
            <div className="mt-6 text-sm text-primary-foreground/80">— Daniel O., Site Engineer · Lagos</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center px-6 py-12 sm:px-12">
        <div className="mx-auto w-full max-w-md">
          <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>

          <h1 className="font-display text-3xl font-bold">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "login" ? "Sign in to your SitePulse workspace." : "Start tracking your first site in under a minute."}
          </p>

          <div className="mt-6 inline-flex rounded-full border border-border bg-secondary p-1">
            {(["login", "signup"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={
                  "rounded-full px-5 py-1.5 text-sm font-medium transition " +
                  (mode === m ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")
                }
              >
                {m === "login" ? "Log in" : "Sign up"}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="mt-6 space-y-4">
            {mode === "signup" && (
              <div className="space-y-1.5">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Sara Mensah" required maxLength={80} />
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required maxLength={255} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required maxLength={100} />
            </div>
            {mode === "signup" && (
              <div className="space-y-1.5">
                <Label>Role</Label>
                <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="engineer">Engineer</SelectItem>
                    <SelectItem value="worker">Worker</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <Button type="submit" className="h-11 w-full bg-gradient-primary text-primary-foreground shadow-md hover:opacity-95">
              {mode === "login" ? "Sign in" : "Create account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            By continuing you agree to SitePulse’s Terms & Privacy.
          </p>
        </div>
      </div>
    </div>
  );
}
