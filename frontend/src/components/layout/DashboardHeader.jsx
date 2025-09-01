import { Button } from "@/components/ui/button";
import { Moon, Sun, Mic } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import Profile from "@/components/Profile";

export function DashboardHeader({
  user,
  title = "Dashboard",
  subtitle,
  onLogout,
  onUserUpdate,
}) {
  const { theme, setTheme } = useTheme();

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Mic className="w-4 h-4 sm:w-6 sm:h-6 text-primary-foreground" />
                </div>
                <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-foreground rounded-full animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-lg sm:text-xl font-bold tracking-tight">
                  VoiceAuth
                </span>
                <span className="text-xs text-muted-foreground -mt-1 hidden sm:block">
                  Secure Voice ID
                </span>
              </div>
            </div>
            <div className="h-6 w-px bg-border hidden sm:block" />
            <div className="hidden sm:block">
              <h1 className="font-serif text-xl font-semibold">{title}</h1>
              {subtitle && (
                <p className="text-sm text-muted-foreground">{subtitle}</p>
              )}
            </div>
          </div>

          {/* Mobile Welcome - Show only on small screens */}
          <div className="sm:hidden flex-1 ml-4">
            <h1 className="font-serif text-lg font-semibold">{title}</h1>
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="relative h-8 w-8 sm:h-10 sm:w-10"
            >
              <Sun className="h-[1rem] w-[1rem] sm:h-[1.2rem] sm:w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1rem] w-[1rem] sm:h-[1.2rem] sm:w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Profile
              user={user}
              onLogout={onLogout}
              onUserUpdate={onUserUpdate}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
