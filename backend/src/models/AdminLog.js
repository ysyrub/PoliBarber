// Modelo AdminLog: registra acciones importantes ejecutadas desde el panel.

import mongoose from "mongoose";

const adminLogSchema = new mongoose.Schema(
  {
    adminUser: {
      type: String,
      default: "admin"
    },
    action: {
      type: String,
      required: true
    },
    entity: {
      type: String,
      required: true
    },
    entityId: {
      type: String,
      default: ""
    },
    metadata: {
      type: Object,
      default: {}
    }
  },
  { timestamps: true }
);

export const AdminLog = mongoose.model("AdminLog", adminLogSchema);
