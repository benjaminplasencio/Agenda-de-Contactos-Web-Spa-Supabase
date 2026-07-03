# Agenda de Contactos — Evaluación Sumativa 3 (Framework JavaScript)

SPA en **React** para gestionar una agenda de contactos, usando **Supabase** (PostgREST) como
backend y **fetch** para consumir su API REST directamente (sin SDK), conforme al criterio 3.1.4.

## Funcionalidades

- Crear y eliminar contactos (nombre + apellido).
- Agregar o quitar "datos de contacto" (teléfono, correo o dirección) a un contacto existente.
- Cada dato de contacto tiene un tipo: Personal, Trabajo o Casa.
- Validación de campos en el formulario (según las restricciones de la base de datos).
- Manejo de errores con mensajes visibles en pantalla (banner de error).
- Desarrollo 100% basado en componentes.

## Estructura del proyecto

```
src/
  components/
    ContactoForm.jsx        -> formulario para crear contacto
    ContactoList.jsx        -> lista de tarjetas de contacto
    ContactoCard.jsx        -> tarjeta con datos del contacto + sus datos asociados
    DatoContactoForm.jsx    -> formulario para agregar un dato de contacto
    DatoContactoItem.jsx    -> ítem individual de un dato de contacto
  services/
    contactoService.js      -> fetch a /rest/v1/contacto (CRUD de contactos)
    datoContactoService.js  -> fetch a /rest/v1/dato_contacto (CRUD de datos de contacto)
  App.jsx                    -> orquesta el estado global y conecta componentes con services
```

## Base de datos (Supabase / PostgreSQL)

```sql
create table contacto (
  id_contacto serial primary key,
  nombre varchar(100) not null,
  apellido varchar(100) not null
);

create table dato_contacto (
  id_dato_contacto serial primary key,
  id_contacto integer not null references contacto(id_contacto) on delete cascade,
  tipo varchar(20) not null check (tipo in ('Personal', 'Trabajo', 'Casa')),
  correo varchar(150),
  telefono varchar(30),
  direccion text
);

alter table contacto enable row level security;
alter table dato_contacto enable row level security;

create policy "Permitir todo contacto" on contacto for all using (true) with check (true);
create policy "Permitir todo dato_contacto" on dato_contacto for all using (true) with check (true);
```

> Nota: las políticas de RLS son permisivas a propósito, ya que este es un proyecto académico
> sin autenticación de usuarios. En un entorno real se restringirían por usuario autenticado.

## Configuración y ejecución local

1. Clonar el repositorio e instalar dependencias:
   ```bash
   npm install
   ```
2. Crear un archivo `.env` en la raíz (puedes copiar `.env.example`) con tus credenciales de Supabase:
   ```
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_ANON_KEY=tu-anon-key
   ```
3. Ejecutar en modo desarrollo:
   ```bash
   npm run dev
   ```
4. Abrir la URL que indica Vite (normalmente `http://localhost:5173`).

## Tecnologías

- React 19 + Vite
- CSS plano (sin frameworks de UI)
- Supabase (PostgreSQL + API REST autogenerada vía PostgREST)
- `fetch` nativo del navegador para el consumo de la API
