import { Link, useNavigate } from "@tanstack/react-router";
import { HeartPulse, Moon, Sun, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme";
import { useApp } from "@/lib/store";

export function SiteHeader() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useApp();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-md">
            <HeartPulse className="h-5 w-5" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">Emergency Health ID</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <a href="/#features" className="hover:text-foreground">Features</a>
          <a href="/#how" className="hover:text-foreground">How it works</a>
          <a href="/#security" className="hover:text-foreground">Security</a>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          {user ? (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              <Button variant="outline" size="sm" onClick={async () => { await logout(); navigate({ to: "/" }); }}>
                <LogOut className="mr-1 h-3.5 w-3.5" /> Logout
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/auth">Sign in</Link>
              </Button>
              <Button asChild size="sm" className="bg-gradient-primary text-primary-foreground hover:opacity-95">
                <Link to="/auth">Create Emergency ID</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
