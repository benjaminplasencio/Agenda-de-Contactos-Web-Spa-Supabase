const ICONOS_TIPO = {
  Personal: "",
  Trabajo: "",
  Casa: "",
};

// Muestra un único set de datos de contacto (correo, teléfono o dirección) con su tipo
export default function DatoContactoItem({ dato, onEliminar }) {
  const valor = dato.correo || dato.telefono || dato.direccion;
  const medio = dato.correo ? "Correo" : dato.telefono ? "Teléfono" : "Dirección";

  return (
    <li className="dato-item">
      <span className="dato-icono" aria-hidden="true">
        {ICONOS_TIPO[dato.tipo] || ""}
      </span>
      <div className="dato-info">
        <span className="dato-tipo">
          {dato.tipo} · {medio}
        </span>
        <span className="dato-valor">{valor}</span>
      </div>
      <button
        type="button"
        className="boton boton-icono"
        onClick={() => onEliminar(dato.id_dato_contacto)}
        title="Eliminar este dato"
        aria-label="Eliminar este dato"
      >
        X
      </button>
    </li>
  );
}
