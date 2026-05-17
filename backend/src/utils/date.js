// Utilidades de fecha y horarios de atencion.
// Se usa hora local del servidor; para Paraguay conviene ejecutar Windows en America/Asuncion.

export const OPEN_TIME = "07:00";
export const CLOSE_TIME = "22:00";
export const SLOT_MINUTES = 15;

// toDateKey convierte una fecha a YYYY-MM-DD para comparar dias sin hora.
export const toDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// parseLocalDateTime crea un Date local desde YYYY-MM-DD y HH:mm.
export const parseLocalDateTime = (dateKey, time) => {
  const [year, month, day] = dateKey.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  return new Date(year, month - 1, day, hour, minute, 0, 0);
};

// addMinutes devuelve una nueva fecha sumando minutos sin mutar la original.
export const addMinutes = (date, minutes) => new Date(date.getTime() + minutes * 60 * 1000);

// minutesFromTime convierte HH:mm en minutos desde medianoche.
export const minutesFromTime = (time) => {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
};

// timeFromMinutes convierte minutos desde medianoche a HH:mm.
export const timeFromMinutes = (minutes) => {
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
};

// isSunday detecta domingo. En JavaScript domingo es 0.
export const isSunday = (date) => date.getDay() === 0;

// paraguayFixedHolidays define feriados nacionales fijos comunes.
const paraguayFixedHolidays = new Set([
  "01-01",
  "03-01",
  "05-01",
  "05-14",
  "05-15",
  "06-12",
  "08-15",
  "09-29",
  "12-08",
  "12-25"
]);

// isHoliday excluye feriados fijos de Paraguay. Se mantiene aqui para que el calendario y la API usen la misma regla.
export const isHoliday = (date) => {
  const key = `${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  return paraguayFixedHolidays.has(key);
};

// overlaps indica si dos rangos [start, end) se pisan.
export const overlaps = (startA, endA, startB, endB) => startA < endB && startB < endA;
