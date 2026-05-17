// Pagina de reservas: datos del cliente, servicios, barbero, calendario y horarios.

import { useEffect, useMemo, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import toast from "react-hot-toast";
import { CalendarDays, CheckCircle2, Clock, UserRound } from "lucide-react";
import { motion } from "framer-motion";
import { api, getErrorMessage } from "../services/api.js";
import { Button } from "../components/Button.jsx";
import { EmptyState } from "../components/EmptyState.jsx";
import { formatGs, todayKey } from "../utils/format.js";

const emptyForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: ""
};

export default function Booking() {
  const [services, setServices] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [barberId, setBarberId] = useState("");
  const [date, setDate] = useState(todayKey());
  const [slots, setSlots] = useState([]);
  const [time, setTime] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lastAppointment, setLastAppointment] = useState(null);

  useEffect(() => {
    Promise.all([api.get("/services"), api.get("/barbers")]).then(([servicesResponse, barbersResponse]) => {
      setServices(servicesResponse.data.services);
      setBarbers(barbersResponse.data.barbers);
      setBarberId(barbersResponse.data.barbers[0]?._id || "");
    });
  }, []);

  const selectedServiceObjects = useMemo(() => services.filter((service) => selectedServices.includes(service._id)), [services, selectedServices]);
  const total = selectedServiceObjects.reduce((sum, service) => sum + service.price, 0);

  useEffect(() => {
    if (!barberId || !date || selectedServices.length === 0) {
      setSlots([]);
      return;
    }

    setLoadingSlots(true);
    setTime("");
    api
      .get("/availability", { params: { barberId, date, serviceIds: selectedServices.join(",") } })
      .then((response) => setSlots(response.data.slots))
      .catch((error) => toast.error(getErrorMessage(error)))
      .finally(() => setLoadingSlots(false));
  }, [barberId, date, selectedServices]);

  const toggleService = (serviceId) => {
    setSelectedServices((current) => (current.includes(serviceId) ? current.filter((id) => id !== serviceId) : [...current, serviceId]));
  };

  const updateForm = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const submitBooking = async (event) => {
    event.preventDefault();
    if (!time) return toast.error("Selecciona un horario disponible.");
    setSaving(true);
    try {
      const { data } = await api.post("/appointments", { ...form, barberId, serviceIds: selectedServices, date, time });
      setLastAppointment(data.appointment);
      setForm(emptyForm);
      toast.success("Turno reservado correctamente.");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.28em] text-cyan-200">Reservas</p>
        <h1 className="mt-2 text-4xl font-black">Agenda tu turno</h1>
      </div>

      <form onSubmit={submitBooking} className="grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
        <motion.section className="glass rounded-3xl p-6" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}>
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold"><UserRound className="h-5 w-5 text-neon" /> Datos del cliente</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["firstName", "Nombre"],
              ["lastName", "Apellido"],
              ["email", "Correo electrónico"],
              ["phone", "Teléfono"]
            ].map(([name, label]) => (
              <label key={name} className="text-sm text-slate-300">
                {label}
                <input
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition focus:border-cyan-300"
                  name={name}
                  type={name === "email" ? "email" : "text"}
                  value={form[name]}
                  onChange={updateForm}
                  required
                />
              </label>
            ))}
          </div>

          <h2 className="mb-4 mt-8 flex items-center gap-2 text-xl font-bold"><ScissorIcon /> Servicios</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {services.map((service) => (
              <button
                type="button"
                key={service._id}
                onClick={() => toggleService(service._id)}
                className={`rounded-2xl border p-4 text-left transition ${selectedServices.includes(service._id) ? "border-cyan-300 bg-cyan-300/14" : "border-white/10 bg-white/5 hover:border-cyan-300/50"}`}
              >
                <span className="text-xs uppercase text-slate-400">{service.type}</span>
                <span className="mt-1 block font-bold">{service.name}</span>
                <span className="mt-2 block text-neon">{formatGs(service.price)}</span>
              </button>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/60 p-4">
            <p className="text-sm text-slate-400">Total estimado</p>
            <p className="text-3xl font-black text-neon">{formatGs(total)}</p>
          </div>
        </motion.section>

        <motion.section className="glass rounded-3xl p-6" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}>
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold"><CalendarDays className="h-5 w-5 text-neon" /> Barbero y calendario</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm text-slate-300">
              Barbero
              <select value={barberId} onChange={(event) => setBarberId(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none">
                {barbers.map((barber) => <option key={barber._id} value={barber._id}>{barber.name}</option>)}
              </select>
            </label>
            <label className="text-sm text-slate-300">
              Fecha seleccionada
              <input type="date" min={todayKey()} value={date} onChange={(event) => setDate(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none" />
            </label>
          </div>

          <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/40 p-3">
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              height="auto"
              selectable
              dateClick={(info) => setDate(info.dateStr)}
              validRange={{ start: todayKey() }}
              events={date ? [{ title: "Seleccionado", date, color: "#38bdf8" }] : []}
            />
          </div>

          <h3 className="mt-6 flex items-center gap-2 font-bold"><Clock className="h-5 w-5 text-neon" /> Horarios disponibles</h3>
          <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5">
            {loadingSlots ? Array.from({ length: 10 }).map((_, index) => <div key={index} className="h-12 animate-pulse rounded-xl bg-white/10" />) : slots.map((slot) => (
              <button type="button" key={slot.time} onClick={() => setTime(slot.time)} className={`rounded-xl border px-3 py-3 text-sm font-bold transition ${time === slot.time ? "border-cyan-300 bg-cyan-300 text-slate-950" : "border-white/10 bg-white/5 hover:border-cyan-300"}`}>
                {slot.time}
              </button>
            ))}
          </div>
          {!loadingSlots && selectedServices.length > 0 && slots.length === 0 && <div className="mt-4"><EmptyState title="Sin horarios" text="Prueba otro dia, otro barbero o una combinacion mas corta." /></div>}

          <Button className="mt-6 w-full" disabled={saving || selectedServices.length === 0}>
            <CheckCircle2 className="h-5 w-5" /> {saving ? "Reservando..." : "Confirmar reserva"}
          </Button>

          {lastAppointment && (
            <div className="mt-5 rounded-2xl border border-emerald-300/30 bg-emerald-400/10 p-4 text-sm">
              <p className="font-bold text-emerald-200">Reserva creada. Código de cita:</p>
              <p className="mt-1 break-all font-mono text-cyan-100">{lastAppointment._id}</p>
            </div>
          )}
        </motion.section>
      </form>
    </main>
  );
}

const ScissorIcon = () => (
  <svg className="h-5 w-5 text-neon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="6" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <path d="M20 4 8.12 15.88" />
    <path d="M14.47 14.48 20 20" />
    <path d="M8.12 8.12 12 12" />
  </svg>
);
