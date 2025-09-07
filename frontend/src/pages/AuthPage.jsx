import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Moon, Sun, ArrowLeft } from "lucide-react";
import Link from "@/components/ui/link";
import { useTheme } from "@/components/theme-provider";
import { AuthPageHeader } from "@/components/layout/AuthPageHeader";
import { LoginForm } from "@/components/form/LoginForm";
import { SignupForm } from "@/components/form/SignupForm";
import {
  showSuccess,
  showError,
  showLoading,
  showInfo,
  dismiss,
} from "@/lib/toast";

export default function AuthPage({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const isLogin = mode === "login";

  // Extract form data helper function
  const extractFormData = (formElement, isLogin) => {
    const formData = new FormData(formElement);

    if (isLogin) {
      return {
        username: formData.get("username"),
        password: formData.get("password"),
      };
    } else {
      const firstName = formData.get("firstName");
      const lastName = formData.get("lastName");
      return {
        fullname: `${firstName} ${lastName}`.trim(),
        email: formData.get("email"),
        username: formData.get("username"),
        password: formData.get("password"),
        confirmPassword: formData.get("confirmPassword"),
      };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Show loading toast
    const loadingToast = showLoading(
      isLogin ? "Signing in..." : "Creating account..."
    );

    try {
      // Extract form data
      const formData = extractFormData(e.target, isLogin);
      console.log("📝 Form data:", {
        ...formData,
        password: "***",
        confirmPassword: "***",
      });

      // Client-side validation for signup
      if (!isLogin && formData.password !== formData.confirmPassword) {
        dismiss(loadingToast);
        showError("Passwords don't match!");
        setLoading(false);
        return;
      }

      // Base URL from .env (frontend)
      const API_BASE_URL =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

      // Decide endpoint
      const endpoint = isLogin
        ? "/voice-web-app/api/users/login"
        : "/voice-web-app/api/users/signup";

      const fullUrl = `${API_BASE_URL}${endpoint}`;
      console.log("🌐 API Request:", fullUrl);
      showInfo(`Making ${isLogin ? "login" : "signup"} request...`);

      const response = await fetch(fullUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important for cookies
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("📡 Server response:", data);
      console.log("📊 Response status:", response.status);

      // Dismiss loading toast
      dismiss(loadingToast);

      // Show status info
      showInfo(`Response: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const errorMessage = data.message || "Something went wrong";
        console.error("❌ Request failed:", {
          status: response.status,
          statusText: response.statusText,
          data: data,
        });
        showError(`${errorMessage} (${response.status})`);
        throw new Error(errorMessage);
      }

      if (isLogin) {
        console.log("=== FRONTEND DEBUG ===");
        console.log("Full response:", JSON.stringify(data, null, 2));

        // Extract user data and token
        const userData = data.data?.user || data.user;
        const accessToken = data.data?.accessToken || data.accessToken;

        console.log("Extracted userData:", userData);
        console.log("Has accessToken:", !!accessToken);

        if (!userData) {
          console.error("❌ No user data found");
          showError("Login failed: No user data received");
          return;
        }

        if (!accessToken) {
          console.error("❌ No access token found");
          showError("Login failed: No access token received");
          return;
        }

        // Add fallback for fullname if missing
        if (!userData.fullname) {
          userData.fullname = userData.username || "User";
          console.log("Added fallback fullname:", userData.fullname);
        }

        console.log("✅ Login successful:", userData);
        onLogin(userData, accessToken);

        setTimeout(() => {
          navigate("/admin-dashboard");
        }, 1500);
      } else {
        console.log("✅ Signup successful:", data.data);
        showSuccess("Account created successfully! Please log in.");
        setMode("login"); // switch to login form
        // Reset form
        e.target.reset();
      }
    } catch (err) {
      console.error("❌ Auth error:", err);
      dismiss(loadingToast);
      showError(err.message || "Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    const loadingToast = showLoading("Sending reset email...");

    try {
      const formData = new FormData(e.target);
      const email = formData.get("email");

      const API_BASE_URL =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

      console.log("📧 Forgot password request for:", email);

      const response = await fetch(
        `${API_BASE_URL}/voice-web-app/api/users/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();
      dismiss(loadingToast);

      console.log("📤 Forgot password response:", data);

      if (response.ok) {
        showSuccess("Password reset email sent!");
      } else {
        showError(data.message || "Failed to send reset email");
      }
    } catch (err) {
      console.error("❌ Forgot password error:", err);
      dismiss(loadingToast);
      showError("Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }

    setShowForgotPassword(false);
  };

  // Rest of component JSX remains the same...
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Navigation buttons */}
      <div className="absolute top-4 left-4">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>
      <div className="absolute top-4 right-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="relative"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] transition-all rotate-90 scale-0 dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>

      {/* Main Card */}
      <Card className="w-full max-w-md">
        <AuthPageHeader isLogin={isLogin} />

        <CardContent>
          {/* Mode Switch */}
          <div className="grid grid-cols-2 gap-1 mb-6">
            <Button
              variant={isLogin ? "default" : "outline"}
              size="sm"
              onClick={() => setMode("login")}
              className="text-xs"
              disabled={loading}
            >
              Login
            </Button>
            <Button
              variant={!isLogin ? "default" : "outline"}
              size="sm"
              onClick={() => setMode("signup")}
              className="text-xs"
              disabled={loading}
            >
              Signup
            </Button>
          </div>

          {/* Forms */}
          {isLogin ? (
            <LoginForm
              onSubmit={handleSubmit}
              onForgotPassword={() => setShowForgotPassword(true)}
              loading={loading}
            />
          ) : (
            <SignupForm onSubmit={handleSubmit} loading={loading} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
