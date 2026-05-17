// App define las rutas principales de PoliBarber.

import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout.jsx";
import { AdminLayout } from "./layouts/AdminLayout.jsx";
import { useAuth } from "./context/AuthContext.jsx";

const Home = lazy(() => import("./pages/Home.jsx"));
const Booking = lazy(() => import("./pages/Booking.jsx"));
const CancelAppointment = lazy(() => import("./pages/CancelAppointment.jsx"));
const AdminLogin = lazy(() => import("./pages/AdminLogin.jsx"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard.jsx"));

// ProtectedRoute bloquea pantallas admin si no hay JWT guardado.
const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/admin" replace />;
};

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/reservar" element={<Booking />} />
        <Route path="/cancelar" element={<CancelAppointment />} />
      </Route>

      <Route path="/admin" element={<AdminLogin />} />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
