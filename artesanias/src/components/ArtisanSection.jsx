import "../styles/artisan.css";

import { motion } from "framer-motion";

function ArtisanSection() {

  return (

    <section className="artisan-section">

      <motion.div
        className="artisan-image"

        initial={{
          opacity: 0,
          x: -80
        }}

        whileInView={{
          opacity: 1,
          x: 0
        }}

        transition={{
          duration: 0.8
        }}

        viewport={{
          once: true
        }}
      >

        <img
          src="https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1200&auto=format&fit=crop"
          alt="Artesano"
        />

      </motion.div>

      <motion.div
        className="artisan-content"

        initial={{
          opacity: 0,
          x: 80
        }}

        whileInView={{
          opacity: 1,
          x: 0
        }}

        transition={{
          duration: 0.8
        }}

        viewport={{
          once: true
        }}
      >

        <span className="section-tag">
          CULTURA Y TRADICIÓN
        </span>

        <h2>
          Conoce a nuestros
          artesanos
        </h2>

        <p>
          Cada pieza artesanal cuenta
          una historia única transmitida
          de generación en generación.
          Nuestros artesanos preservan
          técnicas tradicionales que
          representan la identidad cultural
          de Ate y del Perú.
        </p>

        <button>
          Descubrir más
        </button>

      </motion.div>

    </section>
  );
}

export default ArtisanSection;