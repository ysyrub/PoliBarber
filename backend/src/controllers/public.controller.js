// Controladores publicos para clientes de PoliBarber.

import mongoose from "mongoose";
import { Appointment } from "../models/Appointment.js";
import { Barber } from "../models/Barber.js";
import { Cancellation } from "../models/Cancellation.js";
import { Client } from "../models/Client.js";
import { Service } from "../models/Service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { toDateKey } from "../utils/date.js";
import { calculateDuration, calculateTotal, ensureSlotAvailable, getAvailableSlots } from "../services/booking.service.js";

// getServices lista servicios y combos activos para las tarjetas del frontend.
export const getServices = asyncHandler(async (req, res) => {
  const services = await Service.find({ isActive: true }).sort({ type: 1, price: 1 });
  res.json({ ok: true, services });
});

// getBarbers lista barberos activos que pueden recibir reservas.
export const getBarbers = asyncHandler(async (req, res) => {
  const barbers = await Barber.find({ isActive: true }).sort({ name: 1 });
  res.json({ ok: true, barbers });
});

// getAvailability calcula horarios reales por dia, barbero y servicios seleccionados.
export const getAvailability = asyncHandler(async (req, res) => {
  const { barberId, date, serviceIds = "" } = req.query;

  const barber = await Barber.findById(barberId);
  if (!barber) return res.status(404).json({ ok: false, message: "Barbero no encontrado." });

  const ids = String(serviceIds).split(",").filter(Boolean);
  const services = await Service.find({ _id: { $in: ids }, isActive: true });
  if (!services.length) return res.status(422).json({ ok: false, message: "Selecciona al menos un servicio." });

  const durationMinutes = calculateDuration(services);
  const slots = await getAvailableSlots({ barber, dateKey: date, durationMinutes });

  res.json({
    ok: true,
    date,
    durationMinutes,
    slots
  });
});

// createAppointment guarda cliente y cita en una transaccion logica sencilla.
export const createAppointment = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, phone, barberId, serviceIds, date, time } = req.body;

  const barber = await Barber.findById(barberId);
  if (!barber || !barber.isActive) return res.status(404).json({ ok: false, message: "Barbero no disponible." });

  const services = await Service.find({ _id: { $in: serviceIds }, isActive: true });
  if (services.length !== serviceIds.length) {
    return res.status(422).json({ ok: false, message: "Uno o mas servicios no estan disponibles." });
  }

  const durationMinutes = calculateDuration(services);
  const totalPrice = calculateTotal(services);
  const slot = await ensureSlotAvailable({ barber, dateKey: date, time, durationMinutes });

  const client = await Client.findOneAndUpdate(
    { email: email.toLowerCase(), phone },
    { firstName, lastName, email: email.toLowerCase(), phone },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  const appointment = await Appointment.create({
    client: client._id,
    barber: barber._id,
    services: services.map((service) => service._id),
    startAt: slot.startAt,
    endAt: slot.endAt,
    durationMinutes,
    totalPrice,
    status: "pendiente",
    createdBy: "cliente"
  });

  const populated = await Appointment.findById(appointment._id).populate("client barber services");
  res.status(201).json({ ok: true, message: "Turno reservado correctamente.", appointment: populated });
});

// cancelAppointmentByClient permite cancelar solo si faltan mas de 24 horas.
export const cancelAppointmentByClient = asyncHandler(async (req, res) => {
  const { appointmentId, email, phone, reason = "Cancelacion solicitada por cliente" } = req.body;

  if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
    return res.status(422).json({ ok: false, message: "Codigo de cita invalido." });
  }

  const appointment = await Appointment.findById(appointmentId).populate("client");
  if (!appointment) return res.status(404).json({ ok: false, message: "Cita no encontrada." });

  const ownsAppointment = appointment.client.email === email.toLowerCase() && appointment.client.phone === phone;
  if (!ownsAppointment) return res.status(403).json({ ok: false, message: "Los datos no coinciden con la cita." });

  const hoursUntilAppointment = (appointment.startAt.getTime() - Date.now()) / (1000 * 60 * 60);
  if (hoursUntilAppointment <= 24) {
    return res.status(400).json({ ok: false, message: "Solo puedes cancelar si faltan mas de 24 horas." });
  }

  appointment.status = "cancelada";
  appointment.cancellationReason = reason;
  await appointment.save();
  await Cancellation.create({ appointment: appointment._id, cancelledBy: "cliente", reason });

  res.json({ ok: true, message: "Cita cancelada correctamente." });
});

// getPublicCalendarSummary devuelve dias cerrados y metadatos simples para pintar el calendario.
export const getPublicCalendarSummary = asyncHandler(async (req, res) => {
  const today = new Date();
  const days = Array.from({ length: 45 }).map((_, index) => {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + index);
    return {
      date: toDateKey(date),
      isSunday: date.getDay() === 0
    };
  });

  res.json({ ok: true, days });
});
