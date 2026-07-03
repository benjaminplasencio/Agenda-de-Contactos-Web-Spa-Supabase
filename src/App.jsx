import { useEffect, useState } from "react";
import ContactoForm from "./components/ContactoForm";
import ContactoList from "./components/ContactoList";
import {
  obtenerContactos,
  crearContacto,
  eliminarContacto,
} from "./services/contactoService";
import {
  crearDatoContacto,
  eliminarDatoContacto,
} from "./services/datoContactoService";
import "./App.css";

export default function App() {
  const [contactos, setContactos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarContactos();
  }, []);

  async function cargarContactos() {
    setCargando(true);
    setError("");
    try {
      const datos = await obtenerContactos();
      setContactos(datos);
    } catch (err) {
      setError(`No se pudieron cargar los contactos: ${err.message}`);
    } finally {
      setCargando(false);
    }
  }

  async function manejarCrearContacto(datosContacto) {
    setError("");
    try {
      const nuevo = await crearContacto(datosContacto);
      setContactos((prev) => [...prev, { ...nuevo, dato_contacto: [] }]);
    } catch (err) {
      setError(`No se pudo crear el contacto: ${err.message}`);
    }
  }

  async function manejarEliminarContacto(idContacto) {
    setError("");
    const confirmar = window.confirm("¿Eliminar este contacto y todos sus datos asociados?");
    if (!confirmar) return;

    try {
      await eliminarContacto(idContacto);
      setContactos((prev) => prev.filter((c) => c.id_contacto !== idContacto));
    } catch (err) {
      setError(`No se pudo eliminar el contacto: ${err.message}`);
    }
  }

  async function manejarCrearDato(idContacto, nuevoDato) {
    setError("");
    try {
      const datoCreado = await crearDatoContacto(nuevoDato);
      setContactos((prev) =>
        prev.map((c) =>
          c.id_contacto === idContacto
            ? { ...c, dato_contacto: [...(c.dato_contacto || []), datoCreado] }
            : c
        )
      );
    } catch (err) {
      setError(`No se pudo agregar el dato de contacto: ${err.message}`);
    }
  }

  async function manejarEliminarDato(idContacto, idDatoContacto) {
    setError("");
    try {
      await eliminarDatoContacto(idDatoContacto);
      setContactos((prev) =>
        prev.map((c) =>
          c.id_contacto === idContacto
            ? { ...c, dato_contacto: c.dato_contacto.filter((d) => d.id_dato_contacto !== idDatoContacto) }
            : c
        )
      );
    } catch (err) {
      setError(`No se pudo eliminar el dato de contacto: ${err.message}`);
    }
  }

  return (
    <div className="app-layout">
      <header className="app-header">
        <h1>Agenda de Contactos</h1>
        <p>Gestiona tus contactos y sus datos (teléfono, correo, dirección) en un solo lugar.</p>
      </header>

      {error && (
        <div className="banner-error" role="alert">
          {error}
          <button type="button" onClick={() => setError("")} aria-label="Cerrar mensaje">
            X
          </button>
        </div>
      )}

      <main className="app-main">
        <aside className="panel-formulario">
          <ContactoForm onCrear={manejarCrearContacto} />
        </aside>

        <section className="panel-lista">
          {cargando ? (
            <p className="mensaje-vacio">Cargando contactos...</p>
          ) : (
            <ContactoList
              contactos={contactos}
              onEliminarContacto={manejarEliminarContacto}
              onCrearDato={manejarCrearDato}
              onEliminarDato={manejarEliminarDato}
            />
          )}
        </section>
      </main>
    </div>
  );
}
