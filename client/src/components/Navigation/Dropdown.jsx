import { useState } from "react";
import PropTypes from "prop-types";

const Dropdown = ({ options, label }) => {
  const [openDropdown, setOpenDropdown] = useState(false);

  const toggleDropdown = (openDropdown) => {
    setOpenDropdown((prev) => !prev);
  };

  return (
    <div className="dropdown">
      <button className="dropdown__button" onClick={toggleDropdown}>
        <span className="dropdown__label">{label}</span>
        {openDropdown ? (
          <span className="dropdown__arrow dropdown__arrow--up">
            {/*   <img src="icons/arrow.svg" alt="Cerrar" /> */}
            <svg
              className="dropdown__arrow-svg"
              viewBox="0 0 41 70"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.08108 0.510254C1.97384 0.510254 -0.798213 6.48451 2.49948 10.3844L19.6596 30.6781C21.5351 32.8961 21.5525 36.139 19.7009 38.377L2.27839 59.4355C-0.958008 63.3474 1.82426 69.2603 6.90132 69.2603H9.21672C10.9241 69.2603 12.5506 68.5328 13.6889 67.2602L39.0719 38.8808C41.1092 36.603 41.109 33.1578 39.0713 30.8802L13.6888 2.50964C12.5506 1.23741 10.9243 0.510254 9.21724 0.510254H7.08108Z"
                fill="#182B54"
              />
            </svg>
          </span>
        ) : (
          <span className="dropdown__arrow dropdown__arrow--down">
            {/* <img src="icons/arrow.svg" alt="Abrir" /> */}
            <svg
              className="dropdown__arrow-svg"
              viewBox="0 0 41 70"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.08108 0.510254C1.97384 0.510254 -0.798213 6.48451 2.49948 10.3844L19.6596 30.6781C21.5351 32.8961 21.5525 36.139 19.7009 38.377L2.27839 59.4355C-0.958008 63.3474 1.82426 69.2603 6.90132 69.2603H9.21672C10.9241 69.2603 12.5506 68.5328 13.6889 67.2602L39.0719 38.8808C41.1092 36.603 41.109 33.1578 39.0713 30.8802L13.6888 2.50964C12.5506 1.23741 10.9243 0.510254 9.21724 0.510254H7.08108Z"
                fill="#182B54"
              />
            </svg>
          </span>
        )}
      </button>

      {openDropdown && (
        <ul className="dropdown__menu">
          {options && options.length > 0 ? (
            options.map((option, index) => (
              <li key={index} className="dropdown__item">
                <a href={option.link}>{option.label}</a>
              </li>
            ))
          ) : (
            <li>Sin opciones</li>
          )}
        </ul>
      )}
    </div>
  );
};

Dropdown.displayName = "Dropdown";

Dropdown.propTypes = {
  options: PropTypes.array,
  label: PropTypes.string,
};

export { Dropdown };
