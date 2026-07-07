import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getCategorias }  from "../services/categoriasService";
import { getProductos }   from "../services/productosService";
import { getArtesanos }   from "../services/artesanosService";
import { haySesionActiva } from "../services/authService";

// ─────────────────────────────────────────────────────────
// CONTEXTO GLOBAL DEL ADMIN
//
// Carga las 3 entidades UNA SOLA VEZ cuando el admin entra
// al panel, y las comparte entre todas las pestañas sin
// volver a pedir al servidor cada vez que cambias de pestaña.
//
// USO en cualquier componente del admin:
//   const { categorias, productos, artesanos, recargar } = useAdminData();
//
// Cuando creas/editas/eliminas algo, llama a recargar("productos")
// para actualizar solo ese recurso sin recargar los otros dos.
// ─────────────────────────────────────────────────────────

const AdminDataContext = createContext(null);

export function AdminDataProvider({ children }) {

  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos]   = useState([]);
  const [artesanos, setArtesanos]   = useState([]);

  // Estado de carga por recurso — así cada sección muestra
  // solo SU propio spinner, no uno global que bloquea todo
  const [cargando, setCargando] = useState({
    categorias: false,
    productos:  false,
    artesanos:  false,
  });

  // Carga inicial — se dispara una sola vez al montar el provider
  useEffect(() => {
    if (!haySesionActiva()) return;
    cargarTodo();
  }, []);

  // Carga los 3 recursos en secuencia — evita errores de conexión
  // simultánea que ocurren con XAMPP/Apache en Windows cuando
  // llegan múltiples peticiones a PostgreSQL al mismo tiempo
  async function cargarTodo() {
    setCargando({ categorias: true, productos: true, artesanos: true });

    try {
      const cats  = await getCategorias();
      setCategorias(cats);
      setCargando(prev => ({ ...prev, categorias: false }));

      const prods = await getProductos();
      setProductos(prods);
      setCargando(prev => ({ ...prev, productos: false }));

      const arts  = await getArtesanos();
      setArtesanos(arts);
      setCargando(prev => ({ ...prev, artesanos: false }));

    } catch (err) {
      console.error("Error cargando datos del admin:", err);
      setCargando({ categorias: false, productos: false, artesanos: false });
    }
  }

  // Recarga SOLO el recurso que cambió — sin tocar los demás
  const recargar = useCallback(async (recurso) => {
    setCargando((prev) => ({ ...prev, [recurso]: true }));

    try {
      if (recurso === "categorias") {
        const data = await getCategorias();
        setCategorias(data);
      } else if (recurso === "productos") {
        const data = await getProductos();
        setProductos(data);
      } else if (recurso === "artesanos") {
        const data = await getArtesanos();
        setArtesanos(data);
      }
    } finally {
      setCargando((prev) => ({ ...prev, [recurso]: false }));
    }
  }, []);

  return (
    <AdminDataContext.Provider value={{
      categorias,
      productos,
      artesanos,
      cargando,
      recargar,
    }}>
      {children}
    </AdminDataContext.Provider>
  );
}

// Hook para usar el contexto fácilmente en cualquier componente
export function useAdminData() {
  const ctx = useContext(AdminDataContext);
  if (!ctx) throw new Error("useAdminData debe usarse dentro de AdminDataProvider");
  return ctx;
}