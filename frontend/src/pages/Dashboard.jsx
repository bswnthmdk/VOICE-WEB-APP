import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Mic,
  User,
  Settings,
  LogOut,
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
    // Add logout logic here
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
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
                <h1 className="font-serif text-xl font-semibold">Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                  Welcome back, {user.name}
                </p>
              </div>
            </div>

            {/* Profile Menu */}
            <div className="flex items-center gap-4">
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full"
                  >
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium">{user.avatar}</span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid md:grid-cols-2 gap-6">
          {/* User Dashboard Card */}
          <Card
            className="hover:border-primary/50 transition-colors cursor-pointer"
            onClick={() => navigate("/user-dashboard")}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LayoutDashboard className="w-5 h-5" />
                User Dashboard
              </CardTitle>
              <CardDescription>
                Access your voice authentication controls and connected locks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <Badge variant="outline" className="mb-1">
                      User Features
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      Manage your voice authentication and access
                    </p>
                  </div>
                </div>
                <Button variant="ghost" className="ml-2">
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
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5" />
                Admin Dashboard
              </CardTitle>
              <CardDescription>
                Manage system settings, users, and security controls
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <ShieldAlert className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <Badge variant="outline" className="mb-1">
                      Admin Features
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      System-wide management and controls
                    </p>
                  </div>
                </div>
                <Button variant="ghost" className="ml-2">
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
