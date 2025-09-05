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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  ChevronDown,
  Edit3,
  Search,
  ShieldAlert,
  LayoutDashboard,
} from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [dashboardMode, setDashboardMode] = useState("admin");
  const [showAddLock, setShowAddLock] = useState(false);
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [showEditLockModal, setShowEditLockModal] = useState(false);
  const [showLockDetailsModal, setShowLockDetailsModal] = useState(false);
  const [showDeleteLockModal, setShowDeleteLockModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedLock, setSelectedLock] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [lockToDeleteFrom, setLockToDeleteFrom] = useState(null);
  const [lockToEdit, setLockToEdit] = useState(null);
  const [lockToDelete, setLockToDelete] = useState(null);
  const [editLockName, setEditLockName] = useState("");
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [addLockData, setAddLockData] = useState({
    lockId: "",
    adminPassword: "",
  });

  const adminUser = user || {
    name: "Loading...",
    email: "loading@example.com",
    role: "user",
    avatar: "L",
  };

  // Mock data
  const [locks, setLocks] = useState([
    {
      id: "LOCK001",
      name: "Main Office",
      keys: 12,
      joinKey: "ABC123",
      connectedUsers: [
        {
          id: "alice_j",
          fullName: "Alice Johnson",
          username: "alice_j",
          email: "alice@company.com",
        },
        {
          id: "bob_s",
          fullName: "Bob Smith",
          username: "bob_s",
          email: "bob@company.com",
        },
        {
          id: "carol_d",
          fullName: "Carol Davis",
          username: "carol_d",
          email: "carol@company.com",
        },
        {
          id: "david_w",
          fullName: "David Wilson",
          username: "david_w",
          email: "david@company.com",
        },
        {
          id: "emma_b",
          fullName: "Emma Brown",
          username: "emma_b",
          email: "emma@company.com",
        },
        {
          id: "frank_m",
          fullName: "Frank Miller",
          username: "frank_m",
          email: "frank@company.com",
        },
        {
          id: "grace_t",
          fullName: "Grace Taylor",
          username: "grace_t",
          email: "grace@company.com",
        },
        {
          id: "henry_j",
          fullName: "Henry Johnson",
          username: "henry_j",
          email: "henry@company.com",
        },
        {
          id: "ivy_c",
          fullName: "Ivy Chen",
          username: "ivy_c",
          email: "ivy@company.com",
        },
        {
          id: "jack_w",
          fullName: "Jack Wilson",
          username: "jack_w",
          email: "jack@company.com",
        },
        {
          id: "kate_b",
          fullName: "Kate Brown",
          username: "kate_b",
          email: "kate@company.com",
        },
        {
          id: "leo_g",
          fullName: "Leo Garcia",
          username: "leo_g",
          email: "leo@company.com",
        },
      ],
    },
    {
      id: "LOCK002",
      name: "Server Room",
      keys: 3,
      joinKey: "DEF456",
      connectedUsers: [
        {
          id: "alice_j",
          fullName: "Alice Johnson",
          username: "alice_j",
          email: "alice@company.com",
        },
        {
          id: "bob_s",
          fullName: "Bob Smith",
          username: "bob_s",
          email: "bob@company.com",
        },
        {
          id: "david_w",
          fullName: "David Wilson",
          username: "david_w",
          email: "david@company.com",
        },
      ],
    },
    {
      id: "LOCK003",
      name: "Conference Room A",
      keys: 8,
      joinKey: "GHI789",
      connectedUsers: [
        {
          id: "carol_d",
          fullName: "Carol Davis",
          username: "carol_d",
          email: "carol@company.com",
        },
        {
          id: "emma_b",
          fullName: "Emma Brown",
          username: "emma_b",
          email: "emma@company.com",
        },
        {
          id: "frank_m",
          fullName: "Frank Miller",
          username: "frank_m",
          email: "frank@company.com",
        },
        {
          id: "grace_t",
          fullName: "Grace Taylor",
          username: "grace_t",
          email: "grace@company.com",
        },
        {
          id: "henry_j",
          fullName: "Henry Johnson",
          username: "henry_j",
          email: "henry@company.com",
        },
        {
          id: "ivy_c",
          fullName: "Ivy Chen",
          username: "ivy_c",
          email: "ivy@company.com",
        },
        {
          id: "jack_w",
          fullName: "Jack Wilson",
          username: "jack_w",
          email: "jack@company.com",
        },
        {
          id: "kate_b",
          fullName: "Kate Brown",
          username: "kate_b",
          email: "kate@company.com",
        },
      ],
    },
  ]);

  // All unique users across all locks
  const allUsers = [
    {
      id: "alice_j",
      fullName: "Alice Johnson",
      username: "alice_j",
      email: "alice@company.com",
      lockIds: ["LOCK001", "LOCK002"],
    },
    {
      id: "bob_s",
      fullName: "Bob Smith",
      username: "bob_s",
      email: "bob@company.com",
      lockIds: ["LOCK001", "LOCK002"],
    },
    {
      id: "carol_d",
      fullName: "Carol Davis",
      username: "carol_d",
      email: "carol@company.com",
      lockIds: ["LOCK001", "LOCK003"],
    },
    {
      id: "david_w",
      fullName: "David Wilson",
      username: "david_w",
      email: "david@company.com",
      lockIds: ["LOCK001", "LOCK002"],
    },
    {
      id: "emma_b",
      fullName: "Emma Brown",
      username: "emma_b",
      email: "emma@company.com",
      lockIds: ["LOCK001", "LOCK003"],
    },
    {
      id: "frank_m",
      fullName: "Frank Miller",
      username: "frank_m",
      email: "frank@company.com",
      lockIds: ["LOCK001", "LOCK003"],
    },
    {
      id: "grace_t",
      fullName: "Grace Taylor",
      username: "grace_t",
      email: "grace@company.com",
      lockIds: ["LOCK001", "LOCK003"],
    },
    {
      id: "henry_j",
      fullName: "Henry Johnson",
      username: "henry_j",
      email: "henry@company.com",
      lockIds: ["LOCK001", "LOCK003"],
    },
    {
      id: "ivy_c",
      fullName: "Ivy Chen",
      username: "ivy_c",
      email: "ivy@company.com",
      lockIds: ["LOCK001", "LOCK003"],
    },
    {
      id: "jack_w",
      fullName: "Jack Wilson",
      username: "jack_w",
      email: "jack@company.com",
      lockIds: ["LOCK001", "LOCK003"],
    },
    {
      id: "kate_b",
      fullName: "Kate Brown",
      username: "kate_b",
      email: "kate@company.com",
      lockIds: ["LOCK001", "LOCK003"],
    },
    {
      id: "leo_g",
      fullName: "Leo Garcia",
      username: "leo_g",
      email: "leo@company.com",
      lockIds: ["LOCK001"],
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

  const handleDashboardToggle = (mode) => {
    if (mode !== dashboardMode) {
      setDashboardMode(mode);
      if (mode === "user") {
        navigate("/user-dashboard");
      }
    }
  };

  const handleLockClick = (lock) => {
    setSelectedLock(lock);
    setShowLockDetailsModal(true);
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setShowUserDetailsModal(true);
  };

  const handleEditLock = (lock) => {
    setLockToEdit(lock);
    setEditLockName(lock.name);
    setShowEditLockModal(true);
  };

  const handleSaveEditLock = () => {
    if (!editLockName.trim()) {
      alert("Lock name cannot be empty");
      return;
    }

    setLocks((prev) =>
      prev.map((lock) =>
        lock.id === lockToEdit.id ? { ...lock, name: editLockName } : lock
      )
    );

    setShowEditLockModal(false);
    setLockToEdit(null);
    setEditLockName("");
  };

  const handleAddLock = (e) => {
    e.preventDefault();
    if (!addLockData.lockId || !addLockData.adminPassword) {
      alert("Please fill in all fields");
      return;
    }

    // Generate random join key
    const joinKey = Math.random().toString(36).substring(2, 8).toUpperCase();

    const newLock = {
      id: addLockData.lockId,
      name: `Lock ${addLockData.lockId}`,
      keys: 0,
      joinKey: joinKey,
      connectedUsers: [],
    };

    setLocks((prev) => [...prev, newLock]);
    setAddLockData({ lockId: "", adminPassword: "" });
    setShowAddLock(false);
    alert("Lock added successfully!");
  };

  const handleRemoveUserFromLock = (user, lock) => {
    setUserToDelete(user);
    setLockToDeleteFrom(lock);
    setShowDeleteConfirmModal(true);
  };

  const confirmRemoveUser = () => {
    setLocks((prev) =>
      prev.map((lock) =>
        lock.id === lockToDeleteFrom.id
          ? {
              ...lock,
              connectedUsers: lock.connectedUsers.filter(
                (user) => user.id !== userToDelete.id
              ),
              keys: lock.keys - 1,
            }
          : lock
      )
    );

    setShowDeleteConfirmModal(false);
    setUserToDelete(null);
    setLockToDeleteFrom(null);
    alert("User removed from lock successfully!");
  };

  const handleDeleteLock = (lock) => {
    setLockToDelete(lock);
    setShowDeleteLockModal(true);
  };

  const confirmDeleteLock = () => {
    if (!deletePassword) {
      alert("Please enter admin password");
      return;
    }

    // In a real app, you would verify the password
    if (deletePassword === "admin123") {
      setLocks((prev) => prev.filter((lock) => lock.id !== lockToDelete.id));
      setShowDeleteLockModal(false);
      setShowLockDetailsModal(false);
      setDeletePassword("");
      setLockToDelete(null);
      alert("Lock deleted successfully!");
    } else {
      alert("Invalid admin password");
    }
  };

  // Filter users based on search term and only show users who have registered locks
  const registeredUsers = allUsers.filter((user) => user.lockIds.length > 0);
  const filteredUsers = registeredUsers.filter((user) =>
    user.username.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader
        user={adminUser}
        title="Admin Dashboard"
        subtitle="Welcome back, Administrator"
      />
      <div className="flex justify-center my-3">
        <div className="grid grid-cols-2 gap-1 p-1 bg-muted rounded-lg w-fit">
          <Button
            variant={dashboardMode === "admin" ? "default" : "ghost"}
            onClick={() => handleDashboardToggle("admin")}
          >
            <ShieldAlert className="w-3 h-3 mr-1.5" />
            Admin
          </Button>
          <Button
            variant={dashboardMode === "user" ? "default" : "ghost"}
            onClick={() => handleDashboardToggle("user")}
          >
            <LayoutDashboard className="w-3 h-3 mr-1.5" />
            User
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-6">
        {/* Header Section with Connected Users and Add New Lock */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Lock Management
            </h2>
            <p className="text-muted-foreground">
              {locks.length} lock{locks.length !== 1 ? "s" : ""} configured
            </p>
          </div>
          <div className="flex gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="lg">
                  <Users className="w-4 h-4 mr-2" />
                  View Connected Users <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80" align="end">
                <div className="p-2">
                  <div className="relative mb-2">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users..."
                      value={userSearchTerm}
                      onChange={(e) => setUserSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <DropdownMenuSeparator />
                <div className="max-h-60 overflow-y-auto">
                  {filteredUsers.map((user) => (
                    <DropdownMenuItem
                      key={user.id}
                      onClick={() => handleUserClick(user)}
                      className="cursor-pointer"
                    >
                      <span>{user.username}</span>
                    </DropdownMenuItem>
                  ))}
                  {filteredUsers.length === 0 && (
                    <div className="px-2 py-4 text-sm text-muted-foreground text-center">
                      No users found
                    </div>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              onClick={() => setShowAddLock(true)}
              className="shrink-0"
              size="lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Lock
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Lock Management Section - Now spans 2 columns */}
          <div className="lg:col-span-2">
            {locks.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                    <Lock className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No Locks Added</h3>
                  <p className="text-muted-foreground mb-4">
                    Add your first smart lock to get started with the system
                  </p>
                  <Button onClick={() => setShowAddLock(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Lock
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {locks.map((lock) => (
                  <Card
                    key={lock.id}
                    className="h-fit cursor-pointer transition-colors hover:bg-muted/50"
                    onClick={() => handleLockClick(lock)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <Lock className="w-5 h-5 text-primary" />
                          <div className="min-w-0 flex-1">
                            <CardTitle className="text-lg leading-tight truncate">
                              {lock.name}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground font-mono">
                              {lock.id}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditLock(lock);
                          }}
                          className="h-8 w-8"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <Key className="w-3 h-3" />
                          {lock.keys} keys
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {lock.connectedUsers.length} users
                        </span>
                      </div>
                      <div className="mt-2">
                        <Label className="text-xs text-muted-foreground">
                          Join Key
                        </Label>
                        <p className="text-sm font-mono bg-muted/50 px-2 py-1 rounded mt-1">
                          {lock.joinKey}
                        </p>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Recent Activity Section */}
          <Card className="lg:col-span-1 h-fit">
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

      {/* Lock Details Modal */}
      <Dialog
        open={showLockDetailsModal}
        onOpenChange={setShowLockDetailsModal}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              {selectedLock?.name}
            </DialogTitle>
            <DialogDescription>
              Lock details and connected users management
            </DialogDescription>
          </DialogHeader>

          {selectedLock && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Lock ID
                  </Label>
                  <p className="text-sm font-mono mt-1">{selectedLock.id}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Join Key
                  </Label>
                  <p className="text-sm font-mono mt-1 bg-muted/50 px-2 py-1 rounded">
                    {selectedLock.joinKey}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Keys</Label>
                  <p className="text-sm mt-1">{selectedLock.keys}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Connected Users
                  </Label>
                  <p className="text-sm mt-1">
                    {selectedLock.connectedUsers.length}
                  </p>
                </div>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">
                  Connected Users
                </Label>
                <div className="max-h-60 overflow-y-auto border rounded-md">
                  {selectedLock.connectedUsers.length === 0 ? (
                    <div className="p-3 text-center text-sm text-muted-foreground">
                      No users connected
                    </div>
                  ) : (
                    selectedLock.connectedUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-3 border-b last:border-b-0 hover:bg-muted/50"
                      >
                        <div
                          className="cursor-pointer hover:text-primary"
                          onClick={() => handleUserClick(user)}
                        >
                          <p className="text-sm font-medium">{user.fullName}</p>
                          <p className="text-xs text-muted-foreground font-mono">
                            @{user.username}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleRemoveUserFromLock(user, selectedLock)
                          }
                          className="h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => handleEditLock(selectedLock)}
                  className="flex-1"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Name
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 text-destructive hover:text-destructive hover:bg-destructive/5"
                  onClick={() => handleDeleteLock(selectedLock)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Lock
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Lock Confirmation Modal */}
      <Dialog open={showDeleteLockModal} onOpenChange={setShowDeleteLockModal}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="w-5 h-5" />
              Delete Lock
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. Please enter your admin password to
              confirm.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-4 bg-destructive/10 rounded-lg">
              <p className="text-sm text-destructive font-medium">
                You are about to delete: {lockToDelete?.name} (
                {lockToDelete?.id})
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                All connected users will lose access to this lock.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deleteLockPassword">Admin Password</Label>
              <Input
                id="deleteLockPassword"
                type="password"
                placeholder="Enter admin password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="destructive"
                onClick={confirmDeleteLock}
                className="flex-1"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Lock
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteLockModal(false);
                  setDeletePassword("");
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={showAddLock} onOpenChange={setShowAddLock}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add New Lock
            </DialogTitle>
            <DialogDescription>
              Enter the lock details to add a new smart lock to the system
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddLock} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="lockId">Lock ID</Label>
              <Input
                id="lockId"
                placeholder="e.g., LOCK004"
                value={addLockData.lockId}
                onChange={(e) =>
                  setAddLockData((prev) => ({
                    ...prev,
                    lockId: e.target.value,
                  }))
                }
                className="font-mono"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="adminPassword">Admin Password</Label>
              <Input
                id="adminPassword"
                type="password"
                placeholder="Enter admin password"
                value={addLockData.adminPassword}
                onChange={(e) =>
                  setAddLockData((prev) => ({
                    ...prev,
                    adminPassword: e.target.value,
                  }))
                }
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">
                <Lock className="w-4 h-4 mr-2" />
                Add Lock
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddLock(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Lock Name Modal */}
      <Dialog open={showEditLockModal} onOpenChange={setShowEditLockModal}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit3 className="w-5 h-5" />
              Edit Lock Name
            </DialogTitle>
            <DialogDescription>
              Update the display name for this lock
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="lockName">Lock Name</Label>
              <Input
                id="lockName"
                value={editLockName}
                onChange={(e) => setEditLockName(e.target.value)}
                placeholder="Enter lock name"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button onClick={handleSaveEditLock} className="flex-1">
                <Edit3 className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowEditLockModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* User Details Modal */}
      <Dialog
        open={showUserDetailsModal}
        onOpenChange={setShowUserDetailsModal}
      >
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              {selectedUser?.fullName}
            </DialogTitle>
            <DialogDescription>
              User details and connected locks
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Full Name
                  </Label>
                  <p className="text-sm mt-1">{selectedUser.fullName}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Username
                  </Label>
                  <p className="text-sm mt-1 font-mono">
                    {selectedUser.username}
                  </p>
                </div>
                <div className="col-span-2">
                  <Label className="text-xs text-muted-foreground">Email</Label>
                  <p className="text-sm mt-1">{selectedUser.email}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Connected Locks
                  </Label>
                  <p className="text-sm mt-1">{selectedUser.lockIds.length}</p>
                </div>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">
                  Lock IDs
                </Label>
                <div className="space-y-1">
                  {selectedUser.lockIds.map((lockId) => (
                    <div
                      key={lockId}
                      className="text-xs bg-muted/50 px-2 py-1 rounded font-mono"
                    >
                      {lockId}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Remove User Confirmation Modal */}
      <Dialog
        open={showDeleteConfirmModal}
        onOpenChange={setShowDeleteConfirmModal}
      >
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="w-5 h-5" />
              Remove User from Lock
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this user's access to the lock?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-4 bg-destructive/10 rounded-lg">
              <p className="text-sm text-destructive font-medium">
                Remove {userToDelete?.fullName} from {lockToDeleteFrom?.name}?
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                This action cannot be undone.
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="destructive"
                onClick={confirmRemoveUser}
                className="flex-1"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Remove User
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirmModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
