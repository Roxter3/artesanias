import { USE_MOCK_DATA, apiFetch } from "./api";
import mockCategorias from "../data/categorias";

// ─────────────────────────────────────────────────────────
// SERVICIO DE CATEGORÍAS
// USE_MOCK_DATA ahora aplica solo si no hay backend disponible.
// Por defecto ya usa el backend real (ver api.js).
// ─────────────────────────────────────────────────────────

export async function getCategorias() {
  if (USE_MOCK_DATA) {
    return Promise.resolve(mockCategorias);
  }
  const { datos } = await apiFetch("/categorias");
  return datos;
}

export async function crearCategoria(data) {
  if (USE_MOCK_DATA) {
    console.log("MOCK crearCategoria:", data);
    return Promise.resolve({ ...data, id: Date.now() });
  }
  const { datos } = await apiFetch("/categorias", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return datos;
}

export async function actualizarCategoria(id, data) {
  if (USE_MOCK_DATA) {
    console.log("MOCK actualizarCategoria:", id, data);
    return Promise.resolve({ ...data, id });
  }
  const { datos } = await apiFetch(`/categorias/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return datos;
}

export async function eliminarCategoria(id) {
  if (USE_MOCK_DATA) {
    console.log("MOCK eliminarCategoria:", id);
    return Promise.resolve({ success: true });
  }
  const { datos } = await apiFetch(`/categorias/${id}`, { method: "DELETE" });
  return datos;
}