import { useEffect, useState } from "react";
import API from "../../api/api"; // ✅ use global API
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

export default function Settings() {
  const [form, setForm] = useState({
    shopName: "",
    phone: "",
    whatsapp: "",
    email: "",
    address: "",
    openTime: "",
    closeTime: "",
    isOpen: true,
    aboutTitle: "",
    aboutDescription: "",
    aboutImage: "",
    stats: [],
  });

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  /* ===============================
     FETCH SETTINGS
  =============================== */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/settings");
        const data = res?.data?.data ?? res?.data ?? {};

        setForm((prev) => ({
          ...prev,
          ...data,
          stats: data.stats || [],
        }));

      } catch {
        setMessage("❌ Failed to load settings");
      } finally {
        setPageLoading(false);
      }
    };

    fetchData();
  }, []);

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  /* ===============================
     STATS
  =============================== */
  const updateStat = (index, key, value) => {
    const updated = [...form.stats];
    updated[index][key] = key === "value" ? Number(value) : value;
    setField("stats", updated);
  };

  const addStat = () => {
    setField("stats", [
      ...form.stats,
      { label: "", value: 0, suffix: "" },
    ]);
  };

  const removeStat = (index) => {
    setField(
      "stats",
      form.stats.filter((_, i) => i !== index)
    );
  };

  /* ===============================
     IMAGE UPLOAD
  =============================== */
  const handleImageUpload = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      setMessage("");

      const res = await API.post("/upload", formData);

      setField("aboutImage", res.data.url);
      setMessage("✅ Image uploaded");

    } catch {
      setMessage("❌ Upload failed");
    } finally {
      setUploading(false);
    }
  };

  /* ===============================
     SAVE
  =============================== */
  const handleSave = async () => {
    try {
      if (!form.shopName) {
        return setMessage("❌ Shop name required");
      }

      setLoading(true);
      setMessage("");

      await API.put("/settings", form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage("✅ Saved successfully");

    } catch {
      setMessage("❌ Save failed");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return <h3 style={{ padding: 20 }}>Loading...</h3>;
  }

  return (
    <div className="container">
      <h2>⚙️ Advanced Settings</h2>

      {message && <p className="msg">{message}</p>}

      <div className="grid">

        {/* SHOP */}
        <Card title="Shop Info">
          <Input label="Shop Name" value={form.shopName}
            onChange={(v) => setField("shopName", v)} />
          <Input label="Phone" value={form.phone}
            onChange={(v) => setField("phone", v)} />
          <Input label="Email" value={form.email}
            onChange={(v) => setField("email", v)} />
        </Card>

        {/* BUSINESS */}
        <Card title="Business Hours">
          <Input type="time" label="Open"
            value={form.openTime}
            onChange={(v) => setField("openTime", v)} />
          <Input type="time" label="Close"
            value={form.closeTime}
            onChange={(v) => setField("closeTime", v)} />

          <label>
            <input
              type="checkbox"
              checked={form.isOpen}
              onChange={(e) => setField("isOpen", e.target.checked)}
            /> Open
          </label>
        </Card>

        {/* ABOUT */}
        <Card title="About Section">
          <Input label="Title"
            value={form.aboutTitle}
            onChange={(v) => setField("aboutTitle", v)} />

          <textarea
            className="textarea"
            value={form.aboutDescription}
            onChange={(e) =>
              setField("aboutDescription", e.target.value)
            }
          />

          <input type="file"
            onChange={(e) => handleImageUpload(e.target.files[0])} />

          {uploading && <p>Uploading...</p>}

          {form.aboutImage && (
            <img src={form.aboutImage} alt="" />
          )}
        </Card>

        {/* STATS */}
        <Card title="Stats">
          {form.stats.map((s, i) => (
            <div key={i} className="stat">
              <Input value={s.label}
                onChange={(v) => updateStat(i, "label", v)} />
              <Input value={s.value}
                onChange={(v) => updateStat(i, "value", v)} />
              <Input value={s.suffix}
                onChange={(v) => updateStat(i, "suffix", v)} />

              <button onClick={() => removeStat(i)}>❌</button>
            </div>
          ))}

          <button onClick={addStat}>➕ Add</button>
        </Card>

      </div>

      <Button
        label={loading ? "Saving..." : "Save Settings"}
        onClick={handleSave}
        disabled={loading || uploading}
      />

      {/* STYLES */}
      <style>{`
        .container {
          padding: 20px;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit,minmax(300px,1fr));
          gap: 20px;
          margin-top: 20px;
        }

        .msg {
          color: #C9A84C;
        }

        .textarea {
          width: 100%;
          height: 80px;
          margin-top: 10px;
        }

        .stat {
          display: flex;
          gap: 10px;
          margin-bottom: 10px;
        }

        img {
          width: 100%;
          margin-top: 10px;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
}

/* ===============================
   🔥 REUSABLE CARD
=============================== */
function Card({ title, children }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      {children}

      <style>{`
        .card {
          padding: 20px;
          border-radius: 12px;
          background: rgba(20,20,20,0.6);
          border: 1px solid #222;
          backdrop-filter: blur(10px);
        }
      `}</style>
    </div>
  );
}