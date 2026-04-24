import { useEffect, useState } from "react";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import API from "../../api/api";

export default function Footer() {
  const [settings, setSettings] = useState({});

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await API.get("/settings");
        setSettings(res || {});
      } catch (err) {
        console.error(err);
      }
    };

    fetchSettings();
  }, []);

  const instagram = settings.instagram || "";
  const whatsapp = settings.whatsapp || "";

  return (
    <footer className="footer">
      {/* BRAND */}
      <h2 className="logo">
        {settings.shopName || "OPTIMA TAILORS"}
      </h2>

      {/* TAGLINE */}
      <p className="tag">
        {settings.tagline || "Precision tailoring with modern elegance."}
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
      </div>

      {/* COPYRIGHT */}
      <p className="copy">
        © {new Date().getFullYear()}{" "}
        {settings.shopName || "OPTIMA"} — All Rights Reserved
      </p>

      {/* STYLES */}
      <style>{`
        .footer {
          padding: 50px 20px;
          text-align: center;
          background: #000;
          color: #aaa;
        }

        .logo {
          color: #C9A84C;
          letter-spacing: 3px;
          margin-bottom: 10px;
        }

        .tag {
          color: #777;
          font-size: 14px;
          margin-bottom: 20px;
        }

        .social {
          display: flex;
          justify-content: center;
          gap: 20px;
          font-size: 22px;
          margin-bottom: 20px;
          cursor: pointer;
        }

        .social svg:hover {
          color: #C9A84C;
          transform: scale(1.2);
        }

        .copy {
          font-size: 12px;
          color: #555;
        }
      `}</style>
    </footer>
  );
}