import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import axios from "axios";
import API from "../../api/api";
gsap.registerPlugin(ScrollTrigger);

export default function Services() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  const [services, setServices] = useState([]);
  const [selected, setSelected] = useState(null); // 🔥 modal

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ===============================
     FETCH SERVICES
  =============================== */
useEffect(() => {
  const fetchServices = async () => {
    try {
      const res = await API.get("/services");
      setServices(res.data || []);
    } catch (err) {
      setError("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  fetchServices();
}, []);

  /* ===============================
     RESET REFS
  =============================== */
  useEffect(() => {
    cardsRef.current = [];
  }, [services]);

  /* ===============================
     GSAP ANIMATION
  =============================== */
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(cardsRef.current, {
        opacity: 0,
        y: 80,
        stagger: 0.15,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
        },
      });
    });

    return () => ctx.revert();
  }, [services]);

  /* ===============================
     LOADING / ERROR
  =============================== */
  if (loading)
    return <section className="section center">Loading...</section>;

  if (error)
    return <section className="section center">{error}</section>;

  return (
    <section ref={sectionRef} id="services" className="section">
      <p className="gold">WHAT WE OFFER</p>
      <h2>Our Services</h2>

      <div className="grid">
        {services.map((s, i) => (
          <div
            key={s._id}
            ref={(el) => (cardsRef.current[i] = el)}
            className="card"
            onClick={() => setSelected(s)} // 🔥 modal trigger
          >
            {/* 🔥 IMAGE */}
            {s.image && (
              <img src={s.image} alt="" className="image" />
            )}

            <h3>{s.name}</h3>

            <p className="price">
              ₹{s.price} <span>onwards</span>
            </p>

            {s.description && (
              <p className="desc">{s.description}</p>
            )}
          </div>
        ))}
      </div>

      {/* ================= MODAL ================= */}
      {selected && (
        <div className="modal" onClick={() => setSelected(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={selected.image} alt="" />

            <h2>{selected.name}</h2>

            <p className="price">₹{selected.price}</p>

            <p className="desc">{selected.description}</p>

            <button onClick={() => setSelected(null)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* ================= STYLES ================= */}
      <style>{`
        .section {
          padding: 100px 8%;
          background: #000;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit,minmax(260px,1fr));
          gap: 25px;
          margin-top: 40px;
        }

        /* 🔥 CARD */
        .card {
          padding: 20px;
          border-radius: 16px;
          background: #111;
          border: 1px solid #222;
          transition: 0.4s;
          cursor: pointer;

          transform-style: preserve-3d;
        }

        /* 🔥 3D HOVER */
        .card:hover {
          transform: rotateX(6deg) rotateY(-6deg) scale(1.03);
          border-color: #C9A84C;
          box-shadow: 0 20px 40px rgba(0,0,0,0.5);
        }

        .image {
          width: 100%;
          height: 160px;
          object-fit: cover;
          border-radius: 12px;
          margin-bottom: 10px;
        }

        .price {
          color: #C9A84C;
          font-size: 18px;
        }

        .desc {
          color: #777;
          font-size: 13px;
          margin-top: 8px;
        }

        /* 🔥 MODAL */
        .modal {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal-content {
          background: #111;
          padding: 20px;
          border-radius: 16px;
          max-width: 400px;
          width: 90%;
          text-align: center;
        }

        .modal-content img {
          width: 100%;
          border-radius: 10px;
          margin-bottom: 10px;
        }

        button {
          margin-top: 10px;
          padding: 10px 20px;
          border: none;
          background: #C9A84C;
          color: #000;
          border-radius: 6px;
          cursor: pointer;
        }

        .center {
          text-align: center;
        }
      `}</style>
    </section>
  );
}