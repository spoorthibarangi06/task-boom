import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Plus, ClipboardList, GanttChartSquare, MessageSquare, Camera, AlertTriangle, CheckCircle2, Clock, Calendar, ImagePlus, Users } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useApp, type TaskStatus, type Task, type Project } from "@/lib/store";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — SitePulse" },
      { name: "description", content: "Manage your construction projects, tasks, and daily progress." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { user, authLoading, projects, tasks } = useApp();
  const navigate = useNavigate();
  const [activeProjectId, setActiveProjectId] = useState<string | null>(projects[0]?.id ?? null);

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/auth" });
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!activeProjectId && projects[0]) setActiveProjectId(projects[0].id);
  }, [projects, activeProjectId]);

  const activeProject = projects.find((p) => p.id === activeProjectId) ?? null;
  const projectTasks = useMemo(() => tasks.filter((t) => t.projectId === activeProjectId), [tasks, activeProjectId]);

  const stats = useMemo(() => {
    const all = tasks.length;
    const done = tasks.filter((t) => t.status === "done").length;
    const inProgress = tasks.filter((t) => t.status === "in_progress").length;
    const today = new Date().toISOString().slice(0, 10);
    const delayed = tasks.filter((t) => t.status !== "done" && t.dueDate < today).length;
    return { all, done, inProgress, delayed };
  }, [tasks]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-primary">Workspace</div>
            <h1 className="font-display text-3xl font-bold sm:text-4xl">
              Hi {user.name.split(" ")[0]} — your sites at a glance
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">Role: <span className="capitalize">{user.role}</span></p>
          </div>
          <NewProjectDialog />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={ClipboardList} label="Total tasks" value={stats.all} tone="primary" />
          <StatCard icon={Clock} label="In progress" value={stats.inProgress} tone="accent" />
          <StatCard icon={CheckCircle2} label="Done" value={stats.done} tone="success" />
          <StatCard icon={AlertTriangle} label="Delayed" value={stats.delayed} tone="destructive" />
        </div>

        <TeamMembers />

        <div className="mt-8 grid gap-6 lg:grid-cols-[320px_1fr]">
          <ProjectsSidebar projects={projects} activeId={activeProjectId} onSelect={setActiveProjectId} />

          {activeProject ? (
            <div className="rounded-2xl border border-border bg-card shadow-sm">
              <div className="border-b border-border p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="font-display text-2xl font-bold">{activeProject.name}</h2>
                    <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{activeProject.description}</p>
                    <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {activeProject.startDate} → {activeProject.endDate}</span>
                      <ProjectStatusBadge status={activeProject.status} />
                    </div>
                  </div>
                  <NewTaskDialog projectId={activeProject.id} />
                </div>
              </div>

              <Tabs defaultValue="tasks" className="p-6">
                <TabsList>
                  <TabsTrigger value="tasks"><ClipboardList className="mr-2 h-4 w-4" /> Tasks</TabsTrigger>
                  <TabsTrigger value="updates"><MessageSquare className="mr-2 h-4 w-4" /> Updates</TabsTrigger>
                  <TabsTrigger value="timeline"><GanttChartSquare className="mr-2 h-4 w-4" /> Timeline</TabsTrigger>
                </TabsList>

                <TabsContent value="tasks" className="mt-6">
                  <TaskBoard tasks={projectTasks} />
                </TabsContent>
                <TabsContent value="updates" className="mt-6">
                  <UpdatesFeed projectTasks={projectTasks} />
                </TabsContent>
                <TabsContent value="timeline" className="mt-6">
                  <Timeline project={activeProject} tasks={projectTasks} />
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-border bg-card text-muted-foreground">
              Create your first project to get started.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, tone }: { icon: React.ComponentType<{ className?: string }>; label: string; value: number; tone: "primary" | "accent" | "success" | "destructive" }) {
  const toneClass = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent/20 text-accent-foreground",
    success: "bg-success/15 text-success",
    destructive: "bg-destructive/10 text-destructive",
  }[tone];
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className={"flex h-9 w-9 items-center justify-center rounded-xl " + toneClass}>
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <div className="mt-2 font-display text-3xl font-bold">{value}</div>
    </div>
  );
}

