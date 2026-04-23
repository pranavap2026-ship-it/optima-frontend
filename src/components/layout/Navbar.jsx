import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  // 🔥 SECRET TAP LOGIC
  const tapCount = useRef(0);
  const timer = useRef(null);

  const handleSecretClick = () => {
    tapCount.current++;

    if (tapCount.current === 5) {
      navigate("/optima-secret-admin");
      tapCount.current = 0;
    }

    clearTimeout(timer.current);

    timer.current = setTimeout(() => {
      tapCount.current = 0;
    }, 2000);
  };

  /* ===============================
     ✅ SMOOTH SCROLL FIX
  =============================== */
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (!el) return;

    const yOffset = -100; // navbar height
    const y =
      el.getBoundingClientRect().top + window.pageYOffset + yOffset;

    window.scrollTo({
      top: y,
      behavior: "smooth",
    });

    setOpen(false); // close mobile menu
  };

  /* ===============================
     🎬 MENU ANIMATION
  =============================== */
  useEffect(() => {
    if (open) {
      gsap.fromTo(
        menuRef.current,
        { y: "-100%", opacity: 0 },
        { y: "0%", opacity: 1, duration: 0.5, ease: "power4.out" }
      );
    }
  }, [open]);

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 20,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,

          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",

          width: "90%",
          maxWidth: 1100,
          padding: "12px 20px",

          borderRadius: 50,
          border: "1px solid rgba(255,255,255,0.08)",

          backdropFilter: "blur(20px)",
          background: "rgba(0,0,0,0.5)",

          boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
        }}
      >
        {/* LOGO */}
        <h2
          className="gold"
          style={{ letterSpacing: 2, cursor: "pointer", fontSize: 18 }}
          onClick={handleSecretClick}
        >
          OPTIMA
        </h2>

        {/* DESKTOP MENU */}
        <div className="desktop-menu">
          <div onClick={() => scrollToSection("services")}>SERVICES</div>
          <div onClick={() => scrollToSection("gallery")}>GALLERY</div>
          <div onClick={() => scrollToSection("about")}>ABOUT</div>
          <div onClick={() => scrollToSection("contact")}>CONTACT</div>
        </div>

        {/* MOBILE ICON */}
        <div className="mobile-icon" onClick={() => setOpen(true)}>
          ☰
        </div>
      </nav>

      {/* 🔥 MOBILE FULLSCREEN MENU */}
      {open && (
        <div
          ref={menuRef}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.95)",
            backdropFilter: "blur(20px)",
            zIndex: 2000,

            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 30,
          }}
        >
          {/* CLOSE */}
          <div
            onClick={() => setOpen(false)}
            style={{
              position: "absolute",
              top: 30,
              right: 30,
              fontSize: 24,
              cursor: "pointer",
              color: "#fff",
            }}
          >
            ✕
          </div>

          {/* LINKS */}
          {["services", "gallery", "about", "contact"].map((item) => (
            <div
              key={item}
              onClick={() => scrollToSection(item)}
              style={{
                fontSize: 28,
                color: "#fff",
                letterSpacing: 2,
                cursor: "pointer",
                transition: "0.3s",
              }}
            >
              {item.toUpperCase()}
            </div>
          ))}
        </div>
      )}

      {/* 🔥 RESPONSIVE CSS */}
      <style>
        {`
          .desktop-menu {
            display: flex;
            gap: 25px;
            font-size: 13px;
          }

          .desktop-menu div {
            cursor: pointer;
            color: #aaa;
          }

          .desktop-menu div:hover {
            color: #C9A84C;
          }

          .mobile-icon {
            display: none;
            font-size: 22px;
            cursor: pointer;
          }

          @media (max-width: 768px) {
            .desktop-menu {
              display: none;
            }
            .mobile-icon {
              display: block;
            }
          }
        `}
      </style>
    </>
  );
}