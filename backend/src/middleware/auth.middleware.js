// Middleware JWT para proteger las rutas del panel administrativo.

import jwt from "jsonwebtoken";

// protectAdmin valida el header Authorization: Bearer <token>.
export const protectAdmin = (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ ok: false, message: "Token administrativo requerido." });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "dev_secret_polibarber");
    req.admin = payload;
    next();
  } catch (error) {
    return res.status(401).json({ ok: false, message: "Token invalido o vencido." });
  }
};
