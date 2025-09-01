import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Settings, LogOut } from "lucide-react";
import ProfileSettings from "./ProfileSettings";
import VoiceTraining from "./VoiceTraining";
import {
  showSuccess,
  showError,
  showLoading,
  showInfo,
  dismiss,
} from "@/lib/toast";

export default function Profile({ user, onLogout, onUserUpdate }) {
  const [showSettings, setShowSettings] = useState(false);

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to logout?")) {
      const logoutToast = showLoading("Logging out...");

      try {
        // Call the logout function passed from parent
        if (onLogout) {
          console.log("🔄 Using parent logout function");
          await onLogout();
        } else {
          console.log("🔄 Using fallback logout");
          // Fallback logout logic
          const API_BASE_URL =
            import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
          const token = localStorage.getItem("accessToken");

          if (token) {
            const response = await fetch(
              `${API_BASE_URL}/voice-web-app/api/users/logout`,
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
                credentials: "include",
              }
            );

            const data = await response.json();
            console.log("📤 Logout response:", data);

            if (response.ok) {
              showSuccess("Logged out successfully");
            } else {
              showError(`Logout failed: ${data.message}`);
            }
          }

          // Clear authentication data
          localStorage.removeItem("isAuthenticated");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
          showInfo("Session cleared");

          // Redirect to home page
          setTimeout(() => {
            window.location.href = "/";
          }, 1000);
        }
      } catch (error) {
        console.error("❌ Logout error:", error);
        dismiss(logoutToast);
        showError(`Logout error: ${error.message}`);

        // Force logout even if API call fails
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        showInfo("Forced logout - session cleared");

        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      } finally {
        dismiss(logoutToast);
      }
    } else {
      showInfo("Logout cancelled");
    }
  };

  // Generate user initials for avatar
  const getUserInitials = () => {
    if (user?.fullname) {
      return user.fullname
        .split(" ")
        .map((word) => word.charAt(0))
        .slice(0, 2)
        .join("")
        .toUpperCase();
    }
    if (user?.username) {
      return user.username.charAt(0).toUpperCase();
    }
    return "U";
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-10 w-10 rounded-full hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
          >
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center transition-colors">
              <span className="text-sm font-medium text-foreground">
                {getUserInitials()}
              </span>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 mt-2" sideOffset={8}>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user?.fullname || user?.username || "User"}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email || "user@example.com"}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                @{user?.username || "username"}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => {
              setShowSettings(true);
              showInfo("Opening settings...");
            }}
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>
              Manage your account settings and preferences
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Voice Training Component */}
            <VoiceTraining onClose={() => setShowSettings(false)} />

            {/* Profile Settings Component */}
            <ProfileSettings
              user={user}
              onClose={() => setShowSettings(false)}
              onUserUpdate={onUserUpdate}
              onLogout={onLogout}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
