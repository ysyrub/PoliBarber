// Pagina de inicio publica con servicios, barberos y CTA de reserva.

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CalendarCheck, MapPin, Phone, Scissors, Sparkles } from "lucide-react";
import { api } from "../services/api.js";
import { Button } from "../components/Button.jsx";
import { Skeleton } from "../components/Skeleton.jsx";
import { formatGs } from "../utils/format.js";

export default function Home() {
  const [services, setServices] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/services"), api.get("/barbers")])
      .then(([servicesResponse, barbersResponse]) => {
        setServices(servicesResponse.data.services);
        setBarbers(barbersResponse.data.barbers);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <main>
      <section className="mx-auto grid min-h-[calc(100vh-88px)] max-w-7xl items-center gap-10 px-4 py-12 lg:grid-cols-[1.08fr_.92fr]">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100">
            <Sparkles className="h-4 w-4" /> Agenda premium en Ciudad del Este
          </div>
          <h1 className="max-w-3xl text-5xl font-black leading-tight text-white md:text-7xl">PoliBarber</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Reservas inteligentes, horarios reales y experiencia futurista para cortes, barba, ceja y combos profesionales.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/reservar">
              <Button><CalendarCheck className="h-5 w-5" /> Reservar turno</Button>
            </Link>
            <a href="tel:+595973833080">
              <Button variant="ghost"><Phone className="h-5 w-5" /> +595 973 833080</Button>
            </a>
          </div>
          <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-300">
            <span className="rounded-full border border-white/10 px-4 py-2">Lunes a sábado · 07:00 a 22:00</span>
            <span className="rounded-full border border-white/10 px-4 py-2">Domingos cerrado</span>
            <span className="rounded-full border border-white/10 px-4 py-2"><MapPin className="mr-1 inline h-4 w-4 text-neon" /> Ciudad del Este</span>
          </div>
        </motion.div>

        <motion.div className="glass rounded-3xl p-5" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
          <div className="rounded-2xl border border-cyan-300/20 bg-slate-950/60 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Disponibilidad dinámica</p>
                <h2 className="text-2xl font-black">Agenda inteligente</h2>
              </div>
              <Scissors className="h-8 w-8 text-neon" />
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {["07:00", "09:30", "14:15", "18:45"].map((time) => (
                <div key={time} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-2xl font-black text-neon">{time}</p>
                  <p className="text-xs text-slate-400">slot posible</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="text-3xl font-black">Servicios y combos</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {loading ? Array.from({ length: 8 }).map((_, index) => <Skeleton key={index} className="h-36" />) : services.map((service) => (
            <article key={service._id} className="glass rounded-2xl p-5">
              <p className="text-xs uppercase tracking-[0.25em] text-cyan-200">{service.type}</p>
              <h3 className="mt-3 text-xl font-bold">{service.name}</h3>
              <p className="mt-4 text-2xl font-black text-neon">{formatGs(service.price)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="text-3xl font-black">Barberos</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {barbers.map((barber) => (
            <article key={barber._id} className="glass rounded-2xl p-6">
              <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl text-xl font-black text-slate-950" style={{ background: barber.avatarColor }}>
                {barber.name[0]}
              </div>
              <h3 className="text-xl font-bold">{barber.name}</h3>
              <p className="mt-2 text-sm text-slate-300">{barber.bio}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
