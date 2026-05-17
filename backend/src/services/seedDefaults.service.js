// Servicio de inicializacion idempotente para produccion.
// Render Free no permite usar Shell, por eso el backend puede crear datos base
// automaticamente cuando detecta que la base de datos aun no tiene servicios o barberos.

import { Barber } from "../models/Barber.js";
import { Service } from "../models/Service.js";

// initialBarbers contiene los tres barberos solicitados para iniciar PoliBarber.
const initialBarbers = [
  { name: "Carlos", bio: "Cortes clasicos y degradados limpios.", avatarColor: "#22d3ee" },
  { name: "Miguel", bio: "Especialista en barba y perfilado premium.", avatarColor: "#60a5fa" },
  { name: "Fernando", bio: "Acabados modernos y combos completos.", avatarColor: "#a78bfa" }
];

// initialServices define servicios y combos con precios en guaranies.
const initialServices = [
  { name: "Pelo", price: 65000, type: "servicio", items: ["Pelo"] },
  { name: "Barba", price: 35000, type: "servicio", items: ["Barba"] },
  { name: "Ceja", price: 10000, type: "servicio", items: ["Ceja"] },
  { name: "Bañado", price: 40000, type: "servicio", items: ["Bañado"] },
  { name: "Pelo + Barba", price: 100000, type: "combo", items: ["Pelo", "Barba"] },
  { name: "Pelo + Ceja", price: 75000, type: "combo", items: ["Pelo", "Ceja"] },
  { name: "Completo sin baño", price: 110000, type: "combo", items: ["Pelo", "Barba", "Ceja"] },
  { name: "Completo con baño", price: 140000, type: "combo", items: ["Pelo", "Barba", "Ceja", "Bañado"] }
];

// ensureDefaultData crea datos iniciales solo cuando faltan.
export const ensureDefaultData = async () => {
  const [barberCount, serviceCount] = await Promise.all([Barber.countDocuments(), Service.countDocuments()]);

  if (barberCount === 0) {
    await Barber.insertMany(initialBarbers);
    console.log("Barberos iniciales creados automaticamente.");
  }

  if (serviceCount === 0) {
    await Service.insertMany(initialServices);
    console.log("Servicios iniciales creados automaticamente.");
  }
};
