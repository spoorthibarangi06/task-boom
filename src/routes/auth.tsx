import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { HeartPulse, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useApp } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — Emergency Health ID" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { user, authLoading } = useApp();

  useEffect(() => {
    if (!authLoading && user) navigate({ to: "/dashboard" });
  }, [user, authLoading, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-subtle px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-md">
            <HeartPulse className="h-5 w-5" />
          </span>
          <span className="font-display text-xl font-bold">Emergency Health ID</span>
        </Link>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-elegant sm:p-8">
          <Tabs defaultValue="signin">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Create account</TabsTrigger>
            </TabsList>
            <TabsContent value="signin"><SignInForm /></TabsContent>
            <TabsContent value="signup"><SignUpForm /></TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome back!");
    navigate({ to: "/dashboard" });
  };

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="si-email">Email</Label>
        <Input id="si-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="si-password">Password</Label>
        <Input id="si-password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <Button type="submit" disabled={loading} className="w-full bg-gradient-primary text-primary-foreground hover:opacity-95">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
      </Button>
    </form>
  );
}

function SignUpForm() {
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", dob: "", blood: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: { name: form.name },
      },
    });
    if (error) { setLoading(false); return toast.error(error.message); }

    // Save extra fields on profile
    if (data.user) {
      await supabase.from("profiles").update({
        name: form.name,
        phone: form.phone || null,
        date_of_birth: form.dob || null,
        blood_group: form.blood || null,
      }).eq("user_id", data.user.id);
    }

    setLoading(false);
    toast.success("Account created!");
    navigate({ to: "/dashboard" });
  };

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="su-name">Full name</Label>
        <Input id="su-name" required value={form.name} onChange={set("name")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="su-email">Email</Label>
        <Input id="su-email" type="email" required value={form.email} onChange={set("email")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="su-password">Password</Label>
        <Input id="su-password" type="password" required minLength={6} value={form.password} onChange={set("password")} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="su-phone">Phone</Label>
          <Input id="su-phone" value={form.phone} onChange={set("phone")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="su-dob">Date of birth</Label>
          <Input id="su-dob" type="date" value={form.dob} onChange={set("dob")} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="su-blood">Blood group</Label>
        <Input id="su-blood" placeholder="e.g. O+" value={form.blood} onChange={set("blood")} />
      </div>
      <Button type="submit" disabled={loading} className="w-full bg-gradient-primary text-primary-foreground hover:opacity-95">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Emergency ID"}
      </Button>
    </form>
  );
}
