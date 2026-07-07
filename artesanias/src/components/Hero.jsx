import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getCarrusel } from "../services/carruselService";
import "../styles/hero.css";

// Íconos como SVG directo — sin dependencias externas
const IconHouse = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"
    viewBox="0 0 24 24" fill="none" stroke="white"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const IconChevronRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
    viewBox="0 0 24 24" fill="none" stroke="white"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

// Imágenes de respaldo si el backend no responde
const FALLBACK_IMAGES = [
  { url: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=1400&auto=format&fit=crop", titulo: "Cerámica Andina" },
  { url: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?q=80&w=1400&auto=format&fit=crop", titulo: "Textiles Tradicionales" },
  { url: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1400&auto=format&fit=crop", titulo: "Artesanía de Ate" },
];

const DOT_COLORS    = ["#E67E22", "#1E73BE", "#E83E46"];
const CIRCLE_COLORS = ["#E67E22", "#1E73BE", "#E83E46"];

const WORDS = [
  { first: "A", rest: "ventura",    color: "#E67E22" },
  { first: "T", rest: "radición",   color: "#1E73BE" },
  { first: "E", rest: "xperiencia", color: "#E83E46" },
];

function Hero() {

  const navigate = useNavigate();
  const heroRef  = useRef(null);

  const [current,      setCurrent]      = useState(0);
  const [circleColor,  setCircleColor]  = useState(CIRCLE_COLORS[0]);
  const [imagenes,     setImagenes]     = useState(FALLBACK_IMAGES);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const contentY  = useTransform(scrollYProgress, [0, 1],   ["0%", "30%"]);
  const contentOp = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  // Carga las imágenes del carrusel desde el backend
  useEffect(() => {
    getCarrusel()
      .then((slots) => {
        if (slots && slots.length > 0) {
          setImagenes(slots.map(s => ({ url: s.url, titulo: s.titulo || "" })));
        }
      })
      .catch(() => {
        // Si falla, usa el fallback — el Hero sigue funcionando
      });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === imagenes.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, [imagenes.length]);

  useEffect(() => {
    let idx = 0;
    const timer = setInterval(() => {
      idx = (idx + 1) % CIRCLE_COLORS.length;
      setCircleColor(CIRCLE_COLORS[idx]);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="hero" ref={heroRef}>

      <motion.div
        className="hero-content"
        style={{ y: contentY, opacity: contentOp }}
      >

        <motion.div
          className="hero-left"
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >

          <motion.div
            className="circle-icon"
            animate={{ backgroundColor: circleColor }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <IconHouse />
          </motion.div>

          <h1>LA CASA<br />DEL ARTESANO</h1>

          <div className="line" />

          <p className="hero-words">
            {WORDS.map((w, i) => (
              <span key={i} className="hero-word">
                <span style={{ color: w.color, fontWeight: 700 }}>{w.first}</span>
                <span style={{ color: "#555555" }}>{w.rest}</span>
                {i < WORDS.length - 1 && <span className="word-sep"> - </span>}
              </span>
            ))}
          </p>

          <button className="explore-btn" onClick={() => navigate("/artesanias")}>
            EXPLORAR ARTESANÍAS
            <IconChevronRight />
          </button>

        </motion.div>

        <div className="hero-right">

          <div className="carousel-frame">
            <AnimatePresence mode="wait">
              <motion.img
                key={current}
                src={imagenes[current].url}
                alt={imagenes[current].titulo || "Artesanía"}
                className="carousel-img"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1    }}
                exit={{    opacity: 0, scale: 0.97  }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              />
            </AnimatePresence>
          </div>

          <div className="carousel-dots">
            {DOT_COLORS.map((color, idx) => (
              <button
                key={idx}
                className={`carousel-dot ${idx === current ? "dot-active" : ""}`}
                style={{ backgroundColor: color }}
                onClick={() => setCurrent(idx)}
              />
            ))}
          </div>

          <div className="hero-label">
            artesanía<br />tradición<br />identidad
          </div>

        </div>

      </motion.div>

    </section>
  );
}

export default Hero;