// ─────────────────────────────────────────────────────────
// CONFIGURACIÓN BASE DE LA API
// ─────────────────────────────────────────────────────────
// Este es el ÚNICO archivo que se debe modificar cuando el
// backend cambie de entorno (de tu PC local al servidor
// municipal real).
// ─────────────────────────────────────────────────────────

export const USE_MOCK_DATA = false;

export const BASE_URL = "https://descubre-ate-backend.onrender.com";

export function getAuthHeaders() {
  const token = sessionStorage.getItem("admin_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ─────────────────────────────────────────────────────────
// CONVERSIÓN DE FORMATO — snake_case (PHP/SQL) ↔ camelCase (JS)
//
// El backend y la base de datos usan snake_case por convención
// SQL (foto_presentacion, categoria_id). El frontend usa
// camelCase por convención JS (fotoPresentacion, categoriaId).
//
// Esta es la ÚNICA capa donde se hace la conversión — así
// ni los modelos PHP ni los componentes React necesitan saber
// que el otro lado "habla diferente".
// ─────────────────────────────────────────────────────────

// snake_case → camelCase (al RECIBIR datos del backend)
function aCamelCase(obj) {
  if (Array.isArray(obj)) return obj.map(aCamelCase);
  if (obj === null || typeof obj !== "object") return obj;

  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key.replace(/_([a-z])/g, (_, letra) => letra.toUpperCase()),
      aCamelCase(value),
    ])
  );
}

// camelCase → snake_case (al ENVIAR datos al backend)
function aSnakeCase(obj) {
  if (Array.isArray(obj)) return obj.map(aSnakeCase);
  if (obj === null || typeof obj !== "object") return obj;

  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key.replace(/[A-Z]/g, (letra) => `_${letra.toLowerCase()}`),
      aSnakeCase(value),
    ])
  );
}

// ─────────────────────────────────────────────────────────
// Wrapper genérico de fetch — usado por todos los services.
// Convierte automáticamente en ambas direcciones.
// ─────────────────────────────────────────────────────────
export async function apiFetch(endpoint, options = {}) {

  // Si hay body y es un string JSON, lo convertimos a snake_case
  // antes de enviarlo
  let bodyConvertido = options.body;
  if (options.body) {
    const datosOriginales = JSON.parse(options.body);
    bodyConvertido = JSON.stringify(aSnakeCase(datosOriginales));
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    body: bodyConvertido,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  const dataOriginal = await res.json();

  if (!res.ok) {
    if (res.status === 401) {
      sessionStorage.removeItem("admin_token");
      sessionStorage.removeItem("admin_usuario");
      window.location.href = "/admin";
    }
    throw new Error(dataOriginal.error || `Error en la petición: ${res.status}`);
  }

  // Convierte la respuesta completa a camelCase antes de
  // devolverla — así "datos" también queda convertido
  return aCamelCase(dataOriginal);
}