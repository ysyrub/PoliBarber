// Modelo Client: guarda los datos que el cliente ingresa antes de reservar.

import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    }
  },
  { timestamps: true }
);

clientSchema.index({ email: 1, phone: 1 });

export const Client = mongoose.model("Client", clientSchema);
