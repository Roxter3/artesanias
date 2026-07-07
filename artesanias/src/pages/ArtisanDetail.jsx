import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate }      from "react-router-dom";
import { motion, AnimatePresence }     from "framer-motion";
import { getArtesanoPorId }            from "../services/artesanosService";
import { getProductos }                from "../services/productosService";
import ImageGallery                    from "../components/ImageGallery";
import Navbar                          from "../components/Navbar";
import { IconWhatsapp, IconFacebook, IconInstagram, IconTiktok } from "../components/Icons";
import "../styles/artisanDetail.css";
import "../styles/navbar.css";

function ArtisanDetail() {

  const { id }       = useParams();
  const navigate     = useNavigate();
  const productosRef = useRef(null);
  const [showBack, setShowBack]         = useState(true);
  const [artesano, setArtesano]         = useState(null);
  const [susProductos, setSusProductos] = useState([]);
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    setLoading(true);

    async function cargar() {
      const art   = await getArtesanoPorId(id);
      setArtesano(art);
      const prods = await getProductos();
      setSusProductos(prods.filter(p => parseInt(p.artesanoId) === parseInt(id)));
      setLoading(false);
    }
    cargar();
  }, [id]);

  useEffect(() => {
    const el = productosRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setShowBack(!entry.isIntersecting),
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [susProductos.length]);

  if (loading) {
    return (
      <div className="ad-page">
        <Navbar />
        <p style={{ padding: "120px 60px", color: "#888" }}>Cargando...</p>
      </div>
    );
  }

  if (!artesano) {
    return (
      <div className="ad-notfound">
        <p>Artesano no encontrado.</p>
        <button onClick={() => navigate("/artesanos")}>Volver</button>
      </div>
    );
  }

  const redes = {
    facebook:  artesano.facebook  || artesano.redesSociales?.facebook  || null,
    instagram: artesano.instagram || artesano.redesSociales?.instagram || null,
    tiktok:    artesano.tiktok    || artesano.redesSociales?.tiktok    || null,
  };

  const fotosGaleria = [
    artesano.fotoPresentacion,
    ...(artesano.fotosGaleria || artesano.fotos_galeria || []).map(f => f.url),
  ].filter(Boolean);

  return (
    <div className="ad-page">
      <Navbar />

      {/* Botón volver */}
      <AnimatePresence>
        {showBack && (
          <motion.button
            className="ad-back"
            onClick={() => navigate("/artesanos")}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0   }}
            exit={{    opacity: 0, x: -10  }}
            transition={{ duration: 0.25 }}
          >
            ← Volver
          </motion.button>
        )}
      </AnimatePresence>

      {/* Hero: galería izquierda, info derecha */}
      <section className="ad-hero">

        {/* Galería sticky */}
        <motion.div
          className="ad-foto-wrap"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0  }}
          transition={{ duration: 0.6 }}
        >
          <ImageGallery images={fotosGaleria} alt={`${artesano.nombre} ${artesano.apellidos}`} />
        </motion.div>

        {/* Info */}
        <motion.div
          className="ad-info"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="ad-especialidad">{artesano.especialidad}</span>

          <h1 className="ad-nombre">
            {artesano.nombre}<br />{artesano.apellidos}
          </h1>

          {artesano.rna && (
            <p className="ad-rna">
              Registro Nacional del Artesano: <strong>{artesano.rna}</strong>
            </p>
          )}

          {artesano.descripcion && (
            <p className="ad-descripcion">"{artesano.descripcion}"</p>
          )}

          {/* Contacto */}
          <div className="ad-contacto">
            {artesano.celular && (
              <div className="ad-contacto-row">
                <span className="ad-contacto-label">📞 Celular</span>
                <span className="ad-contacto-valor">{artesano.celular}</span>
              </div>
            )}
            {artesano.correo && (
              <div className="ad-contacto-row">
                <span className="ad-contacto-label">✉️ Correo</span>
                <span className="ad-contacto-valor">{artesano.correo}</span>
              </div>
            )}
            {artesano.direccion && (
              <div className="ad-contacto-row">
                <span className="ad-contacto-label">📍 Dirección</span>
                <span className="ad-contacto-valor">{artesano.direccion}</span>
              </div>
            )}
          </div>

          {/* Redes sociales */}
          {(redes.facebook || redes.instagram || redes.tiktok || artesano.whatsapp) && (
            <div className="ad-redes">
              {redes.facebook && (
                <a href={redes.facebook} target="_blank" rel="noreferrer" className="ad-red facebook">
                  <IconFacebook size={16} />
                  Facebook
                </a>
              )}
              {redes.instagram && (
                <a href={redes.instagram} target="_blank" rel="noreferrer" className="ad-red instagram">
                  <IconInstagram size={16} />
                  Instagram
                </a>
              )}
              {redes.tiktok && (
                <a href={redes.tiktok} target="_blank" rel="noreferrer" className="ad-red tiktok">
                  <IconTiktok size={16} />
                  TikTok
                </a>
              )}
              {/* WhatsApp — solo ícono, sin texto */}
              {artesano.whatsapp && (
                <a href={`https://wa.me/${artesano.whatsapp}`} target="_blank" rel="noreferrer"
                  className="ad-red whatsapp ad-red--icon-only"
                  title="Contactar por WhatsApp">
                  <IconWhatsapp size={18} color="white" />
                </a>
              )}
            </div>
          )}

        </motion.div>
      </section>

      {/* Productos del artesano */}
      {susProductos.length > 0 && (
        <div className="ad-productos" ref={productosRef}>
          <div className="ad-productos-header">
            <span className="ad-productos-tag">PORTAFOLIO</span>
            <h2>Productos de <span className="ad-productos-nombre">{artesano.nombre}</span></h2>
          </div>
          <div className="ad-productos-grid">
            {susProductos.map((p) => (
              <motion.div
                key={p.id}
                className="ad-prod-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                viewport={{ once: true }}
                onClick={() => navigate(`/productos/${p.id}`)}
              >
                <div className="ad-prod-img-wrap">
                  <img src={p.image} alt={p.title} />
                  <span className="ad-prod-badge">{p.categoriaNombre || p.category}</span>
                </div>
                <div className="ad-prod-info">
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

export default ArtisanDetail;