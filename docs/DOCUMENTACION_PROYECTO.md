# Documentación técnica de PoliBarber

## Funcionamiento general

PoliBarber separa responsabilidades en frontend, backend y base de datos. El cliente reserva desde React; React consulta Express; Express valida, calcula disponibilidad y guarda en MongoDB.

## Backend

El backend está en `backend/src`.

- `server.js`: inicia Express, seguridad, CORS, JSON, sanitización y rutas.
- `config/db.js`: conecta MongoDB con Mongoose.
- `models`: define colecciones de barberos, clientes, servicios, citas, cancelaciones, bloqueos y logs.
- `services/booking.service.js`: contiene reglas de duración, precios y disponibilidad.
- `controllers`: procesa las peticiones HTTP.
- `routes`: define endpoints públicos y administrativos.
- `middleware`: autenticación JWT, validación, sanitización y manejo de errores.

## Frontend

El frontend está en `frontend/src`.

- `main.jsx`: monta React y configura router/toasts.
- `App.jsx`: declara rutas.
- `layouts`: estructuras pública y admin.
- `pages`: Inicio, Reservas, Cancelación, Login Admin, Dashboard Admin.
- `components`: botones, loading, skeleton y estados vacíos.
- `services/api.js`: cliente Axios.
- `context/AuthContext.jsx`: token JWT y sesión admin.

## Base de datos

Colecciones principales:

- `clients`: nombre, apellido, email y teléfono.
- `appointments`: cliente, barbero, servicios, inicio, fin, duración, precio y estado.
- `services`: servicios individuales y combos.
- `barbers`: barberos, estado activo, horarios y días laborales.
- `scheduleoverrides`: bloqueos administrativos de días.
- `cancellations`: historial de cancelaciones.
- `adminlogs`: auditoría de acciones administrativas.

## Cálculo de duración

La función `calculateDuration` aplica:

- Mínimo: 60 minutos.
- `Pelo + Ceja`: 65 minutos.
- Cada servicio adicional suma 15 minutos.

Los combos tienen `items`, por ejemplo `Completo con baño` equivale a pelo, barba, ceja y bañado. Eso permite calcular duración real aunque el usuario elija un combo.

## Disponibilidad

La función `getAvailableSlots`:

1. Rechaza barberos inactivos.
2. Rechaza domingos.
3. Rechaza feriados fijos de Paraguay.
4. Rechaza bloqueos administrativos.
5. Lee citas del día.
6. Genera horarios cada 15 minutos entre 07:00 y 22:00.
7. Elimina horarios pasados.
8. Elimina rangos que se pisan con citas existentes.

## Autenticación

El administrador inicia sesión en `/api/auth/login`.

Si usuario y contraseña son correctos, el backend firma un JWT con:

- `username`
- `role: admin`
- vencimiento configurado en `JWT_EXPIRES_IN`

El frontend guarda el token en `localStorage` y Axios lo envía como:

```text
Authorization: Bearer <token>
```

Las rutas `/api/admin/*` usan `protectAdmin`, que verifica el token antes de permitir acceso.

## Endpoints públicos

- `GET /api/services`: lista servicios activos.
- `GET /api/barbers`: lista barberos activos.
- `GET /api/calendar`: resumen simple del calendario.
- `GET /api/availability`: horarios disponibles por barbero, fecha y servicios.
- `POST /api/appointments`: crea reserva.
- `POST /api/appointments/cancel`: cancela si faltan más de 24 horas.

## Endpoints admin

- `POST /api/auth/login`: login.
- `GET /api/auth/me`: perfil del admin.
- `GET /api/admin/stats`: estadísticas.
- `GET /api/admin/appointments`: citas.
- `POST /api/admin/appointments`: crear cita manual.
- `PATCH /api/admin/appointments/:id`: editar estado.
- `PATCH /api/admin/appointments/:id/cancel`: cancelar desde admin.
- `DELETE /api/admin/appointments/:id`: eliminar cita.
- `GET /api/admin/barbers`: listar barberos.
- `POST /api/admin/barbers`: crear barbero.
- `PATCH /api/admin/barbers/:id`: editar barbero.
- `DELETE /api/admin/barbers/:id`: eliminar barbero.
- `GET /api/admin/barbers/:id/availability`: disponibilidad de barbero.
- `POST /api/admin/schedule-overrides`: bloquear día.

## Flujo de reserva

1. Cliente completa nombre, apellido, email y teléfono.
2. Selecciona servicios o combos.
3. Selecciona barbero.
4. Selecciona día en calendario.
5. React consulta disponibilidad.
6. Backend calcula duración y horarios libres.
7. Cliente elige hora.
8. Backend vuelve a validar disponibilidad.
9. MongoDB guarda cliente y cita.
10. React muestra código de cita.
