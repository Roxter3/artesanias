import { Navigate } from "react-router-dom";
import { haySesionActiva } from "../../services/authService";

// ─────────────────────────────────────────────────────────
// RUTA PROTEGIDA
// Si no hay sesión activa, redirige al login en /admin
// ─────────────────────────────────────────────────────────
function ProtectedRoute({ children }) {
  if (!haySesionActiva()) {
    return <Navigate to="/admin" replace />;
  }
  return children;
}

export default ProtectedRoute;