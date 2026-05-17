// Punto de entrada principal del backend de PoliBarber.
// Este archivo levanta Express, conecta MongoDB, registra middlewares globales
// y monta todas las rutas publicas y administrativas del sistema.

import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import publicRoutes from "./routes/public.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware.js";
import { sanitizeRequest } from "./middleware/sanitize.middleware.js";
import { ensureDefaultData } from "./services/seedDefaults.service.js";

// Carga variables desde backend/.env. Si no existe, se usan valores por defecto seguros para desarrollo.
dotenv.config();

// app contiene la instancia de Express sobre la que se configuran middlewares y rutas.
const app = express();

// PORT define el puerto del servidor HTTP; 5000 evita chocar con Vite, que usa 5173.
const PORT = process.env.PORT || 5000;

// helmet agrega cabeceras HTTP de seguridad para reducir riesgos comunes en navegadores.
app.use(helmet());

// cors permite que el frontend React consuma la API desde localhost:5173.
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
  })
);

// express.json parsea cuerpos JSON. El limite evita payloads demasiado grandes.
app.use(express.json({ limit: "1mb" }));

// sanitizeRequest limpia strings enviados por el usuario antes de que lleguen a controladores.
app.use(sanitizeRequest);

// morgan imprime logs breves de cada request durante desarrollo.
app.use(morgan("dev"));

// apiLimiter reduce abuso basico sobre la API sin bloquear el uso normal.
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false
});
app.use("/api", apiLimiter);

// Ruta simple para confirmar que el servidor esta vivo.
app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    service: "PoliBarber API",
    location: "Ciudad del Este, Paraguay"
  });
});

// Rutas publicas para servicios, barberos, disponibilidad, reservas y cancelaciones.
app.use("/api", publicRoutes);

// Rutas de autenticacion administrativa: login y perfil.
app.use("/api/auth", authRoutes);

// Rutas protegidas del panel administrativo.
app.use("/api/admin", adminRoutes);

// Handler 404 cuando ninguna ruta coincide.
app.use(notFoundHandler);

// Handler centralizado de errores; siempre va al final.
app.use(errorHandler);

// startServer conecta la base de datos antes de aceptar requests.
const startServer = async () => {
  await connectDB();
  await ensureDefaultData();
  app.listen(PORT, () => {
    console.log(`PoliBarber API escuchando en http://localhost:${PORT}`);
  });
};

// Si MongoDB falla, se registra el error y el proceso termina para no operar a medias.
startServer().catch((error) => {
  console.error("No se pudo iniciar PoliBarber API:", error);
  process.exit(1);
});
