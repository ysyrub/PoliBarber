// Modelo Cancellation: deja trazabilidad de turnos cancelados.

import mongoose from "mongoose";

const cancellationSchema = new mongoose.Schema(
  {
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true
    },
    cancelledBy: {
      type: String,
      enum: ["cliente", "admin"],
      required: true
    },
    reason: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

export const Cancellation = mongoose.model("Cancellation", cancellationSchema);
