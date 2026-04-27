import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type TaskStatus = "pending" | "in_progress" | "done";
export type Role = "admin" | "engineer" | "worker";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Update {
  id: string;
  taskId: string;
  note: string;
  imageUrl?: string;
  createdAt: string;
  author: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  assignee: string;
  dueDate: string;
  status: TaskStatus;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: "active" | "completed" | "delayed";
}

interface AppState {
  user: User | null;
  projects: Project[];
  tasks: Task[];
  updates: Update[];
  login: (user: User) => void;
  logout: () => void;
  addProject: (p: Omit<Project, "id">) => void;
  addTask: (t: Omit<Task, "id" | "createdAt">) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  addUpdate: (u: Omit<Update, "id" | "createdAt">) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

const seedProjects: Project[] = [
  {
    id: "p1",
    name: "Riverside Tower – Phase 2",
    description: "Foundation and basement structural works for 14-story tower.",
    startDate: "2025-04-01",
    endDate: "2025-06-15",
    status: "active",
  },
  {
    id: "p2",
    name: "Greenfield Warehouse",
    description: "Steel-frame warehouse construction, 8000 sqm.",
    startDate: "2025-04-10",
    endDate: "2025-05-30",
    status: "delayed",
  },
];

const seedTasks: Task[] = [
  { id: "t1", projectId: "p1", title: "Excavation & site clearing", assignee: "Ravi K.", dueDate: "2025-04-29", status: "done", createdAt: "2025-04-15" },
  { id: "t2", projectId: "p1", title: "Pour foundation slab – Block A", assignee: "Sara M.", dueDate: "2025-05-05", status: "in_progress", createdAt: "2025-04-18" },
  { id: "t3", projectId: "p1", title: "Steel rebar installation", assignee: "Daniel O.", dueDate: "2025-05-12", status: "pending", createdAt: "2025-04-20" },
  { id: "t4", projectId: "p2", title: "Frame welding – section 3", assignee: "Liu Wei", dueDate: "2025-04-25", status: "in_progress", createdAt: "2025-04-12" },
  { id: "t5", projectId: "p2", title: "Roofing panels delivery", assignee: "Ravi K.", dueDate: "2025-04-22", status: "pending", createdAt: "2025-04-14" },
];

const seedUpdates: Update[] = [
  { id: "u1", taskId: "t1", note: "Site cleared and leveled. Inspector approved.", createdAt: "2025-04-22T09:30:00Z", author: "Ravi K." },
  { id: "u2", taskId: "t2", note: "Concrete pour 60% complete. Curing started on Block A north.", createdAt: "2025-04-24T14:10:00Z", author: "Sara M." },
  { id: "u3", taskId: "t4", note: "Welding behind by 2 days due to material delay.", createdAt: "2025-04-23T11:00:00Z", author: "Liu Wei" },
];

const id = () => Math.random().toString(36).slice(2, 10);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>(seedProjects);
  const [tasks, setTasks] = useState<Task[]>(seedTasks);
  const [updates, setUpdates] = useState<Update[]>(seedUpdates);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const u = localStorage.getItem("sitepulse-user");
    if (u) setUser(JSON.parse(u));
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (user) localStorage.setItem("sitepulse-user", JSON.stringify(user));
    else localStorage.removeItem("sitepulse-user");
  }, [user]);

  const value: AppState = useMemo(
    () => ({
      user,
      projects,
      tasks,
      updates,
      login: (u) => setUser(u),
      logout: () => setUser(null),
      addProject: (p) => setProjects((prev) => [{ ...p, id: id() }, ...prev]),
      addTask: (t) => setTasks((prev) => [{ ...t, id: id(), createdAt: new Date().toISOString() }, ...prev]),
      updateTaskStatus: (taskId, status) =>
        setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status } : t))),
      addUpdate: (u) => setUpdates((prev) => [{ ...u, id: id(), createdAt: new Date().toISOString() }, ...prev]),
    }),
    [user, projects, tasks, updates],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
