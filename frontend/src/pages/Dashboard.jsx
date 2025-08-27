import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/layout/DashboardHeader";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LayoutDashboard, ShieldAlert, User } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();

  const [user] = useState({
    name: "John Doe",
    email: "john.doe@company.com",
    role: "user",
    avatar: "JD",
  });

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        user={user}
        title="Dashboard"
        subtitle={`Welcome back, ${user.name}`}
      />

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
