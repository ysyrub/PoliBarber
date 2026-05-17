// EmptyState comunica listas vacias de forma elegante.

import { Sparkles } from "lucide-react";

export const EmptyState = ({ title, text }) => (
  <div className="glass rounded-2xl p-8 text-center">
    <Sparkles className="mx-auto mb-3 h-8 w-8 text-neon" />
    <h3 className="text-lg font-bold">{title}</h3>
    <p className="mt-2 text-sm text-slate-300">{text}</p>
  </div>
);
