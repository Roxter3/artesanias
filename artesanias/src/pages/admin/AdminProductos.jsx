import { useState } from "react";
import { motion } from "framer-motion";
import { useAdminData } from "../../context/AdminDataContext";
import {
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  getProductoPorId,
} from "../../services/productosService";
import ProductFormModal from "./ProductFormModal";
import { IconEdit, IconTrash, IconPackagePlus } from "../../components/Icons";
import "../../styles/adminProductos.css";

function AdminProductos() {

  // Datos ya cargados desde el contexto — sin espera adicional
  const { productos, artesanos, categorias, cargando, recargar } = useAdminData();

  const [modalOpen, setModalOpen]           = useState(false);
  const [productoEditar, setProductoEditar] = useState(null);

  // Carga el producto fresco del backend (con sus fotos de galería)
  // antes de abrir el modal — evita mostrar datos desactualizados del caché
  async function abrirEditar(producto) {
    try {
      const fresco = await getProductoPorId(producto.id);
      setProductoEditar(fresco);
    } catch {
      setProductoEditar(producto); // fallback al caché si falla
    }
    setModalOpen(true);
  }

  function nombreArtesano(artesanoId) {
    const a = artesanos.find((art) => art.id === parseInt(artesanoId));
    return a ? `${a.nombre} ${a.apellidos}` : "—";
  }

  function nombreCategoria(producto) {
    if (producto.categoriaNombre) return producto.categoriaNombre;
    const c = categorias.find((cat) => cat.id === parseInt(producto.categoriaId));
    return c ? c.nombre : "—";
  }

  async function handleSave(form) {
    try {
      if (productoEditar) {
        await actualizarProducto(productoEditar.id, form);
      } else {
        await crearProducto(form);
      }
      setModalOpen(false);
      // Recarga solo productos — categorías y artesanos no cambiaron
      recargar("productos");
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDelete(id) {
    const confirmar = window.confirm("¿Seguro que quieres eliminar este producto?");
    if (!confirmar) return;
    try {
      await eliminarProducto(id);
      recargar("productos");
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="admin-productos">

      <div className="admin-page-header">
        <div>
          <h1>Productos</h1>
          <p>Gestiona las artesanías publicadas en el sitio</p>
        </div>
        <button className="admin-btn-primary" onClick={() => { setProductoEditar(null); setModalOpen(true); }}>
          <IconPackagePlus size={16} color="white" /> Nuevo producto
        </button>
      </div>

      {cargando.productos ? (
        <p className="admin-loading">Cargando productos...</p>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Artesano</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => (
                <motion.tr
                  key={p.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td>
                    <img src={p.image} alt={p.title} className="admin-table-img" />
                  </td>
                  <td className="admin-table-title">{p.title}</td>
                  <td><span className="admin-table-badge">{nombreCategoria(p)}</span></td>
                  <td className="admin-table-price">S/ {Number(p.price).toFixed(2)}</td>
                  <td>{nombreArtesano(p.artesanoId)}</td>
                  <td>
                    <div className="admin-table-actions">
                      <button
                        className="admin-action-btn admin-action-edit"
                        onClick={() => abrirEditar(p)}
                      >
                        <IconEdit size={14} color="white" /> Editar
                      </button>
                      <button
                        className="admin-action-btn admin-action-delete"
                        onClick={() => handleDelete(p.id)}
                      >
                        <IconTrash size={14} color="white" /> Eliminar
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {productos.length === 0 && (
            <p className="admin-empty">No hay productos registrados todavía.</p>
          )}
        </div>
      )}

      <ProductFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        producto={productoEditar}
        artesanos={artesanos}
      />

    </div>
  );
}

export default AdminProductos;