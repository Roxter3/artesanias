import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/navbar.css";

const NAV_ITEMS = [
  { label: "Inicio",     path: "/",           scrollId: "inicio"     },
  { label: "Artesanías", path: "/artesanias",  scrollId: "artesanias" },
  { label: "Artesanos",  path: "/artesanos",   scrollId: null         },
];

// Qué ítem está activo según la URL actual (sin scroll)
function getActiveByPath(pathname) {
  if (pathname === "/artesanos" || pathname.startsWith("/artesanos/")) return 2;
  if (pathname === "/artesanias" || pathname.startsWith("/productos/"))  return 1;
  return 0;
}

function Navbar() {

  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === "/";

  const [menuOpen,  setMenuOpen]  = useState(false);
  const [activeIdx, setActiveIdx] = useState(() => getActiveByPath(location.pathname));
  const [indStyle,  setIndStyle]  = useState({ left: 0, width: 0 });

  const itemRefs   = useRef([]);
  const activeRef  = useRef(activeIdx); // ref para usar dentro del observer sin stale closure

  // ── Mueve el indicador al <li> del índice dado ──
  const moveIndicator = useCallback((idx) => {
    const li = itemRefs.current[idx];
    if (!li) return;
    const ul = li.closest("ul");
    if (!ul) return;
    const ulRect = ul.getBoundingClientRect();
    const liRect = li.getBoundingClientRect();
    setIndStyle({ left: liRect.left - ulRect.left, width: liRect.width });
  }, []);

  const activar = useCallback((idx) => {
    activeRef.current = idx;
    setActiveIdx(idx);
    requestAnimationFrame(() => requestAnimationFrame(() => moveIndicator(idx)));
  }, [moveIndicator]);

  // Inicializa el indicador al montar y cuando cambia la ruta
  useEffect(() => {
    const idx = getActiveByPath(location.pathname);
    activar(idx);
  }, [location.pathname, activar]);

  // ── IntersectionObserver solo en "/" ──
  // Detecta qué sección está visible y mueve el indicador suavemente
  useEffect(() => {
    if (!isHome) return;

    const secciones = [
      { id: "inicio",     idx: 0 },
      { id: "artesanias", idx: 1 },
    ];

    // rootMargin negativo: activa cuando la sección ocupa el centro de la pantalla
    // Así evita activarse por un pixel al hacer scroll
    const observerOpts = {
      root: null,
      rootMargin: "-40% 0px -40% 0px",
      threshold: 0,
    };

    const observers = secciones.map(({ id, idx }) => {
      const el = document.getElementById(id);
      if (!el) return null;

      const obs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          activar(idx);
        }
      }, observerOpts);

      obs.observe(el);
      return { obs, el };
    });

    return () => {
      observers.forEach((item) => {
        if (item) item.obs.unobserve(item.el);
      });
    };
  }, [isHome, activar]);

  // ── Click en un ítem ──
  function handleClick(item, idx) {
    setMenuOpen(false);

    // Artesanos — página separada, navegación directa
    if (item.path === "/artesanos") {
      navigate("/artesanos");
      return;
    }

    // Inicio y Artesanías — si ya estamos en "/", hace scroll
    if (isHome) {
      const el = document.getElementById(item.scrollId);
      if (el) el.scrollIntoView({ behavior: "smooth" });
      activar(idx);
      return;
    }

    // Si estamos en otra página, navega a "/" y luego hace scroll
    navigate("/");
    setTimeout(() => {
      const el = document.getElementById(item.scrollId);
      if (el) el.scrollIntoView({ behavior: "smooth" });
      activar(idx);
    }, 350);
  }

  return (
    <nav className="navbar">

      <div className="navbar-brand" onClick={() => navigate("/")}>
        <img src="/logoate.PNG" alt="Logo Ate" className="navbar-logo" />
      </div>

      <div className="nav-links-wrapper">
        <ul className={`nav-links ${menuOpen ? "active-menu" : ""}`}>
          {NAV_ITEMS.map((item, idx) => (
            <li
              key={item.label}
              ref={(el) => (itemRefs.current[idx] = el)}
              className={activeIdx === idx ? "active" : ""}
              onClick={() => handleClick(item, idx)}
            >
              <span>{item.label}</span>
            </li>
          ))}
        </ul>

        <motion.div
          className="nav-indicator"
          animate={indStyle}
          transition={{ type: "spring", stiffness: 400, damping: 35 }}
        />
      </div>

      <div className="nav-right">
        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span></span><span></span><span></span>
        </div>
      </div>

    </nav>
  );
}

export default Navbar;