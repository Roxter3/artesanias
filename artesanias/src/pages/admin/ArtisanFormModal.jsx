import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getCategorias } from "../../services/categoriasService";
import { subirFotoArtesano, eliminarFotoArtesano } from "../../services/fotosService";
import ImageInput from "./ImageInput";
import GaleriaFotos from "./GaleriaFotos";
import "../../styles/adminModal.css";

const ARTESANO_VACIO = {
  nombre: "",
  apellidos: "",
  celular: "",
  correo: "",
  direccion: "",
  especialidad: "",
  descripcion: "",
  rna: "",
  redesSociales: {
    facebook: "",
    instagram: "",
    tiktok: "",
  },
  fotoPresentacion: "",
};

const CAMPOS_OBLIGATORIOS = ["nombre", "apellidos", "celular", "fotoPresentacion"];

function ArtisanFormModal({ open, onClose, onSave, artesano }) {

  const [form, setForm]             = useState(ARTESANO_VACIO);
  const [errores, setErrores]       = useState({});
  const [categorias, setCategorias] = useState([]);
  const [fotosGaleria, setFotosGaleria] = useState([]);

  useEffect(() => {
    getCategorias().then(setCategorias);
  }, []);

  useEffect(() => {
    if (artesano) {
      setForm({
        ...artesano,
        redesSociales: {
          facebook:  artesano.facebook  || artesano.redesSociales?.facebook  || "",
          instagram: artesano.instagram || artesano.redesSociales?.instagram || "",
          tiktok:    artesano.tiktok    || artesano.redesSociales?.tiktok    || "",
        },
      });
      // Carga las fotos de galería existentes del artesano
      // El backend devuelve "fotos_galeria" que camelCase convierte a "fotosGaleria"
      setFotosGaleria(artesano.fotosGaleria || artesano.fotos_galeria || []);
    } else {
      setForm(ARTESANO_VACIO);
      setFotosGaleria([]);
    }
    setErrores({});
  }, [artesano, open]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // Solo permite dígitos en campos de teléfono
  function handleTelefonoChange(e) {
    const { name, value } = e.target;
    const soloNumeros = value.replace(/\D/g, "").slice(0, 9); // máx 9 dígitos
    setForm((prev) => ({ ...prev, [name]: soloNumeros }));
  }

  function handleRedSocialChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      redesSociales: { ...prev.redesSociales, [name]: value || null },
    }));
  }

  function handleFotoChange(value) {
    setForm((prev) => ({ ...prev, fotoPresentacion: value }));
  }

  function validar() {
    const nuevosErrores = {};
    CAMPOS_OBLIGATORIOS.forEach((campo) => {
      if (!form[campo] || form[campo].toString().trim() === "") {
        nuevosErrores[campo] = "Este campo es obligatorio";
      }
    });
    // Celular debe tener exactamente 9 dígitos
    if (form.celular && form.celular.length !== 9) {
      nuevosErrores.celular = "El celular debe tener 9 dígitos";
    }
    return nuevosErrores;
  }

  function handleSubmit(e) {
    e.preventDefault();

    const nuevosErrores = validar();
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    // El WhatsApp se construye automáticamente con código de Perú
    const { redesSociales, ...restoForm } = form;
    const datosParaEnviar = {
      ...restoForm,
      // Agrega automáticamente el código de Perú +51
      whatsapp:  form.celular ? `51${form.celular}` : null,
      facebook:  redesSociales.facebook  || null,
      instagram: redesSociales.instagram || null,
      tiktok:    redesSociales.tiktok    || null,
    };

    onSave(datosParaEnviar);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="admin-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="admin-modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{    opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
          >

            <div className="admin-modal-header">
              <h2>{artesano ? "Editar artesano" : "Nuevo artesano"}</h2>
              <button className="admin-modal-close" onClick={onClose}>✕</button>
            </div>

            <form className="admin-modal-form" onSubmit={handleSubmit}>

              {/* Nombre y apellidos */}
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Nombres *</label>
                  <input
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    placeholder="María Elena"
                    className={errores.nombre ? "admin-input-error" : ""}
                  />
                  {errores.nombre && <span className="admin-error-text">{errores.nombre}</span>}
                </div>
                <div className="admin-form-group">
                  <label>Apellidos *</label>
                  <input
                    name="apellidos"
                    value={form.apellidos}
                    onChange={handleChange}
                    placeholder="Quispe Huanca"
                    className={errores.apellidos ? "admin-input-error" : ""}
                  />
                  {errores.apellidos && <span className="admin-error-text">{errores.apellidos}</span>}
                </div>
              </div>

              {/* Especialidad */}
              <div className="admin-form-group">
                <label>Especialidad artesanal *</label>
                <select name="especialidad" value={form.especialidad} onChange={handleChange}>
                  <option value="">Selecciona una especialidad</option>
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.nombre}>{cat.nombre}</option>
                  ))}
                </select>
                {categorias.length === 0 && (
                  <span className="admin-field-hint">
                    Ve a "Categorías" para crear una especialidad primero.
                  </span>
                )}
              </div>

              {/* Celular — solo números, máx 9 dígitos */}
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Celular * (9 dígitos)</label>
                  <div className="admin-input-prefix-wrapper">
                    <span className="admin-input-prefix">+51</span>
                    <input
                      name="celular"
                      value={form.celular}
                      onChange={handleTelefonoChange}
                      placeholder="987654321"
                      inputMode="numeric"
                      maxLength={9}
                      className={errores.celular ? "admin-input-error admin-input-with-prefix" : "admin-input-with-prefix"}
                    />
                  </div>
                  {errores.celular && <span className="admin-error-text">{errores.celular}</span>}
                  <span className="admin-field-hint">
                    El WhatsApp se genera automáticamente con este número.
                  </span>
                </div>

                <div className="admin-form-group">
                  <label>Correo electrónico</label>
                  <input
                    type="email"
                    name="correo"
                    value={form.correo}
                    onChange={handleChange}
                    placeholder="correo@ejemplo.com"
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label>Dirección referencial</label>
                <input
                  name="direccion"
                  value={form.direccion}
                  onChange={handleChange}
                  placeholder="Av. ejemplo 123, Ate"
                />
              </div>

              {/* RNA */}
              <div className="admin-form-group">
                <label>Registro Nacional del Artesano (RNA)</label>
                <input
                  name="rna"
                  value={form.rna}
                  onChange={handleChange}
                  placeholder="RNA-2024-00000"
                />
              </div>

              {/* Descripción */}
              <div className="admin-form-group">
                <label>Historia / descripción</label>
                <textarea
                  name="descripcion"
                  value={form.descripcion}
                  onChange={handleChange}
                  placeholder="Años de experiencia, ferias, exposiciones..."
                  rows={4}
                />
              </div>

              {/* Redes sociales */}
              <h3 className="admin-form-subtitle">Redes sociales</h3>

              <div className="admin-form-group">
                <label>Facebook</label>
                <input
                  name="facebook"
                  value={form.redesSociales.facebook || ""}
                  onChange={handleRedSocialChange}
                  placeholder="https://facebook.com/..."
                />
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Instagram</label>
                  <input
                    name="instagram"
                    value={form.redesSociales.instagram || ""}
                    onChange={handleRedSocialChange}
                    placeholder="https://instagram.com/..."
                  />
                </div>
                <div className="admin-form-group">
                  <label>TikTok</label>
                  <input
                    name="tiktok"
                    value={form.redesSociales.tiktok || ""}
                    onChange={handleRedSocialChange}
                    placeholder="https://tiktok.com/@..."
                  />
                </div>
              </div>

              {/* Imágenes */}
              <h3 className="admin-form-subtitle">Imágenes</h3>

              <ImageInput
                label="Foto de presentación *"
                value={form.fotoPresentacion}
                onChange={handleFotoChange}
              />
              {errores.fotoPresentacion && (
                <span className="admin-error-text">{errores.fotoPresentacion}</span>
              )}

              {/* Galería de fotos adicionales — solo visible al editar */}
              {artesano?.id && (
                <>
                  <h3 className="admin-form-subtitle">Galería de fotos</h3>
                  <p className="admin-field-hint">
                    Fotos del taller, proceso de trabajo, ferias, etc.
                  </p>
                  <GaleriaFotos
                    fotos={fotosGaleria}
                    onSubir={async (file) => {
                      const nueva = await subirFotoArtesano(artesano.id, file);
                      setFotosGaleria((prev) => [...prev, nueva]);
                    }}
                    onEliminar={async (fotoId) => {
                      await eliminarFotoArtesano(fotoId);
                      setFotosGaleria((prev) => prev.filter(f => f.id !== fotoId));
                    }}
                    limite={8}
                  />
                </>
              )}

              {/* Botones */}
              <div className="admin-modal-actions">
                <button type="button" className="admin-btn-secondary" onClick={onClose}>
                  Cancelar
                </button>
                <button type="submit" className="admin-btn-primary">
                  {artesano ? "Guardar cambios" : "Crear artesano"}
                </button>
              </div>

            </form>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ArtisanFormModal;