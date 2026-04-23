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
     🔐 FAST SECRET TAP (SECURE)
  =============================== */
  const tapCount = useRef(0);
  const lastTap = useRef(0);

  const handleSecretTap = (e) => {
    const now = Date.now();

    // 🔥 Only bottom-right corner
    if (e.clientX < window.innerWidth - 100) return;
    if (e.clientY < window.innerHeight - 100) return;

    // ⏱ reset if slow
    if (now - lastTap.current > 800) {
      tapCount.current = 0;
    }

    tapCount.current++;
    lastTap.current = now;

    if (tapCount.current >= 5) {
      navigate("/optima-secret-admin");
      tapCount.current = 0;
    }
  };

  /* ===============================
     📡 FETCH DATA (PRODUCTION SAFE)
  =============================== */
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [servicesRes, galleryRes] = await Promise.all([
        API.get("/services"),
        API.get("/gallery"),
      ]);

      // ✅ API already returns cleaned data
      setServices(servicesRes?.data || []);
      setGallery(galleryRes?.data || []);

    } catch (err) {
      console.error("Home API error:", err);

      setError("Failed to load content");

      // 🔥 Optional auto retry
      setTimeout(fetchData, 2000);

    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     🎯 EFFECTS
  =============================== */
  useEffect(() => {
    fetchData();

    // 💻 SECRET KEY (DESKTOP)
    const handleKey = (e) => {
      if (e.ctrlKey && e.key.toLowerCase() === "a") {
        navigate("/optima-secret-admin");
      }
    };

    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, []);

  /* ===============================
     ⏳ LOADING UI (PREMIUM)
  =============================== */
  if (loading) {
    return (
      <div className="center">
        <div className="loader">
          <div className="pulse" />
          <p>Loading Optima Experience...</p>
        </div>

        <style>{`
          .center {
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            background: #000;
            color: #aaa;
          }

          .loader {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 15px;
          }

          .pulse {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: #C9A84C;
            animation: pulse 1.2s infinite;
          }

          @keyframes pulse {
            0% { transform: scale(0.8); opacity: 0.5; }
            50% { transform: scale(1.2); opacity: 1; }
            100% { transform: scale(0.8); opacity: 0.5; }
          }
        `}</style>
      </div>
    );
  }

  /* ===============================
     ❌ ERROR UI
  =============================== */
  if (error) {
    return (
      <div className="center">
        <h2 style={{ color: "red" }}>{error}</h2>
        <button onClick={fetchData}>Retry</button>

        <style>{`
          .center {
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 10px;
            background: #000;
          }

          button {
            padding: 10px 20px;
            background: #C9A84C;
            border: none;
            cursor: pointer;
            border-radius: 6px;
          }
        `}</style>
      </div>
    );
  }

  /* ===============================
     🎯 MAIN UI
  =============================== */
  return (
    <div onClick={handleSecretTap}>
      <CustomerSite
        services={services}
        gallery={gallery}
      />
    </div>
  );
}