import { useState } from "react";
import { motion } from "framer-motion";
import { useAdminData } from "../../context/AdminDataContext";
import {
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
} from "../../services/categoriasService";
import CategoryFormModal from "./CategoryFormModal";
import { IconEdit, IconTrash, IconCategoryPlus } from "../../components/Icons";
import "../../styles/adminProductos.css";

function AdminCategorias() {

  const { categorias, productos, cargando, recargar } = useAdminData();

  const [modalOpen, setModalOpen]             = useState(false);
  const [categoriaEditar, setCategoriaEditar] = useState(null);

  function contarProductos(categoriaId) {
    return productos.filter(
      (p) => parseInt(p.categoriaId) === parseInt(categoriaId)
    ).length;
  }

  async function handleSave(form) {
    try {
      if (categoriaEditar) {
        await actualizarCategoria(categoriaEditar.id, form);
      } else {
        await crearCategoria(form);
      }
      setModalOpen(false);
      recargar("categorias");
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDelete(categoria) {
    const enUso = contarProductos(categoria.id);
    if (enUso > 0) {
      alert(`No se puede eliminar "${categoria.nombre}" porque tiene ${enUso} producto(s).`);
      return;
    }
    const confirmar = window.confirm(`¿Eliminar la categoría "${categoria.nombre}"?`);
    if (!confirmar) return;
    try {
      await eliminarCategoria(categoria.id);
      recargar("categorias");
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="admin-productos">

      <div className="admin-page-header">
        <div>
          <h1>Categorías</h1>
          <p>Gestiona las líneas artesanales y su imagen de fondo</p>
        </div>
        <button className="admin-btn-primary" onClick={() => { setCategoriaEditar(null); setModalOpen(true); }}>
          <IconCategoryPlus size={16} color="white" /> Nueva categoría
        </button>
      </div>

      {cargando.categorias ? (
        <p className="admin-loading">Cargando categorías...</p>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Fondo</th>
                <th>Nombre</th>
                <th>Productos</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categorias.map((cat) => (
                <motion.tr
                  key={cat.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td>
                    <img
                      src={cat.background}
                      alt={cat.nombre}
                      className="admin-table-img"
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                  </td>
                  <td className="admin-table-title">{cat.nombre}</td>
                  <td>
                    <span className="admin-table-badge">
                      {contarProductos(cat.id)} producto(s)
                    </span>
                  </td>
                  <td>
                    <div className="admin-table-actions">
                      <button
                        className="admin-action-btn admin-action-edit"
                        onClick={() => { setCategoriaEditar(cat); setModalOpen(true); }}
                      >
                        <IconEdit size={14} color="white" /> Editar
                      </button>
                      <button
                        className="admin-action-btn admin-action-delete"
                        onClick={() => handleDelete(cat)}
                      >
                        <IconTrash size={14} color="white" /> Eliminar
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {categorias.length === 0 && (
            <p className="admin-empty">No hay categorías registradas todavía.</p>
          )}
        </div>
      )}

      <CategoryFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        categoria={categoriaEditar}
      />

    </div>
  );
}

export default AdminCategorias;