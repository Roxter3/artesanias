import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { login, guardarSesion } from "../../services/authService";
import "../../styles/adminLogin.css";

function AdminLogin() {

  const navigate = useNavigate();

  const [usuario, setUsuario]       = useState("");
  const [password, setPassword]     = useState("");
  const [recordarme, setRecordarme] = useState(false);
  const [error, setError]           = useState("");
  const [loading, setLoading]       = useState(false);

  // ─────────────────────────────────────────────
  // Login real — llama al backend PHP en
  // http://localhost/descubre-ate-backend/auth/login
  // ─────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!usuario || !password) {
      setError("Completa todos los campos.");
      return;
    }

    setLoading(true);

    try {
      const { token, usuario: datosUsuario } = await login(usuario, password);

      // Guarda el token — todas las peticiones futuras del
      // admin (crear/editar/borrar) lo usarán automáticamente
      guardarSesion(token, datosUsuario);

      navigate("/admin/dashboard");

    } catch (err) {
      // Mensaje que viene directo del backend
      // (ej. "Usuario o contraseña incorrectos.")
      setError(err.message);

    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-login-page">

      <div className="admin-login-bg" />

      <motion.div
        className="admin-login-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0  }}
        transition={{ duration: 0.6 }}
      >

        <img
          src="/logoate.PNG"
          alt="Logo Ate"
          className="admin-login-logo"
        />

        <h1 className="admin-login-title">Panel Administrador</h1>
        <p className="admin-login-subtitle">
          Descubre Ate — Gestión de Artesanías
        </p>

        <form className="admin-login-form" onSubmit={handleSubmit}>

          <div className="admin-input-group">
            <label htmlFor="usuario">Usuario</label>
            <input
              id="usuario"
              type="text"
              placeholder="Ingresa tu usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
            />
          </div>

          <div className="admin-input-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="admin-checkbox-row">
            <label className="admin-checkbox-label">
              <input
                type="checkbox"
                checked={recordarme}
                onChange={(e) => setRecordarme(e.target.checked)}
              />
              Recordarme
            </label>
          </div>

          {error && <p className="admin-login-error">{error}</p>}

          <button
            type="submit"
            className="admin-login-btn"
            disabled={loading}
          >
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>

        </form>

      </motion.div>

    </div>
  );
}

export default AdminLogin;