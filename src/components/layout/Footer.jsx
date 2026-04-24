import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaInstagram,
  FaWhatsapp,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function Footer() {
  const [settings, setSettings] = useState({});

  useEffect(() => {
  const fetchSettings = async () => {
    try {
      const res = await API.get("/settings");
      setSettings(res.data || res || {});
    } catch (err) {
      console.error(err);
    }
  };

  fetchSettings();
}, []);

  const phone = settings.phone || "+919876543210";
  const email = settings.email || "optimatailors@email.com";
  const address = settings.address || "Kozhikode, Kerala";

  return (
    <footer className="footer">
      {/* GLOW */}
      <div className="glow" />

      <div className="grid">
        {/* BRAND */}
        <div>
          <h2 className="gold">{settings.shopName || "OPTIMA TAILORS"}</h2>
          <p className="muted">
            Precision tailoring with modern elegance.
          </p>

          <p className="status">
            {settings.isOpen ? "🟢 Open Now" : "🔴 Closed"}
          </p>

          {/* SOCIAL ICONS */}
          <div className="social">
            <FaInstagram />
            <FaWhatsapp />
            <FaEnvelope />
          </div>
        </div>

        {/* MAP */}
        <div>
          <h4>Location</h4>

          <iframe
            title="map"
            src={`https://www.google.com/maps?q=${address}&output=embed`}
            className="map"
          />
        </div>

        {/* CONTACT */}
        <div>
          <h4>Contact</h4>

          <p><FaMapMarkerAlt /> {address}</p>
          <p><FaPhone /> {phone}</p>
          <p><FaEnvelope /> {email}</p>

          <div className="actions">
            <button
              onClick={() =>
                window.open(
                  `https://wa.me/${phone.replace(/\D/g, "")}`,
                  "_blank"
                )
              }
            >
              WhatsApp
            </button>

            <button onClick={() => (window.location.href = `tel:${phone}`)}>
              Call
            </button>
          </div>
        </div>

        {/* INSTAGRAM FEED (STATIC PREVIEW) */}
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
        © {new Date().getFullYear()} {settings.shopName || "OPTIMA"} — All Rights Reserved
      </div>

      {/* STYLES */}
      <style>{`
        .footer {
          position: relative;
          padding: 70px 30px 30px;
          background: linear-gradient(180deg, #000, #0a0a0a);
          color: #aaa;
        }

        .glow {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 60%;
          height: 2px;
          background: linear-gradient(to right, transparent, #C9A84C, transparent);
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit,minmax(220px,1fr));
          gap: 30px;
        }

        h4 {
          color: #fff;
          margin-bottom: 10px;
        }

        .muted {
          color: #777;
        }

        .status {
          margin-top: 10px;
        }

        /* SOCIAL */
        .social {
          display: flex;
          gap: 12px;
          margin-top: 10px;
          font-size: 20px;
          cursor: pointer;
        }

        .social svg:hover {
          color: #C9A84C;
          transform: scale(1.2);
        }

        /* MAP */
        .map {
          width: 100%;
          height: 150px;
          border: none;
          border-radius: 10px;
        }

        /* INSTAGRAM */
        .insta-grid {
          display: grid;
          grid-template-columns: repeat(2,1fr);
          gap: 8px;
        }

        .insta-box {
          height: 60px;
          background: #111;
          border-radius: 8px;
          transition: 0.3s;
        }

        .insta-box:hover {
          background: #C9A84C;
        }

        /* BUTTONS */
        .actions {
          margin-top: 10px;
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        button {
          padding: 8px 12px;
          background: #C9A84C;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: 0.3s;
        }

        button:hover {
          transform: scale(1.05);
        }

        .bottom {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #111;
          font-size: 13px;
          color: #666;
        }

        /* MOBILE */
        @media (max-width: 768px) {
          .footer {
            padding: 50px 20px;
          }
        }
      `}</style>
    </footer>
  );
}