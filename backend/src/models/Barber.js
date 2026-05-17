// Modelo Barber: representa a cada barbero disponible en PoliBarber.

import mongoose from "mongoose";

const barberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    bio: {
      type: String,
      default: "Especialista PoliBarber"
    },
    avatarColor: {
      type: String,
      default: "#38bdf8"
    },
    isActive: {
      type: Boolean,
      default: true
    },
    workDays: {
      type: [Number],
      default: [1, 2, 3, 4, 5, 6]
    },
    startTime: {
      type: String,
      default: "07:00"
    },
    endTime: {
      type: String,
      default: "22:00"
    }
  },
  { timestamps: true }
);

export const Barber = mongoose.model("Barber", barberSchema);
