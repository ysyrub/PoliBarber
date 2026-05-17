// Middleware generico para procesar reglas de express-validator.

import { validationResult } from "express-validator";

// validate junta los errores de validacion y corta la request si hay datos invalidos.
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      ok: false,
      message: "Datos invalidos. Revisa el formulario.",
      errors: errors.array()
    });
  }
  next();
};
