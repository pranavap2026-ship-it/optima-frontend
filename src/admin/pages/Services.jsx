import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "../../components/common/Spinner";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

import API from "../api/api"; // adjust path

export default function Services() {
  const [services, setServices] = useState([]);

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
  });

  const [image, setImage] = useState(null);
  const [editId, setEditId] = useState(null); // 🔥 edit mode

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const authHeader = {
    headers: { Authorization: `Bearer ${token}` },
  };

  /* ================= FETCH ================= */
  const fetchServices = async () => {
    try {
      const res = await axios.get(`${API}/admin`, authHeader);
      setServices(res.data?.data || []);
    } catch {
      setError("Failed to load services");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!form.name.trim()) return setError("Name required");
    if (!form.price) return setError("Price required");

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("price", Number(form.price));
      formData.append("description", form.description);

      if (image) formData.append("image", image);

      let res;

      if (editId) {
        // 🔥 UPDATE
        res = await axios.put(`${API}/${editId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        setServices((prev) =>
          prev.map((s) => (s._id === editId ? res.data.data : s))
        );

      } else {
        // 🔥 CREATE
        res = await axios.post(API, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        setServices((prev) => [res.data.data, ...prev]);
      }

      // 🔥 RESET
      setForm({ name: "", price: "", description: "" });
      setImage(null);
      setEditId(null);

    } catch (err) {
      setError(err.response?.data?.error || "Failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (service) => {
    setForm({
      name: service.name,
      price: service.price,
      description: service.description || "",
    });

    setEditId(service._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this service?")) return;

    await axios.delete(`${API}/${id}`, authHeader);

    setServices((prev) => prev.filter((s) => s._id !== id));
  };

  /* ================= TOGGLE ================= */
  const handleToggle = async (id) => {
    const res = await axios.patch(`${API}/${id}/toggle`, {}, authHeader);

    setServices((prev) =>
      prev.map((s) => (s._id === id ? res.data.data : s))
    );
  };

  return (
    <div className="container">
      <h2>Manage Services</h2>

      {error && <p className="error">{error}</p>}

      {/* ================= FORM ================= */}
      <div className="card form-card">
        <h3>{editId ? "Edit Service" : "Add Service"}</h3>

        <Input
          placeholder="Service Name"
          value={form.name}
          onChange={(v) => setForm({ ...form, name: v })}
        />

        <Input
          placeholder="Price"
          type="number"
          value={form.price}
          onChange={(v) => setForm({ ...form, price: v })}
        />

        {/* 🔥 FIXED TEXTAREA CLICK */}
        <textarea
          value={form.description}
          placeholder="Description"
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
          className="input"
        />

        <input type="file" onChange={(e) => setImage(e.target.files[0])} />

        {image && (
          <img
            src={URL.createObjectURL(image)}
            className="preview"
          />
        )}

        <Button
          label={loading ? "Saving..." : editId ? "UPDATE" : "ADD"}
          onClick={handleSubmit}
        />
      </div>

      {/* ================= LIST ================= */}
      {fetching ? (
        <Spinner />
      ) : (
        services.map((s) => (
          <div key={s._id} className="card">
            {s.image && <img src={s.image} className="img" />}

            <h3>{s.name}</h3>
            <p className="price">₹{s.price}</p>
            <p className="desc">{s.description}</p>

            <div className="actions">
              <button type="button" onClick={() => handleEdit(s)}>Edit</button>
              <button type="button" onClick={() => handleToggle(s._id)}>
  {s.active ? "Hide" : "Show"}
</button>
              <button type="button" onClick={() => handleDelete(s._id)}>
  Delete
</button>
            </div>
          </div>
        ))
      )}

      {/* ================= STYLES ================= */}
      <style>{`
        .container { position: relative; z-index: 10; }

        .card {
          padding: 20px;
          border-radius: 12px;
          background: #111;
          border: 1px solid #222;
          margin-bottom: 20px;
        }

        .form-card * {
          pointer-events: auto; /* 🔥 FIX CLICK */
        }

        input, textarea {
          width: 100%;
          padding: 10px;
          margin-top: 10px;
          background: #0a0a0a;
          color: #fff;
          border: 1px solid #222;
          border-radius: 6px;
          z-index: 100;
          position: relative;
        }

        textarea {
          min-height: 100px;
          resize: vertical;
        }

        .actions {
          display: flex;
          gap: 10px;
          margin-top: 10px;
        }

        .img {
          width: 100%;
          height: 150px;
          object-fit: cover;
          border-radius: 10px;
        }
        

        .actions button {
  pointer-events: auto;
  position: relative;
  z-index: 50;
  cursor: pointer;
}


.card {
  position: relative;
  z-index: 10;
}

.container {
  position: relative;
  z-index: 10;
}

.overlay {
  pointer-events: none;
}
        .preview {
          width: 100px;
          margin-top: 10px;
        }

        .price { color: #C9A84C; }
        .desc { color: #777; }
        .error { color: red; }
      `}</style>
    </div>
  );
}