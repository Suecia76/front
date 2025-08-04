import { useEffect, useState } from "react";

const useIsStandalone = () => {
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const checkStandalone = () => {
      const displayMode = window.matchMedia(
        "(display-mode: standalone)"
      ).matches;
      const isIosStandalone = window.navigator.standalone === true;
      setIsStandalone(displayMode || isIosStandalone);
    };

    checkStandalone();
  }, []);

  return isStandalone;
};

export default useIsStandalone;
