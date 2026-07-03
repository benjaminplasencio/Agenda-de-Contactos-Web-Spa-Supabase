import ContactoCard from "./ContactoCard";

// Renderiza la lista de contactos, o un mensaje si no hay ninguno
export default function ContactoList({ contactos, onEliminarContacto, onCrearDato, onEliminarDato }) {
  if (contactos.length === 0) {
    return <p className="mensaje-vacio">Aún no hay contactos. Agrega el primero con el formulario de la izquierda.</p>;
  }

  return (
    <div className="lista-contactos">
      {contactos.map((contacto) => (
        <ContactoCard
          key={contacto.id_contacto}
          contacto={contacto}
          onEliminarContacto={onEliminarContacto}
          onCrearDato={(dato) => onCrearDato(contacto.id_contacto, dato)}
          onEliminarDato={(idDato) => onEliminarDato(contacto.id_contacto, idDato)}
        />
      ))}
    </div>
  );
}
