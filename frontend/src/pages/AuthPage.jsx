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
import { Moon, Sun, ArrowLeft, Mic } from "lucide-react";
import Link from "@/components/ui/link";
import { useTheme } from "@/components/theme-provider";
import { AuthPageHeader } from "@/components/layout/AuthPageHeader";
import { LoginForm } from "@/components/form/LoginForm";
import { SignupForm } from "@/components/form/SignupForm";
import { ForgotPasswordForm } from "@/components/form/ForgotPasswordForm";

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const isLogin = mode === "login";

  const handleSubmit = async (e, isLogin, formData, setMode) => {
    e.preventDefault();
    const navigate = useNavigate();

    try {
      // Base URL from .env (frontend)
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

      // Decide endpoint
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      if (isLogin) {
        // Save token/user info
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("token", data.token);

        navigate("/dashboard");
      } else {
        alert("Account created successfully!");
        setMode("login"); // switch to login form
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    alert("Password reset email sent!");
    setShowForgotPassword(false);
  };

  // Forgot Password Form
  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
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

        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
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
            </div>
            <CardTitle className="font-serif text-2xl">
              Reset Password
            </CardTitle>
            <CardDescription>
              Enter your email to receive a reset link
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ForgotPasswordForm
              onSubmit={handleForgotPassword}
              onBack={() => setShowForgotPassword(false)}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main Login/Signup Form
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Top Buttons */}
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

      {/* The Card */}
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
            >
              Login
            </Button>
            <Button
              variant={!isLogin ? "default" : "outline"}
              size="sm"
              onClick={() => setMode("signup")}
              className="text-xs"
            >
              Signup
            </Button>
          </div>

          {/* Forms */}
          {isLogin ? (
            <LoginForm
              onSubmit={handleSubmit}
              onForgotPassword={() => setShowForgotPassword(true)}
            />
          ) : (
            <SignupForm onSubmit={handleSubmit} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
