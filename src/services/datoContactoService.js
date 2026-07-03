// Servicio de acceso a la API REST de Supabase (PostgREST) para la entidad "dato_contacto"

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

function headers(extra = {}) {
  const { anonKey } = obtenerConfigSupabase();

  return {
    apikey: anonKey,
    Authorization: `Bearer ${anonKey}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

async function checkResponse(response) {
  if (!response.ok) {
    let mensaje = `Error ${response.status}`;
    try {
      const data = await response.json();
      mensaje = data.message || data.hint || mensaje;
    } catch {
      // sin cuerpo JSON en la respuesta de error
    }
    throw new Error(mensaje);
  }
  return response;
}

// Crea un set de datos de contacto (tipo + uno de: correo/telefono/direccion) para un contacto existente
export async function crearDatoContacto({ id_contacto, tipo, correo, telefono, direccion }) {
  const { url } = obtenerConfigSupabase();
  const baseUrl = `${url}/rest/v1/dato_contacto`;
  const response = await fetch(baseUrl, {
    method: "POST",
    headers: headers({ Prefer: "return=representation" }),
    body: JSON.stringify({
      id_contacto,
      tipo,
      correo: correo || null,
      telefono: telefono || null,
      direccion: direccion || null,
    }),
  });
  await checkResponse(response);
  const data = await response.json();
  return data[0];
}

// Elimina un set de datos de contacto puntual
export async function eliminarDatoContacto(idDatoContacto) {
  const { url } = obtenerConfigSupabase();
  const requestUrl = `${url}/rest/v1/dato_contacto?id_dato_contacto=eq.${idDatoContacto}`;
  const response = await fetch(requestUrl, {
    method: "DELETE",
    headers: headers(),
  });
  await checkResponse(response);
}
