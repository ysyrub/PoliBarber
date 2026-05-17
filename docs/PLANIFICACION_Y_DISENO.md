# Etapa 1 - Planificación y diseño

## Propuesta del proyecto

Título: PoliBarber.

Descripción: sistema web moderno para gestionar reservas de barbería, disponibilidad de barberos y administración del negocio.

Objetivo: permitir que clientes reserven turnos reales y que el administrador controle citas, barberos, horarios y ganancias.

Público objetivo:

- Clientes que desean reservar desde celular o PC.
- Administrador de la barbería.
- Barberos que necesitan agenda ordenada.

## Funcionalidades

- Inicio con servicios, barberos, contacto y horarios.
- Reserva con calendario dinámico.
- Validación de datos del cliente.
- Bloqueo automático de horarios ocupados.
- Cancelación con regla de más de 24 horas.
- Panel administrativo con JWT.
- Estadísticas de reservas, ganancias, barberos y servicios.
- Gestión de barberos y citas.

## Herramientas seleccionadas

- React + Vite: interfaz rápida y moderna.
- TailwindCSS: diseño responsive y consistente.
- Framer Motion: animaciones suaves.
- Axios: consumo de API.
- FullCalendar: calendario profesional.
- Lucide React: iconografía clara.
- Node + Express: API REST.
- MongoDB + Mongoose: persistencia flexible.
- JWT: protección de rutas admin.

## Wireframes

### Inicio

```text
┌────────────────────────────────────────────┐
│ Logo PoliBarber     Inicio Reservar Admin  │
├────────────────────────────────────────────┤
│ PoliBarber                                  │
│ Texto premium + botón reservar             │
│ Chips: horario, ubicación, contacto         │
│                         Tarjeta agenda      │
├────────────────────────────────────────────┤
│ Servicios y combos en tarjetas              │
├────────────────────────────────────────────┤
│ Barberos Carlos / Miguel / Fernando         │
└────────────────────────────────────────────┘
```

### Reservas

```text
┌────────────────────────────────────────────┐
│ Datos cliente       Barbero + Calendario    │
│ Servicios           Horarios disponibles    │
│ Total Gs.           Confirmar reserva       │
└────────────────────────────────────────────┘
```

### Admin

```text
┌────────────────────────────────────────────┐
│ Dashboard: reservas, ganancias, barberos    │
├────────────────────────────────────────────┤
│ Gráficos ganancias / servicios              │
├────────────────────────────────────────────┤
│ Gestión barberos | Crear cita manual         │
├────────────────────────────────────────────┤
│ Tabla/lista de citas con acciones            │
└────────────────────────────────────────────┘
```

## Interactividad

- Botón Reservar navega a `/reservar`.
- Selección de servicios recalcula precio y disponibilidad.
- Selección de día actualiza horarios por API.
- Confirmar reserva valida datos antes de guardar.
- Cancelar cita exige código, email y teléfono.
- Admin puede aprobar, completar, cancelar o eliminar citas.
- Admin puede activar/desactivar barberos.

## Validaciones

- Frontend: campos requeridos, email válido, selección de servicio y horario.
- Backend: express-validator, sanitización, existencia de barbero/servicio, JWT y disponibilidad real.

## Roles grupales de ejemplo

- Líder técnico: arquitectura y revisión.
- Frontend: pantallas, componentes y experiencia responsive.
- Backend: modelos, endpoints y seguridad.
- Base de datos: seed, relaciones y consultas.
- QA: pruebas de reserva, cancelación y admin.
- Documentación: guías, endpoints y flujo del sistema.
