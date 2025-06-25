import PropTypes from "prop-types";
import { forwardRef } from "react";
import { IconButton } from "../Buttons/IconButton";
import { Button } from "../Button";

const InputCalculator = forwardRef(
  ({ label, type = "number", name, value, onChange, ...moreProps }, ref) => {
    return (
      <div className="display-flex flex-start flex-column">
        {label && <label>{label}</label>}

        <div className="container-input-calculator">
          <p className="pesos-sign h1">$</p>

          <input
            ref={ref}
            id={name}
            type={type}
            placeholder={0}
            name={name}
            value={value}
            onChange={onChange}
            className="h1 input-calculator"
            {...moreProps}
          />

          <IconButton label="" className="btn-calculator" icon="calculator-indigo" />
        </div>
      </div>
    );
  }
);

InputCalculator.displayName = "InputCalculator";

InputCalculator.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // El valor es requerido
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func, // El manejador de cambio es requerido
};

export { InputCalculator };
