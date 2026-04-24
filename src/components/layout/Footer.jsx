import { useEffect, useState } from "react";
import {
  FaInstagram,
  FaWhatsapp,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

import API from "../../api/api";

export default function Footer() {
  const [settings, setSettings] = useState({});

  /* ===============================
     📡 FETCH SETTINGS (AUTO REFRESH)
  =============================== */
  const fetchSettings = async () => {
    try {
      const res = await API.get("/settings");
      setSettings(res || {});
    } catch (err) {
      console.error("Footer error:", err);
    }
  };

  useEffect(() => {
    fetchSettings();

    // 🔥 AUTO UPDATE EVERY 10s (sync with admin)
    const interval = setInterval(fetchSettings, 10000);
    return () => clearInterval(interval);
  }, []);

  /* ===============================
     📦 SAFE VALUES
  =============================== */
  const phone = settings.phone || "";
  const whatsapp = settings.whatsapp || phone;
  const email = settings.email || "";
  const address = settings.address || "";
  const instagram = settings.instagram || "#";

  return (
    <footer className="footer">
      <div className="glow" />

      <div className="grid">

        {/* BRAND */}
        <div>
          <h2 className="gold">
            {settings.shopName || "OPTIMA TAILORS"}
          </h2>

          <p className="muted">
            {settings.tagline || "Precision tailoring with modern elegance."}
          </p>

          <p className="status">
            {settings.isOpen ? "🟢 Open Now" : "🔴 Closed"}
          </p>

          {/* SOCIAL */}
          <div className="social">
            {instagram && (
              <FaInstagram
                onClick={() => window.open(instagram, "_blank")}
              />
            )}

            {whatsapp && (
              <FaWhatsapp
                onClick={() =>
                  window.open(
                    `https://wa.me/${whatsapp.replace(/\D/g, "")}`,
                    "_blank"
                  )
                }
              />
            )}

            {email && (
              <FaEnvelope
                onClick={() =>
                  (window.location.href = `mailto:${email}`)
                }
              />
            )}
          </div>
        </div>

        {/* MAP */}
        <div>
          <h4>Location</h4>

          {address ? (
            <iframe
              title="map"
              src={`https://www.google.com/maps?q=${address}&output=embed`}
              className="map"
            />
          ) : (
            <p>No location set</p>
          )}
        </div>

        {/* CONTACT */}
        <div>
          <h4>Contact</h4>

          {address && <p><FaMapMarkerAlt /> {address}</p>}
          {phone && <p><FaPhone /> {phone}</p>}
          {email && <p><FaEnvelope /> {email}</p>}

          <div className="actions">
            {whatsapp && (
              <button
                onClick={() =>
                  window.open(
                    `https://wa.me/${whatsapp.replace(/\D/g, "")}`,
                    "_blank"
                  )
                }
              >
                WhatsApp
              </button>
            )}

            {phone && (
              <button
                onClick={() =>
                  (window.location.href = `tel:${phone}`)
                }
              >
                Call
              </button>
            )}
          </div>
        </div>

        {/* INSTAGRAM PREVIEW */}
        <div>
          <h4>Instagram</h4>

          <div className="insta-grid">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="insta-box" />
            ))}
          </div>
        </div>

      </div>

      {/* COPYRIGHT */}
      <div className="bottom">
        © {new Date().getFullYear()}{" "}
        {settings.shopName || "OPTIMA"} — All Rights Reserved
      </div>
    </footer>
  );
}