function ProjectsSidebar({ projects, activeId, onSelect }: { projects: Project[]; activeId: string | null; onSelect: (id: string) => void }) {
  return (
    <aside className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between px-2">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Projects</h3>
        <span className="text-xs text-muted-foreground">{projects.length}</span>
      </div>
      <div className="space-y-1">
        {projects.map((p) => (
          <button
            key={p.id}
            onClick={() => onSelect(p.id)}
            className={
              "flex w-full flex-col gap-0.5 rounded-xl px-3 py-3 text-left transition " +
              (activeId === p.id ? "bg-gradient-primary text-primary-foreground shadow-md" : "hover:bg-secondary")
            }
          >
            <span className="text-sm font-semibold">{p.name}</span>
            <span className={"text-xs " + (activeId === p.id ? "text-primary-foreground/80" : "text-muted-foreground")}>
              {p.startDate} → {p.endDate}
            </span>
          </button>
        ))}
      </div>
    </aside>
  );
}

function ProjectStatusBadge({ status }: { status: Project["status"] }) {
  const map = {
    active: { label: "Active", cls: "bg-success/15 text-success border-success/30" },
    completed: { label: "Completed", cls: "bg-primary/10 text-primary border-primary/30" },
    delayed: { label: "Delayed", cls: "bg-destructive/10 text-destructive border-destructive/30" },
  } as const;
  const s = map[status];
  return <span className={"inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium " + s.cls}>{s.label}</span>;
}

const STATUS_LABEL: Record<TaskStatus, string> = { pending: "Pending", in_progress: "In Progress", done: "Done" };

