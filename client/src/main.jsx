import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.scss";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthContextProvider } from "./context/AuthContext.jsx";
import { AppLayout } from "./components/AppLayout.jsx";
import RouteChangeLoader from "./components/Animations/RouteChangeLoader";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <AppLayout>
          <App />
        </AppLayout>
      </AuthContextProvider>
    </BrowserRouter>
  </StrictMode>
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    // Registrar el service worker principal (web-push)
    navigator.serviceWorker.register("/service-worker.js").then(
      (registration) => {
        console.log("Service Worker registrado:", registration);
      },
      (err) => {
        console.log("Error al registrar el Service Worker:", err);
      }
    );
  });
}
