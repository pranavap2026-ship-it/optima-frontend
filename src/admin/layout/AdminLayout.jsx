import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <main className="admin-content">
        <Outlet />
      </main>

      <style>{`
        * {
          box-sizing: border-box;
        }

        .admin-layout {
          display: flex;
          background: #000;
          min-height: 100vh;
          width: 100%;
        }

        /* ===============================
           MAIN CONTENT
        =============================== */
        .admin-content {
          flex: 1;
          margin-left: 250px;
          padding: 30px;
          transition: all 0.3s ease;
          
          height: 100vh;
          overflow-y: auto;
        }

        /* ===============================
           SCROLLBAR
        =============================== */
        .admin-content::-webkit-scrollbar {
          width: 6px;
        }

        .admin-content::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 10px;
        }

        .admin-content::-webkit-scrollbar-track {
          background: transparent;
        }

        /* ===============================
           TABLET
        =============================== */
        @media (max-width: 1024px) {
          .admin-content {
            padding: 20px;
          }
        }

        /* ===============================
           MOBILE
        =============================== */
        @media (max-width: 768px) {
          .admin-layout {
            flex-direction: column;
          }

          .admin-content {
            margin-left: 0;
            margin-top: 60px; /* 🔥 matches mobile topbar height */
            padding: 16px;

            height: auto;
            min-height: calc(100vh - 60px);
            overflow-y: visible;
          }
        }

        /* ===============================
           SMALL MOBILE
        =============================== */
        @media (max-width: 480px) {
          .admin-content {
            padding: 12px;
          }
        }
      `}</style>
    </div>
  );
}