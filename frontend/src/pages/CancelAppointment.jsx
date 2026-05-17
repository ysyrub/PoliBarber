// Pagina publica para cancelar reservas con validacion de 24 horas en backend.

import { useState } from "react";
import toast from "react-hot-toast";
import { Ban, Mail, Phone } from "lucide-react";
import { Button } from "../components/Button.jsx";
import { api, getErrorMessage } from "../services/api.js";

export default function CancelAppointment() {
  const [form, setForm] = useState({ appointmentId: "", email: "", phone: "", reason: "" });
  const [loading, setLoading] = useState(false);

  const updateForm = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const submitCancel = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/appointments/cancel", form);
      toast.success(data.message);
      setForm({ appointmentId: "", email: "", phone: "", reason: "" });
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <section className="glass rounded-3xl p-6 md:p-8">
        <div className="mb-6">
          <p className="text-sm uppercase tracking-[0.28em] text-cyan-200">Cancelación</p>
          <h1 className="mt-2 text-4xl font-black">Cancelar turno</h1>
          <p className="mt-3 text-slate-300">Puedes cancelar solo si faltan más de 24 horas para tu cita.</p>
        </div>
        <form onSubmit={submitCancel} className="grid gap-4">
          <label className="text-sm text-slate-300">
            Código de cita
            <input name="appointmentId" value={form.appointmentId} onChange={updateForm} required className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none" />
          </label>
          <label className="text-sm text-slate-300">
            <Mail className="mr-1 inline h-4 w-4 text-neon" /> Correo electrónico
            <input type="email" name="email" value={form.email} onChange={updateForm} required className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none" />
          </label>
          <label className="text-sm text-slate-300">
            <Phone className="mr-1 inline h-4 w-4 text-neon" /> Teléfono
            <input name="phone" value={form.phone} onChange={updateForm} required className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none" />
          </label>
          <label className="text-sm text-slate-300">
            Motivo opcional
            <textarea name="reason" value={form.reason} onChange={updateForm} rows="3" className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none" />
          </label>
          <Button variant="danger" disabled={loading}><Ban className="h-5 w-5" /> {loading ? "Cancelando..." : "Cancelar cita"}</Button>
        </form>
      </section>
    </main>
  );
}
