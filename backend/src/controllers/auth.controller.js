// Controlador de autenticacion administrativa.

import jwt from "jsonwebtoken";

// createToken firma un JWT con usuario y rol admin.
const createToken = (username) =>
  jwt.sign({ username, role: "admin" }, process.env.JWT_SECRET || "dev_secret_polibarber", {
    expiresIn: process.env.JWT_EXPIRES_IN || "8h"
  });

// loginAdmin valida las credenciales fijas pedidas: admin / poli123.
export const loginAdmin = (req, res) => {
  const { username, password } = req.body;
  const expectedUser = process.env.ADMIN_USER || "admin";
  const expectedPassword = process.env.ADMIN_PASSWORD || "poli123";

  if (username !== expectedUser || password !== expectedPassword) {
    return res.status(401).json({ ok: false, message: "Usuario o contrasena incorrectos." });
  }

  res.json({
    ok: true,
    token: createToken(username),
    admin: { username, role: "admin" }
  });
};

// getAdminProfile devuelve informacion basica del token validado.
export const getAdminProfile = (req, res) => {
  res.json({ ok: true, admin: req.admin });
};
