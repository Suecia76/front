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
    <div style={styles.container}>
      <h1 style={styles.title}>📲 Instala nuestra App</h1>
      <p style={styles.text}>
        Para disfrutar la mejor experiencia, instala la app en tu dispositivo.
      </p>
      <button
        onClick={handleInstallClick}
        disabled={!isInstallable}
        style={{
          ...styles.button,
          backgroundColor: isInstallable ? "#ff5722" : "#aaa",
          cursor: isInstallable ? "pointer" : "not-allowed",
        }}
      >
        Instalar App
      </button>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "linear-gradient(135deg, #007bff, #00c6ff)",
    color: "#fff",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
    padding: "1rem",
  },
  title: {
    fontSize: "2.5rem",
    marginBottom: "1rem",
  },
  text: {
    fontSize: "1.2rem",
    marginBottom: "2rem",
  },
  button: {
    fontSize: "1.5rem",
    padding: "1rem 2rem",
    border: "none",
    borderRadius: "12px",
    color: "#fff",
    transition: "background-color 0.3s ease",
  },
};
