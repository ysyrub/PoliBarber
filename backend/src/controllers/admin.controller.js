// Controladores del panel administrativo protegido por JWT.

import { Appointment } from "../models/Appointment.js";
import { Barber } from "../models/Barber.js";
import { Cancellation } from "../models/Cancellation.js";
import { Client } from "../models/Client.js";
import { Service } from "../models/Service.js";
import { ScheduleOverride } from "../models/ScheduleOverride.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { calculateDuration, calculateTotal, ensureSlotAvailable, getAvailableSlots } from "../services/booking.service.js";
import { logAdminAction } from "../utils/adminLog.js";

// listAppointments devuelve todas las citas, filtrables por estado.
export const listAppointments = asyncHandler(async (req, res) => {
  const filter = req.query.status ? { status: req.query.status } : {};
  const appointments = await Appointment.find(filter).populate("client barber services").sort({ startAt: -1 });
  res.json({ ok: true, appointments });
});

// createAppointmentManual crea una cita desde el panel administrativo.
export const createAppointmentManual = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, phone, barberId, serviceIds, date, time, status = "aprobada" } = req.body;
  const barber = await Barber.findById(barberId);
  const services = await Service.find({ _id: { $in: serviceIds }, isActive: true });
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
    status,
    createdBy: "admin"
  });

  await logAdminAction({ adminUser: req.admin.username, action: "crear_cita", entity: "Appointment", entityId: appointment._id.toString() });
  res.status(201).json({ ok: true, appointment: await Appointment.findById(appointment._id).populate("client barber services") });
});

// updateAppointment cambia estado, barbero/fecha o servicios de una cita existente.
export const updateAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) return res.status(404).json({ ok: false, message: "Cita no encontrada." });

  const { status, cancellationReason } = req.body;
  if (status) appointment.status = status;
  if (cancellationReason) appointment.cancellationReason = cancellationReason;

  await appointment.save();
  await logAdminAction({ adminUser: req.admin.username, action: "editar_cita", entity: "Appointment", entityId: appointment._id.toString(), metadata: req.body });
  res.json({ ok: true, appointment: await Appointment.findById(appointment._id).populate("client barber services") });
});

// deleteAppointment elimina una cita y deja log administrativo.
export const deleteAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findByIdAndDelete(req.params.id);
  if (!appointment) return res.status(404).json({ ok: false, message: "Cita no encontrada." });

  await logAdminAction({ adminUser: req.admin.username, action: "eliminar_cita", entity: "Appointment", entityId: req.params.id });
  res.json({ ok: true, message: "Cita eliminada." });
});

// cancelAppointmentByAdmin cancela una cita sin regla de 24 horas porque es accion interna.
export const cancelAppointmentByAdmin = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) return res.status(404).json({ ok: false, message: "Cita no encontrada." });

  appointment.status = "cancelada";
  appointment.cancellationReason = req.body.reason || "Cancelada por administracion";
  await appointment.save();
  await Cancellation.create({ appointment: appointment._id, cancelledBy: "admin", reason: appointment.cancellationReason });
  await logAdminAction({ adminUser: req.admin.username, action: "cancelar_cita", entity: "Appointment", entityId: appointment._id.toString() });

  res.json({ ok: true, appointment });
});

// listBarbers devuelve todos los barberos, incluso inactivos.
export const listBarbers = asyncHandler(async (req, res) => {
  const barbers = await Barber.find().sort({ name: 1 });
  res.json({ ok: true, barbers });
});

// createBarber agrega un nuevo barbero.
export const createBarber = asyncHandler(async (req, res) => {
  const barber = await Barber.create(req.body);
  await logAdminAction({ adminUser: req.admin.username, action: "crear_barbero", entity: "Barber", entityId: barber._id.toString() });
  res.status(201).json({ ok: true, barber });
});

// updateBarber edita nombre, horarios, dias y estado activo.
export const updateBarber = asyncHandler(async (req, res) => {
  const barber = await Barber.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!barber) return res.status(404).json({ ok: false, message: "Barbero no encontrado." });
  await logAdminAction({ adminUser: req.admin.username, action: "editar_barbero", entity: "Barber", entityId: barber._id.toString(), metadata: req.body });
  res.json({ ok: true, barber });
});

