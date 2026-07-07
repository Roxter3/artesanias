import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/categorySelect.css";

// Ahora recibe las categorías como prop desde ProductGrid
// (ya las tiene cargadas del backend, no necesita pedirlas de nuevo)
function CategorySelect({ value, onChange, categorias = [] }) {

  const [open, setOpen] = useState(false);
  const ref             = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(option) {
    onChange(option);
    setOpen(false);
  }

  const opciones = ["Todo", ...categorias.map(c => c.nombre)];

  return (
    <div className="cat-select" ref={ref}>

      <button
        className={`cat-trigger ${open ? "cat-trigger--open" : ""}`}
        onClick={() => setOpen(!open)}
        type="button"
      >
        <span className="cat-trigger-label">
          {value === "Todo" ? "Línea artesanal" : value}
        </span>
        <motion.span
          className="cat-arrow"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
        >
          ▾
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            className="cat-dropdown"
            initial={{ opacity: 0, y: -8, scaleY: 0.92 }}
            animate={{ opacity: 1, y: 0,  scaleY: 1    }}
            exit={{    opacity: 0, y: -8, scaleY: 0.92 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            style={{ originY: 0 }}
          >
            {opciones.map((opt) => (
              <li
                key={opt}
                className={`cat-option ${value === opt ? "cat-option--active" : ""}`}
                onClick={() => handleSelect(opt)}
              >
                {opt}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

    </div>
  );
}

export default CategorySelect;