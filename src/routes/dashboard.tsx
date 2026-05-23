import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Download, HeartPulse, Loader2, Plus, Trash2, ExternalLink, Save } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useApp } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Emergency Health ID" }] }),
  component: Dashboard,
});

interface Profile {
  user_id: string;
  public_id: string;
  name: string;
  email: string;
  phone: string | null;
  date_of_birth: string | null;
  blood_group: string | null;
  allergies: string | null;
  conditions: string | null;
  medications: string | null;
  organ_donor: boolean;
  notes: string | null;
}

interface Contact {
  id: string;
  name: string;
  relationship: string | null;
  phone: string;
}

function Dashboard() {
  const { user, authLoading } = useApp();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/auth" });
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: p }, { data: c }] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle(),
        supabase.from("emergency_contacts").select("*").eq("user_id", user.id).order("created_at"),
      ]);
      if (p) setProfile(p as Profile);
      if (c) setContacts(c as Contact[]);
      setLoading(false);
    })();
  }, [user]);

  if (authLoading || loading || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold">Hi {profile.name.split(" ")[0]} 👋</h1>
          <p className="mt-1 text-muted-foreground">Keep your emergency profile up to date — it could save your life.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <MedicalCard profile={profile} setProfile={setProfile} />
            <ContactsCard userId={user!.id} contacts={contacts} setContacts={setContacts} />
          </div>
          <div className="space-y-6">
            <QRCard publicId={profile.public_id} name={profile.name} />
          </div>
        </div>
      </div>
    </div>
  );
}

function MedicalCard({ profile, setProfile }: { profile: Profile; setProfile: (p: Profile) => void }) {
  const [form, setForm] = useState(profile);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      name: form.name,
      phone: form.phone,
      date_of_birth: form.date_of_birth,
      blood_group: form.blood_group,
      allergies: form.allergies,
      conditions: form.conditions,
      medications: form.medications,
      organ_donor: form.organ_donor,
      notes: form.notes,
    }).eq("user_id", profile.user_id);
    setSaving(false);
    if (error) return toast.error(error.message);
    setProfile(form);
    toast.success("Medical info saved");
  };

  const set = <K extends keyof Profile>(k: K, v: Profile[K]) => setForm({ ...form, [k]: v });

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold">Medical information</h2>
          <p className="text-sm text-muted-foreground">Shown on your public emergency profile.</p>
        </div>
        <Button onClick={save} disabled={saving} className="bg-gradient-primary text-primary-foreground hover:opacity-95">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="mr-2 h-4 w-4" /> Save</>}
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name"><Input value={form.name} onChange={(e) => set("name", e.target.value)} /></Field>
        <Field label="Blood group"><Input value={form.blood_group ?? ""} onChange={(e) => set("blood_group", e.target.value)} placeholder="O+" /></Field>
        <Field label="Phone"><Input value={form.phone ?? ""} onChange={(e) => set("phone", e.target.value)} /></Field>
        <Field label="Date of birth"><Input type="date" value={form.date_of_birth ?? ""} onChange={(e) => set("date_of_birth", e.target.value)} /></Field>
        <Field label="Allergies" full><Textarea rows={2} value={form.allergies ?? ""} onChange={(e) => set("allergies", e.target.value)} placeholder="Penicillin, peanuts…" /></Field>
        <Field label="Conditions / diseases" full><Textarea rows={2} value={form.conditions ?? ""} onChange={(e) => set("conditions", e.target.value)} placeholder="Diabetes type 1, asthma…" /></Field>
        <Field label="Current medications" full><Textarea rows={2} value={form.medications ?? ""} onChange={(e) => set("medications", e.target.value)} placeholder="Insulin 10u/day, Ventolin…" /></Field>
        <Field label="Additional notes" full><Textarea rows={2} value={form.notes ?? ""} onChange={(e) => set("notes", e.target.value)} /></Field>
        <div className="sm:col-span-2 flex items-center justify-between rounded-xl border border-border bg-secondary/40 p-4">
          <div>
            <div className="font-medium">Organ donor</div>
            <div className="text-xs text-muted-foreground">Display donor status on your emergency profile.</div>
          </div>
          <Switch checked={form.organ_donor} onCheckedChange={(v) => set("organ_donor", v)} />
        </div>
      </div>
    </div>
  );
}

