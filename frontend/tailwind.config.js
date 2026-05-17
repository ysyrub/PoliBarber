// Tailwind escanea index.html y src para generar solo las clases utilizadas.
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"]
      },
      colors: {
        night: "#020617",
        panel: "rgba(15, 23, 42, 0.74)",
        neon: "#38bdf8",
        violet: "#a78bfa"
      },
      boxShadow: {
        glow: "0 0 28px rgba(56, 189, 248, 0.22)"
      }
    }
  },
  plugins: []
};
