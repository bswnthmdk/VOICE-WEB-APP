import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AdminHeader } from "@/components/layout/AdminHeader";
import {
  Lock,
  Key,
  Users,
  Plus,
  Trash2,
  Activity,
  Clock,
  User,
} from "lucide-react";

export default function AdminDashboard() {
  const [selectedLock, setSelectedLock] = useState(null);
  const [showAddLock, setShowAddLock] = useState(false);

  // Mock admin user data
  const [adminUser] = useState({
    name: "Biswanath Modak",
    email: "admin@voiceauth.com",
    role: "admin",
    avatar: "BM",
  });

  // Mock data
  const locks = [
    { id: "LOCK001", name: "Main Office", keys: 12, status: "active" },
    { id: "LOCK002", name: "Server Room", keys: 3, status: "active" },
    { id: "LOCK003", name: "Conference Room A", keys: 8, status: "inactive" },
  ];

  const users = [
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice@company.com",
      panelId: "PANEL001",
      status: "active",
      lastSeen: "2 hours ago",
    },
    {
      id: 2,
      name: "Bob Smith",
      email: "bob@company.com",
      panelId: "PANEL002",
      status: "active",
      lastSeen: "5 minutes ago",
    },
    {
      id: 3,
      name: "Carol Davis",
      email: "carol@company.com",
      panelId: "PANEL003",
      status: "inactive",
      lastSeen: "2 days ago",
    },
  ];

  const recentActivity = [
    {
      id: 1,
      action: "User login",
      user: "Alice Johnson",
      time: "2 minutes ago",
      type: "success",
    },
    {
      id: 2,
      action: "Lock accessed",
      lock: "Main Office",
      time: "15 minutes ago",
      type: "info",
    },
    {
      id: 3,
      action: "New user registered",
      user: "David Wilson",
      time: "1 hour ago",
      type: "success",
    },
    {
      id: 4,
      action: "Failed authentication",
      user: "Unknown",
      time: "2 hours ago",
      type: "warning",
    },
    {
      id: 5,
      action: "Lock created",
      lock: "Storage Room",
      time: "3 hours ago",
      type: "info",
    },
  ];

  const handleAddLock = (e) => {
    e.preventDefault();
    setShowAddLock(false);
    // Add lock logic here
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader
        user={adminUser}
        title="Admin Dashboard"
        subtitle="Welcome back, Administrator"
      />

      <div className="container mx-auto px-6 py-6">
        <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
          {/* Lock List Section */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Lock Management
                  </CardTitle>
                  <CardDescription>
                    {locks.length} locks configured
                  </CardDescription>
                </div>
                <Button size="sm" onClick={() => setShowAddLock(true)}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {showAddLock && (
                <Card className="border-dashed">
                  <CardContent className="pt-4">
                    <form onSubmit={handleAddLock} className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="lockId" className="text-sm">
                          Lock ID
                        </Label>
                        <Input id="lockId" placeholder="LOCK004" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="adminPassword" className="text-sm">
                          Admin Password
                        </Label>
                        <Input id="adminPassword" type="password" required />
                      </div>
                      <div className="flex gap-2">
                        <Button type="submit" size="sm" className="flex-1">
                          Add
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setShowAddLock(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              {locks.map((lock) => (
                <Card
                  key={lock.id}
                  className={`cursor-pointer transition-colors ${
                    selectedLock === lock.id
                      ? "border-primary bg-primary/5"
                      : "hover:bg-muted/50"
                  }`}
                  onClick={() =>
                    setSelectedLock(selectedLock === lock.id ? null : lock.id)
                  }
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{lock.name}</h3>
                      <Badge
                        variant={
                          lock.status === "active" ? "default" : "secondary"
                        }
                      >
                        {lock.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {lock.id}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Key className="w-3 h-3" />
                        {lock.keys} keys
                      </span>
                    </div>
                    {selectedLock === lock.id && (
                      <div className="mt-3 pt-3 border-t border-border">
                        <p className="text-xs text-muted-foreground mb-2">
                          Related Keys:
                        </p>
                        <div className="space-y-1">
                          {Array.from({ length: lock.keys }, (_, i) => (
                            <div
                              key={i}
                              className="text-xs bg-muted/50 px-2 py-1 rounded"
                            >
                              KEY{String(i + 1).padStart(3, "0")} - User {i + 1}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>

          {/* User List Section */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Connected Users
              </CardTitle>
              <CardDescription>
                {users.filter((u) => u.status === "active").length} active users
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {users.map((user) => (
                <Card
                  key={user.id}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm">{user.name}</h3>
                          <p className="text-xs text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            user.status === "active" ? "default" : "secondary"
                          }
                          className="text-xs"
                        >
                          {user.status}
                        </Badge>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <p>Panel ID: {user.panelId}</p>
                      <p>Last seen: {user.lastSeen}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity Section */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>Live system activity feed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/30"
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === "success"
                        ? "bg-green-500"
                        : activity.type === "warning"
                        ? "bg-yellow-500"
                        : "bg-blue-500"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.user && `User: ${activity.user}`}
                      {activity.lock && `Lock: ${activity.lock}`}
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
