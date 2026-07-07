import { useState, useEffect } from "react";
import { getProductos }  from "../services/productosService";
import { getCategorias } from "../services/categoriasService";
import ProductCard       from "./ProductCard";
import SearchBar         from "./SearchBar";
import CategorySelect    from "./CategorySelect";
import "../styles/products.css";

function ProductGrid() {

  const [productos,   setProductos]   = useState([]);
  const [categorias,  setCategorias]  = useState([]);
  const [search,      setSearch]      = useState("");
  const [categoria,   setCategoria]   = useState("Todo");
  const [loading,     setLoading]     = useState(true);

  // Carga categorías primero, luego productos en secuencia
  // (evita errores de conexión cuando Apache recibe múltiples
  // peticiones simultáneas a PostgreSQL en Windows/XAMPP)
  useEffect(() => {
    async function cargar() {
      try {
        const cats  = await getCategorias();
        setCategorias(cats);
        const prods = await getProductos();
        setProductos(prods);
      } catch (err) {
        console.error("Error cargando datos:", err);
      } finally {
        setLoading(false);
      }
    }
    cargar();
  }, []);

  // Filtra por búsqueda y categoría
  const filtrados = productos.filter((p) => {
    const matchSearch   = p.title.toLowerCase().includes(search.toLowerCase());
    const nombreCat     = categorias.find(c => c.id === parseInt(p.categoriaId))?.nombre || p.categoriaNombre || "";
    const matchCategoria = categoria === "Todo" || nombreCat === categoria;
    return matchSearch && matchCategoria;
  });

  return (
    <section className="products-section" id="artesanias">

      <div className="products-header">
        <h2>Artesanías</h2>
        <div className="filters">
          <SearchBar search={search} setSearch={setSearch} />
          <CategorySelect
            value={categoria}
            onChange={setCategoria}
            categorias={categorias}
          />
        </div>
      </div>

      {loading ? (
        <div className="products-loading">Cargando artesanías...</div>
      ) : filtrados.length === 0 ? (
        <div className="products-empty">No se encontraron productos.</div>
      ) : (
        <div className="products-grid">
          {filtrados.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

    </section>
  );
}

export default ProductGrid;