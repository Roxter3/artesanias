import { useState, useEffect } from "react";
import { getArtesanos } from "../services/artesanosService";
import ArtisanCard from "./ArtisanCard";
import "../styles/artisanGrid.css";

function ArtisanGrid() {

  const [artesanos, setArtesanos] = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    getArtesanos().then((data) => {
      setArtesanos(data);
      setLoading(false);
    });
  }, []);

  return (
    <section className="artisan-grid-section">

      <div className="artisan-grid-header">
        <h1>Artesanos</h1>
      </div>

      {loading ? (
        <div className="artisan-loading">Cargando artesanos...</div>
      ) : artesanos.length === 0 ? (
        <div className="artisan-empty">No hay artesanos registrados aún.</div>
      ) : (
        <div className="artisan-grid">
          {artesanos.map((artisan) => (
            <ArtisanCard key={artisan.id} artisan={artisan} />
          ))}
        </div>
      )}

    </section>
  );
}

export default ArtisanGrid;