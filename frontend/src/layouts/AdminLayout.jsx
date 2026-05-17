// Layout del panel administrativo con barra superior protegida.

import { LogOut, Scissors } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { Button } from "../components/Button.jsx";

export const AdminLayout = ({ children }) => {
  const { logout, admin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin");
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-white/10 bg-night/85 px-4 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-400 text-slate-950">
              <Scissors className="h-5 w-5" />
            </span>
            <div>
              <p className="font-black">Panel PoliBarber</p>
              <p className="text-xs text-slate-400">Admin: {admin?.username}</p>
            </div>
          </div>
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut className="h-4 w-4" /> Salir
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
    </div>
  );
};
