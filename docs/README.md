# PoliBarber

Sistema web full stack para agendamiento de barbería en Ciudad del Este, Paraguay.

## Tecnologías

- Frontend: React.js, Vite, TailwindCSS, Framer Motion, Axios, React Router DOM, FullCalendar, Lucide React, Recharts.
- Backend: Node.js, Express.js, MongoDB, Mongoose, JWT, Helmet, CORS, express-validator.
- Base de datos: MongoDB local.
- Moneda: guaraníes paraguayos, mostrados como `Gs.`.

## Estructura

```text
C:\proyectos\PoliBarber
├── backend
├── frontend
├── database
└── docs
```

## Instalación rápida

```bash
cd C:\proyectos\PoliBarber
npm run install:all
copy backend\.env.example backend\.env
copy frontend\.env.example frontend\.env
npm run seed
npm run dev
```

## Accesos

- Frontend: `http://localhost:5173`
- Backend health: `http://localhost:5000/api/health`
- Admin: `http://localhost:5173/admin`
- Usuario admin: `admin`
- Contraseña admin: `poli123`

## Scripts

- `npm run dev`: inicia backend y frontend juntos.
- `npm run server`: inicia solo backend.
- `npm run client`: inicia solo frontend.
- `npm run build`: genera build de producción del frontend.
- `npm run seed`: carga barberos y servicios iniciales.

## Funcionalidades

- Servicios, combos y precios en Gs.
- Selección de barbero.
- Calendario dinámico.
- Horarios disponibles por día.
- Bloqueo automático por citas existentes.
- Exclusión de domingos y feriados fijos de Paraguay.
- Reservas públicas.
- Cancelación pública solo con más de 24 horas.
- Panel admin protegido con JWT.
- CRUD de citas y barberos.
- Dashboard con ganancias, reservas, servicios y barberos destacados.
