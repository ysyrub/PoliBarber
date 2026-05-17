// Login administrativo protegido por JWT.

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { LockKeyhole, Scissors } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { Button } from "../components/Button.jsx";
import { getErrorMessage } from "../services/api.js";

export default function AdminLogin() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("poli123");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await login(username, password);
      toast.success("Bienvenido al panel.");
      navigate("/admin/dashboard");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center px-4">
      <form onSubmit={submit} className="glass w-full max-w-md rounded-3xl p-8">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-cyan-400 text-slate-950 shadow-glow">
            <Scissors className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-black">Admin PoliBarber</h1>
          <p className="mt-2 text-sm text-slate-400">Acceso protegido con JWT</p>
        </div>
        <label className="text-sm text-slate-300">
          Usuario
          <input value={username} onChange={(event) => setUsername(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none" />
        </label>
        <label className="mt-4 block text-sm text-slate-300">
          Contraseña
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none" />
        </label>
        <Button className="mt-6 w-full" disabled={loading}><LockKeyhole className="h-5 w-5" /> {loading ? "Ingresando..." : "Entrar"}</Button>
      </form>
    </main>
  );
}
