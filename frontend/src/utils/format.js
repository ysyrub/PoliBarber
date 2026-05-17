// Utilidades de formato compartidas por componentes.

export const formatGs = (value = 0) =>
  new Intl.NumberFormat("es-PY", {
    style: "currency",
    currency: "PYG",
    maximumFractionDigits: 0
  })
    .format(value)
    .replace("PYG", "Gs.");

export const todayKey = () => new Date().toISOString().slice(0, 10);

export const formatDateTime = (date) =>
  new Intl.DateTimeFormat("es-PY", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(date));