// deleteBarber elimina un barbero cuando el negocio ya no quiere verlo en el panel.
export const deleteBarber = asyncHandler(async (req, res) => {
  const barber = await Barber.findByIdAndDelete(req.params.id);
  if (!barber) return res.status(404).json({ ok: false, message: "Barbero no encontrado." });
  await logAdminAction({ adminUser: req.admin.username, action: "eliminar_barbero", entity: "Barber", entityId: req.params.id });
  res.json({ ok: true, message: "Barbero eliminado." });
});

// getBarberAvailability permite que admin vea disponibilidad de un barbero.
export const getBarberAvailability = asyncHandler(async (req, res) => {
  const barber = await Barber.findById(req.params.id);
  if (!barber) return res.status(404).json({ ok: false, message: "Barbero no encontrado." });
  const services = await Service.find({ isActive: true }).limit(1);
  const durationMinutes = Number(req.query.duration) || calculateDuration(services);
  const slots = await getAvailableSlots({ barber, dateKey: req.query.date, durationMinutes });
  res.json({ ok: true, slots });
});

// createScheduleOverride cierra un dia completo global o para un barbero.
export const createScheduleOverride = asyncHandler(async (req, res) => {
  const override = await ScheduleOverride.create(req.body);
  await logAdminAction({ adminUser: req.admin.username, action: "bloquear_horario", entity: "ScheduleOverride", entityId: override._id.toString() });
  res.status(201).json({ ok: true, override });
});

// getDashboardStats calcula indicadores principales de reservas y ganancias.
export const getDashboardStats = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({ status: { $ne: "cancelada" } }).populate("barber services");
  const totalReservations = appointments.length;
  const totalRevenue = appointments.reduce((sum, item) => sum + item.totalPrice, 0);

  const byBarber = {};
  const byService = {};
  const byHour = {};
  const byDay = {};
  const byWeek = {};
  const byMonth = {};

  appointments.forEach((appointment) => {
    const barberName = appointment.barber?.name || "Sin barbero";
    byBarber[barberName] ||= { reservations: 0, revenue: 0 };
    byBarber[barberName].reservations += 1;
    byBarber[barberName].revenue += appointment.totalPrice;

    appointment.services.forEach((service) => {
      byService[service.name] = (byService[service.name] || 0) + 1;
    });

    const hour = `${String(appointment.startAt.getHours()).padStart(2, "0")}:00`;
    byHour[hour] = (byHour[hour] || 0) + 1;

    const dayKey = appointment.startAt.toISOString().slice(0, 10);
    byDay[dayKey] = (byDay[dayKey] || 0) + appointment.totalPrice;

    const weekKey = `${appointment.startAt.getFullYear()}-W${Math.ceil((((appointment.startAt - new Date(appointment.startAt.getFullYear(), 0, 1)) / 86400000) + 1) / 7)}`;
    byWeek[weekKey] = (byWeek[weekKey] || 0) + appointment.totalPrice;

    const monthKey = appointment.startAt.toISOString().slice(0, 7);
    byMonth[monthKey] = (byMonth[monthKey] || 0) + appointment.totalPrice;
  });

  const barberEntries = Object.entries(byBarber);
  const mostBookedBarber = barberEntries.sort((a, b) => b[1].reservations - a[1].reservations)[0] || null;
  const mostRevenueBarber = barberEntries.sort((a, b) => b[1].revenue - a[1].revenue)[0] || null;
  const leastBookedBarber = barberEntries.sort((a, b) => a[1].reservations - b[1].reservations)[0] || null;

  res.json({
    ok: true,
    stats: {
      totalReservations,
      totalRevenue,
      mostBookedBarber,
      mostRevenueBarber,
      leastBookedBarber,
      busiestHours: Object.entries(byHour).sort((a, b) => b[1] - a[1]),
      topServices: Object.entries(byService).sort((a, b) => b[1] - a[1]),
      revenueByDay: byDay,
      revenueByWeek: byWeek,
      revenueByMonth: byMonth,
      byBarber
    }
  });
});
