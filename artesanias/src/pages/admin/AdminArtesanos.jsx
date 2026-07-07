import { useState } from "react";
import { motion } from "framer-motion";
import { useAdminData } from "../../context/AdminDataContext";
import {
  crearArtesano,
  actualizarArtesano,
  eliminarArtesano,
  getArtesanoPorId,
} from "../../services/artesanosService";
import ArtisanFormModal from "./ArtisanFormModal";
import { IconEdit, IconTrash, IconUserRoundPlus } from "../../components/Icons";
import "../../styles/adminProductos.css";

function AdminArtesanos() {

  const { artesanos, cargando, recargar } = useAdminData();

  const [modalOpen, setModalOpen]           = useState(false);
  const [artesanoEditar, setArtesanoEditar] = useState(null);

  // Carga el artesano fresco del backend (con sus fotos de galería)
  // antes de abrir el modal — evita mostrar datos desactualizados del caché
  async function abrirEditar(artesano) {
    try {
      const fresco = await getArtesanoPorId(artesano.id);
      setArtesanoEditar(fresco);
    } catch {
      setArtesanoEditar(artesano); // fallback al caché si falla
    }
    setModalOpen(true);
  }

  async function handleSave(form) {
    try {
      if (artesanoEditar) {
        await actualizarArtesano(artesanoEditar.id, form);
      } else {
        await crearArtesano(form);
      }
      setModalOpen(false);
      recargar("artesanos");
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDelete(id) {
    const confirmar = window.confirm("¿Seguro que quieres eliminar este artesano?");
    if (!confirmar) return;
    try {
      await eliminarArtesano(id);
      recargar("artesanos");
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="admin-productos">

      <div className="admin-page-header">
        <div>
          <h1>Artesanos</h1>
          <p>Gestiona la información de los artesanos registrados</p>
        </div>
        <button className="admin-btn-primary" onClick={() => { setArtesanoEditar(null); setModalOpen(true); }}>
          <IconUserRoundPlus size={16} color="white" /> Nuevo artesano
        </button>
      </div>

      {cargando.artesanos ? (
        <p className="admin-loading">Cargando artesanos...</p>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Foto</th>
                <th>Nombre completo</th>
                <th>Especialidad</th>
                <th>Celular</th>
                <th>RNA</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {artesanos.map((a) => (
                <motion.tr
                  key={a.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td>
                    <img
                      src={a.fotoPresentacion}
                      alt={a.nombre}
                      className="admin-table-img admin-table-img--round"
                    />
                  </td>
                  <td className="admin-table-title">{a.nombre} {a.apellidos}</td>
                  <td><span className="admin-table-badge">{a.especialidad}</span></td>
                  <td>{a.celular}</td>
                  <td>{a.rna}</td>
                  <td>
                    <div className="admin-table-actions">
                      <button
                        className="admin-action-btn admin-action-edit"
                        onClick={() => abrirEditar(a)}
                      >
                        <IconEdit size={14} color="white" /> Editar
                      </button>
                      <button
                        className="admin-action-btn admin-action-delete"
                        onClick={() => handleDelete(a.id)}
                      >
                        <IconTrash size={14} color="white" /> Eliminar
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {artesanos.length === 0 && (
            <p className="admin-empty">No hay artesanos registrados todavía.</p>
          )}
        </div>
      )}

      <ArtisanFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        artesano={artesanoEditar}
      />

    </div>
  );
}

export default AdminArtesanos;