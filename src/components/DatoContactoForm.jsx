import { useState } from "react";

const TIPOS = ["Personal", "Trabajo", "Casa"];
const MEDIOS = [
  { valor: "correo", etiqueta: "Correo electrónico" },
  { valor: "telefono", etiqueta: "Teléfono" },
  { valor: "direccion", etiqueta: "Dirección postal" },
];

// Validaciones más estrictas para evitar correos, teléfonos o direcciones inválidos.
const REGEX_CORREO = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

function validarCorreo(correo) {
  const valor = correo.trim();

  if (!valor) return "Este campo es obligatorio.";
  if (valor.length > 254) return "El correo es demasiado largo.";
  if (valor.includes(" ")) return "El correo no debe incluir espacios.";
  if (!REGEX_CORREO.test(valor)) return "Ingresa un correo electrónico válido.";

  const [local, dominio] = valor.split("@");
  if (!local || local.length > 64) return "El correo tiene una parte local inválida.";
  if (!dominio || dominio.length > 253) return "El dominio del correo no es válido.";

  const etiquetas = dominio.split(".");
  const extension = etiquetas[etiquetas.length - 1];

  if (etiquetas.some((etiqueta) => etiqueta.length < 2)) {
    return "El dominio debe incluir una extensión válida.";
  }

  if (!/^[a-zA-Z]+$/.test(extension)) {
    return "La extensión del correo debe contener solo letras.";
  }

  return "";
}

function validarTelefono(telefono) {
  const valor = telefono.trim();

  if (!valor) return "Este campo es obligatorio.";
  if (valor.length > 20) return "El teléfono es demasiado largo.";
  if (!/^\+?[0-9\s()-]+$/.test(valor)) {
    return "Ingresa un teléfono válido (solo números, espacios, + o -).";
  }

  const digitos = valor.replace(/\D/g, "");
  if (digitos.length < 7 || digitos.length > 15) {
    return "El teléfono debe tener entre 7 y 15 dígitos.";
  }

  return "";
}

function validarDireccion(direccion) {
  const valor = direccion.trim();

  if (!valor) return "Este campo es obligatorio.";
  if (valor.length < 5) return "La dirección es demasiado corta.";
  if (!/[a-zA-ZÁÉÍÓÚáéíóúÑñ]/.test(valor)) return "La dirección debe incluir letras.";
  if (/^[\d\s().,-]+$/.test(valor)) return "La dirección no puede estar compuesta solo por números o signos.";

  return "";
}

// Formulario para agregar un set de datos de contacto a un contacto existente
export default function DatoContactoForm({ idContacto, onCrear, onCancelar }) {
  const [tipo, setTipo] = useState(TIPOS[0]);
  const [medio, setMedio] = useState(MEDIOS[0].valor);
  const [valor, setValor] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  function validar() {
    const valorNormalizado = valor.trim();
    let mensaje = "";

    if (medio === "correo") {
      mensaje = validarCorreo(valorNormalizado);
    } else if (medio === "telefono") {
      mensaje = validarTelefono(valorNormalizado);
    } else if (medio === "direccion") {
      mensaje = validarDireccion(valorNormalizado);
    }

    if (!valorNormalizado) {
      mensaje = "Este campo es obligatorio.";
    }

    setError(mensaje);
    return !mensaje;
  }

  async function manejarSubmit(e) {
    e.preventDefault();
    if (!validar()) return;

    setEnviando(true);
    try {
      await onCrear({
        id_contacto: idContacto,
        tipo,
        correo: medio === "correo" ? valor.trim() : null,
        telefono: medio === "telefono" ? valor.trim() : null,
        direccion: medio === "direccion" ? valor.trim() : null,
      });
      setValor("");
      setError("");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form className="formulario-dato" onSubmit={manejarSubmit} noValidate>
      <div className="fila-campos">
        <div className="campo">
          <label>Tipo</label>
          <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
            {TIPOS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="campo">
          <label>Medio</label>
          <select value={medio} onChange={(e) => { setMedio(e.target.value); setValor(""); setError(""); }}>
            {MEDIOS.map((m) => (
              <option key={m.valor} value={m.valor}>
                {m.etiqueta}
              </option>
            ))}
          </select>
        </div>

        <div className="campo campo-valor">
          <label>Valor</label>
          <input
            type={medio === "correo" ? "email" : "text"}
            value={valor}
            onChange={(e) => {
              setValor(e.target.value);
              if (error) setError("");
            }}
            placeholder={
              medio === "correo"
                ? "ejemplo@correo.com"
                : medio === "telefono"
                ? "+56 9 1234 5678"
                : "Calle, número, comuna"
            }
          />
        </div>
      </div>

      {error && <span className="error">{error}</span>}

      <div className="acciones-form">
        <button type="submit" className="boton boton-secundario" disabled={enviando}>
          {enviando ? "Guardando..." : "Agregar dato"}
        </button>
        <button type="button" className="boton boton-texto" onClick={onCancelar}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
