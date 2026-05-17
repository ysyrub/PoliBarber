// Cliente Axios centralizado para hablar con Express.

import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const api = axios.create({
  baseURL: API_URL,
  timeout: 12000
});

// Interceptor: agrega JWT automaticamente cuando existe en localStorage.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("polibarber_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// getErrorMessage normaliza mensajes de error para toasts y pantallas.
export const getErrorMessage = (error) => error?.response?.data?.message || "No se pudo completar la operacion.";
