import { useState } from "react";
import { NavLink, useNavigate, Outlet } from "react-router-dom";
import { cerrarSesion, obtenerUsuarioActual } from "../../services/authService";
import { AdminDataProvider } from "../../context/AdminDataContext";
import { IconLogout } from "../../components/Icons";
import "../../styles/adminLayout.css";

const ADMIN_MENU = [
  { label: "Dashboard",   path: "/admin/dashboard"  },
  { label: "Productos",   path: "/admin/productos"  },
  { label: "Categorías",  path: "/admin/categorias" },
  { label: "Artesanos",   path: "/admin/artesanos"  },
  { label: "Carrusel",    path: "/admin/carrusel"   },
];

function AdminLayout() {

  const navigate      = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const usuarioActual = obtenerUsuarioActual();

  function handleLogout() {
    cerrarSesion();
    navigate("/admin");
  }

  return (
    // AdminDataProvider envuelve todo el admin — carga los datos
    // una sola vez y los comparte entre todas las pestañas
    <AdminDataProvider>
      <div className="admin-layout">

        <header className="admin-header">

          <div className="admin-header-left">
            <img src="/logoate.PNG" alt="Logo Ate" className="admin-header-logo" />
            <span className="admin-header-title">Panel Admin</span>
          </div>

          <nav className={`admin-nav ${menuOpen ? "admin-nav--open" : ""}`}>
            {ADMIN_MENU.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  isActive ? "admin-nav-link admin-nav-link--active" : "admin-nav-link"
                }
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="admin-header-right">
            {usuarioActual && (
              <span className="admin-header-usuario">
                {usuarioActual.nombre_completo || usuarioActual.usuario}
              </span>
            )}
            <button className="admin-logout-btn" onClick={handleLogout}>
              <IconLogout size={15} color="currentColor" /> Cerrar sesión
            </button>
            <div className="admin-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>

        </header>

        <main className="admin-content">
          <Outlet />
        </main>

      </div>
    </AdminDataProvider>
  );
}

export default AdminLayout;