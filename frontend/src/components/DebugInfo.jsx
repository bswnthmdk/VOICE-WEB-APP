import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { showInfo, showSuccess, showError } from "@/lib/toast";

export function DebugInfo() {
  const [debugData, setDebugData] = useState({});

  useEffect(() => {
    const data = {
      apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
      isAuthenticated: localStorage.getItem("isAuthenticated"),
      hasAccessToken: !!localStorage.getItem("accessToken"),
      hasUserData: !!localStorage.getItem("user"),
      currentUrl: window.location.href,
      userAgent: navigator.userAgent,
    };
    setDebugData(data);
  }, []);

  const testConnection = async () => {
    const loadingToast = showInfo("Testing connection...");

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const data = await response.json();
        showSuccess(`Connection successful: ${data.message}`);
      } else {
        showError(
          `Connection failed: ${response.status} ${response.statusText}`
        );
      }
    } catch (error) {
      showError(`Connection error: ${error.message}`);
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-sm">Debug Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-xs space-y-1">
          {Object.entries(debugData).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span className="font-medium">{key}:</span>
              <span className="text-muted-foreground">
                {typeof value === "boolean"
                  ? value.toString()
                  : value || "null"}
              </span>
            </div>
          ))}
        </div>
        <Button size="sm" onClick={testConnection} className="w-full">
          Test API Connection
        </Button>
      </CardContent>
    </Card>
  );
}
