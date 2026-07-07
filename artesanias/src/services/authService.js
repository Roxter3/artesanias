import { BASE_URL } from "./api";

// ─────────────────────────────────────────────────────────
// SERVICIO DE AUTENTICACIÓN
// A diferencia de productosService/artesanosService, este
// SIEMPRE llama al backend real — no tiene modo mock, porque
// el login no tiene sentido simularlo: necesitamos probar la
// seguridad real desde el principio.
// ─────────────────────────────────────────────────────────

export async function login(usuario, password) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usuario, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    // El backend manda mensajes claros: "Usuario o contraseña incorrectos."
    throw new Error(data.error || "No se pudo iniciar sesión.");
  }

  return data.datos; // { token, usuario: { id, usuario, nombre_completo } }
}

// Guarda el token y los datos del usuario logueado
export function guardarSesion(token, usuario) {
  sessionStorage.setItem("admin_token", token);
  sessionStorage.setItem("admin_usuario", JSON.stringify(usuario));
}

// Limpia la sesión — usado en logout
export function cerrarSesion() {
  sessionStorage.removeItem("admin_token");
  sessionStorage.removeItem("admin_usuario");
}

// Devuelve los datos del usuario logueado, o null si no hay sesión
export function obtenerUsuarioActual() {
  const data = sessionStorage.getItem("admin_usuario");
  return data ? JSON.parse(data) : null;
}

// Verifica si hay un token guardado (chequeo simple, no valida
// expiración aquí — eso lo hace el backend en cada petición)
export function haySesionActiva() {
  return !!sessionStorage.getItem("admin_token");
}