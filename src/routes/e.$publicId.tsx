import { createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { HeartPulse, Phone, AlertTriangle, Pill, Activity, Droplet, Loader2, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/e/$publicId")({
  head: ({ params }) => ({
    meta: [
      { title: "Emergency Medical Profile" },
      { name: "description", content: `Emergency medical profile for ID ${params.publicId}` },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: EmergencyView,
});

interface EmergencyProfile {
  name: string;
  date_of_birth: string | null;
  blood_group: string | null;
  allergies: string | null;
  conditions: string | null;
  medications: string | null;
  organ_donor: boolean;
  notes: string | null;
  phone: string | null;
  user_id: string;
}

interface Contact { id: string; name: string; relationship: string | null; phone: string; }

function EmergencyView() {
  const { publicId } = Route.useParams();
  const [profile, setProfile] = useState<EmergencyProfile | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFoundState, setNotFoundState] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: p } = await supabase
        .from("profiles")
        .select("name,date_of_birth,blood_group,allergies,conditions,medications,organ_donor,notes,phone,user_id")
        .eq("public_id", publicId)
        .maybeSingle();
      if (!p) { setNotFoundState(true); setLoading(false); return; }
      setProfile(p as EmergencyProfile);
      const { data: c } = await supabase
        .from("emergency_contacts")
        .select("id,name,relationship,phone")
        .eq("user_id", (p as EmergencyProfile).user_id);
      setContacts((c ?? []) as Contact[]);
      setLoading(false);
    })();
  }, [publicId]);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-background"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }

  if (notFoundState || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 text-center">
        <div>
          <AlertTriangle className="mx-auto h-10 w-10 text-destructive" />
          <h1 className="mt-4 font-display text-2xl font-bold">Profile not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">This emergency link is invalid or has been revoked.</p>
        </div>
      </div>
    );
  }

  const age = profile.date_of_birth ? Math.floor((Date.now() - new Date(profile.date_of_birth).getTime()) / 31557600000) : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Emergency banner */}
      <div className="bg-accent px-4 py-3 text-center text-sm font-semibold text-accent-foreground">
        <HeartPulse className="mr-2 inline h-4 w-4" /> EMERGENCY MEDICAL PROFILE
      </div>

      <div className="mx-auto max-w-2xl px-4 py-6 sm:py-10">
        {/* Identity */}
        <div className="rounded-2xl bg-gradient-primary p-6 text-primary-foreground shadow-elegant">
          <div className="text-xs uppercase tracking-widest opacity-80">Patient</div>
          <h1 className="mt-1 font-display text-3xl font-bold">{profile.name}</h1>
          <div className="mt-1 text-sm opacity-90">
            {age !== null && `${age} years old`}
            {profile.organ_donor && <span className="ml-2 rounded-full bg-background/20 px-2 py-0.5 text-xs font-medium">Organ donor</span>}
          </div>
        </div>

        {/* Critical info */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <CriticalCard icon={Droplet} label="Blood group" value={profile.blood_group || "Unknown"} highlight />
          <CriticalCard icon={Phone} label="Personal phone" value={profile.phone || "—"} />
        </div>

        <Section icon={AlertTriangle} title="Allergies" value={profile.allergies} tone="danger" />
        <Section icon={Activity} title="Medical conditions" value={profile.conditions} />
        <Section icon={Pill} title="Current medications" value={profile.medications} />
        {profile.notes && <Section icon={HeartPulse} title="Additional notes" value={profile.notes} />}

        {/* Contacts */}
        <div className="mt-6 rounded-2xl border border-border bg-card p-5">
          <h2 className="font-display text-lg font-semibold">Emergency contacts</h2>
          <div className="mt-3 space-y-2">
            {contacts.length === 0 && <div className="text-sm text-muted-foreground">No contacts listed.</div>}
            {contacts.map((c) => (
              <a key={c.id} href={`tel:${c.phone}`} className="flex items-center justify-between rounded-xl border border-border bg-secondary/40 p-3 transition hover:bg-secondary">
                <div>
                  <div className="font-semibold">{c.name}</div>
                  <div className="text-xs text-muted-foreground">{c.relationship || "Contact"}</div>
                </div>
                <div className="flex items-center gap-2 text-primary">
                  <Phone className="h-4 w-4" />
                  <span className="font-medium">{c.phone}</span>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5" />
          Provided by Emergency Health ID
        </div>
      </div>
    </div>
  );
}

function CriticalCard({ icon: Icon, label, value, highlight }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-2xl border p-4 ${highlight ? "border-accent/40 bg-accent/10" : "border-border bg-card"}`}>
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
        <Icon className={`h-3.5 w-3.5 ${highlight ? "text-accent" : ""}`} /> {label}
      </div>
      <div className={`mt-1 font-display text-2xl font-bold ${highlight ? "text-accent" : ""}`}>{value}</div>
    </div>
  );
}

function Section({ icon: Icon, title, value, tone }: { icon: React.ComponentType<{ className?: string }>; title: string; value: string | null; tone?: "danger" }) {
  return (
    <div className={`mt-4 rounded-2xl border p-5 ${tone === "danger" && value ? "border-accent/40 bg-accent/5" : "border-border bg-card"}`}>
      <div className="flex items-center gap-2">
        <Icon className={`h-4 w-4 ${tone === "danger" ? "text-accent" : "text-primary"}`} />
        <h2 className="font-display text-base font-semibold">{title}</h2>
      </div>
      <p className="mt-2 whitespace-pre-wrap text-sm text-foreground">{value || <span className="text-muted-foreground">None reported</span>}</p>
    </div>
  );
}
