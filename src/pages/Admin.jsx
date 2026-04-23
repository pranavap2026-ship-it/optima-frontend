import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../admin/layout/AdminLayout";

export default function Admin() {
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("optima_token");

    if (!token) {
      navigate("/admin/login", { replace: true });
    } else {
      setChecking(false);
    }
  }, [navigate]);

  if (checking) return null; // 🔥 prevents flash

  return <AdminLayout />;
}