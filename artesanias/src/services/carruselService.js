import { BASE_URL, apiFetch } from "./api";

// Devuelve los 3 slots del carrusel — público, lo usa el Hero
export async function getCarrusel() {
  const { datos } = await apiFetch("/carrusel");
  return datos;
}

// Actualiza un slot específico (posicion: 1, 2 o 3) — requiere JWT
export async function actualizarSlot(posicion, url, titulo = "") {
  const { datos } = await apiFetch(`/carrusel/${posicion}`, {
    method: "PUT",
    body: JSON.stringify({ url, titulo }),
  });
  return datos;
}

// Sube una imagen al servidor y devuelve su URL
// (reutiliza el endpoint /uploads que ya existe)
export async function subirImagenCarrusel(file) {
  const formData = new FormData();
  formData.append("imagen", file);

  const headers = { Authorization: `Bearer ${sessionStorage.getItem("admin_token")}` };

  const res = await fetch(`${BASE_URL}/uploads`, {
    method: "POST",
    headers,
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "No se pudo subir la imagen.");
  return data.datos.url;
}