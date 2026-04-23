import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "../pages/Home";

// 🔐 ADMIN
import AdminLayout from "../admin/layout/AdminLayout";
import Dashboard from "../admin/pages/Dashboard";
import Services from "../admin/pages/Services";
import Gallery from "../admin/pages/Gallery";
import Settings from "../admin/pages/Settings";
import Enquiries from "../admin/pages/Enquiries";
import Login from "../admin/pages/Login";

// 🔥 PROTECTED ROUTE
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/optima-secret-admin" />;
  }

  return children;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= PUBLIC ================= */}
        <Route path="/" element={<Home />} />

        {/* 🔥 SECRET LOGIN (HIDDEN) */}
        <Route path="/optima-secret-admin" element={<Login />} />

        {/* (Optional) keep normal login hidden fallback */}
        <Route path="/admin/login" element={<Navigate to="/" />} />

        {/* ================= ADMIN ================= */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="services" element={<Services />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="settings" element={<Settings />} />
          <Route path="enquiries" element={<Enquiries />} />
        </Route>

        {/* ================= 404 ================= */}
        <Route path="*" element={<h2>Page Not Found</h2>} />

      </Routes>
    </BrowserRouter>
  );
}