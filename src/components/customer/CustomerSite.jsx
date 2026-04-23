import { Suspense, lazy } from "react";

// 🔥 LAZY LOAD (PERFORMANCE BOOST)
const Navbar = lazy(() => import("../layout/Navbar"));
const Hero = lazy(() => import("./Hero"));
const Services = lazy(() => import("./Services"));
const Gallery = lazy(() => import("./Gallery"));
const About = lazy(() => import("./About"));
const ShopInfo = lazy(() => import("./ShopInfo"));
const Contact = lazy(() => import("./Contact"));
const Footer = lazy(() => import("../layout/Footer"));

export default function CustomerSite({ services = [], gallery = [] }) {
  return (
    <div className="site">
      <Suspense fallback={<Loader />}>

        {/* NAVBAR */}
        <Navbar />

        {/* HERO */}
        <section id="home">
          <Hero />
        </section>

        {/* SERVICES */}
        <section id="services">
          <Services services={services} />
        </section>

        {/* GALLERY */}
        <section id="gallery">
          <Gallery gallery={gallery} />
        </section>

        {/* ABOUT */}
        <section id="about">
          <About />
        </section>

        {/* SHOP INFO */}
        <section id="shop">
          <ShopInfo />
        </section>

        {/* CONTACT */}
        <section id="contact">
          <Contact />
        </section>

        {/* FOOTER */}
        <Footer />

      </Suspense>

      {/* 🔥 STYLES */}
      <style>{`
        .site {
          background: #000;
          color: #fff;
          scroll-behavior: smooth;
        }

        section {
          position: relative;
        }
      `}</style>
    </div>
  );
}

/* ===============================
   🔥 LOADER COMPONENT
=============================== */
function Loader() {
  return (
    <div className="loader">
      <div className="spinner" />
      <p>Loading Optima Experience...</p>

      <style>{`
        .loader {
          height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background: #000;
          color: #aaa;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #333;
          border-top: 3px solid #C9A84C;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 10px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}