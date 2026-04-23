import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const links = [
    { name: "Dashboard", path: "/admin" },
    { name: "Services", path: "/admin/services" },
    { name: "Gallery", path: "/admin/gallery" },
    { name: "Settings", path: "/admin/settings" },
    { name: "Enquiries", path: "/admin/enquiries" },
  ];

  /* ===============================
     🔥 LOGOUT FUNCTION
  =============================== */
  const handleLogout = () => {
    localStorage.removeItem("token"); // 🔥 remove auth
    setOpen(false);
    navigate("/"); // 🔥 redirect
  };

  return (
    <>
      {/* 🔥 MOBILE TOP BAR */}
      <div className="mobile-topbar">
        <h3 className="gold">OPTIMA</h3>
        <div onClick={() => setOpen(true)} style={{ cursor: "pointer" }}>
          ☰
        </div>
      </div>

      {/* 🔥 SIDEBAR */}
      <div className={`sidebar ${open ? "open" : ""}`}>
        {/* CLOSE BUTTON */}
       {/* CLOSE BUTTON */}
<button
  className="close-btn"
  onClick={() => setOpen(false)}
>
  ✕
</button>

        <h2 className="gold">OPTIMA ADMIN</h2>

        <nav>
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setOpen(false)}
              className="nav-item"
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* 🔥 LOGOUT BUTTON */}
        <div className="logout-wrapper">
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* 🔥 OVERLAY */}
      {open && <div className="overlay" onClick={() => setOpen(false)} />}

      {/* 🔥 STYLES */}
      <style>{`
        .sidebar {
          width: 250px;
          height: 100vh;
          background: #0a0a0a;
          border-right: 1px solid #111;
          padding: 20px;
          position: fixed;
          left: 0;
          top: 0;
          z-index: 1000;
          transition: transform 0.3s ease;

          display: flex;
          flex-direction: column;
          justify-content: space-between; /* 🔥 push logout bottom */
        }

        .sidebar nav {
          margin-top: 30px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
.close-btn {
  display: none;
  position: absolute;
  top: 15px;
  right: 15px;

  width: 35px;
  height: 35px;

  border-radius: 50%;
  background: #111;
  border: 1px solid #333;

  color: #fff;
  font-size: 18px;

  cursor: pointer;
  z-index: 1200;

  display: flex;
  align-items: center;
  justify-content: center;

  transition: 0.3s;
}

.close-btn:hover {
  background: #C9A84C;
  color: #000;
}

.sidebar {
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}


        .nav-item {
          color: #aaa;
          text-decoration: none;
        }

        .nav-item.active {
          color: #C9A84C;
        }

        /* 🔥 LOGOUT */
        .logout-wrapper {
          margin-top: 30px;
        }

        .logout-btn {
          width: 100%;
          padding: 10px;
          border-radius: 8px;
          background: transparent;
          border: 1px solid #C9A84C;
          color: #C9A84C;
          cursor: pointer;
          transition: 0.3s;
        }

        .logout-btn:hover {
          background: #C9A84C;
          color: #000;
        }

        /* MOBILE TOP BAR */
        .mobile-topbar {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          padding: 15px 20px;
          background: rgba(0,0,0,0.9);
          backdrop-filter: blur(10px);
          z-index: 1100;

          justify-content: space-between;
          align-items: center;
        }

        .close-btn {
          display: none;
          position: absolute;
          top: 20px;
          right: 20px;
          cursor: pointer;
          font-size: 20px;
          color: #fff;
        }

        .overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          z-index: 999;
        }

        @media (max-width: 768px) {
          .mobile-topbar {
            display: flex;
          }

          .sidebar {
            transform: translateX(-100%);
            width: 260px;
          }

          .sidebar.open {
            transform: translateX(0);
          }

          .close-btn {
            display: block;
          }
        }
      `}</style>
    </>
  );
}