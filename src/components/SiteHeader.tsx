import { Link, useNavigate } from "@tanstack/react-router";
import { HardHat, Moon, Sun, LogOut } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { useApp } from "@/lib/store";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useApp();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
            <HardHat className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <div className="font-display text-lg font-bold leading-none">SitePulse</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Build. Track. Deliver.</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <a href="/#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Features</a>
          <a href="/#how" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">How it works</a>
          <a href="/#pricing" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Pricing</a>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          {user ? (
            <>
              <Button variant="ghost" asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              <Button variant="outline" size="icon" onClick={() => { logout(); navigate({ to: "/" }); }} aria-label="Log out">
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild className="hidden sm:inline-flex">
                <Link to="/auth">Sign in</Link>
              </Button>
              <Button asChild className="bg-gradient-primary text-primary-foreground shadow-md hover:opacity-95">
                <Link to="/auth">Start Free</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
