import { useEffect, useState } from "react";
import axios from "axios";

export default function ShopInfo() {
  const [data, setData] = useState({
    isOpen: true,
    phone: "",
    address: "",
    openTime: "",
    closeTime: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ===============================
     FETCH SETTINGS (FIXED)
  =============================== */
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/settings")
      .then((res) => {
        const settings = res.data?.data || res.data || {};
        setData(settings);
      })
      .catch(() => setError("Failed to load shop info"))
      .finally(() => setLoading(false));
  }, []);

  const phone = data.phone || "+919876543210";
  const cleanPhone = phone.replace(/\D/g, "");
  const address = data.address || "Location not set";

  /* ===============================
     LOADING
  =============================== */
  if (loading) {
    return (
      <section className="section" style={{ textAlign: "center" }}>
        <p style={{ color: "#888" }}>Loading...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section" style={{ textAlign: "center" }}>
        <p style={{ color: "red" }}>{error}</p>
      </section>
    );
  }

  return (
    <section
      className="section"
      style={{
        background:
          "radial-gradient(circle at top, rgba(201,168,76,0.08), transparent 60%), #000",
        padding: "80px 20px",
      }}
    >
      {/* TITLE */}
      <p className="gold" style={{ letterSpacing: 3 }}>
        DETAILS
      </p>

      <h2 style={{ fontSize: "clamp(40px,6vw,60px)" }}>
        Shop Info
      </h2>

      {/* GRID */}
      <div className="shop-grid">
        {/* STATUS */}
        <div className="card">
          <div className="glow" />
          <h3 className="gold">
            {data.isOpen ? "🟢 OPEN" : "🔴 CLOSED"}
          </h3>

          <p>
            {data.openTime || "09:00"} -{" "}
            {data.closeTime || "20:00"}
          </p>
        </div>

        {/* LOCATION */}
        <div
          className="card clickable"
          onClick={() =>
            window.open(
              `https://maps.google.com/?q=${encodeURIComponent(address)}`,
              "_blank"
            )
          }
        >
          <div className="glow" />
          <h3>📍 Location</h3>
          <p>{address}</p>
        </div>

        {/* PHONE */}
        <div className="card">
          <div className="glow" />
          <h3>{phone}</h3>

          <div className="actions">
            <button
              onClick={() =>
                (window.location.href = `tel:${cleanPhone}`)
              }
            >
              Call
            </button>

            <button
              onClick={() =>
                window.open(
                  `https://wa.me/${cleanPhone}`,
                  "_blank"
                )
              }
            >
              WhatsApp
            </button>
          </div>
        </div>
      </div>

      {/* STYLES */}
      <style>{`
        .shop-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit,minmax(240px,1fr));
          gap: 20px;
          margin-top: 40px;
        }

        .card {
          padding: 25px;
          border-radius: 14px;
          background: rgba(20,20,20,0.6);
          border: 1px solid #222;
          text-align: center;
          position: relative;
          transition: 0.3s;
        }

        .card:hover {
          transform: translateY(-6px) scale(1.02);
          border-color: #C9A84C;
        }

        .clickable {
          cursor: pointer;
        }

        .glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle, rgba(201,168,76,0.15), transparent 70%);
          opacity: 0;
          transition: 0.4s;
        }

        .card:hover .glow {
          opacity: 1;
        }

        .actions {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-top: 10px;
        }

        button {
          padding: 6px 12px;
          border: none;
          border-radius: 6px;
          background: #C9A84C;
          color: #000;
          cursor: pointer;
          font-size: 12px;
        }

        button:hover {
          opacity: 0.85;
        }
      `}</style>
    </section>
  );
}