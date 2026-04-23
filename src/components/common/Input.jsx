import { useState } from "react";

export default function Input({
  value,
  onChange,
  placeholder,
  type = "text",
  label,
  textarea = false, // 🔥 support textarea also
}) {
  const [focus, setFocus] = useState(false);

  return (
    <div style={{ marginBottom: 20, position: "relative", zIndex: 1 }}>
      {label && (
        <label
          style={{
            color: "#aaa",
            fontSize: 13,
            display: "block",
            marginBottom: 4,
          }}
        >
          {label}
        </label>
      )}

      {textarea ? (
        <textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          rows={4}
          style={inputStyle(focus)}
        />
      ) : (
        <input
          type={type}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={inputStyle(focus)}
        />
      )}
    </div>
  );
}

/* ===============================
   🔥 COMMON STYLE (IMPORTANT)
=============================== */
const inputStyle = (focus) => ({
  width: "100%",
  padding: "12px",
  background: "#0a0a0a",
  border: `1px solid ${focus ? "#C9A84C" : "#222"}`,
  color: "#fff",
  outline: "none",
  borderRadius: 6,

  // 🔥 FIX CLICK ISSUE
  position: "relative",
  zIndex: 5,
  pointerEvents: "auto",

  // 🔥 UX IMPROVEMENTS
  transition: "0.2s",
});