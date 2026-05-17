// Middlewares de error compartidos por toda la API.

// notFoundHandler responde cuando Express no encontro una ruta coincidente.
export const notFoundHandler = (req, res, next) => {
  const error = new Error(`Ruta no encontrada: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

// errorHandler convierte errores internos en respuestas JSON consistentes.
export const errorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    ok: false,
    message: error.message || "Error interno del servidor",
    details: process.env.NODE_ENV === "production" ? undefined : error.details
  });
};
