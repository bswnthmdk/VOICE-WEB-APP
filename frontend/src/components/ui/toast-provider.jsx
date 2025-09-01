import { Toaster } from "react-hot-toast";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 4000,
        style: {
          background: "hsl(var(--background))",
          color: "hsl(var(--foreground))",
          border: "1px solid hsl(var(--border))",
          borderRadius: "8px",
          padding: "16px",
          fontSize: "14px",
          maxWidth: "420px",
        },
        success: {
          duration: 3000,
          iconTheme: {
            primary: "hsl(var(--primary))",
            secondary: "hsl(var(--primary-foreground))",
          },
        },
        error: {
          duration: 5000,
          iconTheme: {
            primary: "hsl(var(--destructive))",
            secondary: "hsl(var(--destructive-foreground))",
          },
        },
      }}
    />
  );
}
