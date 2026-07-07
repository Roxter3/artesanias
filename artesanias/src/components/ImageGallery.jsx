import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/imageGallery.css";

// ─────────────────────────────────────────────────────────
// GALERÍA DE IMÁGENES
// - Imagen principal a la izquierda
// - Máximo 4 miniaturas a la derecha (1 principal + 4 adicionales = 5 total)
// - Sin hint de zoom
// - Sin margen transparente en la imagen
// ─────────────────────────────────────────────────────────

// Máximo de imágenes que se muestran en la galería pública
// (1 principal + hasta 4 adicionales)
const MAX_IMAGENES = 5;

function ImageGallery({ images = [], alt = "" }) {

  const [activa, setActiva] = useState(0);
  const [zoom, setZoom]     = useState(false);
  const [posZoom, setPosZoom] = useState({ x: 50, y: 50 });

  if (images.length === 0) return null;

  // Limita a MAX_IMAGENES para que las miniaturas no se desborden
  const imagenesVisibles = images.slice(0, MAX_IMAGENES);
  const activaReal = Math.min(activa, imagenesVisibles.length - 1);

  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width)  * 100;
    const y = ((e.clientY - rect.top)  / rect.height) * 100;
    setPosZoom({ x, y });
  }

  function anterior() {
    setActiva((prev) => (prev === 0 ? imagenesVisibles.length - 1 : prev - 1));
  }

  function siguiente() {
    setActiva((prev) => (prev === imagenesVisibles.length - 1 ? 0 : prev + 1));
  }

  return (
    <div className="igallery">

      {/* Miniaturas a la derecha — solo si hay más de 1 imagen */}
      {imagenesVisibles.length > 1 && (
        <div className="igallery-thumbs">
          {imagenesVisibles.map((url, idx) => (
            <button
              key={idx}
              className={`igallery-thumb ${idx === activaReal ? "igallery-thumb--active" : ""}`}
              onClick={() => setActiva(idx)}
            >
              <img src={url} alt={`${alt} ${idx + 1}`} />
            </button>
          ))}
        </div>
      )}

      {/* Imagen principal */}
      <div className="igallery-main">

        <div
          className="igallery-zoom-wrap"
          onMouseEnter={() => setZoom(true)}
          onMouseLeave={() => setZoom(false)}
          onMouseMove={handleMouseMove}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={activaReal}
              src={imagenesVisibles[activaReal]}
              alt={alt}
              className="igallery-img"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{    opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={zoom ? {
                transformOrigin: `${posZoom.x}% ${posZoom.y}%`,
                transform: "scale(2.2)",
              } : {}}
            />
          </AnimatePresence>
        </div>

        {/* Flechas sobresalidas — solo si hay más de 1 imagen */}
        {imagenesVisibles.length > 1 && (
          <>
            <button className="igallery-arrow igallery-arrow--prev" onClick={anterior}>‹</button>
            <button className="igallery-arrow igallery-arrow--next" onClick={siguiente}>›</button>
            <div className="igallery-counter">{activaReal + 1} / {imagenesVisibles.length}</div>
          </>
        )}

      </div>

    </div>
  );
}

export default ImageGallery;