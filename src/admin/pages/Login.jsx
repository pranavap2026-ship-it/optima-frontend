import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // 🔥 LOGIN FUNCTION
import API from "../../api/api"; // adjust path

const handleLogin = async () => {
  if (!form.email || !form.password) {
    return setError("Enter email & password");
  }

  try {
    setLoading(true);
    setError("");

    const res = await API.post("/admin/login", form);

    // 🔐 SAVE TOKEN (match your interceptor key!)
    localStorage.setItem("optima_token", res.token);

    // 🚀 REDIRECT
    navigate("/admin");

  } catch (err) {
    setError(err.message || "Login failed");
  } finally {
    setLoading(false);
  }
};

  // 🔥 ENTER KEY SUPPORT
  const handleKey = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "radial-gradient(circle at top, #111, #000)",
      }}
    >
      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: 400,
          padding: 30,
          borderRadius: 12,
          backdropFilter: "blur(12px)",
        }}
        onKeyDown={handleKey}
      >
        {/* 🔥 TITLE */}
        <h2
          className="gold"
          style={{
            marginBottom: 25,
            textAlign: "center",
            letterSpacing: 2,
          }}
        >
          OPTIMA ADMIN
        </h2>

        {/* ❌ ERROR MESSAGE */}
        {error && (
          <p
            style={{
              color: "red",
              fontSize: 13,
              marginBottom: 15,
              textAlign: "center",
            }}
          >
            {error}
          </p>
        )}

        {/* 🔥 EMAIL */}
        <Input
          label="Email"
          placeholder="Enter email"
          value={form.email}
          onChange={(v) => setField("email", v)}
        />

        {/* 🔥 PASSWORD */}
        <Input
          label="Password"
          type="password"
          placeholder="Enter password"
          value={form.password}
          onChange={(v) => setField("password", v)}
        />

        {/* 🔥 BUTTON */}
        <Button
          label={loading ? "Logging in..." : "Login"}
          onClick={handleLogin}
          full
        />

        {/* 🔥 FOOTER */}
        <p
          style={{
            textAlign: "center",
            marginTop: 15,
            color: "#666",
            fontSize: 12,
          }}
        >
          Secure admin access only
        </p>
      </div>
    </div>
  );
}