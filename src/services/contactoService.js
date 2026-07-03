// Servicio de acceso a la API REST de Supabase (PostgREST) para la entidad "contacto"
// Se usa fetch puro, tal como exige el criterio 3.1.4 de la evaluación.

function obtenerConfigSupabase() {
  const url = import.meta.env.VITE_SUPABASE_URL?.trim();
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

  if (!url || !anonKey) {
    throw new Error("Configura VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en el archivo .env");
  }

  if (
    url.includes("tu-proyecto.supabase.co") ||
    anonKey.includes("pega_aqui") ||
    anonKey.includes("tu-anon-key")
  ) {
    throw new Error("Reemplaza los valores de ejemplo en .env con la URL y la anon key reales de tu proyecto de Supabase");
  }

  return {
    url: url.replace(/\/$/, ""),
    anonKey,
  };
}

// Headers comunes que exige PostgREST para autenticar con la anon key
function headers(extra = {}) {
  const { anonKey } = obtenerConfigSupabase();

  return {
    apikey: anonKey,
    Authorization: `Bearer ${anonKey}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

// Lanza un error legible si la respuesta de PostgREST no fue exitosa
async function checkResponse(response) {
  if (!response.ok) {
    let mensaje = `Error ${response.status}`;
    try {
      const data = await response.json();
      mensaje = data.message || data.hint || mensaje;
    } catch {
      // la respuesta no traía JSON, se deja el mensaje genérico
    }
    throw new Error(mensaje);
  }
  return response;
}

// Obtiene todos los contactos junto con sus datos de contacto asociados (join embebido de PostgREST)
export async function obtenerContactos() {
  const { url } = obtenerConfigSupabase();
  const baseUrl = `${url}/rest/v1/contacto`;
  const requestUrl = `${baseUrl}?select=*,dato_contacto(*)&order=apellido.asc,nombre.asc`;
  const response = await fetch(requestUrl, { headers: headers() });
  await checkResponse(response);
  return response.json();
}

// Crea un nuevo contacto. Devuelve el registro creado.
export async function crearContacto({ nombre, apellido }) {
  const { url } = obtenerConfigSupabase();
  const baseUrl = `${url}/rest/v1/contacto`;
  const response = await fetch(baseUrl, {
    method: "POST",
    headers: headers({ Prefer: "return=representation" }),
    body: JSON.stringify({ nombre, apellido }),
  });
  await checkResponse(response);
  const data = await response.json();
  return data[0];
}

// Elimina un contacto (sus datos de contacto se eliminan en cascada por la FK)
export async function eliminarContacto(idContacto) {
  const { url } = obtenerConfigSupabase();
  const requestUrl = `${url}/rest/v1/contacto?id_contacto=eq.${idContacto}`;
  const response = await fetch(requestUrl, {
    method: "DELETE",
    headers: headers(),
  });
  await checkResponse(response);
}
