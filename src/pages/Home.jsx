import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import CustomerSite from "../components/customer/CustomerSite";

export default function Home() {
  const [services, setServices] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [intro, setIntro] = useState(true); // 🎬 intro state

  const navigate = useNavigate();

  /* ===============================
     🎬 INTRO ANIMATION
  =============================== */
  useEffect(() => {
    const timer = setTimeout(() => {
      setIntro(false);
    }, 2500); // duration

    return () => clearTimeout(timer);
  }, []);

  /* ===============================
     🔐 SECRET TAP
  =============================== */
  const tapCount = useRef(0);
  const lastTap = useRef(0);

  const handleSecretTap = (e) => {
    const now = Date.now();

    if (e.clientX < window.innerWidth - 50) return;
    if (e.clientY < window.innerHeight - 50) return;

    if (now - lastTap.current > 600) {
      tapCount.current = 0;
    }

    tapCount.current++;
    lastTap.current = now;

    if (tapCount.current >= 7) {
      openAdminAccess();
      tapCount.current = 0;
    }
  };

  const openAdminAccess = () => {
    const pin = prompt("Enter Admin PIN");

    if (pin === "1234") {
      navigate("/optima-secret-admin");
    } else {
      alert("Access denied");
    }
  };

  /* ===============================
     ⌨️ SECRET KEY
  =============================== */
  useEffect(() => {
    const handleKey = (e) => {
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
      console.error(err);
      setError("Failed to load content");
      setTimeout(fetchData, 2000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ===============================
     🎬 INTRO SCREEN UI
  =============================== */
  if (intro) {
    return (
      <div className="intro">
        <h1 className="logo">OPTIMA</h1>
        <p className="tag">Precision • Style • Perfection</p>

        <div className="shine" />

        <style>{`
          .intro {
            height: 100vh;
            background: black;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            position: relative;
          }

          .logo {
            font-size: 60px;
            letter-spacing: 6px;
            color: #C9A84C;
            animation: fadeScale 1.5s ease forwards;
          }

          .tag {
            margin-top: 10px;
            color: #777;
            letter-spacing: 2px;
            opacity: 0;
            animation: fadeIn 2s ease 1s forwards;
          }

          .shine {
            position: absolute;
            width: 200%;
            height: 2px;
            background: linear-gradient(to right, transparent, #C9A84C, transparent);
            animation: shineMove 2s linear infinite;
            bottom: 40%;
          }

          @keyframes fadeScale {
            0% { opacity: 0; transform: scale(0.8); }
            100% { opacity: 1; transform: scale(1); }
          }

          @keyframes fadeIn {
            to { opacity: 1; }
          }

          @keyframes shineMove {
            0% { left: -100%; }
            100% { left: 100%; }
          }
        `}</style>
      </div>
    );
  }

  /* ===============================
     ⏳ LOADING
  =============================== */
  if (loading) {
    return (
      <div className="center">
        <div className="pulse" />
        <p>Loading Optima Experience...</p>

        <style>{`
          .center {
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background: #000;
            color: #aaa;
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

  /* ===============================
     🎯 MAIN SITE
  =============================== */
  return (
    <div onClick={handleSecretTap}>
      <CustomerSite services={services} gallery={gallery} />
    </div>
  );
}