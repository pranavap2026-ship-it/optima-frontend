import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Canvas, useFrame } from "@react-three/fiber";

/* ===============================
   🔥 3D WAVE BACKGROUND
================================= */
function WavePlane() {
  const meshRef = useRef();

  useFrame(({ clock, mouse }) => {
    const t = clock.getElapsedTime();

    if (meshRef.current) {
      meshRef.current.rotation.x = -0.6;
      meshRef.current.rotation.y = mouse.x * 0.5;
      meshRef.current.position.z = Math.sin(t) * 0.3;
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[12, 12, 64, 64]} />
      <meshStandardMaterial
        color="#C9A84C"
        wireframe
        transparent
        opacity={0.5}   // 🔥 visible now
      />
    </mesh>
  );
}

function ThreeBackground() {
  return (
    <Canvas
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 1, // 👈 visible
      }}
      camera={{ position: [0, 0, 4] }}
    >
      <ambientLight intensity={1} />
      <pointLight position={[5, 5, 5]} />
      <WavePlane />
    </Canvas>
  );
}

/* ===============================
   🔥 HERO COMPONENT
================================= */
export default function Hero() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const buttonsRef = useRef(null);
  const topTextRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.from(topTextRef.current, {
        y: -20,
        opacity: 0,
        duration: 0.8,
      })
        .from(titleRef.current, {
          y: 100,
          opacity: 0,
          duration: 1.2,
          ease: "power4.out",
        })
        .from(subtitleRef.current, {
          opacity: 0,
          y: 30,
          duration: 0.8,
        })
        .from(buttonsRef.current, {
          opacity: 0,
          y: 30,
          duration: 0.8,
        });

      // 🔥 Mouse parallax (text)
      const move = (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;

        gsap.to(titleRef.current, {
          x,
          y,
          duration: 0.5,
        });
      };

      window.addEventListener("mousemove", move);

      return () => {
        window.removeEventListener("mousemove", move);
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // 🔥 Scroll function
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (!el) return;

    const yOffset = -80;
    const y =
      el.getBoundingClientRect().top + window.pageYOffset + yOffset;

    window.scrollTo({
      top: y,
      behavior: "smooth",
    });
  };

  return (
    <section
      ref={sectionRef}
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        background: "radial-gradient(circle, #111, #000)", // 👈 DO NOT block canvas
      }}
    >
      {/* 🔥 3D BACKGROUND */}
      <ThreeBackground />

      {/* 🔥 CONTENT */}
      <div style={{ position: "relative", zIndex: 5 }}>
        {/* TOP TEXT */}
        <p
          ref={topTextRef}
          style={{
            letterSpacing: 4,
            color: "#aaa",
            marginBottom: 10,
            fontSize: 12,
          }}
        >
          EST. 2005 • YENDAYAR
        </p>

        {/* TITLE */}
        <h1
          ref={titleRef}
          style={{
            fontSize: "clamp(60px,10vw,110px)",
            lineHeight: 1,
            color: "#eee",
          }}
        >
          OPTIMA <br />
          <span
            style={{
              color: "#C9A84C",
              textShadow: "0 0 25px rgba(201,168,76,0.6)",
            }}
          >
            TAILORS
          </span>
        </h1>

        {/* SUBTITLE */}
        <p
          ref={subtitleRef}
          style={{
            letterSpacing: 3,
            color: "#bbb",
            marginTop: 15,
            fontSize: 14,
          }}
        >
          PRECISION • STYLE • PERFECTION
        </p>

        {/* BUTTONS */}
        <div ref={buttonsRef} style={{ marginTop: 35 }}>
          <button
            className="btn fill"
            onClick={() => scrollToSection("services")}
          >
            VIEW SERVICES
          </button>

          <button
            className="btn"
            style={{ marginLeft: 12 }}
            onClick={() => scrollToSection("contact")}
          >
            ENQUIRE NOW
          </button>
        </div>
      </div>

      {/* SCROLL INDICATOR */}
      <div
        style={{
          position: "absolute",
          bottom: 30,
          color: "#888",
          fontSize: 12,
          letterSpacing: 2,
          animation: "bounce 1.5s infinite",
          zIndex: 5,
        }}
      >
        ↓ SCROLL
      </div>
    </section>
  );
}