// Modelo Appointment: relaciona cliente, barbero, servicios, fecha y estado del turno.

import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true
    },
    barber: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Barber",
      required: true
    },
    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        required: true
      }
    ],
    startAt: {
      type: Date,
      required: true
    },
    endAt: {
      type: Date,
      required: true
    },
    durationMinutes: {
      type: Number,
      required: true
    },
    totalPrice: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ["pendiente", "aprobada", "cancelada", "completada"],
      default: "pendiente"
    },
    cancellationReason: {
      type: String,
      default: ""
    },
    createdBy: {
      type: String,
      enum: ["cliente", "admin"],
      default: "cliente"
    }
  },
  { timestamps: true }
);

appointmentSchema.index({ barber: 1, startAt: 1, endAt: 1 });
appointmentSchema.index({ status: 1, startAt: 1 });

export const Appointment = mongoose.model("Appointment", appointmentSchema);
