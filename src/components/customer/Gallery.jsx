import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import axios from "axios";
import API from "../../api/api";
export default function Gallery() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const [gallery, setGallery] = useState([]);
  const [activeImg, setActiveImg] = useState(null);

  /* ===============================
     FETCH FROM ADMIN BACKEND
  =============================== */
useEffect(() => {
  const fetchGallery = async () => {
    try {
      const res = await API.get("/gallery");
      console.log("Gallery Data:", res);
      setGallery(res.data || res);
    } catch (err) {
      console.error("Gallery error:", err);
    }
  };

  fetchGallery();
}, []);

  /* ===============================
     GSAP ANIMATION
  =============================== */
  useEffect(() => {
    if (!sectionRef.current || gallery.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current, {
        opacity: 0,
        y: 60,
        duration: 1,
      });

      gsap.from(cardsRef.current, {
        opacity: 0,
        y: 50,
        stagger: 0.12,
        duration: 0.8,
      });
    });

    return () => ctx.revert();
  }, [gallery]);

  /* ===============================
     3D TILT
  =============================== */
  const handleMove = (e, el) => {
    const rect = el.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateX = -(y / rect.height - 0.5) * 12;
    const rotateY = (x / rect.width - 0.5) * 12;

    el.style.transform = `
      perspective(1000px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      scale(1.05)
    `;

    el.style.setProperty("--x", `${x}px`);
    el.style.setProperty("--y", `${y}px`);
  };

  const resetTilt = (el) => {
    el.style.transform = `
      perspective(1000px)
      rotateX(0deg)
      rotateY(0deg)
      scale(1)
    `;
  };

  /* ===============================
     FALLBACK (if backend fails)
  =============================== */
  const images =
    gallery.length > 0
      ? gallery
      : [
          { url: "https://images.unsplash.com/photo-1520975922284-9e0ce8270b49" },
          { url: "https://images.unsplash.com/photo-1491553895911-0055eca6402d" },
          { url: "https://images.unsplash.com/photo-1521336575822-6da63fb45455" },
          { url: "https://images.unsplash.com/photo-1516826957135-700dedea698c" },
        ];

  return (
    <section
      ref={sectionRef}
      style={{
        padding: "100px 40px",
        background: "linear-gradient(180deg, #000, #0a0a0a)",
      }}
    >
      {/* TITLE */}
      <h2 style={{ color: "#fff", fontSize: 50 }}>Gallery</h2>

      {/* GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
          gap: 20,
          marginTop: 50,
          perspective: "1200px",
        }}
      >
        {images.map((img, i) => {
          const src = img.url || img.image;

          return (
            <div
              key={img._id || src || i} // ✅ FIX duplicate issue
              ref={(el) => (cardsRef.current[i] = el)}
              style={{
                height: 250,
                position: "relative",
                borderRadius: 16,
                overflow: "hidden",
                cursor: "pointer",

                transformStyle: "preserve-3d",
                transition: "transform 0.25s ease",
              }}
              onMouseMove={(e) => handleMove(e, e.currentTarget)}
              onMouseLeave={(e) => resetTilt(e.currentTarget)}
              onClick={() => setActiveImg(src)}
            >
              {/* IMAGE */}
              <img
                src={src}
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transform: "translateZ(40px) scale(1.1)",
                  transition: "transform 0.4s ease",
                }}
                onError={(e) => {
                  e.target.style.display = "none"; // hide broken image
                }}
              />

              {/* GLOW */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "radial-gradient(circle at var(--x,50%) var(--y,50%), rgba(201,168,76,0.25), transparent)",
                  pointerEvents: "none",
                }}
              />

              {/* OVERLAY */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.6), transparent)",
                  transform: "translateZ(20px)",
                }}
              />
            </div>
          );
        })}
      </div>

      {/* FULLSCREEN */}
      {activeImg && (
        <div
          onClick={() => setActiveImg(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.95)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <img
            src={activeImg}
            alt=""
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              borderRadius: 14,
              boxShadow: "0 0 60px rgba(0,0,0,0.9)",
            }}
          />
        </div>
      )}
    </section>
  );
}