import { useState } from "react";
import DatoContactoForm from "./DatoContactoForm";
import DatoContactoItem from "./DatoContactoItem";

// Tarjeta que representa un contacto completo: datos básicos + sus sets de datos de contacto
export default function ContactoCard({ contacto, onEliminarContacto, onCrearDato, onEliminarDato }) {
  const [mostrarFormDato, setMostrarFormDato] = useState(false);
  const datos = contacto.dato_contacto || [];

  async function manejarCrearDato(nuevoDato) {
    await onCrearDato(nuevoDato);
    setMostrarFormDato(false);
  }

  return (
    <article className="tarjeta contacto-card">
      <header className="contacto-header">
        <div>
          <h3>
            {contacto.nombre} {contacto.apellido}
          </h3>
          <span className="contador-datos">
            {datos.length} {datos.length === 1 ? "dato registrado" : "datos registrados"}
          </span>
        </div>
        <button
          type="button"
          className="boton boton-peligro"
          onClick={() => onEliminarContacto(contacto.id_contacto)}
        >
          Eliminar contacto
        </button>
      </header>

      {datos.length > 0 && (
        <ul className="lista-datos">
          {datos.map((dato) => (
            <DatoContactoItem key={dato.id_dato_contacto} dato={dato} onEliminar={onEliminarDato} />
          ))}
        </ul>
      )}

      {mostrarFormDato ? (
        <DatoContactoForm
          idContacto={contacto.id_contacto}
          onCrear={manejarCrearDato}
          onCancelar={() => setMostrarFormDato(false)}
        />
      ) : (
        <button type="button" className="boton boton-texto" onClick={() => setMostrarFormDato(true)}>
          + Agregar dato de contacto
        </button>
      )}
    </article>
  );
}
