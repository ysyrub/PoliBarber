// Sanitizacion basica de strings entrantes.
// El objetivo es reducir HTML malicioso antes de guardar datos o renderizar mensajes.

import sanitizeHtml from "sanitize-html";

// cleanValue recorre objetos/arrays y limpia cada string sin tocar numeros, fechas o booleanos.
const cleanValue = (value) => {
  if (typeof value === "string") {
    return sanitizeHtml(value.trim(), { allowedTags: [], allowedAttributes: {} });
  }
  if (Array.isArray(value)) {
    return value.map(cleanValue);
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, val]) => [key, cleanValue(val)]));
  }
  return value;
};

// sanitizeRequest modifica body, params y query antes de llegar a rutas.
export const sanitizeRequest = (req, res, next) => {
  req.body = cleanValue(req.body);
  req.params = cleanValue(req.params);
  req.query = cleanValue(req.query);
  next();
};
