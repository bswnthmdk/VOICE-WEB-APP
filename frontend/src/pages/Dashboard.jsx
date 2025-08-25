import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import Profile from "@/components/Profile";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Mic,
  User,
  LayoutDashboard,
  ShieldAlert,
  Moon,
  Sun,
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const [user] = useState({
    name: "John Doe",
    email: "john.doe@company.com",
    role: "user",
    avatar: "JD",
  });

  const handleLogout = () => {
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
                <h1 className="font-serif text-xl font-semibold">Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                  Welcome back, {user.name}
                </p>
              </div>
            </div>

            {/* Mobile Welcome - Show only on small screens */}
            <div className="sm:hidden flex-1 ml-4">
              <h1 className="font-serif text-lg font-semibold">Dashboard</h1>
            </div>

            {/* Profile Menu */}
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
              <Profile user={user} onLogout={handleLogout} />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Mobile Welcome Message - Show only on small screens */}
        <div className="sm:hidden mb-6">
          <p className="text-sm text-muted-foreground">
            Welcome back, {user.name}
          </p>
        </div>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* User Dashboard Card */}
          <Card
            className="hover:border-primary/50 transition-colors cursor-pointer"
            onClick={() => navigate("/user-dashboard")}
          >
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <LayoutDashboard className="w-4 h-4 sm:w-5 sm:h-5" />
                User Dashboard
              </CardTitle>
              <CardDescription className="text-sm">
                Access your voice authentication controls and connected locks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div>
                    <Badge variant="outline" className="mb-1 text-xs">
                      User Features
                    </Badge>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Manage your voice authentication and access
                    </p>
                  </div>
                </div>
                <Button variant="ghost" className="ml-2 text-sm">
                  Open →
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Admin Dashboard Card */}
          <Card
            className="hover:border-primary/50 transition-colors cursor-pointer"
            onClick={() => navigate("/admin-dashboard")}
          >
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <ShieldAlert className="w-4 h-4 sm:w-5 sm:h-5" />
                Admin Dashboard
              </CardTitle>
              <CardDescription className="text-sm">
                Manage system settings, users, and security controls
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div>
                    <Badge variant="outline" className="mb-1 text-xs">
                      Admin Features
                    </Badge>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      System-wide management and controls
                    </p>
                  </div>
                </div>
                <Button variant="ghost" className="ml-2 text-sm">
                  Open →
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
