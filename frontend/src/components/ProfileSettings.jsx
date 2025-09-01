import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff, Trash2 } from "lucide-react";
import {
  showSuccess,
  showError,
  showLoading,
  showInfo,
  dismiss,
} from "@/lib/toast";

export default function ProfileSettings({
  user,
  onClose,
  onUserUpdate,
  onLogout,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form states
  const [profileData, setProfileData] = useState({
    newFullname: user?.fullname || "",
    newUsername: user?.username || "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    const loadingToast = showLoading("Updating profile...");

    try {
      // Validation
      if (
        profileData.newPassword &&
        profileData.newPassword !== profileData.confirmNewPassword
      ) {
        dismiss(loadingToast);
        showError("New passwords don't match!");
        setLoading(false);
        return;
      }

      // Check for changes
      const hasChanges =
        profileData.newFullname !== user?.fullname ||
        profileData.newUsername !== user?.username ||
        profileData.newPassword;

      if (!hasChanges) {
        dismiss(loadingToast);
        showInfo("No changes to save!");
        setLoading(false);
        return;
      }

      // Prepare API call
      const API_BASE_URL =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
      const token = localStorage.getItem("accessToken");

      const updateData = {};
      if (profileData.newFullname !== user?.fullname) {
        updateData.newFullname = profileData.newFullname;
      }
      if (profileData.newUsername !== user?.username) {
        updateData.newUsername = profileData.newUsername;
      }
      if (profileData.newPassword) {
        updateData.currentPassword = profileData.currentPassword;
        updateData.newPassword = profileData.newPassword;
      }

      console.log("🔄 Updating profile with data:", updateData);
      const fullUrl = `${API_BASE_URL}/voice-web-app/api/users/update-profile`;
      showInfo(`Sending update request...`);

      const response = await fetch(fullUrl, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updateData),
      });

      const data = await response.json();
      console.log("📡 Update response:", data);

      dismiss(loadingToast);

      if (!response.ok) {
        const errorMessage = data.message || "Failed to update profile";
        console.error("❌ Update failed:", { status: response.status, data });
        showError(`${errorMessage} (${response.status})`);
        throw new Error(errorMessage);
      }

      // Success
      if (onUserUpdate && data.data) {
        onUserUpdate(data.data);
      }

      showSuccess("Profile updated successfully! 🎉");

      // Reset password fields
      setProfileData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      }));
    } catch (error) {
      console.error("❌ Profile update error:", error);
      dismiss(loadingToast);
      showError(error.message || "Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const currentPassword = prompt(
      "Enter your current password to confirm account deletion:"
    );

    if (!currentPassword) {
      showInfo("Account deletion cancelled");
      return;
    }

    if (
      !window.confirm(
        "⚠️ Are you sure you want to delete your account? This action cannot be undone and will permanently delete all your data."
      )
    ) {
      showInfo("Account deletion cancelled");
      return;
    }

    setLoading(true);
    const loadingToast = showLoading("Deleting account...");

    try {
      const API_BASE_URL =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
      const token = localStorage.getItem("accessToken");

      console.log("🗑️ Deleting account...");

      const response = await fetch(
        `${API_BASE_URL}/voice-web-app/api/users/delete-account`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ currentPassword }),
        }
      );

      const data = await response.json();
      console.log("📡 Delete response:", data);

      dismiss(loadingToast);

      if (!response.ok) {
        const errorMessage = data.message || "Failed to delete account";
        console.error("❌ Delete failed:", { status: response.status, data });
        showError(`${errorMessage} (${response.status})`);
        throw new Error(errorMessage);
      }

      showSuccess("Account deleted successfully! 👋");

      // Clear auth and redirect
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");

      onClose();

      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch (error) {
      console.error("❌ Delete account error:", error);
      dismiss(loadingToast);
      showError(error.message || "Failed to delete account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // JSX remains the same - just the handlers are updated with toast notifications
  return (
    <div className="space-y-6">
      {/* Profile Information Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Profile Information</CardTitle>
          <CardDescription>
            Update your personal information and username
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={profileData.newFullname}
              onChange={(e) => handleInputChange("newFullname", e.target.value)}
              placeholder="Enter your full name"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={profileData.newUsername}
              onChange={(e) => handleInputChange("newUsername", e.target.value)}
              placeholder="Enter your username"
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              Choose a unique username for your account
            </p>
          </div>

          <div className="space-y-2">
            <Label>Email Address</Label>
            <Input
              value={user?.email || "user@example.com"}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              Email cannot be changed. Contact support if needed.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Password Change Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Change Password</CardTitle>
          <CardDescription>
            Update your account password for better security
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showPassword ? "text" : "password"}
                value={profileData.currentPassword}
                onChange={(e) =>
                  handleInputChange("currentPassword", e.target.value)
                }
                placeholder="Enter current password"
                disabled={loading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={profileData.newPassword}
              onChange={(e) => handleInputChange("newPassword", e.target.value)}
              placeholder="Enter new password"
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              Password should be at least 6 characters long
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirmNewPassword"
                type={confirmPassword ? "text" : "password"}
                value={profileData.confirmNewPassword}
                onChange={(e) =>
                  handleInputChange("confirmNewPassword", e.target.value)
                }
                placeholder="Confirm new password"
                disabled={loading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setConfirmPassword(!confirmPassword)}
                disabled={loading}
              >
                {confirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={handleSaveProfile}
          className="flex-1"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </Button>
        <Button
          variant="outline"
          onClick={onClose}
          className="flex-1"
          disabled={loading}
        >
          Cancel
        </Button>
      </div>

      {/* Danger Zone */}
      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="text-lg text-destructive">
            Danger Zone
          </CardTitle>
          <CardDescription>
            Irreversible and destructive actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h4 className="font-medium">Delete Account</h4>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all associated data
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              className="shrink-0"
              disabled={loading}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {loading ? "Deleting..." : "Delete Account"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
