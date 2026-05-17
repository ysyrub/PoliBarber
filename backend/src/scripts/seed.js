// Script de carga inicial de datos.
// Ejecutar con: npm --prefix backend run seed

import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import { Barber } from "../models/Barber.js";
import { Service } from "../models/Service.js";

dotenv.config();

const barbers = [
  { name: "Carlos", bio: "Cortes clasicos y degradados limpios.", avatarColor: "#22d3ee" },
  { name: "Miguel", bio: "Especialista en barba y perfilado premium.", avatarColor: "#60a5fa" },
  { name: "Fernando", bio: "Acabados modernos y combos completos.", avatarColor: "#a78bfa" }
];

const services = [
  { name: "Pelo", price: 65000, type: "servicio", items: ["Pelo"] },
  { name: "Barba", price: 35000, type: "servicio", items: ["Barba"] },
  { name: "Ceja", price: 10000, type: "servicio", items: ["Ceja"] },
  { name: "Bañado", price: 40000, type: "servicio", items: ["Bañado"] },
  { name: "Pelo + Barba", price: 100000, type: "combo", items: ["Pelo", "Barba"] },
  { name: "Pelo + Ceja", price: 75000, type: "combo", items: ["Pelo", "Ceja"] },
  { name: "Completo sin baño", price: 110000, type: "combo", items: ["Pelo", "Barba", "Ceja"] },
  { name: "Completo con baño", price: 140000, type: "combo", items: ["Pelo", "Barba", "Ceja", "Bañado"] }
];

const seed = async () => {
  await connectDB();

  for (const barber of barbers) {
    await Barber.findOneAndUpdate({ name: barber.name }, barber, { upsert: true, new: true });
  }

  for (const service of services) {
    await Service.findOneAndUpdate({ name: service.name }, service, { upsert: true, new: true });
  }

  console.log("Datos iniciales de PoliBarber cargados correctamente.");
  process.exit(0);
};

seed().catch((error) => {
  console.error("Error cargando seed:", error);
  process.exit(1);
});
