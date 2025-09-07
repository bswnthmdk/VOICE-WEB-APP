import { Button } from "@/components/ui/button";
import { Moon, Sun, Mic, MessageCircle, Bell } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import Profile from "@/components/Profile";

export function AdminHeader({
  user,
  onLogout,
  onUserUpdate,
  title = "Admin Dashboard",
  subtitle = "Welcome back",
}) {
  const { theme, setTheme } = useTheme();

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Mic className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-foreground rounded-full animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl font-bold tracking-tight">
                VoiceAuth
              </span>
              <span className="text-xs text-muted-foreground -mt-1">
                Secure Voice ID
              </span>
            </div>
          </div>
          <div className="h-6 w-px bg-border" />
          <div>
            <h1 className="font-serif text-xl font-semibold">{title}</h1>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm">
            <MessageCircle className="w-4 h-4 mr-2" />
            Chat
          </Button>
          <div className="relative">
            <Button variant="outline" size="icon">
              <Bell className="w-4 h-4" />
            </Button>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="relative"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          {user && (
            <Profile
              user={user}
              onLogout={onLogout}
              onUserUpdate={onUserUpdate}
            />
          )}
        </div>
      </div>
    </header>
  );
}
