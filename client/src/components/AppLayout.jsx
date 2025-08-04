import { TopBar, NavBar } from "../components";
import { useLocation } from "react-router-dom";
import useIsStandalone from "../hooks/useIsStandalone";

const AppLayout = ({ children }) => {
  const location = useLocation();

  const isStandalone = useIsStandalone();

  const hideNavBarRoutes = ["/users/login", "/users/register", "/instalar"];

  const hideTopBarRoutes = ["/users/login", "/users/register", "/instalar"];

  return (
    <div
      className={`app-wrapper ${isStandalone ? "app-wrapper--standalone" : ""}`}
    >
      {!hideTopBarRoutes.includes(location.pathname) && <TopBar />}

      <div className="content">{children}</div>

      {!hideNavBarRoutes.includes(location.pathname) && <NavBar />}
    </div>
  );
};

export { AppLayout };
