// Rutas de autenticacion del administrador.

import { Router } from "express";
import { body } from "express-validator";
import { getAdminProfile, loginAdmin } from "../controllers/auth.controller.js";
import { protectAdmin } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

const router = Router();

router.post(
  "/login",
  [
    body("username").notEmpty().withMessage("El usuario es obligatorio."),
    body("password").notEmpty().withMessage("La contrasena es obligatoria.")
  ],
  validate,
  loginAdmin
);

router.get("/me", protectAdmin, getAdminProfile);

export default router;
