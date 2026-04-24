import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API from "../../api/api"; // adjust path
export default function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    services: 0,
    gallery: 0,
    enquiries: 0,
    isOpen: true,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
const token = localStorage.getItem("optima_token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  /* ===============================
     🔥 SAFE COUNT HELPER
  =============================== */
  const getCount = (res) => {
    return (
      res?.data?.total ??
      res?.data?.data?.length ??
      res?.data?.length ??
      0
    );
  };

  /* ===============================
     FETCH DATA
  =============================== */


const fetchStats = async () => {
  try {
    setError("");
    setRefreshing(true);

    const [servicesRes, galleryRes, enquiriesRes, settingsRes] =
      await Promise.all([
        API.get("/services/admin", { headers }),
        API.get("/gallery"),
        API.get("/enquiry", { headers }),
        API.get("/settings"),
      ]);

    // 🔥 DEBUG
    console.log("Services:", servicesRes);
    console.log("Gallery:", galleryRes);
    console.log("Enquiries:", enquiriesRes);
    console.log("Settings:", settingsRes);

    setStats({
      services: getCount(servicesRes),
      gallery: getCount(galleryRes),
      enquiries: getCount(enquiriesRes),
      isOpen:
        settingsRes?.isOpen ??
        settingsRes?.data?.isOpen ??
        true,
    });

  } catch (err) {
    console.error("Dashboard Error:", err);
    setError("Failed to load dashboard");
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};

useEffect(() => {
  fetchStats();

  const interval = setInterval(fetchStats, 30000);
  return () => clearInterval(interval);
}, []);
  /* ===============================
     TOGGLE SHOP STATUS
  =============================== */
 const toggleShop = async () => {
  try {
    await API.put("/settings", {
      isOpen: !stats.isOpen,
    });

    setStats((prev) => ({
      ...prev,
      isOpen: !prev.isOpen,
    }));
  } catch (err) {
    alert("Failed to update shop status");
  }
};

  /* ===============================
     LOADING
  =============================== */
  if (loading) {
    return (
      <div style={{ padding: 40 }}>
        <h2 style={{ color: "#aaa" }}>Loading dashboard...</h2>
      </div>
    );
  }

  /* ===============================
     ERROR
  =============================== */
  if (error) {
    return (
      <div style={{ padding: 40 }}>
        <h2 style={{ color: "red" }}>{error}</h2>
      </div>
    );
  }

  return (
    <div className="dash">
      {/* HEADER */}
      <div className="header">
        <div>
          <h1>Welcome back 👋</h1>
          <p>Manage your tailoring business</p>
        </div>

        <button onClick={fetchStats} className="refresh">
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* QUICK ACTIONS */}
      <div className="actions">
        <button onClick={() => navigate("/admin/services")}>
          ➕ Add Service
        </button>

        <button onClick={() => navigate("/admin/gallery")}>
          🖼 Add Image
        </button>

        <button onClick={() => navigate("/admin/enquiries")}>
          📩 View Enquiries
        </button>
      </div>

      {/* STATS */}
      <div className="grid">
        <Card title="Services" value={stats.services} />
        <Card title="Gallery" value={stats.gallery} />
        <Card title="Enquiries" value={stats.enquiries} />

        <div className="card">
          <h2 style={{ color: stats.isOpen ? "#22c55e" : "#ef4444" }}>
            {stats.isOpen ? "OPEN" : "CLOSED"}
          </h2>
          <p>Shop Status</p>

          <button onClick={toggleShop} className="toggle">
            Toggle
          </button>
        </div>
      </div>

      {/* STATUS */}
      <div className="card status">
        <h3>System Status</h3>
        <p>
          ✅ Backend connected <br />
          ✅ API working <br />
          ✅ Admin panel operational
        </p>
      </div>

      {/* STYLES */}
      <style>{`
        .dash {
          padding: 20px;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .header p {
          color: #777;
        }

        .refresh {
          padding: 8px 14px;
          background: #111;
          border: 1px solid #333;
          color: #fff;
          cursor: pointer;
          border-radius: 6px;
        }

        .actions {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .actions button {
          padding: 10px 14px;
          background: #C9A84C;
          border: none;
          cursor: pointer;
          border-radius: 8px;
          font-weight: 500;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit,minmax(220px,1fr));
          gap: 20px;
        }

        .card {
          padding: 25px;
          background: #111;
          border-radius: 16px;
          text-align: center;
          border: 1px solid #222;
          transition: 0.3s;
        }

        .card:hover {
          transform: translateY(-5px);
          border-color: #C9A84C;
        }

        .toggle {
          margin-top: 10px;
          padding: 6px 12px;
          background: #333;
          border: none;
          color: #fff;
          cursor: pointer;
          border-radius: 6px;
        }

        .status {
          margin-top: 30px;
          text-align: left;
        }

        @media (max-width: 768px) {
          .header {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
        }
      `}</style>
    </div>
  );
}

/* ===============================
   CARD COMPONENT
=============================== */
function Card({ title, value }) {
  return (
    <div className="card">
      <h2 style={{ color: "#C9A84C", fontSize: 36 }}>{value}</h2>
      <p style={{ color: "#aaa" }}>{title}</p>
    </div>
  );
}