import { useState } from "react";
import axios from "axios";
import { messaging, getToken } from "../../firebase"; // Ajusta la ruta si es necesario

// Función para detectar Opera o Safari
function isOpera() {
  return /Opera|OPR\//.test(navigator.userAgent);
}
function isSafari() {
  return (
    /^((?!chrome|android).)*safari/i.test(navigator.userAgent) && !isOpera()
  );
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const NotificationPrompt = ({ userId }) => {
  const [permission, setPermission] = useState(
    typeof Notification !== "undefined" ? Notification.permission : "default"
  );

  const handleEnableNotifications = async () => {
    if (typeof Notification !== "undefined") {
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result === "granted") {
        if (isOpera() || isSafari()) {
          try {
            const token = await getToken(messaging, {
              vapidKey: import.meta.env.VITE_VAPID_PUBLIC_KEY, // O la clave pública de Firebase
              serviceWorkerRegistration: await navigator.serviceWorker.ready,
            });
            if (token) {
              await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/usuarios/suscripcion-fcm`,
                {
                  userId,
                  fcmToken: token,
                }
              );
            } else {
              alert("No se pudo obtener el token de FCM.");
            }
          } catch (error) {
            alert("Error al obtener el token FCM: " + error.message);
          }
        } else if ("serviceWorker" in navigator && "PushManager" in window) {
          // Lógica web-push (tu código actual)
          const registration = await navigator.serviceWorker.ready;
          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(
              import.meta.env.VITE_VAPID_PUBLIC_KEY
            ),
          });
          await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/usuarios/suscripcion-push`,
            {
              subscription,
              userId,
            }
          );
        }
      }
    }
  };

  return (
    <div>
      {permission !== "granted" && (
        <button
          className="btn btn-outlined"
          onClick={handleEnableNotifications}
        >
          Activar notificaciones
        </button>
      )}
      {permission === "granted" && console.log("Notificaciones activadas")}
    </div>
  );
};

export { NotificationPrompt };
