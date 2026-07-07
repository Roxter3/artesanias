import Navbar      from "../components/Navbar";
import Hero        from "../components/Hero";
import ProductGrid from "../components/ProductGrid";

// Home tiene 2 secciones en scroll continuo:
// - #inicio   → el Hero
// - #artesanias → el grid de productos
function Home() {
  return (
    <div style={{ background: "#EDFBFF" }}>
      <Navbar />
      <section id="inicio">
        <Hero />
      </section>
      <section id="artesanias">
        <ProductGrid />
      </section>
    </div>
  );
}

export default Home;