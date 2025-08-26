import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/header";
import {
  Mic,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  Activity,
  Settings,
  Key,
  Lock,
  UserIcon,
} from "lucide-react";

export default function UserDashboard() {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);

  // Mock user data
  const [user] = useState({
    name: "John Doe",
    email: "john.doe@company.com",
    role: "user",
    avatar: "JD",
  });

  const handleLogout = () => {
    navigate("/auth");
  };

  const userProfile = {
    name: user.name,
    email: user.email,
    panelId: "PANEL001",
    status: "active",
    joinedDate: "March 15, 2024",
  };

  const connectedLocks = [
    {
      id: "LOCK001",
      name: "Main Office",
      status: "connected",
      lastAccess: "2 hours ago",
    },
    {
      id: "LOCK002",
      name: "Conference Room A",
      status: "connected",
      lastAccess: "1 day ago",
    },
    {
      id: "LOCK003",
      name: "Storage Room",
      status: "pending",
      lastAccess: "Never",
    },
  ];

  const recentActivity = [
    {
      id: 1,
      action: "Voice authentication successful",
      location: "Main Office",
      time: "2 hours ago",
      status: "success",
    },
    {
      id: 2,
      action: "Access granted",
      location: "Conference Room A",
      time: "1 day ago",
      status: "success",
    },
    {
      id: 3,
      action: "Authentication failed",
      location: "Storage Room",
      time: "2 days ago",
      status: "failed",
    },
    {
      id: 4,
      action: "Voice pattern updated",
      location: "System",
      time: "1 week ago",
      status: "info",
    },
  ];

  const handleVoiceTest = () => {
    setIsRecording(true);
    // Simulate voice recording
    setTimeout(() => {
      setIsRecording(false);
      alert("Voice test completed successfully!");
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        user={user}
        onLogout={handleLogout}
        title="User Panel"
        subtitle={`Welcome back, ${userProfile.name}`}
      />

      <div className="container mx-auto px-6 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile & Voice Test Section */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="w-5 h-5" />
                Profile & Voice Test
              </CardTitle>
              <CardDescription>
                Manage your profile and test voice authentication
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <UserIcon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{userProfile.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {userProfile.email}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Panel ID</p>
                    <p className="font-mono">{userProfile.panelId}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <Badge variant="default" className="text-xs">
                      {userProfile.status}
                    </Badge>
                  </div>
                </div>
                <div className="text-sm">
                  <p className="text-muted-foreground">Member since</p>
                  <p>{userProfile.joinedDate}</p>
                </div>
              </div>

              {/* Voice Test */}
              <div className="border-t pt-6">
                <h4 className="font-semibold mb-3">
                  Voice Authentication Test
                </h4>
                <div className="space-y-3">
                  <Button
                    onClick={handleVoiceTest}
                    disabled={isRecording}
                    className="w-full"
                    variant={isRecording ? "secondary" : "default"}
                  >
                    <Mic
                      className={`w-4 h-4 mr-2 ${
                        isRecording ? "animate-pulse" : ""
                      }`}
                    />
                    {isRecording ? "Recording..." : "Test Voice Authentication"}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Test your voice pattern to ensure optimal authentication
                    performance
                  </p>
                </div>
              </div>

              {/* Quick Settings */}
              <div className="border-t pt-6">
                <Button variant="outline" className="w-full bg-transparent">
                  <Settings className="w-4 h-4 mr-2" />
                  Voice Settings
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Connected Locks Section */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Connected Locks
              </CardTitle>
              <CardDescription>
                {connectedLocks.filter((l) => l.status === "connected").length}{" "}
                active connections
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {connectedLocks.map((lock) => (
                <Card
                  key={lock.id}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <Key className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm">{lock.name}</h3>
                          <p className="text-xs text-muted-foreground">
                            {lock.id}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          lock.status === "connected" ? "default" : "secondary"
                        }
                        className="text-xs"
                      >
                        {lock.status}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <p>Last access: {lock.lastAccess}</p>
                    </div>
                    {lock.status === "connected" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-3 bg-transparent"
                      >
                        <Shield className="w-3 h-3 mr-2" />
                        Authenticate
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>

          {/* Activity History Section */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>Your authentication history</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/30"
                >
                  <div className="mt-2">
                    {activity.status === "success" && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                    {activity.status === "failed" && (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                    {activity.status === "info" && (
                      <Activity className="w-4 h-4 text-blue-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">
                      Location: {activity.location}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {activity.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
