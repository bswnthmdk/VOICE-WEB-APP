import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { UserHeader } from "@/components/layout/UserHeader";
import {
  Plus,
  Lock,
  Key,
  Wifi,
  Clock,
  Shield,
  Unplug,
  MapPin,
  Battery,
  Signal,
} from "lucide-react";

export default function UserDashboard() {
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [selectedLock, setSelectedLock] = useState(null);
  const [connectData, setConnectData] = useState({
    lockId: "",
    joinCode: "",
  });

  // Mock user data
  const [user] = useState({
    name: "John Doe",
    email: "john.doe@company.com",
    role: "user",
    avatar: "JD",
  });

  const [connectedLocks, setConnectedLocks] = useState([
    {
      id: "LOCK001",
      name: "Main Office Door",
      status: "connected",
      isOpen: false,
      location: "Building A, Floor 1",
      lastAccess: "2 hours ago",
      batteryLevel: 85,
      signalStrength: "strong",
      connectedSince: "March 15, 2024",
    },
    {
      id: "LOCK002",
      name: "Conference Room A",
      status: "connected",
      isOpen: true,
      location: "Building A, Floor 2",
      lastAccess: "5 minutes ago",
      batteryLevel: 62,
      signalStrength: "medium",
      connectedSince: "March 20, 2024",
    },
    {
      id: "LOCK003",
      name: "Storage Room",
      status: "connected",
      isOpen: false,
      location: "Building B, Basement",
      lastAccess: "1 day ago",
      batteryLevel: 45,
      signalStrength: "weak",
      connectedSince: "April 2, 2024",
    },
    {
      id: "LOCK004",
      name: "Server Room",
      status: "connected",
      isOpen: false,
      location: "Building A, Floor 3",
      lastAccess: "Never",
      batteryLevel: 95,
      signalStrength: "strong",
      connectedSince: "April 10, 2024",
    },
  ]);

  const handleConnectLock = () => {
    if (!connectData.lockId || !connectData.joinCode) {
      alert("Please enter both Lock ID and Join Code");
      return;
    }

    // Simulate connecting to a new lock
    const newLock = {
      id: connectData.lockId,
      name: `Lock ${connectData.lockId}`,
      status: "connected",
      isOpen: false,
      location: "Unknown Location",
      lastAccess: "Never",
      batteryLevel: Math.floor(Math.random() * 100),
      signalStrength: ["weak", "medium", "strong"][
        Math.floor(Math.random() * 3)
      ],
      connectedSince: new Date().toLocaleDateString(),
    };

    setConnectedLocks((prev) => [...prev, newLock]);
    setConnectData({ lockId: "", joinCode: "" });
    setShowConnectModal(false);
    alert("Lock connected successfully!");
  };

  const handleDisconnectLock = (lockId) => {
    if (
      window.confirm(
        "Are you sure you want to disconnect from this lock? You'll need the join code to reconnect."
      )
    ) {
      setConnectedLocks((prev) => prev.filter((lock) => lock.id !== lockId));
      setSelectedLock(null);
      alert("Lock disconnected successfully!");
    }
  };

  const handleLockClick = (lock) => {
    setSelectedLock(selectedLock?.id === lock.id ? null : lock);
  };

  const getSignalIcon = (strength) => {
    const baseClass = "w-4 h-4";
    switch (strength) {
      case "strong":
        return <Signal className={`${baseClass} text-green-500`} />;
      case "medium":
        return <Signal className={`${baseClass} text-yellow-500`} />;
      case "weak":
        return <Signal className={`${baseClass} text-red-500`} />;
      default:
        return <Signal className={`${baseClass} text-gray-400`} />;
    }
  };

  const getBatteryColor = (level) => {
    if (level > 60) return "text-green-500";
    if (level > 30) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="min-h-screen bg-background">
      <UserHeader
        user={user}
        title="Lock Management"
        subtitle="Manage your connected smart locks"
      />

      <div className="container mx-auto px-4 sm:px-6 py-6">
        {/* UserHeader Section with Connect Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Connected Locks
            </h2>
            <p className="text-muted-foreground">
              {connectedLocks.length} lock
              {connectedLocks.length !== 1 ? "s" : ""} connected
            </p>
          </div>
          <Button
            onClick={() => setShowConnectModal(true)}
            className="shrink-0"
            size="lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Connect New Lock
          </Button>
        </div>

        {/* Locks Grid */}
        {connectedLocks.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                <Lock className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Locks Connected</h3>
              <p className="text-muted-foreground mb-4">
                Connect to your first smart lock to get started with voice
                authentication
              </p>
              <Button onClick={() => setShowConnectModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Connect Your First Lock
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {connectedLocks.map((lock) => (
              <Card
                key={lock.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedLock?.id === lock.id
                    ? "ring-2 ring-primary border-primary shadow-md"
                    : "hover:border-primary/50"
                }`}
                onClick={() => handleLockClick(lock)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          lock.isOpen
                            ? "bg-green-100 dark:bg-green-900/20"
                            : "bg-red-100 dark:bg-red-900/20"
                        }`}
                      >
                        <Lock
                          className={`w-5 h-5 ${
                            lock.isOpen ? "text-green-600" : "text-red-600"
                          }`}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-base leading-tight truncate">
                          {lock.name}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground font-mono">
                          {lock.id}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={lock.isOpen ? "destructive" : "secondary"}
                      className="text-xs shrink-0"
                    >
                      {lock.isOpen ? "Open" : "Closed"}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  {/* Quick Info - Always Visible */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span className="truncate">{lock.location}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          Last: {lock.lastAccess}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getSignalIcon(lock.signalStrength)}
                        <div className="flex items-center gap-1">
                          <Battery
                            className={`w-3 h-3 ${getBatteryColor(
                              lock.batteryLevel
                            )}`}
                          />
                          <span
                            className={`text-xs ${getBatteryColor(
                              lock.batteryLevel
                            )}`}
                          >
                            {lock.batteryLevel}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details - Show when selected */}
                  {selectedLock?.id === lock.id && (
                    <div className="mt-4 pt-4 border-t space-y-3">
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <p className="text-muted-foreground">Status</p>
                          <Badge variant="outline" className="text-xs mt-1">
                            <Wifi className="w-3 h-3 mr-1" />
                            Connected
                          </Badge>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Signal</p>
                          <div className="flex items-center gap-1 mt-1">
                            {getSignalIcon(lock.signalStrength)}
                            <span className="capitalize text-xs">
                              {lock.signalStrength}
                            </span>
                          </div>
                        </div>
                        <div className="col-span-2">
                          <p className="text-muted-foreground">
                            Connected Since
                          </p>
                          <p className="text-sm mt-1">{lock.connectedSince}</p>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-transparent"
                        >
                          <Shield className="w-3 h-3 mr-2" />
                          Authenticate
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:text-destructive hover:bg-destructive/5"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDisconnectLock(lock.id);
                          }}
                        >
                          <Unplug className="w-3 h-3 mr-2" />
                          Disconnect
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Connect Lock Modal */}
      <Dialog open={showConnectModal} onOpenChange={setShowConnectModal}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Connect New Lock
            </DialogTitle>
            <DialogDescription>
              Enter the lock details to establish a secure connection
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="lockId">Lock ID</Label>
              <Input
                id="lockId"
                placeholder="e.g., LOCK001"
                value={connectData.lockId}
                onChange={(e) =>
                  setConnectData((prev) => ({
                    ...prev,
                    lockId: e.target.value,
                  }))
                }
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Found on the lock device or provided by your administrator
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="joinCode">Join Code</Label>
              <Input
                id="joinCode"
                placeholder="Enter 6-digit code"
                value={connectData.joinCode}
                onChange={(e) =>
                  setConnectData((prev) => ({
                    ...prev,
                    joinCode: e.target.value,
                  }))
                }
                maxLength={6}
                className="font-mono tracking-wider"
              />
              <p className="text-xs text-muted-foreground">
                Provided by your system administrator or found in setup docs
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button onClick={handleConnectLock} className="flex-1">
                <Key className="w-4 h-4 mr-2" />
                Connect Lock
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowConnectModal(false)}
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
