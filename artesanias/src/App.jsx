import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home           from "./pages/Home";
import Artesanias     from "./pages/Artesanias";
import Artisans       from "./pages/Artisans";
import ArtisanDetail  from "./pages/ArtisanDetail";
import ProductDetail  from "./pages/ProductDetail";
import AdminLogin     from "./pages/admin/AdminLogin";
import AdminLayout    from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProductos from "./pages/admin/AdminProductos";
import AdminArtesanos from "./pages/admin/AdminArtesanos";
import AdminCategorias from "./pages/admin/AdminCategorias";
import AdminCarrusel   from "./pages/admin/AdminCarrusel";
import ProtectedRoute from "./pages/admin/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── Páginas públicas ── */}
        <Route path="/"              element={<Home />}        />
        <Route path="/artesanias"    element={<Artesanias />}  />
        <Route path="/artesanos"     element={<Artisans />}    />
        <Route path="/artesanos/:id" element={<ArtisanDetail />} />
        <Route path="/productos/:id" element={<ProductDetail />} />

        {/* ── Admin ── */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard"  element={<AdminDashboard />}  />
          <Route path="productos"  element={<AdminProductos />}  />
          <Route path="artesanos"  element={<AdminArtesanos />}  />
          <Route path="categorias" element={<AdminCategorias />} />
          <Route path="carrusel"   element={<AdminCarrusel />}   />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;