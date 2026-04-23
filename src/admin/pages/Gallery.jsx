import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "../../components/common/Spinner";
import Button from "../../components/common/Button";

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔐 TOKEN FIX
  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  // ===============================
  // FETCH IMAGES
  // ===============================
  const fetchImages = async () => {
    try {
      setPageLoading(true);
      setError("");

      const res = await axios.get("http://localhost:5000/api/gallery");
      setImages(res?.data || []);

    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load gallery");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // ===============================
  // HANDLE FILE
  // ===============================
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    console.log("FILE:", selected); // 🔥 DEBUG
    setFile(selected);
  };

  // ===============================
  // UPLOAD IMAGE
  // ===============================
  const handleUpload = async () => {
    console.log("BUTTON CLICKED"); // 🔥 DEBUG

    if (!file) {
      setError("Please select an image first");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      setLoading(true);
      setError("");

      const res = await axios.post(
        "http://localhost:5000/api/gallery",
        formData,
        {
          headers: {
            ...headers,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("UPLOAD SUCCESS:", res.data);

      setFile(null);
      fetchImages();

    } catch (err) {
      console.error("UPLOAD ERROR:", err.response || err);
      setError("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // DELETE IMAGE
  // ===============================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this image?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/gallery/${id}`,
        { headers }
      );

      fetchImages();
    } catch (err) {
      console.error(err);
      setError("Delete failed");
    }
  };

  // ===============================
  // LOADING UI
  // ===============================
  if (pageLoading) {
    return (
      <div style={{ padding: 40 }}>
        <Spinner />
      </div>
    );
  }

  return (
    <div
      style={{
        position: "relative",
        zIndex: 10, // 🔥 FIX OVERLAY ISSUE
      }}
    >
      <h2 style={{ marginBottom: 20 }}>Gallery Management</h2>

      {/* ❌ ERROR */}
      {error && (
        <p style={{ color: "red", marginBottom: 10 }}>{error}</p>
      )}

      {/* ================= UPLOAD ================= */}
      <div
        className="card"
        style={{
          marginBottom: 30,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          position: "relative",
          zIndex: 999, // 🔥 FORCE ABOVE EVERYTHING
        }}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{
            pointerEvents: "auto",
            position: "relative",
            zIndex: 999,
          }}
        />

        {file && (
          <p style={{ color: "#aaa", fontSize: 12 }}>
            Selected: {file.name}
          </p>
        )}

        {/* 🔥 BUTTON FIX */}
        <Button
          label={loading ? "Uploading..." : "Upload Image"}
          onClick={handleUpload}
        />
      </div>

      {/* ================= GRID ================= */}
      {images.length === 0 ? (
        <p style={{ color: "#777" }}>No images uploaded</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
            gap: 20,
          }}
        >
          {images.map((img) => (
            <div
              key={img._id}
              className="card"
              style={{
                overflow: "hidden",
                position: "relative",
              }}
            >
              <img
                src={img.url}
                alt=""
                style={{
                  width: "100%",
                  height: 180,
                  objectFit: "cover",
                }}
              />

              <button
                onClick={() => handleDelete(img._id)}
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  background: "#000",
                  border: "1px solid #C9A84C",
                  color: "#C9A84C",
                  padding: "5px 10px",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}