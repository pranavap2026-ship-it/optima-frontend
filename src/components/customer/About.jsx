import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import API from "../../api/api"; // ✅ use your API instance

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef(null);
  const statsRef = useRef([]);
  const numberRefs = useRef([]);

  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ===============================
     📡 FETCH SETTINGS
  =============================== */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/settings");

        const settings = res?.data?.data ?? res?.data ?? {};
        setData(settings);
console.log("SETTINGS DATA:", settings);
      } catch (err) {
        console.error("About error:", err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = Array.isArray(data.stats) ? data.stats : [];

  /* ===============================
     🔁 RESET REFS
  =============================== */
  useEffect(() => {
    statsRef.current = [];
    numberRefs.current = [];
  }, [stats]);

  /* ===============================
     🎬 GSAP ANIMATION
  =============================== */
useEffect(() => {
  if (!sectionRef.current || stats.length === 0) return;

  const validStats = statsRef.current.filter(Boolean);
  const validNumbers = numberRefs.current.filter(Boolean);

  if (validStats.length === 0) return; // ✅ prevent error

  const ctx = gsap.context(() => {

    // SECTION
    gsap.from(sectionRef.current, {
      opacity: 0,
      y: 80,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 85%",
      },
    });

    // STATS (SAFE)
    gsap.from(validStats, {
      opacity: 0,
      y: 50,
      stagger: 0.12,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
      },
    });

    // COUNTER
    validNumbers.forEach((el, i) => {
      if (!el || !stats[i]) return;

      const { value = 0, suffix = "" } = stats[i];

      gsap.fromTo(
        el,
        { innerText: 0 },
        {
          innerText: value,
          duration: 1.8,
          ease: "power2.out",
          snap: { innerText: 1 },
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            once: true,
          },
          onUpdate: function () {
            el.innerText = Math.floor(el.innerText) + suffix;
          },
        }
      );
    });

  }, sectionRef);

  return () => ctx.revert();
}, [stats]);

  /* ===============================
     ⏳ LOADING
  =============================== */
  if (loading) {
    return (
      <section className="center">
        <p>Loading...</p>

        <style>{`
          .center {
            padding: 80px;
            text-align: center;
            color: #888;
            background: #000;
          }
        `}</style>
      </section>
    );
  }

  /* ===============================
     ❌ ERROR
  =============================== */
  if (error) {
    return (
      <section className="center">
        <p style={{ color: "red" }}>{error}</p>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="about"
      className="section"
    >
      {/* TITLE */}
      <p className="gold">OUR STORY</p>

      <h2>
        {data.aboutTitle || "About Optima Tailors"}
      </h2>

      {/* GRID */}
      <div className="about-grid">

        {/* TEXT */}
        <div>
          <p className="desc">
            {data.aboutDescription ||
              "We craft premium custom clothing with precision and elegance."}
          </p>

          {data.aboutImage && (
            <img src={data.aboutImage} alt="about" />
          )}
        </div>

{/* STATS */}
<div className="stats-grid">
  {stats.length === 0 ? (
    <p className="muted">No stats available</p>
  ) : (
    stats.map((s, i) => (
      <div
        key={i}
        ref={(el) => (statsRef.current[i] = el)}
        className="card"
      >
        <div className="glow" />

        {/* 🔥 NUMBER */}
      <h3
  ref={(el) => (numberRefs.current[i] = el)}
  className="gold"
>
  {s.value}{s.suffix}
</h3>

        {/* 🔥 LABEL */}
        <p className="label">{s.label}</p>
      </div>
    ))
  )}
</div>

      </div>

      {/* STYLES */}
      <style>{`
        .section {
          padding: 100px 20px;
          background:
            radial-gradient(circle at top, rgba(201,168,76,0.08), transparent 60%),
            #000;
        }

        h2 {
          font-size: clamp(38px,6vw,60px);
        }

        .about-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 60px;
          margin-top: 50px;
          align-items: center;
        }

        .desc {
          color: #bbb;
          line-height: 1.8;
        }

        img {
          width: 100%;
          margin-top: 20px;
          border-radius: 12px;
          object-fit: cover;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2,1fr);
          gap: 20px;
        }

        .card {
          padding: 22px;
          border-radius: 14px;
          background: rgba(20,20,20,0.6);
          border: 1px solid #222;
          backdrop-filter: blur(10px);
          position: relative;
          transition: 0.3s;
        }

        .card:hover {
          transform: translateY(-6px) scale(1.02);
          border-color: #C9A84C;
        }

        .glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle, rgba(201,168,76,0.15), transparent 70%);
          opacity: 0;
          transition: 0.4s;
        }

        .card:hover .glow {
          opacity: 1;
        }

        .muted {
          color: #777;
        }

        @media (max-width: 768px) {
          .about-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
        }
      `}</style>
    </section>
  );
}