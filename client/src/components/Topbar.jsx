import { useState } from "react";
import { NotificationsMenu } from "./Navigation/NotificationsMenu";
import { SettingsMenu } from "./Navigation/SettingsMenu";

const TopBar = () => {
  const [openMenu, setOpenMenu] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const toggleMenu = (menuName) => {
    if (openMenu === menuName) {
      setOpenMenu(null); //If already opened, it closes
    } else {
      setOpenMenu(menuName); //Open the other
    }
  };

  return (
    <div className="topbar">
      <div className="topbar__buttons-container">
        <button
          className="topbar__button"
          onClick={() => toggleMenu("settings")}
        >
          <img src="./assets/icons/settings.svg" alt="" />
        </button>

        <button
          className="topbar__button"
          onClick={() => toggleMenu("notifications")}
        >
          <img src="./assets/icons/bell.svg" alt="Notificaciones" />
        </button>
      </div>

      <SettingsMenu
        open={openMenu === "settings"}
        toggle={() => toggleMenu("settings")}
      />

      <NotificationsMenu
        open={openMenu === "notifications"}
        toggle={() => toggleMenu("notifications")}
      />

      {/*        <div id="notifications">

        </div> */}
    </div>
  );
};

export { TopBar };
