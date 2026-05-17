// Modelo ScheduleOverride: permite bloquear dias u horarios especiales desde administracion.

import mongoose from "mongoose";

const scheduleOverrideSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true
    },
    barber: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Barber",
      default: null
    },
    isClosed: {
      type: Boolean,
      default: true
    },
    reason: {
      type: String,
      default: "Bloqueo administrativo"
    }
  },
  { timestamps: true }
);

scheduleOverrideSchema.index({ date: 1, barber: 1 });

export const ScheduleOverride = mongoose.model("ScheduleOverride", scheduleOverrideSchema);