function Field({ label, full, children }: { label: string; full?: boolean; children: React.ReactNode }) {
  return (
    <div className={`space-y-2 ${full ? "sm:col-span-2" : ""}`}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function ContactsCard({ userId, contacts, setContacts }: { userId: string; contacts: Contact[]; setContacts: (c: Contact[]) => void }) {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: "", relationship: "", phone: "" });

  const add = async () => {
    if (!form.name || !form.phone) return toast.error("Name and phone are required");
    setAdding(true);
    const { data, error } = await supabase.from("emergency_contacts")
      .insert({ user_id: userId, name: form.name, relationship: form.relationship || null, phone: form.phone })
      .select().single();
    setAdding(false);
    if (error) return toast.error(error.message);
    setContacts([...contacts, data as Contact]);
    setForm({ name: "", relationship: "", phone: "" });
    toast.success("Contact added");
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("emergency_contacts").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setContacts(contacts.filter((c) => c.id !== id));
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h2 className="font-display text-xl font-semibold">Emergency contacts</h2>
      <p className="text-sm text-muted-foreground">People responders should call first.</p>

      <div className="mt-5 space-y-3">
        {contacts.map((c) => (
          <div key={c.id} className="flex items-center justify-between rounded-xl border border-border bg-secondary/30 p-3">
            <div>
              <div className="font-medium">{c.name} <span className="text-xs text-muted-foreground">· {c.relationship || "Contact"}</span></div>
              <div className="text-sm text-muted-foreground">{c.phone}</div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => remove(c.id)} aria-label="Remove">
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}
        {contacts.length === 0 && (
          <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            No contacts yet — add the first one below.
          </div>
        )}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_1fr_1fr_auto]">
        <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Input placeholder="Relationship" value={form.relationship} onChange={(e) => setForm({ ...form, relationship: e.target.value })} />
        <Input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <Button onClick={add} disabled={adding} className="bg-gradient-primary text-primary-foreground hover:opacity-95">
          {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Plus className="mr-1 h-4 w-4" /> Add</>}
        </Button>
      </div>
    </div>
  );
}

function QRCard({ publicId, name }: { publicId: string; name: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const url = typeof window !== "undefined" ? `${window.location.origin}/e/${publicId}` : `/e/${publicId}`;

  const download = () => {
    const svg = ref.current?.querySelector("svg");
    if (!svg) return;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);
    const img = new Image();
    const svgBlob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const urlBlob = URL.createObjectURL(svgBlob);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 800; canvas.height = 1000;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#0f172a"; ctx.font = "bold 36px sans-serif"; ctx.textAlign = "center";
      ctx.fillText("EMERGENCY HEALTH ID", 400, 80);
      ctx.font = "28px sans-serif"; ctx.fillText(name, 400, 130);
      ctx.drawImage(img, 100, 180, 600, 600);
      ctx.fillStyle = "#64748b"; ctx.font = "20px sans-serif";
      ctx.fillText("Scan in case of emergency", 400, 840);
      ctx.font = "16px monospace"; ctx.fillText(url, 400, 880);
      URL.revokeObjectURL(urlBlob);
      const a = document.createElement("a");
      a.download = `emergency-id-${name.replace(/\s+/g, "-").toLowerCase()}.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();
    };
    img.src = urlBlob;
  };

  return (
    <div className="sticky top-20 rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <HeartPulse className="h-5 w-5 text-accent" />
        <h2 className="font-display text-lg font-semibold">Your QR code</h2>
      </div>
      <div ref={ref} className="rounded-xl bg-white p-5 ring-1 ring-border">
        <QRCodeSVG value={url} size={260} className="mx-auto" level="M" />
      </div>
      <p className="mt-3 break-all text-center text-xs text-muted-foreground">{url}</p>
      <div className="mt-4 grid gap-2">
        <Button onClick={download} className="bg-gradient-primary text-primary-foreground hover:opacity-95">
          <Download className="mr-2 h-4 w-4" /> Download card
        </Button>
        <Button asChild variant="outline">
          <a href={`/e/${publicId}`} target="_blank" rel="noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" /> Preview emergency view
          </a>
        </Button>
      </div>
    </div>
  );
}
