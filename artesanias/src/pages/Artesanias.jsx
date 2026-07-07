import Navbar      from "../components/Navbar";
import ProductGrid from "../components/ProductGrid";

// Página directa /artesanias — muestra solo el grid
// (sin scroll, sin secciones — el navbar detecta la ruta y activa "Artesanías")
function Artesanias() {
  return (
    <>
      <Navbar />
      <div style={{ paddingTop: "70px" }}>
        <ProductGrid />
      </div>
    </>
  );
}

export default Artesanias;