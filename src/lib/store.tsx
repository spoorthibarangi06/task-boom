import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface User {
  id: string;
  email: string;
  name: string;
}

interface AppState {
  user: User | null;
  authLoading: boolean;
  logout: () => Promise<void>;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email ?? "",
          name: (session.user.user_metadata as { name?: string })?.name ?? session.user.email?.split("@")[0] ?? "User",
        });
      } else {
        setUser(null);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email ?? "",
          name: (session.user.user_metadata as { name?: string })?.name ?? session.user.email?.split("@")[0] ?? "User",
        });
      }
      setAuthLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const value: AppState = useMemo(
    () => ({
      user,
      authLoading,
      logout: async () => {
        await supabase.auth.signOut();
        setUser(null);
      },
    }),
    [user, authLoading],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
