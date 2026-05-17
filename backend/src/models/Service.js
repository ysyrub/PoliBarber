// Modelo Service: contiene servicios individuales y combos con precio en guaranies.

import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    type: {
      type: String,
      enum: ["servicio", "combo"],
      default: "servicio"
    },
    items: {
      type: [String],
      default: []
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export const Service = mongoose.model("Service", serviceSchema);
