import { useState } from "react";

// Formulario para crear un nuevo contacto (nombre + apellido)
export default function ContactoForm({ onCrear }) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);

  function validar() {
    const nuevosErrores = {};
    // varchar en la BD: exigimos texto no vacío y un largo razonable acorde a la columna
    if (!nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio.";
    else if (nombre.length > 100) nuevosErrores.nombre = "Máximo 100 caracteres.";

    if (!apellido.trim()) nuevosErrores.apellido = "El apellido es obligatorio.";
    else if (apellido.length > 100) nuevosErrores.apellido = "Máximo 100 caracteres.";

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  }

  async function manejarSubmit(e) {
    e.preventDefault();
    if (!validar()) return;

    setEnviando(true);
    try {
      await onCrear({ nombre: nombre.trim(), apellido: apellido.trim() });
      setNombre("");
      setApellido("");
      setErrores({});
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form className="tarjeta formulario" onSubmit={manejarSubmit} noValidate>
      <h2>Nuevo contacto</h2>

      <div className="campo">
        <label htmlFor="nombre">Nombre</label>
        <input
          id="nombre"
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          maxLength={100}
          placeholder="Ej: María"
        />
        {errores.nombre && <span className="error">{errores.nombre}</span>}
      </div>

      <div className="campo">
        <label htmlFor="apellido">Apellido</label>
        <input
          id="apellido"
          type="text"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
          maxLength={100}
          placeholder="Ej: González"
        />
        {errores.apellido && <span className="error">{errores.apellido}</span>}
      </div>

      <button type="submit" className="boton boton-primario" disabled={enviando}>
        {enviando ? "Guardando..." : "Agregar contacto"}
      </button>
    </form>
  );
}
