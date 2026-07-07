import { BASE_URL, getAuthHeaders } from "./api";

// ─────────────────────────────────────────────────────────
// SERVICIO DE FOTOS DE GALERÍA
// Maneja la subida y eliminación de fotos adicionales
// para artesanos y productos.
// ─────────────────────────────────────────────────────────

// Sube una foto adicional al artesano
export async function subirFotoArtesano(artesanoId, file) {
  const formData = new FormData();
  formData.append("imagen", file);

  const headers = getAuthHeaders();
  delete headers["Content-Type"];

  const res = await fetch(`${BASE_URL}/fotos/artesano/${artesanoId}`, {
    method: "POST",
    headers,
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "No se pudo subir la foto.");
  return data.datos;
}

// Sube una foto adicional al producto
export async function subirFotoProducto(productoId, file) {
  const formData = new FormData();
  formData.append("imagen", file);

  const headers = getAuthHeaders();
  delete headers["Content-Type"];

  const res = await fetch(`${BASE_URL}/fotos/producto/${productoId}`, {
    method: "POST",
    headers,
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "No se pudo subir la foto.");
  return data.datos;
}

// Elimina una foto de artesano por su id
export async function eliminarFotoArtesano(fotoId) {
  const headers = getAuthHeaders();
  const res = await fetch(`${BASE_URL}/fotos/artesano-foto/${fotoId}`, {
    method: "DELETE",
    headers,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "No se pudo eliminar la foto.");
  return data.datos;
}

// Elimina una foto de producto por su id
export async function eliminarFotoProducto(fotoId) {
  const headers = getAuthHeaders();
  const res = await fetch(`${BASE_URL}/fotos/producto-foto/${fotoId}`, {
    method: "DELETE",
    headers,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "No se pudo eliminar la foto.");
  return data.datos;
}