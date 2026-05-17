// Helper para registrar acciones administrativas sin ensuciar controladores.

import { AdminLog } from "../models/AdminLog.js";

// logAdminAction guarda accion, entidad afectada y metadatos opcionales.
export const logAdminAction = async ({ adminUser = "admin", action, entity, entityId = "", metadata = {} }) => {
  await AdminLog.create({ adminUser, action, entity, entityId, metadata });
};
