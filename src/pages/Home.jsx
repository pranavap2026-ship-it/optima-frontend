import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import CustomerSite from "../components/customer/CustomerSite";

export default function Home() {
  const [services, setServices] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  /* ===============================
     🔐 SECRET TAP (ADVANCED)
  =============================== */
  const tapCount = useRef(0);
  const lastTap = useRef(0);

  const handleSecretTap = (e) => {
    const now = Date.now();

    // 🎯 VERY SMALL HIDDEN ZONE (bottom-right 50px)
    if (e.clientX < window.innerWidth - 50) return;
    if (e.clientY < window.innerHeight - 50) return;

    // ⏱ reset if slow
    if (now - lastTap.current > 600) {
      tapCount.current = 0;
    }

    tapCount.current++;
    lastTap.current = now;

    // 🔥 Require 7 taps (harder)
    if (tapCount.current >= 7) {
      openAdminAccess();
      tapCount.current = 0;
    }
  };

  /* ===============================
     🔐 ADMIN ACCESS (PIN OPTIONAL)
  =============================== */
  const openAdminAccess = () => {
    const pin = prompt("Enter Admin PIN");

    // 👉 Change PIN here
    if (pin === "1234") {
      navigate("/optima-secret-admin");
    } else {
      alert("Access denied");
    }
  };

  /* ===============================
     ⌨️ SECRET KEY COMBO
  =============================== */
  useEffect(() => {
    const handleKey = (e) => {
      // Ctrl + Shift + A
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "a") {
        openAdminAccess();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  /* ===============================
     📡 FETCH DATA
  =============================== */
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [servicesRes, galleryRes] = await Promise.all([
        API.get("/services"),
        API.get("/gallery"),
      ]);

      setServices(servicesRes?.data || []);
      setGallery(galleryRes?.data || []);

    } catch (err) {
      console.error("Home API error:", err);
      setError("Failed to load content");

      // retry
      setTimeout(fetchData, 2000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ===============================
     ⏳ LOADING
  =============================== */
  if (loading) {
    return (
      <div className="center">
        <div className="pulse" />
        <p>WELCOME TO OPTIMA TAILORS...</p>
      </div>
    );
  }

  /* ===============================
     ❌ ERROR
  =============================== */
  if (error) {
    return (
      <div className="center">
        <h2 style={{ color: "red" }}>{error}</h2>
        <button onClick={fetchData}>Retry</button>
      </div>
    );
  }

  return (
    <div onClick={handleSecretTap}>
      <CustomerSite services={services} gallery={gallery} />
    </div>
  );
}