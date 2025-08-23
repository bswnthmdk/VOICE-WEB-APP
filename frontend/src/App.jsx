import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/user" element={<UserDashboard />} />
    </Routes>
  );
}

export default App;
