import { useState, useEffect } from "react";
import axios from "axios";
import Input from "../common/Input";
import Button from "../common/Button";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [settings, setSettings] = useState({});
  const [settingsLoading, setSettingsLoading] = useState(true);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  /* ===============================
     FETCH SETTINGS (FIXED)
  =============================== */
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/settings")
      .then((res) => {
        const data = res.data?.data || res.data || {};
        setSettings(data);
      })
      .catch(console.error)
      .finally(() => setSettingsLoading(false));
  }, []);

  /* ===============================
     FORM HANDLING
  =============================== */
  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validate = () => {
    if (!form.name || !form.email || !form.message) {
      return "Please fill all required fields";
    }

    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      return "Invalid email address";
    }

    if (form.message.length < 5) {
      return "Message must be at least 5 characters";
    }

    return null;
  };

  const handleSubmit = async () => {
    const errMsg = validate();
    if (errMsg) {
      setError(errMsg);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      await axios.post("http://localhost:5000/api/enquiry", form);

      setForm({
        name: "",
        email: "",
        phone: "",
        message: "",
      });

      setSuccess("✅ Message sent successfully!");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     DYNAMIC DATA
  =============================== */
  const phone = settings.phone || "+919876543210";
  const address = settings.address || "Kozhikode, Kerala";

  const cleanPhone = phone.replace(/\D/g, "");

  /* ===============================
     LOADING UI
  =============================== */
  if (settingsLoading) {
    return (
      <section style={{ padding: 80, textAlign: "center" }}>
        <p style={{ color: "#888" }}>Loading contact info...</p>
      </section>
    );
  }

  return (
    <section
      id="contact"
      className="section"
      style={{
        background:
          "radial-gradient(circle at top, rgba(201,168,76,0.08), transparent 60%), #000",
        padding: "80px 20px",
      }}
    >
      {/* TITLE */}
      <p className="gold">GET IN TOUCH</p>
      <h2 style={{ fontSize: "clamp(40px,6vw,60px)", marginBottom: 40 }}>
        Contact Us
      </h2>

      <div className="contact-grid">
        {/* FORM */}
        <div className="card">
          <p className="gold">SEND MESSAGE</p>

          <Input
            placeholder="Your Name"
            value={form.name}
            onChange={(v) => setField("name", v)}
          />

          <Input
            placeholder="Your Email"
            value={form.email}
            onChange={(v) => setField("email", v)}
          />

          <Input
            placeholder="Phone"
            value={form.phone}
            onChange={(v) => setField("phone", v)}
          />

          <textarea
            placeholder="Message"
            rows={4}
            value={form.message}
            onChange={(e) => setField("message", e.target.value)}
            className="textarea"
          />

          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          <Button
            label={loading ? "Sending..." : "SEND MESSAGE"}
            onClick={handleSubmit}
            disabled={loading}
          />
        </div>

        {/* CONTACT INFO */}
        <div className="card">
          <p className="gold">CONTACT</p>

          <h3>{phone}</h3>

          <Button
            label="WhatsApp Us"
            onClick={() =>
              window.open(`https://wa.me/${cleanPhone}`, "_blank")
            }
          />

          <Button
            label="Call Now"
            onClick={() =>
              (window.location.href = `tel:${cleanPhone}`)
            }
          />
        </div>

        {/* MAP */}
        <div className="card">
          <p className="gold">LOCATION</p>

          <p style={{ color: "#aaa" }}>{address}</p>

          <iframe
            title="map"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(
              address
            )}&z=13&output=embed`}
            style={{
              width: "100%",
              height: 200,
              border: "none",
              borderRadius: 10,
              marginTop: 10,
            }}
          />
        </div>
      </div>

      {/* STYLES */}
      <style>{`
        .contact-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit,minmax(300px,1fr));
          gap: 25px;
        }

        .card {
          padding: 25px;
          border-radius: 14px;
          background: rgba(20,20,20,0.6);
          border: 1px solid #222;
        }

        .textarea {
          width: 100%;
          padding: 12px;
          margin-top: 10px;
          background: #0a0a0a;
          border: 1px solid #222;
          color: #fff;
          border-radius: 6px;
        }

        .error {
          color: #ff4d4d;
        }

        .success {
          color: #C9A84C;
        }
      `}</style>
    </section>
  );
}