import PropTypes from "prop-types";
import { forwardRef

 } from "react";
const RadioOption = forwardRef(
  (
    { label, type = "radio", name, ...moreProps },
    ref
  ) => {
    return (
      <div className="input-option">
        {label && <label className="input-option__label" htmlFor={name}>{label}</label>}
        <input className="input-option__radio"
          ref={ref}
          id={name}
          type={type}
          name={name}
          {...moreProps}
        />
      </div>
    );
  }
);

RadioOption.displayName = "RadioOption";

RadioOption.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // El valor es requerido
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func, // El manejador de cambio es requerido
};

export { RadioOption };
