import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import LoaderOverlay from "./LoaderOverlay";

const RouteChangeLoader = () => {
  const location = useLocation();
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    setShowLoader(true);
    const timeout = setTimeout(() => setShowLoader(false), 800);
    return () => clearTimeout(timeout);
  }, [location.pathname]);

  return <LoaderOverlay isVisible={showLoader} />;
};

export default RouteChangeLoader;
