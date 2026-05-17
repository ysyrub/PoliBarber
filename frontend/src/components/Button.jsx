// Boton reutilizable con variantes visuales consistentes.

export const Button = ({ children, variant = "primary", className = "", ...props }) => {
  const variants = {
    primary: "bg-cyan-400 text-slate-950 hover:bg-cyan-300",
    ghost: "border border-slate-600 bg-slate-900/40 text-slate-100 hover:border-cyan-300",
    danger: "bg-rose-500 text-white hover:bg-rose-400"
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
