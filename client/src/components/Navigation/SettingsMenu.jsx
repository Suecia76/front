import PropTypes from "prop-types";
import { Dropdown } from "./Dropdown";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";

const SettingsMenu = ({ open }) => {
  const { user, auth, logoutUser } = useContext(AuthContext);

  // console.log('user', user)
  // console.log('auth', auth)

  const options = [
    {
      label: "Perfil",
      link: "/profile",
    },
    {
      label: "Agregar categorías",
      link: "/categories/add",
    },

    {
      label: "Agregar metas",
      link: "/goals/add",
    },
  ];

  return (
    <div className="menu">
      {open && (
        <>
          <nav className="menu__navigation">
            <ul className="menu__list">
              <Dropdown label="Cuenta" options={options} />

              <li className="menu__item">
                <a href="/outcomes">Mis gastos</a>
              </li>

              <li className="menu__item">
                <a href="/incomes">Mis ingresos</a>
              </li>

              <li className="menu__item">
                <a href="/confirmaciones">Gastos y ingresos a confirmar</a>
              </li>

              {user ? (
                <>
                  <li className="menu__item menu__item--highlight">
                    <button onClick={logoutUser}>Cerrar sesión</button>
                  </li>
                </>
              ) : (
                <li className="menu__item">
                  <a href="/users/login">Iniciar sesión</a>
                </li>
              )}
            </ul>
          </nav>
        </>
      )}
    </div>
  );
};

SettingsMenu.displayName = "SettingsMenu";

SettingsMenu.propTypes = {
  open: PropTypes.bool,
  toggle: PropTypes.func,
};

export { SettingsMenu };
