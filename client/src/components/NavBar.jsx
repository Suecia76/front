import { useState } from "react";

const NavBar = () => {
  const [openActions, setOpenActions] = useState(false);

  const toggleActions = () => {
    setOpenActions((prev) => !prev);
  };

  return (
    <>
      <nav className="navbar">
        <ul className="navbar__container">
          <li>
            <div className="navbar__actions-container">
              <button
                onClick={toggleActions}
                className="navbar__actions-button"
              >
                +
              </button>

              <ul
                className={`navbar__actions ${
                  openActions ? "navbar__actions--active" : ""
                }`}
              >
                <li className="navbar__action">
                  <a className="navbar__action-link" href="/income/add">
                    Nuevo ingreso
                  </a>
                </li>
                <li className="navbar__action">
                  <a
                    className="navbar__action-link navbar__action-link--bordered"
                    href="/outcome/add"
                  >
                    Nuevo gasto
                  </a>
                </li>
              </ul>
            </div>
          </li>

          <li className="navbar__link-container">
            <a className="navbar__link" href="/">
              <img
                className="navbar__link-icon"
                src="/assets/icons/home.svg"
                alt="Inicio"
              />
              Inicio
            </a>
          </li>

          <li className="navbar__link-container navbar__link-container--spaced-right">
            <a className="navbar__link" href="/calendar">
              <img
                className="navbar__link-icon"
                src="/assets/icons/calendar.svg"
                alt="Calendario"
              />
              Calendario
            </a>
          </li>

          <li className="navbar__link-container navbar__link-container--spaced-left">
            <a className="navbar__link" href="/balances">
              <img
                className="navbar__link-icon"
                src="/assets/icons/balance.svg"
                alt="Balance"
              />
              Balance
            </a>
          </li>

          <li className="navbar__link-container">
            <a className="navbar__link" href="/group">
              <img
                className="navbar__link-icon"
                src="/assets/icons/group.svg"
                alt="Grupo"
              />
              Grupo
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
};

export { NavBar };
