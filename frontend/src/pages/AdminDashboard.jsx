// Dashboard administrativo con estadisticas, citas y gestion de barberos.

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CalendarCheck, DollarSign, Plus, RefreshCw, Scissors, Trash2, UserCheck } from "lucide-react";
import { api, getErrorMessage } from "../services/api.js";
import { Button } from "../components/Button.jsx";
import { EmptyState } from "../components/EmptyState.jsx";
import { formatDateTime, formatGs, todayKey } from "../utils/format.js";

const emptyBarber = { name: "", bio: "", avatarColor: "#38bdf8", isActive: true };
const emptyManual = { firstName: "", lastName: "", email: "", phone: "", barberId: "", serviceIds: [], date: todayKey(), time: "09:00" };

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [services, setServices] = useState([]);
  const [barberForm, setBarberForm] = useState(emptyBarber);
  const [manualForm, setManualForm] = useState(emptyManual);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsResponse, appointmentsResponse, barbersResponse, servicesResponse] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/admin/appointments"),
        api.get("/admin/barbers"),
        api.get("/services")
      ]);
      setStats(statsResponse.data.stats);
      setAppointments(appointmentsResponse.data.appointments);
      setBarbers(barbersResponse.data.barbers);
      setServices(servicesResponse.data.services);
      setManualForm((current) => ({ ...current, barberId: current.barberId || barbersResponse.data.barbers[0]?._id || "" }));
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const revenueByDay = useMemo(() => Object.entries(stats?.revenueByDay || {}).map(([date, revenue]) => ({ date, revenue })), [stats]);
  const servicesChart = useMemo(() => (stats?.topServices || []).slice(0, 6).map(([name, count]) => ({ name, count })), [stats]);

  const createBarber = async (event) => {
    event.preventDefault();
    try {
      await api.post("/admin/barbers", barberForm);
      toast.success("Barbero agregado.");
      setBarberForm(emptyBarber);
      loadData();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const toggleBarber = async (barber) => {
    try {
      await api.patch(`/admin/barbers/${barber._id}`, { isActive: !barber.isActive });
      toast.success("Estado actualizado.");
      loadData();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const deleteBarber = async (barberId) => {
    try {
      await api.delete(`/admin/barbers/${barberId}`);
      toast.success("Barbero eliminado.");
      loadData();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const updateAppointmentStatus = async (appointmentId, status) => {
    try {
      await api.patch(`/admin/appointments/${appointmentId}`, { status });
      toast.success("Cita actualizada.");
      loadData();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const deleteAppointment = async (appointmentId) => {
    try {
      await api.delete(`/admin/appointments/${appointmentId}`);
      toast.success("Cita eliminada.");
      loadData();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const createManualAppointment = async (event) => {
    event.preventDefault();
    try {
      await api.post("/admin/appointments", manualForm);
      toast.success("Cita manual creada.");
      setManualForm({ ...emptyManual, barberId: barbers[0]?._id || "" });
      loadData();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  if (loading) {
    return <div className="glass rounded-3xl p-8 text-center text-slate-300">Cargando dashboard administrativo...</div>;
  }

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-4">
        <StatCard icon={<CalendarCheck />} label="Reservas" value={stats?.totalReservations || 0} />
        <StatCard icon={<DollarSign />} label="Total ganado" value={formatGs(stats?.totalRevenue || 0)} />
        <StatCard icon={<UserCheck />} label="Más reservas" value={stats?.mostBookedBarber?.[0] || "Sin datos"} />
        <StatCard icon={<Scissors />} label="Más ganancias" value={stats?.mostRevenueBarber?.[0] || "Sin datos"} />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <ChartPanel title="Ganancias por día">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={revenueByDay}>
              <defs><linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#38bdf8" stopOpacity={0.7} /><stop offset="95%" stopColor="#38bdf8" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid stroke="rgba(148,163,184,.16)" />
              <XAxis dataKey="date" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip formatter={(value) => formatGs(value)} contentStyle={{ background: "#0f172a", border: "1px solid rgba(56,189,248,.35)" }} />
              <Area type="monotone" dataKey="revenue" stroke="#38bdf8" fill="url(#revenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel title="Servicios más solicitados">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={servicesChart}>
              <CartesianGrid stroke="rgba(148,163,184,.16)" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(56,189,248,.35)" }} />
              <Bar dataKey="count" fill="#a78bfa" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>
      </section>

      <section className="grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
        <div className="glass rounded-3xl p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-black">Gestión de barberos</h2>
            <Button variant="ghost" onClick={loadData}><RefreshCw className="h-4 w-4" /></Button>
          </div>
          <form onSubmit={createBarber} className="grid gap-3">
            <input placeholder="Nombre" value={barberForm.name} onChange={(event) => setBarberForm({ ...barberForm, name: event.target.value })} className="rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 outline-none" required />
            <input placeholder="Bio" value={barberForm.bio} onChange={(event) => setBarberForm({ ...barberForm, bio: event.target.value })} className="rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 outline-none" />
            <Button><Plus className="h-4 w-4" /> Agregar barbero</Button>
          </form>
          <div className="mt-5 space-y-3">
            {barbers.map((barber) => (
              <div key={barber._id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
                <div>
                  <p className="font-bold">{barber.name}</p>
                  <p className="text-xs text-slate-400">{barber.isActive ? "Activo" : "Inactivo"} · {barber.startTime} a {barber.endTime}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" onClick={() => toggleBarber(barber)}>{barber.isActive ? "Desactivar" : "Activar"}</Button>
                  <Button variant="danger" onClick={() => deleteBarber(barber._id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-3xl p-6">
          <h2 className="text-2xl font-black">Crear cita manual</h2>
          <form onSubmit={createManualAppointment} className="mt-5 grid gap-3 md:grid-cols-2">
            {["firstName", "lastName", "email", "phone"].map((field) => (
              <input key={field} placeholder={field} value={manualForm[field]} onChange={(event) => setManualForm({ ...manualForm, [field]: event.target.value })} className="rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 outline-none" required />
            ))}
            <select value={manualForm.barberId} onChange={(event) => setManualForm({ ...manualForm, barberId: event.target.value })} className="rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 outline-none">
              {barbers.map((barber) => <option key={barber._id} value={barber._id}>{barber.name}</option>)}
            </select>
            <select multiple value={manualForm.serviceIds} onChange={(event) => setManualForm({ ...manualForm, serviceIds: Array.from(event.target.selectedOptions).map((option) => option.value) })} className="rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 outline-none">
              {services.map((service) => <option key={service._id} value={service._id}>{service.name}</option>)}
            </select>
            <input type="date" value={manualForm.date} onChange={(event) => setManualForm({ ...manualForm, date: event.target.value })} className="rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 outline-none" />
            <input type="time" value={manualForm.time} onChange={(event) => setManualForm({ ...manualForm, time: event.target.value })} className="rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 outline-none" />
            <Button className="md:col-span-2"><Plus className="h-4 w-4" /> Crear cita</Button>
          </form>
        </div>
      </section>

      <section className="glass rounded-3xl p-6">
        <h2 className="text-2xl font-black">Gestión de citas</h2>
        <div className="mt-5 space-y-3">
          {appointments.length === 0 && <EmptyState title="Sin citas" text="Cuando entren reservas aparecerán aquí." />}
          {appointments.map((appointment) => (
            <div key={appointment._id} className="grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 lg:grid-cols-[1.2fr_1fr_auto] lg:items-center">
              <div>
                <p className="font-bold">{appointment.client?.firstName} {appointment.client?.lastName}</p>
                <p className="text-sm text-slate-400">{appointment.client?.phone} · {appointment.client?.email}</p>
              </div>
              <div className="text-sm text-slate-300">
                <p>{appointment.barber?.name} · {formatDateTime(appointment.startAt)}</p>
                <p>{appointment.services?.map((service) => service.name).join(", ")} · {formatGs(appointment.totalPrice)}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="ghost" onClick={() => updateAppointmentStatus(appointment._id, "aprobada")}>Aprobar</Button>
                <Button variant="ghost" onClick={() => updateAppointmentStatus(appointment._id, "completada")}>Completar</Button>
                <Button variant="danger" onClick={() => updateAppointmentStatus(appointment._id, "cancelada")}>Cancelar</Button>
                <Button variant="danger" onClick={() => deleteAppointment(appointment._id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const StatCard = ({ icon, label, value }) => (
  <article className="glass rounded-2xl p-5">
    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-300/15 text-neon">{icon}</div>
    <p className="text-sm text-slate-400">{label}</p>
    <p className="mt-2 text-2xl font-black">{value}</p>
  </article>
);

const ChartPanel = ({ title, children }) => (
  <article className="glass rounded-3xl p-6">
    <h2 className="mb-5 text-2xl font-black">{title}</h2>
    {children}
  </article>
);
