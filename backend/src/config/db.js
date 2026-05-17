// Configuracion de conexion a MongoDB con Mongoose.
// Mantener esta logica aislada permite reutilizarla en scripts como seed.js.

import mongoose from "mongoose";

// connectDB abre una conexion a MongoDB y muestra el host conectado.
export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/polibarber";

  mongoose.set("strictQuery", true);

  const connection = await mongoose.connect(mongoUri);
  console.log(`MongoDB conectado: ${connection.connection.host}`);
  return connection;
};
