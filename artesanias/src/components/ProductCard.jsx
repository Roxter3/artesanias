import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function ProductCard({ product }) {

  const navigate = useNavigate();

  const nombreCategoria  = product.categoriaNombre || product.category || "";
  const precioFormateado = product.price
    ? `S/ ${Number(product.price).toFixed(2)}`
    : "";

  return (
    <motion.div
      className="product-card"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      onClick={() => navigate(`/productos/${product.id}`)}
      style={{ cursor: "pointer" }}
    >
      {/* Imagen */}
      <div className="image-container">
        <img src={product.image} alt={product.title} />
        {nombreCategoria && (
          <span className="category-badge">{nombreCategoria}</span>
        )}
      </div>

      {/* Footer — título y precio en la misma fila */}
      <div className="card-footer">
        <h3 className="card-title">{product.title}</h3>
        <span className="card-price">{precioFormateado}</span>
      </div>

    </motion.div>
  );
}

export default ProductCard;