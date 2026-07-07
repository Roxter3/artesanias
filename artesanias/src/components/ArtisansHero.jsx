import "../styles/artisansHero.css";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
 
function ArtisansHero() {
 
  return (
 
    <section className="artisans-hero">
 
      <Navbar />
 
      <div className="artisans-overlay"></div>
 
      <motion.div
        className="artisans-content"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
 
        <span>
          AVENTURA • TRADICIÓN • EXPERIENCIA
        </span>
 
        <h1>
          Artesanos
          <br />
          de Ate
        </h1>
 
        <p>
          Conoce a los artistas que
          preservan nuestras tradiciones
          a través de piezas únicas
          elaboradas a mano.
        </p>
 
        <button>
          Explorar Artesanos
        </button>
 
      </motion.div>
 
    </section>
  );
}
 
export default ArtisansHero;