// LoadingScreen se muestra mientras Vite carga rutas lazy o datos principales.

import { Scissors } from "lucide-react";
import { motion } from "framer-motion";

export const LoadingScreen = () => (
  <div className="grid min-h-screen place-items-center bg-night">
    <motion.div
      className="glass flex items-center gap-3 rounded-2xl px-6 py-5 text-neon"
      animate={{ opacity: [0.55, 1, 0.55], scale: [0.98, 1, 0.98] }}
      transition={{ duration: 1.4, repeat: Infinity }}
    >
      <Scissors className="h-6 w-6" />
      <span className="font-semibold">Cargando PoliBarber</span>
    </motion.div>
  </div>
);
