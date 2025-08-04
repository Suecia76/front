import { useEffect, useState } from "react";

export default function InstallPage() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isInStandaloneMode, setIsInStandaloneMode] = useState(false);

  useEffect(() => {
    // Detectar iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    console.log(userAgent);
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);
    console.log(isIosDevice);

    // Detectar si ya está instalada
    const standalone = window.navigator.standalone === true;
    setIsInStandaloneMode(standalone);

    // Android/Chrome
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      if (result.outcome === "accepted") {
        window.location.href = "/users/login";
      }
      setDeferredPrompt(null);
      setIsInstallable(false);
    }
  };

  return (
    <div className="download">
      <img className="download__logo" src="/assets/logo.png" alt="finz" />
      <h1 className="download__title">Instalá nuestra App</h1>

      {isIos && !isInStandaloneMode ? (
        <>
          <p className="download__text">Para instalar la app en tu iPhone:</p>
          <ol className="download__list">
            <li>
              <span className="download__item">1.</span>Abrí este sitio en
              Safari.
            </li>
            <li>
              <span className="download__item">2.</span>Tocá el botón
              “Compartir”
            </li>
            <li>
              <span className="download__item">3.</span>Elegí “Agregar a
              pantalla de inicio”.
            </li>
          </ol>
        </>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}
