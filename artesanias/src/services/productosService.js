import { USE_MOCK_DATA, apiFetch } from "./api";
import mockProducts from "../data/products";

// ─────────────────────────────────────────────────────────
// SERVICIO DE PRODUCTOS
// ─────────────────────────────────────────────────────────

export async function getProductos() {
  if (USE_MOCK_DATA) {
    return Promise.resolve(mockProducts);
  }
  const { datos } = await apiFetch("/productos");
  return datos;
}

export async function getProductoPorId(id) {
  if (USE_MOCK_DATA) {
    return Promise.resolve(mockProducts.find((p) => p.id === parseInt(id)));
  }
  const { datos } = await apiFetch(`/productos/${id}`);
  return datos;
}

export async function crearProducto(data) {
  if (USE_MOCK_DATA) {
    console.log("MOCK crearProducto:", data);
    return Promise.resolve({ ...data, id: Date.now() });
  }
  const { datos } = await apiFetch("/productos", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return datos;
}

export async function actualizarProducto(id, data) {
  if (USE_MOCK_DATA) {
    console.log("MOCK actualizarProducto:", id, data);
    return Promise.resolve({ ...data, id });
  }
  const { datos } = await apiFetch(`/productos/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return datos;
}

export async function eliminarProducto(id) {
  if (USE_MOCK_DATA) {
    console.log("MOCK eliminarProducto:", id);
    return Promise.resolve({ success: true });
  }
  const { datos } = await apiFetch(`/productos/${id}`, { method: "DELETE" });
  return datos;
}