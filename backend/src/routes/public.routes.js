// Rutas publicas consumidas por clientes.

import { Router } from "express";
import { body, query } from "express-validator";
import {
  cancelAppointmentByClient,
  createAppointment,
  getAvailability,
  getBarbers,
  getPublicCalendarSummary,
  getServices
} from "../controllers/public.controller.js";
import { validate } from "../middleware/validate.middleware.js";

const router = Router();

router.get("/services", getServices);
router.get("/barbers", getBarbers);
router.get("/calendar", getPublicCalendarSummary);

router.get(
  "/availability",
  [
    query("barberId").isMongoId().withMessage("Barbero invalido."),
    query("date").isISO8601().withMessage("Fecha invalida."),
    query("serviceIds").notEmpty().withMessage("Debes enviar servicios.")
  ],
  validate,
  getAvailability
);

router.post(
  "/appointments",
  [
    body("firstName").isLength({ min: 2 }).withMessage("Nombre minimo de 2 caracteres."),
    body("lastName").isLength({ min: 2 }).withMessage("Apellido minimo de 2 caracteres."),
    body("email").isEmail().withMessage("Correo invalido."),
    body("phone").isLength({ min: 6 }).withMessage("Telefono invalido."),
    body("barberId").isMongoId().withMessage("Barbero invalido."),
    body("serviceIds").isArray({ min: 1 }).withMessage("Selecciona servicios."),
    body("date").isISO8601().withMessage("Fecha invalida."),
    body("time").matches(/^\d{2}:\d{2}$/).withMessage("Hora invalida.")
  ],
  validate,
  createAppointment
);

router.post(
  "/appointments/cancel",
  [
    body("appointmentId").notEmpty().withMessage("Codigo de cita requerido."),
    body("email").isEmail().withMessage("Correo invalido."),
    body("phone").notEmpty().withMessage("Telefono requerido.")
  ],
  validate,
  cancelAppointmentByClient
);

export default router;
