// Entrada principal del frontend.
// React monta App dentro de #root y BrowserRouter habilita navegacion SPA.

import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext.jsx";
import { LoadingScreen } from "./components/LoadingScreen.jsx";
import "./styles.css";

const App = lazy(() => import("./App.jsx"));

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<LoadingScreen />}>
          <App />
        </Suspense>
        <Toaster position="top-right" toastOptions={{ style: { background: "#0f172a", color: "#e2e8f0", border: "1px solid rgba(56,189,248,.35)" } }} />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
