// Layout publico con navegacion, marca, contacto y rutas hijas.

import { Link, NavLink, Outlet } from "react-router-dom";
import { CalendarDays, Phone, Scissors, Shield } from "lucide-react";

export const MainLayout = () => (
  <div className="min-h-screen">
    <header className="sticky top-0 z-40 border-b border-white/10 bg-night/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-cyan-400 text-slate-950 shadow-glow">
            <Scissors className="h-5 w-5" />
          </span>
          <div>
            <p className="text-lg font-black">PoliBarber</p>
            <p className="text-xs text-slate-400">Ciudad del Este</p>
          </div>
        </Link>
        <div className="hidden items-center gap-2 md:flex">
          {[
            ["/", "Inicio"],
            ["/reservar", "Reservar"],
            ["/cancelar", "Cancelar"]
          ].map(([path, label]) => (
            <NavLink key={path} to={path} className={({ isActive }) => `rounded-xl px-4 py-2 text-sm transition ${isActive ? "bg-white/10 text-neon" : "text-slate-300 hover:bg-white/10"}`}>
              {label}
            </NavLink>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <a href="tel:+595973833080" className="hidden items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm text-slate-200 sm:flex">
            <Phone className="h-4 w-4 text-neon" /> +595 973 833080
          </a>
          <Link to="/admin" className="rounded-xl border border-cyan-300/30 p-3 text-neon" title="Panel administrador">
            <Shield className="h-5 w-5" />
          </Link>
        </div>
      </nav>
      <div className="grid grid-cols-3 border-t border-white/10 md:hidden">
        <NavLink to="/" className="py-3 text-center text-xs text-slate-300">Inicio</NavLink>
        <NavLink to="/reservar" className="flex items-center justify-center gap-1 py-3 text-center text-xs text-slate-300"><CalendarDays className="h-3 w-3" /> Reservar</NavLink>
        <NavLink to="/cancelar" className="py-3 text-center text-xs text-slate-300">Cancelar</NavLink>
      </div>
    </header>
    <Outlet />
    <footer className="border-t border-white/10 px-4 py-8 text-center text-sm text-slate-400">
      PoliBarber · Ciudad del Este, Paraguay · Pagos y precios en Gs.
    </footer>
  </div>
);
