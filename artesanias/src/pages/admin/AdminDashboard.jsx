import { useNavigate } from "react-router-dom";
import { useAdminData } from "../../context/AdminDataContext";
import { obtenerUsuarioActual } from "../../services/authService";
import { IconPackagePlus, IconUserRoundPlus, IconCategoryPlus, IconPackage, IconCategory, IconUserRound } from "../../components/Icons";
import "../../styles/adminDashboard.css";

// Fecha en español para la píldora del header
function fechaHoy() {
  return new Date().toLocaleDateString("es-PE", {
    weekday: "long",
    day:     "numeric",
    month:   "long",
    year:    "numeric",
  });
}

// Capitaliza la primera letra
function cap(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
}

function AdminDashboard() {

  const navigate      = useNavigate();
  const usuario       = obtenerUsuarioActual();
  const { productos, artesanos, categorias, cargando } = useAdminData();

  // Nombre de saludo — usa el primer nombre del campo nombre_completo o usuario
  const nombreSaludo = usuario
    ? (usuario.nombre_completo || usuario.usuario).split(" ")[0]
    : "Admin";

  // ── Últimos 4 productos agregados (los más recientes vienen primero del backend) ──
  const ultimosProductos = productos.slice(0, 4);

  // ── Productos por categoría ──
  const productosPorCategoria = categorias.map((cat) => ({
    nombre: cat.nombre,
    total:  productos.filter(
      (p) => parseInt(p.categoriaId) === parseInt(cat.id)
    ).length,
  })).sort((a, b) => b.total - a.total);

  const maxProductos = productosPorCategoria[0]?.total || 1;

  // ── Artesanos con más productos ──
  const artesanosConProductos = artesanos
    .map((a) => ({
      ...a,
      totalProductos: productos.filter(
        (p) => parseInt(p.artesanoId) === parseInt(a.id)
      ).length,
    }))
    .sort((a, b) => b.totalProductos - a.totalProductos)
    .slice(0, 6);

  // ── Alertas dinámicas ──
  const sinFoto = artesanos.filter((a) => !a.fotoPresentacion).length;

  return (
    <div className="dash-wrap">

      {/* ── HEADER ── */}
      <div className="dash-header">
        <div>
          <h1>Hola, {nombreSaludo} 👋</h1>
          <p>Esto es lo que está pasando en Descubre Ate hoy</p>
        </div>
        <span className="dash-date-pill">{cap(fechaHoy())}</span>
      </div>

      {/* ── STAT CARDS ── */}
      <div className="stat-grid">

        <div className="stat-card accent">
          <span className="stat-icon"><IconPackage size={22} color="#FFC400" /></span>
          <span className="stat-number">
            {cargando.productos ? "…" : productos.length}
          </span>
          <span className="stat-label">Productos registrados</span>
          <span className="stat-trend trend-up">en el catálogo</span>
        </div>

        <div className="stat-card">
          <span className="stat-icon"><IconUserRound size={22} color="#4A4A4A" /></span>
          <span className="stat-number">
            {cargando.artesanos ? "…" : artesanos.length}
          </span>
          <span className="stat-label">Artesanos registrados</span>
          <span className="stat-trend trend-flat">perfiles activos</span>
        </div>

        <div className="stat-card">
          <span className="stat-icon"><IconCategory size={22} color="#4A4A4A" /></span>
          <span className="stat-number">
            {cargando.categorias ? "…" : categorias.length}
          </span>
          <span className="stat-label">Categorías activas</span>
          <span className="stat-trend trend-flat">líneas artesanales</span>
        </div>

      </div>

      {/* ── ACCIONES RÁPIDAS ── */}
      <div className="quick-actions">
        <button className="qa-btn primary" onClick={() => navigate("/admin/productos")}>
          <IconPackagePlus size={15} color="currentColor" /> Nuevo producto
        </button>
        <button className="qa-btn" onClick={() => navigate("/admin/artesanos")}>
          <IconUserRoundPlus size={15} color="currentColor" /> Nuevo artesano
        </button>
        <button className="qa-btn" onClick={() => navigate("/admin/categorias")}>
          <IconCategoryPlus size={15} color="currentColor" /> Nueva categoría
        </button>
      </div>

      {/* ── GRID PRINCIPAL ── */}
      <div className="main-grid">

        {/* Últimos productos */}
        <div className="dash-panel">
          <div className="dash-panel-header">
            <h2>Últimos productos agregados</h2>
            <button className="dash-panel-link" onClick={() => navigate("/admin/productos")}>
              Ver todos →
            </button>
          </div>

          {ultimosProductos.length === 0 ? (
            <p style={{ color: "var(--gray-soft)", fontSize: "0.9rem" }}>
              No hay productos registrados aún.
            </p>
          ) : (
            ultimosProductos.map((p, idx) => {
              const artesano = artesanos.find(
                (a) => parseInt(a.id) === parseInt(p.artesanoId)
              );
              return (
                <div className="recent-item" key={p.id}>
                  <img
                    src={p.image}
                    alt={p.title}
                    className="recent-thumb"
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                  <div className="recent-info">
                    <div className="recent-title">
                      {p.title}
                      {idx === 0 && <span className="badge-new">Nuevo</span>}
                    </div>
                    <div className="recent-sub">
                      {p.categoriaNombre || "—"} ·{" "}
                      {artesano ? `${artesano.nombre} ${artesano.apellidos}` : "—"}
                    </div>
                  </div>
                  <div className="recent-price">
                    S/ {Number(p.price).toFixed(2)}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Productos por categoría */}
        <div className="dash-panel">
          <div className="dash-panel-header">
            <h2>Productos por categoría</h2>
            <button className="dash-panel-link" onClick={() => navigate("/admin/categorias")}>
              Gestionar →
            </button>
          </div>

          {productosPorCategoria.length === 0 ? (
            <p style={{ color: "var(--gray-soft)", fontSize: "0.9rem" }}>
              No hay categorías registradas.
            </p>
          ) : (
            productosPorCategoria.map((cat) => (
              <div className="cat-bar-row" key={cat.nombre}>
                <div className="cat-bar-label">
                  <span>{cat.nombre}</span>
                  <span>{cat.total}</span>
                </div>
                <div className="cat-bar-track">
                  <div
                    className="cat-bar-fill"
                    style={{
                      width: `${maxProductos > 0 ? (cat.total / maxProductos) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            ))
          )}
        </div>

      </div>

      {/* ── ALERTAS ── */}
      {sinFoto > 0 && (
        <div className="dash-panel">
          <div className="dash-panel-header">
            <h2>Pendientes por revisar</h2>
          </div>

          <div className="alert-item warn">
            <span className="alert-icon">🖼️</span>
            <div className="alert-text">
              <div className="alert-title">
                {sinFoto} artesano{sinFoto > 1 ? "s" : ""} sin foto de presentación
              </div>
              <div className="alert-sub">
                Su perfil se ve incompleto en la página pública de artesanos.
              </div>
            </div>
            <button className="alert-link" onClick={() => navigate("/admin/artesanos")}>
              Revisar →
            </button>
          </div>
        </div>
      )}

      {/* ── ARTESANOS CON MÁS PRODUCTOS ── */}
      {artesanosConProductos.length > 0 && (
        <div className="dash-panel">
          <div className="dash-panel-header">
            <h2>Artesanos con más productos</h2>
            <button className="dash-panel-link" onClick={() => navigate("/admin/artesanos")}>
              Ver todos →
            </button>
          </div>

          <div className="artisan-strip">
            {artesanosConProductos.map((a) => (
              <div
                key={a.id}
                className="artisan-chip"
                onClick={() => navigate("/admin/artesanos")}
              >
                <img
                  src={a.fotoPresentacion || ""}
                  alt={a.nombre}
                  className="artisan-avatar"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
                <div className="artisan-name">{a.nombre} {a.apellidos?.split(" ")[0]}</div>
                <div className="artisan-count">{a.totalProductos} productos</div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

export default AdminDashboard;