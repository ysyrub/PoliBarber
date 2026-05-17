// Servicio de dominio para duracion, precios y disponibilidad.
// Los controladores llaman estas funciones para mantener reglas de negocio en un solo lugar.

import { Appointment } from "../models/Appointment.js";
import { ScheduleOverride } from "../models/ScheduleOverride.js";
import {
  addMinutes,
  CLOSE_TIME,
  isHoliday,
  isSunday,
  minutesFromTime,
  OPEN_TIME,
  overlaps,
  parseLocalDateTime,
  SLOT_MINUTES,
  timeFromMinutes,
  toDateKey
} from "../utils/date.js";

// normalizeItems transforma los nombres de items a minusculas para comparar reglas.
const normalizeItems = (services) =>
  services.flatMap((service) => service.items?.length ? service.items : [service.name]).map((item) => item.toLowerCase());

// calculateDuration aplica las reglas solicitadas:
// minimo 60 minutos, Pelo + Ceja = 65, y cada servicio adicional suma 15.
export const calculateDuration = (services) => {
  const items = normalizeItems(services);
  const uniqueItems = [...new Set(items)];

  if (uniqueItems.includes("pelo") && uniqueItems.includes("ceja") && uniqueItems.length === 2) {
    return 65;
  }

  const additionalItems = Math.max(uniqueItems.length - 1, 0);
  return 60 + additionalItems * 15;
};

// calculateTotal suma precios ya guardados en MongoDB, siempre en guaranies.
export const calculateTotal = (services) => services.reduce((sum, service) => sum + service.price, 0);

// getDayBounds devuelve el rango completo de un dia local.
const getDayBounds = (dateKey) => {
  const dayStart = parseLocalDateTime(dateKey, "00:00");
  const dayEnd = addMinutes(dayStart, 24 * 60);
  return { dayStart, dayEnd };
};

// isClosedDay valida domingos, feriados y bloqueos administrativos globales.
export const isClosedDay = async (dateKey, barberId = null) => {
  const date = parseLocalDateTime(dateKey, "12:00");
  if (isSunday(date) || isHoliday(date)) return true;

  const globalOverride = await ScheduleOverride.findOne({ date: dateKey, barber: null, isClosed: true });
  const barberOverride = barberId ? await ScheduleOverride.findOne({ date: dateKey, barber: barberId, isClosed: true }) : null;
  return Boolean(globalOverride || barberOverride);
};

// getAvailableSlots calcula horarios libres para un barbero, dia y duracion concreta.
export const getAvailableSlots = async ({ barber, dateKey, durationMinutes }) => {
  if (!barber?.isActive) return [];
  if (await isClosedDay(dateKey, barber._id)) return [];

  const date = parseLocalDateTime(dateKey, "12:00");
  if (!barber.workDays.includes(date.getDay())) return [];

  const { dayStart, dayEnd } = getDayBounds(dateKey);
  const bookedAppointments = await Appointment.find({
    barber: barber._id,
    status: { $in: ["pendiente", "aprobada", "completada"] },
    startAt: { $lt: dayEnd },
    endAt: { $gt: dayStart }
  }).select("startAt endAt");

  const openMinutes = minutesFromTime(barber.startTime || OPEN_TIME);
  const closeMinutes = minutesFromTime(barber.endTime || CLOSE_TIME);
  const lastStart = closeMinutes - durationMinutes;
  const slots = [];
  const now = new Date();

  for (let minute = openMinutes; minute <= lastStart; minute += SLOT_MINUTES) {
    const startAt = parseLocalDateTime(dateKey, timeFromMinutes(minute));
    const endAt = addMinutes(startAt, durationMinutes);
    const isPast = startAt <= now;
    const isBusy = bookedAppointments.some((appointment) => overlaps(startAt, endAt, appointment.startAt, appointment.endAt));

    if (!isPast && !isBusy) {
      slots.push({ time: timeFromMinutes(minute), startAt, endAt });
    }
  }

  return slots;
};

// ensureSlotAvailable verifica una hora puntual antes de guardar una cita.
export const ensureSlotAvailable = async ({ barber, dateKey, time, durationMinutes }) => {
  const slots = await getAvailableSlots({ barber, dateKey, durationMinutes });
  const selectedSlot = slots.find((slot) => slot.time === time);

  if (!selectedSlot) {
    const error = new Error("El horario seleccionado ya no esta disponible.");
    error.statusCode = 409;
    throw error;
  }

  return selectedSlot;
};
