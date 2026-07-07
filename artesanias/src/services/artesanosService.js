import { USE_MOCK_DATA, apiFetch } from "./api";
import mockArtisans from "../data/artisans";

// ─────────────────────────────────────────────────────────
// SERVICIO DE ARTESANOS
// ─────────────────────────────────────────────────────────

export async function getArtesanos() {
  if (USE_MOCK_DATA) {
    return Promise.resolve(mockArtisans);
  }
  const { datos } = await apiFetch("/artesanos");
  return datos;
}

export async function getArtesanoPorId(id) {
  if (USE_MOCK_DATA) {
    return Promise.resolve(mockArtisans.find((a) => a.id === parseInt(id)));
  }
  const { datos } = await apiFetch(`/artesanos/${id}`);
  return datos;
}

// Productos elaborados por un artesano específico
export async function getProductosDeArtesano(id) {
  if (USE_MOCK_DATA) {
    return Promise.resolve([]); // en mock ya se filtra desde products.js directamente
  }
  const { datos } = await apiFetch(`/artesanos/${id}/productos`);
  return datos;
}

export async function crearArtesano(data) {
  if (USE_MOCK_DATA) {
    console.log("MOCK crearArtesano:", data);
    return Promise.resolve({ ...data, id: Date.now() });
  }
  const { datos } = await apiFetch("/artesanos", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return datos;
}

export async function actualizarArtesano(id, data) {
  if (USE_MOCK_DATA) {
    console.log("MOCK actualizarArtesano:", id, data);
    return Promise.resolve({ ...data, id });
  }
  const { datos } = await apiFetch(`/artesanos/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return datos;
}

export async function eliminarArtesano(id) {
  if (USE_MOCK_DATA) {
    console.log("MOCK eliminarArtesano:", id);
    return Promise.resolve({ success: true });
  }
  const { datos } = await apiFetch(`/artesanos/${id}`, { method: "DELETE" });
  return datos;
}