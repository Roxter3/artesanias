import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getCategorias } from "../../services/categoriasService";
import { subirFotoProducto, eliminarFotoProducto } from "../../services/fotosService";
import ImageInput from "./ImageInput";
import GaleriaFotos from "./GaleriaFotos";
import "../../styles/adminModal.css";

const PRODUCTO_VACIO = {
  title: "",
  categoriaId: "",
  price: "",
  description: "",
  image: "",
  background: "",
  artesanoId: "",
  caracteristicas: {
    tecnica: "",
    material: "",
    medidas: "",
  },
};

const CAMPOS_OBLIGATORIOS = ["title", "price", "artesanoId", "image", "categoriaId"];

function ProductFormModal({ open, onClose, onSave, producto, artesanos }) {

  const [form, setForm]             = useState(PRODUCTO_VACIO);
  const [errores, setErrores]       = useState({});
  const [categorias, setCategorias] = useState([]);
  const [fotosGaleria, setFotosGaleria] = useState([]);

  useEffect(() => {
    getCategorias().then(setCategorias);
  }, []);

  useEffect(() => {
    if (producto) {
      setForm({
        ...producto,
        caracteristicas: {
          tecnica:  producto.tecnica  || producto.caracteristicas?.tecnica  || "",
          material: producto.material || producto.caracteristicas?.material || "",
          medidas:  producto.medidas  || producto.caracteristicas?.medidas  || "",
        },
      });
      // Carga las fotos de galería existentes del producto
      // El backend las incluye en el campo "fotos" desde findConDetalles()
      setFotosGaleria(producto.fotos || []);
    } else {
      setForm(PRODUCTO_VACIO);
      setFotosGaleria([]);
    }
    setErrores({});
  }, [producto, open]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // Solo permite números y punto decimal en el precio
  function handlePriceChange(e) {
    const valor = e.target.value;
    // Acepta solo dígitos y un punto decimal
    if (valor === "" || /^\d*\.?\d{0,2}$/.test(valor)) {
      setForm((prev) => ({ ...prev, price: valor }));
    }
  }

  function handleCategoryChange(e) {
    const idElegido = e.target.value;
    const categoriaElegida = categorias.find((c) => c.id === parseInt(idElegido));

    setForm((prev) => ({
      ...prev,
      categoriaId: idElegido,
      background: categoriaElegida ? categoriaElegida.background : prev.background,
    }));
  }

  function handleCaracteristicaChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      caracteristicas: { ...prev.caracteristicas, [name]: value },
    }));
  }

  function handleImageChange(value) {
    setForm((prev) => ({ ...prev, image: value }));
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

    const { caracteristicas, ...restoForm } = form;
    const datosParaEnviar = {
      ...restoForm,
      price:       parseFloat(form.price),
      categoriaId: parseInt(form.categoriaId),
      artesanoId:  parseInt(form.artesanoId),
      tecnica:     caracteristicas.tecnica,
      material:    caracteristicas.material,
      medidas:     caracteristicas.medidas,
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
              <h2>{producto ? "Editar producto" : "Nuevo producto"}</h2>
              <button className="admin-modal-close" onClick={onClose}>✕</button>
            </div>

            <form className="admin-modal-form" onSubmit={handleSubmit}>

              <div className="admin-form-group">
                <label>Nombre del producto *</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Ej. Cerámica Andina"
                  className={errores.title ? "admin-input-error" : ""}
                />
                {errores.title && <span className="admin-error-text">{errores.title}</span>}
              </div>

              <div className="admin-form-row">

                <div className="admin-form-group">
                  <label>Línea artesanal *</label>
                  <select
                    name="categoriaId"
                    value={form.categoriaId}
                    onChange={handleCategoryChange}
                    className={errores.categoriaId ? "admin-input-error" : ""}
                  >
                    <option value="">Selecciona una categoría</option>
                    {categorias.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                    ))}
                  </select>
                  {errores.categoriaId && <span className="admin-error-text">{errores.categoriaId}</span>}
                  {categorias.length === 0 && (
                    <span className="admin-field-hint">
                      No hay categorías. Ve a "Categorías" para crear una.
                    </span>
                  )}
                </div>

                {/* Precio — solo acepta números */}
                <div className="admin-form-group">
                  <label>Precio (S/) *</label>
                  <input
                    name="price"
                    value={form.price}
                    onChange={handlePriceChange}
                    placeholder="150.00"
                    inputMode="decimal"
                    className={errores.price ? "admin-input-error" : ""}
                  />
                  {errores.price && <span className="admin-error-text">{errores.price}</span>}
                </div>

              </div>

              <div className="admin-form-group">
                <label>Artesano *</label>
                <select
                  name="artesanoId"
                  value={form.artesanoId}
                  onChange={handleChange}
                  className={errores.artesanoId ? "admin-input-error" : ""}
                >
                  <option value="">Selecciona un artesano</option>
                  {artesanos.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.nombre} {a.apellidos}
                    </option>
                  ))}
                </select>
                {errores.artesanoId && <span className="admin-error-text">{errores.artesanoId}</span>}
              </div>

              <div className="admin-form-group">
                <label>Descripción</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe el producto..."
                  rows={3}
                />
              </div>

              <ImageInput
                label="Imagen del producto *"
                value={form.image}
                onChange={handleImageChange}
              />
              {errores.image && <span className="admin-error-text">{errores.image}</span>}

              <div className="admin-form-group">
                <label>Fondo (se asigna automáticamente según la categoría)</label>
                <input
                  name="background"
                  value={form.background}
                  onChange={handleChange}
                  disabled
                />
                <span className="admin-field-hint">
                  Para cambiar este fondo, edítalo desde "Categorías".
                </span>
              </div>

              <h3 className="admin-form-subtitle">Características del producto</h3>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Técnica</label>
                  <input
                    name="tecnica"
                    value={form.caracteristicas.tecnica}
                    onChange={handleCaracteristicaChange}
                    placeholder="Modelado a mano"
                  />
                </div>
                <div className="admin-form-group">
                  <label>Material</label>
                  <input
                    name="material"
                    value={form.caracteristicas.material}
                    onChange={handleCaracteristicaChange}
                    placeholder="Arcilla cocida"
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label>Medidas</label>
                <input
                  name="medidas"
                  value={form.caracteristicas.medidas}
                  onChange={handleCaracteristicaChange}
                  placeholder="25 cm alto x 18 cm diámetro"
                />
              </div>

              {/* Galería de fotos adicionales — solo visible al editar */}
              {producto?.id && (
                <>
                  <h3 className="admin-form-subtitle">Fotos adicionales del producto</h3>
                  <p className="admin-field-hint">
                    Diferentes ángulos, detalles, proceso de creación, etc.
                  </p>
                  <GaleriaFotos
                    fotos={fotosGaleria}
                    onSubir={async (file) => {
                      const nueva = await subirFotoProducto(producto.id, file);
                      setFotosGaleria((prev) => [...prev, nueva]);
                    }}
                    onEliminar={async (fotoId) => {
                      await eliminarFotoProducto(fotoId);
                      setFotosGaleria((prev) => prev.filter(f => f.id !== fotoId));
                    }}
                    limite={4}
                  />
                </>
              )}

              <div className="admin-modal-actions">
                <button type="button" className="admin-btn-secondary" onClick={onClose}>
                  Cancelar
                </button>
                <button type="submit" className="admin-btn-primary">
                  {producto ? "Guardar cambios" : "Crear producto"}
                </button>
              </div>

            </form>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ProductFormModal;