import { useEffect, useState } from "react";

export default function InstallPage() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault(); // Bloquea el auto-prompt
      console.log("👍 Evento beforeinstallprompt capturado");
      setDeferredPrompt(e);
      setIsInstallable(true); // Habilita el botón
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      console.log(`ℹ️ Usuario eligió: ${result.outcome}`);
      if (result.outcome === "accepted") {
        console.log("✅ App instalada");
        window.location.href = "/users/login";
      } else {
        console.log("❌ Instalación cancelada");
      }
      setDeferredPrompt(null); // Limpia el evento
      setIsInstallable(false); // Desactiva el botón
    }
  };

  return (
    <div className="download">
      <img src="/assets/logo.png" alt="finz" />
      <h1 className="download__title">Instalá nuestra App</h1>
      <p className="download__text">
        Para disfrutar la mejor experiencia, instalá la app en tu celular.
      </p>
      <button
        onClick={handleInstallClick}
        disabled={!isInstallable}
        className="btn download__btn"
        style={{
          backgroundColor: isInstallable ? "#2057f2" : "#d9dae0",
          cursor: isInstallable ? "pointer" : "not-allowed",
        }}
      >
        Instalar App
      </button>
    </div>
  );
}
