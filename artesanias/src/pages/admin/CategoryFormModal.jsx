import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ImageInput from "./ImageInput";
import "../../styles/adminModal.css";

const CATEGORIA_VACIA = {
  nombre: "",
  background: "",
};

const CAMPOS_OBLIGATORIOS = ["nombre", "background"];

function CategoryFormModal({ open, onClose, onSave, categoria }) {

  const [form, setForm]       = useState(CATEGORIA_VACIA);
  const [errores, setErrores] = useState({});

  useEffect(() => {
    if (categoria) {
      setForm(categoria);
    } else {
      setForm(CATEGORIA_VACIA);
    }
    setErrores({});
  }, [categoria, open]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleBackgroundChange(value) {
    setForm((prev) => ({ ...prev, background: value }));
  }

  function validar() {
    const nuevosErrores = {};
    CAMPOS_OBLIGATORIOS.forEach((campo) => {
      if (!form[campo] || form[campo].toString().trim() === "") {
        nuevosErrores[campo] = "Este campo es obligatorio";
      }
    });
    return nuevosErrores;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const nuevosErrores = validar();
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }
    onSave(form);
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
              <h2>{categoria ? "Editar categoría" : "Nueva categoría"}</h2>
              <button className="admin-modal-close" onClick={onClose}>✕</button>
            </div>

            <form className="admin-modal-form" onSubmit={handleSubmit}>

              {/* Nombre */}
              <div className="admin-form-group">
                <label>Nombre de la categoría *</label>
                <input
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Ej. Cerámica y Alfarería"
                  className={errores.nombre ? "admin-input-error" : ""}
                />
                {errores.nombre && <span className="admin-error-text">{errores.nombre}</span>}
              </div>

              {/* Imagen de fondo */}
              <ImageInput
                label="Imagen de fondo *"
                value={form.background}
                onChange={handleBackgroundChange}
              />
              {errores.background && (
                <span className="admin-error-text">{errores.background}</span>
              )}
              <p className="admin-field-hint">
                Esta imagen se usa como fondo en la página de detalle de cada
                producto que pertenezca a esta categoría.
              </p>

              {/* Botones */}
              <div className="admin-modal-actions">
                <button type="button" className="admin-btn-secondary" onClick={onClose}>
                  Cancelar
                </button>
                <button type="submit" className="admin-btn-primary">
                  {categoria ? "Guardar cambios" : "Crear categoría"}
                </button>
              </div>

            </form>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default CategoryFormModal;