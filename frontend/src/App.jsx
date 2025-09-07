// frontend/src/App.jsx
import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Mic } from "lucide-react";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import {
  showError,
  showSuccess,
  showInfo,
  showLoading,
  dismiss,
} from "@/lib/toast";

// Create Auth Context
const AuthContext = React.createContext();

// Auth Provider Component - Single instance for entire app
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Check authentication status and fetch user data
  useEffect(() => {
    const checkAuth = async () => {
      let authCheckToast = null;

      try {
        const isAuth = localStorage.getItem("isAuthenticated") === "true";
        const token = localStorage.getItem("accessToken");

        console.log("Auth Check:", { isAuth, hasToken: !!token });

        if (isAuth && token) {
          authCheckToast = showLoading("Verifying authentication...");

          // Try to fetch current user data from backend
          const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
          console.log("API Base URL:", API_BASE_URL);

          if (!API_BASE_URL) {
            dismiss(authCheckToast);
            showError("API URL not configured. Please check your .env file.");
            clearAuthData();
            setLoading(false);
            return;
          }

          const response = await fetch(
            `${API_BASE_URL}/voice-web-app/api/users/current-user`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              credentials: "include",
            }
          );

          console.log("Current user response status:", response.status);

          if (response.ok) {
            const data = await response.json();
            setUser(data.data);
            setIsAuthenticated(true);
            dismiss(authCheckToast);
            showSuccess(
              `Welcome back, ${data.data?.fullname || data.data?.username}!`
            );
            console.log("Auth verified:", data.data);
          } else {
            dismiss(authCheckToast);
            const refreshToast = showLoading("Token expired, refreshing...");

            // Token might be expired, try to refresh
            const refreshResponse = await fetch(
              `${API_BASE_URL}/voice-web-app/api/users/refresh-token`,
              {
                method: "POST",
                credentials: "include",
              }
            );

            console.log("Refresh response status:", refreshResponse.status);

            if (refreshResponse.ok) {
              const refreshData = await refreshResponse.json();
              localStorage.setItem("accessToken", refreshData.data.accessToken);
              dismiss(refreshToast);
              showSuccess("Session refreshed successfully");

              // Retry fetching user data
              const retryResponse = await fetch(
                `${API_BASE_URL}/voice-web-app/api/users/current-user`,
                {
                  method: "GET",
                  headers: {
                    Authorization: `Bearer ${refreshData.data.accessToken}`,
                    "Content-Type": "application/json",
                  },
                  credentials: "include",
                }
              );

              if (retryResponse.ok) {
                const retryData = await retryResponse.json();
                setUser(retryData.data);
                setIsAuthenticated(true);
                console.log("Auth verified after refresh:", retryData.data);
              } else {
                showError("Failed to fetch user data after refresh");
                clearAuthData();
              }
            } else {
              dismiss(refreshToast);
              showError("Session expired. Please login again");
              clearAuthData();
            }
          }
        } else {
          console.log("No valid auth state found");
          // Check for stored user data as fallback
          const storedUser = localStorage.getItem("user");
          if (storedUser && isAuth) {
            try {
              const userData = JSON.parse(storedUser);
              setUser(userData);
              setIsAuthenticated(true);
              showInfo("Using cached user data");
              console.log("Using cached user data");
            } catch (error) {
              console.error("Invalid cached user data:", error);
              clearAuthData();
            }
          } else {
            // Clear any invalid state
            clearAuthData(false); // Don't show error message for clean state
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
        if (authCheckToast) dismiss(authCheckToast);

        // Only show error if we were expecting to be authenticated
        const wasAuthenticated =
          localStorage.getItem("isAuthenticated") === "true";
        if (wasAuthenticated) {
          showError(`Authentication failed: ${error.message}`);
        }

        clearAuthData();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Helper function to clear authentication data
  const clearAuthData = (showMessage = true) => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
    if (showMessage) {
      showInfo("Authentication cleared");
    }
  };

  // Update user data function
  const updateUser = (newUserData) => {
    setUser(newUserData);
    localStorage.setItem("user", JSON.stringify(newUserData));
    showInfo("User profile updated");
    console.log("User updated:", newUserData);
  };

  // Login function - called from AuthPage
  const login = (userData, accessToken) => {
    console.log("🔄 Login function called with:", {
      userData: userData ? { ...userData, password: undefined } : null,
      hasAccessToken: !!accessToken,
    });

    if (!userData) {
      console.error("❌ Login failed: userData is undefined");
      showError("Login failed: User data is missing");
      return;
    }

    if (!accessToken) {
      console.error("❌ Login failed: accessToken is undefined");
      showError("Login failed: Access token is missing");
      return;
    }

    // Ensure fullname exists
    if (!userData.fullname) {
      userData.fullname = userData.username || "User";
      console.log("Added fallback fullname in login:", userData.fullname);
    }

    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("user", JSON.stringify(userData));

    console.log("✅ Login successful:", userData);
    showSuccess(`Welcome back, ${userData.fullname}!`);
  };

  // Logout function
  const logout = async () => {
    const logoutToast = showLoading("Logging out...");

    try {
      const API_BASE_URL =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
      const token = localStorage.getItem("accessToken");

      if (token) {
        console.log("Calling logout API...");
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

        if (response.ok) {
          const data = await response.json();
          console.log("Logout response:", data);
        } else {
          const errorData = await response.json();
          console.log("Logout failed:", errorData);
        }
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      dismiss(logoutToast);

      // Clear all auth data regardless of API call result
      clearAuthData(false);
      showSuccess("Logged out successfully");
      console.log("Auth data cleared");
      navigate("/");
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    updateUser,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center animate-pulse">
            <Mic className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="font-serif text-xl font-bold">Loading...</span>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    console.log("Access denied - not authenticated");
    showInfo("Please login to access this page");
    return <Navigate to="/auth" replace />;
  }
  return children;
};

// Public Route component (only prevents access to auth page when logged in)
const PublicRoute = ({ children, redirectToDashboard = false }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated && redirectToDashboard) {
    console.log("Already logged in, redirecting to admin dashboard");
    showInfo("Already logged in, redirecting to admin dashboard");
    return <Navigate to="/admin-dashboard" replace />;
  }
  return children;
};

// Wrapper components to use auth context
const AuthPageWrapper = () => {
  const { login } = useAuth();
  return <AuthPage onLogin={login} />;
};

const DashboardWrapper = () => {
  const { user, updateUser, logout } = useAuth();
  return <Dashboard user={user} updateUser={updateUser} logout={logout} />;
};

const AdminDashboardWrapper = () => {
  const { user, updateUser, logout, loading } = useAuth();

  // Add loading check here
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-lg animate-pulse" />
          <span className="font-serif text-xl font-bold">Loading...</span>
        </div>
      </div>
    );
  }

  return <AdminDashboard user={user} updateUser={updateUser} logout={logout} />;
};

const UserDashboardWrapper = () => {
  const { user, updateUser, logout, loading } = useAuth();

  // Add loading check here
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-lg animate-pulse" />
          <span className="font-serif text-xl font-bold">Loading...</span>
        </div>
      </div>
    );
  }

  return <UserDashboard user={user} updateUser={updateUser} logout={logout} />;
};

// Debug function to clear all auth state (useful for development)
window.clearAuth = () => {
  localStorage.removeItem("isAuthenticated");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
  console.log("Auth state cleared via window.clearAuth()");
  window.location.reload();
};

// Add debug info to window (useful for development)
window.getAuthState = () => {
  const state = {
    isAuthenticated: localStorage.getItem("isAuthenticated"),
    hasAccessToken: !!localStorage.getItem("accessToken"),
    hasUserData: !!localStorage.getItem("user"),
    userData: localStorage.getItem("user"),
  };
  console.log("Current auth state:", state);
  return state;
};

function App() {
  // Log environment info
  console.log("App starting with API URL:", import.meta.env.VITE_API_BASE_URL);

  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/auth"
          element={
            <PublicRoute redirectToDashboard={true}>
              <AuthPageWrapper />
            </PublicRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardWrapper />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboardWrapper />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute>
              <UserDashboardWrapper />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
export { useAuth };