function TaskBoard({ tasks }: { tasks: Task[] }) {
  const columns: TaskStatus[] = ["pending", "in_progress", "done"];
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {columns.map((col) => {
        const items = tasks.filter((t) => t.status === col);
        return (
          <div key={col} className="rounded-xl border border-border bg-secondary/50 p-3">
            <div className="mb-3 flex items-center justify-between px-1">
              <span className="text-sm font-semibold">{STATUS_LABEL[col]}</span>
              <span className="text-xs text-muted-foreground">{items.length}</span>
            </div>
            <div className="space-y-2">
              {items.length === 0 && <p className="px-1 py-4 text-xs text-muted-foreground">No tasks here yet.</p>}
              {items.map((t) => <TaskCard key={t.id} task={t} />)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TaskCard({ task }: { task: Task }) {
  const { updateTaskStatus, updates } = useApp();
  const today = new Date().toISOString().slice(0, 10);
  const delayed = task.status !== "done" && task.dueDate < today;
  const updateCount = updates.filter((u) => u.taskId === task.id).length;

  return (
    <div className="rounded-lg border border-border bg-card p-3 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium leading-snug">{task.title}</p>
        {delayed && <Badge variant="outline" className="border-destructive/30 bg-destructive/10 text-[10px] text-destructive">Delayed</Badge>}
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
        <span className="truncate">{task.assignee}</span>
        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {task.dueDate}</span>
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        <Select value={task.status} onValueChange={(v) => { updateTaskStatus(task.id, v as TaskStatus); toast.success("Status updated"); }}>
          <SelectTrigger className="h-8 w-full text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="done">Done</SelectItem>
          </SelectContent>
        </Select>
        <UpdateDialog taskId={task.id}>
          <Button size="sm" variant="outline" className="h-8 shrink-0 px-2">
            <MessageSquare className="h-3.5 w-3.5" />
            <span className="ml-1 text-xs">{updateCount}</span>
          </Button>
        </UpdateDialog>
      </div>
    </div>
  );
}

function UpdatesFeed({ projectTasks }: { projectTasks: Task[] }) {
  const { updates } = useApp();
  const taskMap = new Map(projectTasks.map((t) => [t.id, t]));
  const feed = updates
    .filter((u) => taskMap.has(u.taskId))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  if (feed.length === 0) return <p className="py-8 text-center text-sm text-muted-foreground">No updates yet. Add one from any task.</p>;

  return (
    <div className="space-y-3">
      {feed.map((u) => {
        const t = taskMap.get(u.taskId)!;
        return (
          <div key={u.id} className="flex gap-4 rounded-xl border border-border bg-secondary/40 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-primary text-sm font-semibold text-primary-foreground">
              {u.author.split(" ").map((s) => s[0]).join("").slice(0, 2)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-sm font-semibold">{u.author}</span>
                <span className="text-xs text-muted-foreground">on “{t.title}”</span>
                <span className="ml-auto text-xs text-muted-foreground">{new Date(u.createdAt).toLocaleString()}</span>
              </div>
              <p className="mt-1 text-sm text-foreground">{u.note}</p>
              {u.imageUrl && (
                <div className="mt-3 flex items-center gap-2 rounded-lg border border-dashed border-border bg-card p-3 text-xs text-muted-foreground">
                  <Camera className="h-4 w-4" /> Photo attached: {u.imageUrl}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Timeline({ project, tasks }: { project: Project; tasks: Task[] }) {
  const start = new Date(project.startDate).getTime();
  const end = new Date(project.endDate).getTime();
  const span = Math.max(end - start, 1);
  const today = Date.now();
  const todayPct = Math.min(100, Math.max(0, ((today - start) / span) * 100));

  if (tasks.length === 0) return <p className="py-8 text-center text-sm text-muted-foreground">No tasks to display on the timeline.</p>;

  return (
    <div className="space-y-3">
      <div className="relative h-2 rounded-full bg-secondary">
        <div className="absolute top-1/2 h-3 w-0.5 -translate-y-1/2 bg-accent" style={{ left: `${todayPct}%` }} />
      </div>
      <div className="space-y-2">
        {tasks.map((t) => {
          const due = new Date(t.dueDate).getTime();
          const created = new Date(t.createdAt).getTime();
          const startPct = Math.max(0, Math.min(95, ((created - start) / span) * 100));
          const widthPct = Math.max(4, Math.min(100 - startPct, ((due - created) / span) * 100));
          const isDelayed = t.status !== "done" && due < today;
          const barClass =
            t.status === "done" ? "bg-success" : isDelayed ? "bg-destructive" : t.status === "in_progress" ? "bg-gradient-primary" : "bg-muted-foreground/40";
          return (
            <div key={t.id} className="grid grid-cols-[200px_1fr] items-center gap-3">
              <div className="truncate text-sm">
                <div className="font-medium">{t.title}</div>
                <div className="text-xs text-muted-foreground">{t.assignee} · due {t.dueDate}</div>
              </div>
              <div className="relative h-7 rounded-md bg-secondary/60">
                <div
                  className={"absolute top-1 h-5 rounded " + barClass}
                  style={{ left: `${startPct}%`, width: `${widthPct}%` }}
                  title={`${STATUS_LABEL[t.status]}${isDelayed ? " · delayed" : ""}`}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-4 pt-2 text-xs text-muted-foreground">
        <Legend className="bg-gradient-primary" label="In progress" />
        <Legend className="bg-success" label="Done" />
        <Legend className="bg-destructive" label="Delayed" />
        <Legend className="bg-muted-foreground/40" label="Pending" />
        <span className="ml-auto inline-flex items-center gap-1.5"><span className="inline-block h-3 w-0.5 bg-accent" /> Today</span>
      </div>
    </div>
  );
}

function Legend({ className, label }: { className: string; label: string }) {
  return <span className="inline-flex items-center gap-1.5"><span className={"h-2.5 w-2.5 rounded " + className} /> {label}</span>;
}

function NewProjectDialog() {
  const { addProject } = useApp();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const today = new Date().toISOString().slice(0, 10);
  const inAMonth = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10);
  const [start, setStart] = useState(today);
  const [end, setEnd] = useState(inAMonth);

  const submit = () => {
    if (name.trim().length < 2) return toast.error("Project name is too short");
    addProject({ name: name.trim(), description: desc.trim(), startDate: start, endDate: end, status: "active" });
    toast.success("Project created");
    setOpen(false); setName(""); setDesc("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-primary text-primary-foreground shadow-md hover:opacity-95">
          <Plus className="mr-2 h-4 w-4" /> New project
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Create new project</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="pname">Project name</Label>
            <Input id="pname" value={name} onChange={(e) => setName(e.target.value)} placeholder="Riverside Tower – Phase 3" maxLength={120} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pdesc">Description</Label>
            <Textarea id="pdesc" value={desc} onChange={(e) => setDesc(e.target.value)} maxLength={500} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="ps">Start</Label>
              <Input id="ps" type="date" value={start} onChange={(e) => setStart(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pe">End</Label>
              <Input id="pe" type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={submit} className="bg-gradient-primary text-primary-foreground hover:opacity-95">Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function NewTaskDialog({ projectId }: { projectId: string }) {
  const { addTask } = useApp();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [assignee, setAssignee] = useState("");
  const [due, setDue] = useState(new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10));
  const [status, setStatus] = useState<TaskStatus>("pending");

  const submit = () => {
    if (title.trim().length < 2) return toast.error("Task title is too short");
    if (assignee.trim().length < 2) return toast.error("Assignee required");
    addTask({ projectId, title: title.trim(), assignee: assignee.trim(), dueDate: due, status });
    toast.success("Task added");
    setOpen(false); setTitle(""); setAssignee("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline"><Plus className="mr-2 h-4 w-4" /> Add task</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Add task</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="tt">Title</Label>
            <Input id="tt" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={140} placeholder="Pour foundation slab" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ta">Assignee</Label>
            <Input id="ta" value={assignee} onChange={(e) => setAssignee(e.target.value)} maxLength={80} placeholder="Sara M." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="td">Due date</Label>
              <Input id="td" type="date" value={due} onChange={(e) => setDue(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as TaskStatus)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={submit} className="bg-gradient-primary text-primary-foreground hover:opacity-95">Add task</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function UpdateDialog({ taskId, children }: { taskId: string; children: React.ReactNode }) {
  const { addUpdate, user, updates } = useApp();
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [imageName, setImageName] = useState<string | null>(null);

  const taskUpdates = updates.filter((u) => u.taskId === taskId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const submit = () => {
    if (note.trim().length < 2) return toast.error("Add a note");
    addUpdate({ taskId, note: note.trim(), imageUrl: imageName ?? undefined, author: user?.name ?? "Anonymous" });
    toast.success("Update posted");
    setNote(""); setImageName(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>Task updates</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="What was done today?" maxLength={500} />
          <div className="flex items-center justify-between">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-border px-3 py-2 text-xs text-muted-foreground hover:bg-secondary">
              <ImagePlus className="h-4 w-4" />
              {imageName ?? "Attach photo (UI demo)"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setImageName(e.target.files?.[0]?.name ?? null)}
              />
            </label>
            <Button onClick={submit} className="bg-gradient-primary text-primary-foreground hover:opacity-95">Post update</Button>
          </div>

          <div className="mt-4 max-h-72 space-y-2 overflow-y-auto pr-1">
            {taskUpdates.length === 0 && <p className="py-4 text-center text-xs text-muted-foreground">No updates yet.</p>}
            {taskUpdates.map((u) => (
              <div key={u.id} className="rounded-lg border border-border bg-secondary/40 p-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-semibold">{u.author}</span>
                  <span className="text-[10px] text-muted-foreground">{new Date(u.createdAt).toLocaleString()}</span>
                </div>
                <p className="mt-1 text-sm">{u.note}</p>
                {u.imageUrl && <p className="mt-1 text-[11px] text-muted-foreground"><Camera className="mr-1 inline h-3 w-3" />{u.imageUrl}</p>}
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface ProfileRow {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

function TeamMembers() {
  const [members, setMembers] = useState<ProfileRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, email, created_at")
        .order("created_at", { ascending: false });
      if (!mounted) return;
      if (error) {
        toast.error("Could not load team members");
      } else {
        setMembers(data ?? []);
      }
      setLoading(false);
    };
    load();
    return () => { mounted = false; };
  }, []);

  return (
    <section className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Users className="h-4 w-4" />
          </span>
          <div>
            <h2 className="font-display text-lg font-bold">Team members</h2>
            <p className="text-xs text-muted-foreground">Everyone who has signed up to this workspace.</p>
          </div>
        </div>
        <span className="text-xs text-muted-foreground">{members.length} total</span>
      </div>

      {loading ? (
        <p className="py-6 text-center text-sm text-muted-foreground">Loading…</p>
      ) : members.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">No members yet.</p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">Name</th>
                <th className="px-4 py-2 text-left font-semibold">Email</th>
                <th className="px-4 py-2 text-left font-semibold">Joined</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id} className="border-t border-border">
                  <td className="px-4 py-2.5 font-medium">{m.name}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{m.email}</td>
                  <td className="px-4 py-2.5 text-xs text-muted-foreground">
                    {new Date(m.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
