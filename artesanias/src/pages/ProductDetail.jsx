import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate }      from "react-router-dom";
import { motion, AnimatePresence }     from "framer-motion";
import { getProductoPorId }            from "../services/productosService";
import { getArtesanoPorId }            from "../services/artesanosService";
import { getProductos }                from "../services/productosService";
import ImageGallery                    from "../components/ImageGallery";
import Navbar                          from "../components/Navbar";
import { IconWhatsapp }                from "../components/Icons";
import "../styles/productDetail.css";
import "../styles/navbar.css";

const NOMBRE_TIENDA = "DESCUBREATE.GOB.PE";

function ProductDetail() {

  const { id }                      = useParams();
  const navigate                    = useNavigate();
  const [hover, setHover]           = useState(false);
  const [showBack, setShowBack]     = useState(true);
  const otrosRef                    = useRef(null);
  const [product, setProduct]       = useState(null);
  const [artesano, setArtesano]     = useState(null);
  const [otrosProductos, setOtros]  = useState([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    setLoading(true);
    setProduct(null);
    setArtesano(null);
    setOtros([]);

    async function cargar() {
      try {
        const prod = await getProductoPorId(id);
        if (!prod) { setLoading(false); return; }
        setProduct(prod);

        // Secuencial para evitar errores de conexión simultánea en XAMPP
        const art   = await getArtesanoPorId(prod.artesanoId);
        const todos = await getProductos();

        setArtesano(art);
        setOtros(todos.filter(p =>
          parseInt(p.artesanoId) === parseInt(prod.artesanoId) &&
          parseInt(p.id)         !== parseInt(id)
        ));
      } catch (err) {
        console.error("Error cargando producto:", err);
      } finally {
        setLoading(false);
      }
    }
    cargar();
  }, [id]);

  useEffect(() => {
    const el = otrosRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowBack(!entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [otrosProductos.length]);

  function getWhatsappLink() {
    if (!artesano?.whatsapp) return null;
    const precio  = product.price ? `S/ ${Number(product.price).toFixed(2)}` : "";
    const mensaje = `Hola! Estoy interesado en adquirir el producto *${product.title}* visto por *${precio}* en la tienda ${NOMBRE_TIENDA}`;
    return `https://wa.me/${artesano.whatsapp}?text=${encodeURIComponent(mensaje)}`;
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center",
                    justifyContent: "center", color: "#888" }}>
        Cargando producto...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pd-notfound">
        <p>Producto no encontrado.</p>
        <button onClick={() => navigate("/")}>Volver al inicio</button>
      </div>
    );
  }

  const fondoUrl        = product.categoriaBackground || product.background || "";
  const nombreCategoria = product.categoriaNombre     || product.category   || "";
  const precio          = product.price ? `S/ ${Number(product.price).toFixed(2)}` : "";

  // Construye el array de imágenes: foto principal + fotos de galería
  const todasLasFotos = [
    product.image,
    ...(product.fotos || []).map(f => f.url),
  ].filter(Boolean);

  return (
    <div className="pd-page">

      <AnimatePresence>
        {showBack && (
          <motion.button className="pd-back" onClick={() => navigate(-1)}
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
            ← Volver
          </motion.button>
        )}
      </AnimatePresence>

      {artesano?.whatsapp && (
        <motion.a href={getWhatsappLink()} target="_blank" rel="noreferrer"
          className="pd-whatsapp-btn"
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}>
          <IconWhatsapp size={22} color="white" />
          <span className="pd-whatsapp-label">Contáctame</span>
        </motion.a>
      )}

      <div className="pd-wrapper" style={{ backgroundImage: `url(${fondoUrl})` }}>
        <div className="pd-overlay" />
        <Navbar />

        <div className="pd-content">

          {/* IZQUIERDA — info */}
          <motion.div className="pd-left"
            initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}>

            {nombreCategoria && <span className="pd-category">{nombreCategoria}</span>}
            <h1 className="pd-title">{product.title}</h1>
            <p className="pd-price">{precio}</p>
            {product.description && <p className="pd-description">{product.description}</p>}

            {(product.tecnica || product.material || product.medidas) && (
              <div className="pd-caracteristicas">
                <h3 className="pd-carac-title">Características del producto</h3>
                <div className="pd-carac-grid">
                  {nombreCategoria && (
                    <div className="pd-carac-row">
                      <span className="pd-carac-label">Línea artesanal</span>
                      <span className="pd-carac-value">{nombreCategoria}</span>
                    </div>
                  )}
                  {product.tecnica && (
                    <div className="pd-carac-row">
                      <span className="pd-carac-label">Técnica</span>
                      <span className="pd-carac-value">{product.tecnica}</span>
                    </div>
                  )}
                  {product.material && (
                    <div className="pd-carac-row">
                      <span className="pd-carac-label">Material</span>
                      <span className="pd-carac-value">{product.material}</span>
                    </div>
                  )}
                  {product.medidas && (
                    <div className="pd-carac-row">
                      <span className="pd-carac-label">Medidas</span>
                      <span className="pd-carac-value">{product.medidas}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>

          {/* DERECHA — galería + chip artesano */}
          <motion.div className="pd-right"
            initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}>

            {/* Galería con miniaturas a la izquierda y zoom */}
            <ImageGallery images={todasLasFotos} alt={product.title} />

            {artesano && (
              <div className="pd-artesano-chip"
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                onClick={() => navigate(`/artesanos/${artesano.id}`)}>
                <AnimatePresence>
                  {hover && (
                    <motion.div className="pd-artesano-name"
                      initial={{ opacity: 0, x: 20, width: 0      }}
                      animate={{ opacity: 1, x: 0,  width: "auto" }}
                      exit={{    opacity: 0, x: 20, width: 0      }}
                      transition={{ duration: 0.25 }}>
                      {artesano.nombre} {artesano.apellidos}
                    </motion.div>
                  )}
                </AnimatePresence>
                <img src={artesano.fotoPresentacion} alt={artesano.nombre}
                     className="pd-artesano-avatar" />
              </div>
            )}
          </motion.div>

        </div>
      </div>

      {/* Otros productos del artesano */}
      {otrosProductos.length > 0 && (
        <div className="pd-otros" ref={otrosRef}>
          <div className="pd-otros-header">
            <span className="pd-otros-tag">ARTESANO</span>
            <h2>Otros productos de{" "}
              <span className="pd-otros-nombre">
                {artesano?.nombre} {artesano?.apellidos}
              </span>
            </h2>
          </div>
          <div className="pd-otros-grid">
            {otrosProductos.map((p) => (
              <motion.div key={p.id} className="pd-otros-card"
                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }} viewport={{ once: true }}
                onClick={() => navigate(`/productos/${p.id}`)}>
                <div className="pd-otros-img-wrap">
                  <img src={p.image} alt={p.title} />
                  <span className="pd-otros-badge">{p.categoriaNombre || p.category}</span>
                </div>
                <div className="pd-otros-info">
                  <h4>{p.title}</h4>
                  <span>S/ {Number(p.price).toFixed(2)}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

export default ProductDetail;