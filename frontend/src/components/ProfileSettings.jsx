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

export default function ProfileSettings({
  user,
  onClose,
  onUserUpdate,
  onLogout,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form states - initialize with actual user data
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

    try {
      // Validate passwords match if changing password
      if (
        profileData.newPassword &&
        profileData.newPassword !== profileData.confirmNewPassword
      ) {
        alert("New passwords don't match!");
        setLoading(false);
        return;
      }

      // Check if any changes were made
      const hasChanges =
        profileData.newFullname !== user?.fullname ||
        profileData.newUsername !== user?.username ||
        profileData.newPassword;

      if (!hasChanges) {
        alert("No changes to save!");
        setLoading(false);
        return;
      }

      const API_BASE_URL =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
      const token = localStorage.getItem("accessToken");

      // Prepare update data
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

      const response = await fetch(
        `${API_BASE_URL}/voice-web-app/api/users/update-profile`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(updateData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      // Update user data in parent component
      if (onUserUpdate && data.data) {
        onUserUpdate(data.data);
      }

      alert("Profile updated successfully!");

      // Reset password fields
      setProfileData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      }));
    } catch (error) {
      console.error("Update profile error:", error);
      alert(error.message || "Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const currentPassword = prompt(
      "Enter your current password to confirm account deletion:"
    );

    if (!currentPassword) {
      return; // User cancelled
    }

    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone and will permanently delete all your data."
      )
    ) {
      setLoading(true);

      try {
        const API_BASE_URL =
          import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
        const token = localStorage.getItem("accessToken");

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

        if (!response.ok) {
          throw new Error(data.message || "Failed to delete account");
        }

        alert("Account deleted successfully!");

        // Clear authentication and close modal
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");

        onClose();

        // Redirect to home page
        window.location.href = "/";
      } catch (error) {
        console.error("Delete account error:", error);
        alert(error.message || "Failed to delete account. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

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
