import { useState } from "react";

export default function Button({
  label,
  onClick,
  type = "primary", // primary | outline | ghost
  loading = false,
  icon,
  full = false,
}) {
  const [hover, setHover] = useState(false);

  const styles = {
    base: {
      padding: "12px 24px",
      borderRadius: 8,
      fontWeight: 600,
      fontSize: 14,
      cursor: "pointer",
      transition: "all 0.25s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      width: full ? "100%" : "auto",
    },

    primary: {
      background: hover ? "#d4b55a" : "#C9A84C",
      color: "#000",
      border: "none",
      boxShadow: hover
        ? "0 8px 25px rgba(201,168,76,0.4)"
        : "0 4px 15px rgba(201,168,76,0.2)",
      transform: hover ? "translateY(-2px)" : "translateY(0)",
    },

    outline: {
      background: "transparent",
      color: "#C9A84C",
      border: "1px solid #C9A84C",
    },

    ghost: {
      background: "transparent",
      color: "#aaa",
      border: "none",
    },
  };

  return (
    <button
      onClick={onClick}
      disabled={loading}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        ...styles.base,
        ...(styles[type] || styles.primary),
        opacity: loading ? 0.7 : 1,
      }}
    >
      {loading ? "Please wait..." : (
        <>
          {icon && <span>{icon}</span>}
          {label}
        </>
      )}
    </button>
  );
}