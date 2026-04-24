import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import CustomerSite from "../components/customer/CustomerSite";

export default function Home() {
  const [services, setServices] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [intro, setIntro] = useState(true);

  const navigate = useNavigate();

  /* ===============================
     🎬 INTRO ANIMATION
  =============================== */
  useEffect(() => {
    const timer = setTimeout(() => setIntro(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  /* ===============================
     🔐 SECRET TAP (MOBILE + DESKTOP)
  =============================== */
  const tapCount = useRef(0);
  const lastTap = useRef(0);

  const handleSecretTap = (e) => {
    const now = Date.now();

    let x, y;

    // 📱 MOBILE TOUCH
    if (e.touches && e.touches.length > 0) {
      x = e.touches[0].clientX;
      y = e.touches[0].clientY;
    } else {
      // 💻 DESKTOP
      x = e.clientX;
      y = e.clientY;
    }

    // 🎯 bottom-right detection (60px zone)
    if (x < window.innerWidth - 60) return;
    if (y < window.innerHeight - 60) return;

    // ⏱ reset if slow
    if (now - lastTap.current > 700) {
      tapCount.current = 0;
    }

    tapCount.current++;
    lastTap.current = now;

    // 🔥 6 taps trigger
    if (tapCount.current >= 6) {
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
     ⌨️ SECRET KEY (DESKTOP)
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
     🎬 INTRO UI
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
          }

          .logo {
            font-size: 60px;
            color: #C9A84C;
            animation: fadeScale 1.5s ease forwards;
          }

          .tag {
            color: #777;
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
            from { opacity: 0; transform: scale(0.8); }
            to { opacity: 1; transform: scale(1); }
          }

          @keyframes fadeIn {
            to { opacity: 1; }
          }

          @keyframes shineMove {
            from { left: -100%; }
            to { left: 100%; }
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
    <div
      onClick={handleSecretTap}
      onTouchStart={handleSecretTap} // ✅ MOBILE FIX
    >
      <CustomerSite services={services} gallery={gallery} />
    </div>
  );
}