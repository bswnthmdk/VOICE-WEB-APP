import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";

// Auth context for managing user state
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check authentication status and fetch user data
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuth = localStorage.getItem("isAuthenticated") === "true";
        const token = localStorage.getItem("accessToken");

        if (isAuth && token) {
          // Try to fetch current user data from backend
          const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

          if (response.ok) {
            const data = await response.json();
            setUser(data.data);
          } else {
            // Token might be expired, try to refresh
            const refreshResponse = await fetch(
              `${API_BASE_URL}/voice-web-app/api/users/refresh-token`,
              {
                method: "POST",
                credentials: "include",
              }
            );

            if (refreshResponse.ok) {
              const refreshData = await refreshResponse.json();
              localStorage.setItem("accessToken", refreshData.data.accessToken);

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
              } else {
                // Clear invalid auth data
                localStorage.removeItem("isAuthenticated");
                localStorage.removeItem("accessToken");
                localStorage.removeItem("user");
              }
            } else {
              // Clear invalid auth data
              localStorage.removeItem("isAuthenticated");
              localStorage.removeItem("accessToken");
              localStorage.removeItem("user");
            }
          }
        } else {
          // Check for stored user data as fallback
          const storedUser = localStorage.getItem("user");
          if (storedUser && isAuth) {
            setUser(JSON.parse(storedUser));
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
        // Clear invalid auth data
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Update user data function
  const updateUser = (newUserData) => {
    setUser(newUserData);
    localStorage.setItem("user", JSON.stringify(newUserData));
  };

  // Logout function
  const logout = async () => {
    try {
      const API_BASE_URL =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
      const token = localStorage.getItem("accessToken");

      if (token) {
        await fetch(`${API_BASE_URL}/voice-web-app/api/users/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear all auth data
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      setUser(null);
      navigate("/");
    }
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

  return <>{React.cloneElement(children, { user, updateUser, logout })}</>;
};

// Simple auth check
const isAuthenticated = () => {
  return localStorage.getItem("isAuthenticated") === "true";
};

// Protected Route component
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/auth" replace />;
  }
  return children;
};

// Public Route component (only prevents access to auth page when logged in)
const PublicRoute = ({ children, redirectToDashboard = false }) => {
  if (isAuthenticated() && redirectToDashboard) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/auth"
        element={
          <PublicRoute redirectToDashboard={true}>
            <AuthPage />
          </PublicRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AuthProvider>
              <Dashboard />
            </AuthProvider>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute>
            <AuthProvider>
              <AdminDashboard />
            </AuthProvider>
          </ProtectedRoute>
        }
      />
      <Route
        path="/user-dashboard"
        element={
          <ProtectedRoute>
            <AuthProvider>
              <UserDashboard />
            </AuthProvider>
          </ProtectedRoute>
        }
      />
      {/* Redirect any unknown routes to dashboard if authenticated, otherwise to landing page */}
      <Route
        path="*"
        element={
          isAuthenticated() ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
    </Routes>
  );
}

export default App;
