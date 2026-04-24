import { useEffect, useState } from "react";
import API from "../../api/api"; // adjust path if needed

export default function Enquiries() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");

  // ===============================
  // 📡 FETCH ENQUIRIES
  // ===============================
  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.get("/enquiry");

      // API wrapper already returns res.data
      setData(res || []);
    } catch (err) {
      console.error("Enquiry fetch error:", err);

      if (err.status === 401 || err.response?.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("optima_token");
        window.location.href = "/admin/login";
      } else {
        setError("Failed to load enquiries");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  // ===============================
  // ✅ MARK AS READ
  // ===============================
  const markRead = async (id) => {
    try {
      setActionLoading(id);

      await API.put(`/enquiry/${id}/read`);

      // Optimistic update
      setData((prev) =>
        prev.map((e) =>
          e._id === id ? { ...e, read: true } : e
        )
      );
    } catch (err) {
      console.error("Mark read error:", err);
    } finally {
      setActionLoading(null);
    }
  };

  // ===============================
  // 🗑 DELETE ENQUIRY
  // ===============================
  const deleteEnquiry = async (id) => {
    if (!window.confirm("Delete this enquiry?")) return;

    try {
      setActionLoading(id);

      await API.delete(`/enquiry/${id}`);

      // Remove locally (no refetch needed)
      setData((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setActionLoading(null);
    }
  };

  // ===============================
  // ⏳ LOADING UI
  // ===============================
  if (loading) {
    return (
      <div style={{ padding: 40 }}>
        <h3 style={{ color: "#aaa" }}>Loading enquiries...</h3>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>Customer Enquiries</h2>

      {/* ❌ ERROR */}
      {error && (
        <p style={{ color: "#ff4d4d" }}>{error}</p>
      )}

      {/* 📭 EMPTY */}
      {data.length === 0 && (
        <p style={{ color: "#777" }}>No enquiries yet</p>
      )}

      {/* 📦 LIST */}
      <div style={{ display: "grid", gap: 20 }}>
        {data.map((e) => {
          const phone = e.phone?.replace(/\D/g, "") || "";
          const message = encodeURIComponent(
            `Hi ${e.name}, regarding your enquiry`
          );

          return (
            <div
              key={e._id}
              className="card"
              style={{
                borderLeft: e.read
                  ? "3px solid #222"
                  : "3px solid #C9A84C",
                padding: 20,
                opacity: actionLoading === e._id ? 0.6 : 1,
              }}
            >
              {/* HEADER */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <h3>{e.name}</h3>

                <span
                  style={{
                    fontSize: 12,
                    color: e.read ? "#777" : "#C9A84C",
                  }}
                >
                  {e.read ? "READ" : "NEW"}
                </span>
              </div>

              <p style={{ color: "#aaa", fontSize: 13 }}>
                {e.email}
              </p>

              <p style={{ marginTop: 10 }}>
                {e.message}
              </p>

              {/* ACTIONS */}
              <div
                style={{
                  marginTop: 15,
                  display: "flex",
                  gap: 10,
                  flexWrap: "wrap",
                }}
              >
                {!e.read && (
                  <button
                    className="btn"
                    onClick={() => markRead(e._id)}
                    disabled={actionLoading === e._id}
                  >
                    {actionLoading === e._id
                      ? "Updating..."
                      : "Mark Read"}
                  </button>
                )}

                {/* WHATSAPP */}
                {phone && (
                  <a
                    href={`https://wa.me/${phone}?text=${message}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <button className="btn">
                      WhatsApp
                    </button>
                  </a>
                )}

                <button
                  className="btn"
                  onClick={() => deleteEnquiry(e._id)}
                  disabled={actionLoading === e._id}
                  style={{
                    borderColor: "#ff4d4d",
                    color: "#ff4d4d",
                  }}
                >
                  {actionLoading === e._id
                    ? "Deleting..."
                    : "Delete"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}