import { useState, useRef } from "react";
import { BASE_URL, getAuthHeaders } from "../../services/api";
import "../../styles/adminImageInput.css";

// ─────────────────────────────────────────────────────────
// COMPONENTE DE SUBIDA DE IMAGEN
//
// Solo acepta archivos subidos desde el dispositivo.
// Los archivos se envían al backend PHP, que los guarda en
// /media/ y devuelve la URL corta para guardar en la BD.
// Esto garantiza que las imágenes siempre estén disponibles
// sin depender de links externos que pueden caer o cambiar.
// ─────────────────────────────────────────────────────────

function ImageInput({ label, value, onChange }) {

  const [subiendo, setSubiendo]       = useState(false);
  const [errorSubida, setErrorSubida] = useState("");
  const [imgError, setImgError]       = useState(false);
  const fileInputRef                  = useRef(null);

  async function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorSubida("Selecciona un archivo de imagen válido.");
      return;
    }

    const limiteBytes = 5 * 1024 * 1024; // 5MB
    if (file.size > limiteBytes) {
      setErrorSubida("El archivo supera el límite de 5MB.");
      return;
    }

    setErrorSubida("");
    setSubiendo(true);

    try {
      const formData = new FormData();
      formData.append("imagen", file);

      const headers = getAuthHeaders();
      delete headers["Content-Type"];

      const res = await fetch(`${BASE_URL}/uploads`, {
        method: "POST",
        headers,
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorSubida(data.error || "No se pudo subir la imagen.");
        return;
      }

      setImgError(false);
      onChange(data.datos.url);

    } catch (err) {
      setErrorSubida("Error de conexión al subir la imagen.");
    } finally {
      setSubiendo(false);
    }
  }

  function limpiarImagen() {
    onChange("");
    setImgError(false);
    setErrorSubida("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className="admin-image-input">

      <label className="admin-image-input-label">{label}</label>

      {/* Zona de subida */}
      <div className="admin-image-dropzone">

        <label className="admin-image-file-label">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="admin-image-file-hidden"
            disabled={subiendo}
          />
          <div className="admin-image-dropzone-inner">
            {subiendo ? (
              <>
                <span className="admin-image-dropzone-icon">⏳</span>
                <span className="admin-image-dropzone-text">Subiendo imagen...</span>
              </>
            ) : (
              <>
                <span className="admin-image-dropzone-icon">📁</span>
                <span className="admin-image-dropzone-text">
                  Haz clic para seleccionar una imagen
                </span>
                <span className="admin-image-dropzone-hint">
                  JPG, PNG, WEBP — máximo 5MB
                </span>
              </>
            )}
          </div>
        </label>

        {errorSubida && (
          <p className="admin-image-error">{errorSubida}</p>
        )}
      </div>

      {/* Preview compacto — solo cuando hay imagen válida cargada */}
      {value && !subiendo && !imgError && (
        <div className="admin-image-preview-wrapper">
          <img
            src={value}
            alt="Vista previa"
            className="admin-image-preview"
            onError={() => setImgError(true)}
          />
          <div className="admin-image-preview-info">
            <span className="admin-image-preview-ok">✓ Imagen cargada</span>
            <button
              type="button"
              className="admin-image-remove"
              onClick={limpiarImagen}
            >
              Quitar
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default ImageInput;