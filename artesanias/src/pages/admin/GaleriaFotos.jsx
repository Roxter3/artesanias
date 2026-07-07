import { useState, useRef } from "react";
import "../../styles/galeriaFotos.css";

// ─────────────────────────────────────────────────────────
// COMPONENTE: gestión de fotos adicionales con drag & drop
//
// Props:
//   fotos      → array { id, url } de fotos ya guardadas
//   onSubir    → async (file) → sube una foto al backend
//   onEliminar → async (fotoId) → elimina una foto
//   limite     → máximo de fotos (default 6)
// ─────────────────────────────────────────────────────────

function GaleriaFotos({ fotos = [], onSubir, onEliminar, limite = 6 }) {

  const [subiendo, setSubiendo]   = useState(false);
  const [dragOver, setDragOver]   = useState(false);
  const [error, setError]         = useState("");
  const inputRef                  = useRef(null);

  // Procesa uno o varios archivos
  async function procesarArchivos(archivos) {
    const permitidos = Array.from(archivos).filter(f =>
      f.type.startsWith("image/")
    );

    if (permitidos.length === 0) {
      setError("Solo se permiten archivos de imagen (JPG, PNG, WEBP).");
      return;
    }

    const disponibles = limite - fotos.length;
    if (disponibles <= 0) {
      setError(`Ya alcanzaste el límite de ${limite} fotos.`);
      return;
    }

    const aSubir = permitidos.slice(0, disponibles);
    if (permitidos.length > disponibles) {
      setError(`Solo se agregarán ${disponibles} foto(s) — límite alcanzado.`);
    } else {
      setError("");
    }

    setSubiendo(true);
    try {
      // Sube las fotos una por una en secuencia
      for (const file of aSubir) {
        await onSubir(file);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubiendo(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleFileInput(e) {
    procesarArchivos(e.target.files);
  }

  function handleDragOver(e) {
    e.preventDefault();
    setDragOver(true);
  }

  function handleDragLeave() {
    setDragOver(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    procesarArchivos(e.dataTransfer.files);
  }

  async function handleEliminar(fotoId) {
    const confirmar = window.confirm("¿Eliminar esta foto?");
    if (!confirmar) return;
    try {
      await onEliminar(fotoId);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="galeria-admin">

      {/* Grid de fotos existentes */}
      {fotos.length > 0 && (
        <div className="galeria-admin-grid">
          {fotos.map((foto) => (
            <div key={foto.id} className="galeria-admin-item">
              <img src={foto.url} alt="Foto" />
              <button
                type="button"
                className="galeria-admin-remove"
                onClick={() => handleEliminar(foto.id)}
                title="Eliminar foto"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Zona de drop — solo visible si no se llegó al límite */}
      {fotos.length < limite && (
        <label
          className={`galeria-dropzone ${dragOver ? "galeria-dropzone--over" : ""} ${subiendo ? "galeria-dropzone--loading" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleFileInput}
            disabled={subiendo}
            style={{ display: "none" }}
          />

          {subiendo ? (
            <>
              <span className="galeria-dropzone-icon">⏳</span>
              <span className="galeria-dropzone-text">Subiendo fotos...</span>
            </>
          ) : (
            <>
              <span className="galeria-dropzone-icon">📸</span>
              <span className="galeria-dropzone-text">
                Arrastra fotos aquí o haz clic para seleccionar
              </span>
              <span className="galeria-dropzone-hint">
                JPG, PNG, WEBP — máx. 5MB por foto
              </span>
            </>
          )}
        </label>
      )}

      {error && <p className="galeria-admin-error">{error}</p>}
      <p className="galeria-admin-hint">
        {fotos.length} / {limite} fotos adicionales
      </p>

    </div>
  );
}

export default GaleriaFotos;