import { useEffect, useState } from "react";

export default function Toast({
  msg,
  type = "success", // success | error | info
  duration = 3000,
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (msg) {
      setShow(true);

      const timer = setTimeout(() => {
        setShow(false);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [msg]);

  if (!msg || !show) return null;

  const colors = {
    success: "#C9A84C",
    error: "#ff4d4f",
    info: "#3498db",
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        background: colors[type],
        color: "#000",
        padding: "12px 20px",
        borderRadius: 8,
        boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
        zIndex: 9999,

        // 🔥 ANIMATION
        transform: "translateY(0)",
        animation: "slideIn 0.4s ease",
      }}
    >
      {msg}
    </div>
  );
}