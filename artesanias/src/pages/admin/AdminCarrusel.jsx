import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { getCarrusel, actualizarSlot, subirImagenCarrusel } from "../../services/carruselService";
import "../../styles/adminCarrusel.css";

const TITULOS_DEFAULT = ["Imagen 1", "Imagen 2", "Imagen 3"];

function AdminCarrusel() {

  const [slots, setSlots]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [guardando, setGuardando] = useState(null); // índice del slot que se está guardando
  const [error, setError]       = useState("");
  const fileRefs                = useRef([]);

  useEffect(() => {
    getCarrusel().then((data) => {
      setSlots(data);
      setLoading(false);
    });
  }, []);

  async function handleFile(e, posicion) {
    const file = e.target.files[0];
    if (!file) return;

    setError("");
    setGuardando(posicion);

    try {
      const url = await subirImagenCarrusel(file);
      const slot = slots.find(s => s.posicion === posicion);
      await actualizarSlot(posicion, url, slot?.titulo || "");
      const actualizados = await getCarrusel();
      setSlots(actualizados);
    } catch (err) {
      setError(err.message);
    } finally {
      setGuardando(null);
      if (fileRefs.current[posicion]) fileRefs.current[posicion].value = "";
    }
  }

  async function handleTitulo(posicion, nuevoTitulo) {
    setSlots(prev => prev.map(s =>
      s.posicion === posicion ? { ...s, titulo: nuevoTitulo } : s
    ));
  }

  async function guardarTitulo(posicion) {
    const slot = slots.find(s => s.posicion === posicion);
    if (!slot?.url) return;
    setGuardando(posicion);
    try {
      await actualizarSlot(posicion, slot.url, slot.titulo || "");
    } catch (err) {
      setError(err.message);
    } finally {
      setGuardando(null);
    }
  }

  return (
    <div className="admin-carrusel">

      <div className="admin-page-header">
        <div>
          <h1>Carrusel del Inicio</h1>
          <p>Edita las 3 imágenes que aparecen en la página de inicio</p>
        </div>
      </div>

      {error && <p className="admin-carrusel-error">{error}</p>}

      {loading ? (
        <p className="admin-loading">Cargando carrusel...</p>
      ) : (
        <div className="carrusel-grid">
          {slots.map((slot) => (
            <motion.div
              key={slot.posicion}
              className="carrusel-slot"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: slot.posicion * 0.1 }}
            >
              {/* Número de slot */}
              <div className="carrusel-slot-num">
                Imagen {slot.posicion}
              </div>

              {/* Preview de la imagen actual */}
              <div className="carrusel-slot-preview">
                {slot.url ? (
                  <img src={slot.url} alt={`Slot ${slot.posicion}`} />
                ) : (
                  <div className="carrusel-slot-empty">Sin imagen</div>
                )}
                {guardando === slot.posicion && (
                  <div className="carrusel-slot-overlay">Guardando...</div>
                )}
              </div>

              {/* Título opcional */}
              <div className="carrusel-slot-field">
                <label>Título (opcional)</label>
                <div className="carrusel-titulo-row">
                  <input
                    type="text"
                    value={slot.titulo || ""}
                    placeholder={TITULOS_DEFAULT[slot.posicion - 1]}
                    onChange={(e) => handleTitulo(slot.posicion, e.target.value)}
                    onBlur={() => guardarTitulo(slot.posicion)}
                  />
                </div>
              </div>

              {/* Botón cambiar imagen */}
              <label className="carrusel-upload-btn">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  ref={(el) => (fileRefs.current[slot.posicion] = el)}
                  onChange={(e) => handleFile(e, slot.posicion)}
                  disabled={guardando === slot.posicion}
                  style={{ display: "none" }}
                />
                {guardando === slot.posicion ? "⏳ Subiendo..." : "📁 Cambiar imagen"}
              </label>

            </motion.div>
          ))}
        </div>
      )}

      <div className="carrusel-hint">
        <p>💡 Las imágenes se actualizan en la página de inicio instantáneamente al guardarlas.</p>
        <p>Recomendamos imágenes horizontales de al menos 1400×800px para mejor calidad.</p>
      </div>

    </div>
  );
}

export default AdminCarrusel;