// Rutas protegidas del panel administrativo.

import { Router } from "express";
import { body } from "express-validator";
import {
  cancelAppointmentByAdmin,
  createAppointmentManual,
  createBarber,
  createScheduleOverride,
  deleteAppointment,
  deleteBarber,
  getBarberAvailability,
  getDashboardStats,
  listAppointments,
  listBarbers,
  updateAppointment,
  updateBarber
} from "../controllers/admin.controller.js";
import { protectAdmin } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

const router = Router();

router.use(protectAdmin);

router.get("/stats", getDashboardStats);

router.get("/appointments", listAppointments);
router.post(
  "/appointments",
  [
    body("firstName").notEmpty(),
    body("lastName").notEmpty(),
    body("email").isEmail(),
    body("phone").notEmpty(),
    body("barberId").isMongoId(),
    body("serviceIds").isArray({ min: 1 }),
    body("date").isISO8601(),
    body("time").matches(/^\d{2}:\d{2}$/)
  ],
  validate,
  createAppointmentManual
);
router.patch("/appointments/:id", updateAppointment);
router.patch("/appointments/:id/cancel", cancelAppointmentByAdmin);
router.delete("/appointments/:id", deleteAppointment);

router.get("/barbers", listBarbers);
router.post("/barbers", [body("name").isLength({ min: 2 })], validate, createBarber);
router.patch("/barbers/:id", updateBarber);
router.delete("/barbers/:id", deleteBarber);
router.get("/barbers/:id/availability", getBarberAvailability);

router.post("/schedule-overrides", [body("date").isISO8601()], validate, createScheduleOverride);

export default router;
