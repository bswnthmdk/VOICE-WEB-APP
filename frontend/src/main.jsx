import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider defaultTheme="light" storageKey="voiceauth-theme">
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
