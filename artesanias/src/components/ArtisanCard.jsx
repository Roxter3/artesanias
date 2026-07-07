import "../styles/artisanGrid.css";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function ArtisanCard({ artisan }) {

  // El backend devuelve las redes sociales como columnas sueltas
  // (facebook, instagram, tiktok) — las normalizamos para el renderizado
  const redes = {
    facebook:  artisan.facebook  || artisan.redesSociales?.facebook  || null,
    instagram: artisan.instagram || artisan.redesSociales?.instagram || null,
    tiktok:    artisan.tiktok    || artisan.redesSociales?.tiktok    || null,
  };

  return (
    <motion.div
      className="artisan-card"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >

      <div className="artisan-card-photo">
        <img
          src={artisan.fotoPresentacion}
          alt={`${artisan.nombre} ${artisan.apellidos}`}
        />
        <span className="artisan-card-especialidad">
          {artisan.especialidad}
        </span>
      </div>

      <div className="artisan-card-body">

        <h3 className="artisan-card-nombre">
          {artisan.nombre} {artisan.apellidos}
        </h3>

        <div className="artisan-card-redes">
          {redes.facebook && (
            <a href={redes.facebook} target="_blank" rel="noreferrer"
               className="red-social facebook" title="Facebook">f</a>
          )}
          {redes.instagram && (
            <a href={redes.instagram} target="_blank" rel="noreferrer"
               className="red-social instagram" title="Instagram">in</a>
          )}
          {redes.tiktok && (
            <a href={redes.tiktok} target="_blank" rel="noreferrer"
               className="red-social tiktok" title="TikTok">tt</a>
          )}
        </div>

        <Link to={`/artesanos/${artisan.id}`} className="artisan-card-btn">
          Ver perfil completo
        </Link>

      </div>

    </motion.div>
  );
}

export default ArtisanCard;