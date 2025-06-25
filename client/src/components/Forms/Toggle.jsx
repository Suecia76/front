import { useState } from "react";
import PropTypes from "prop-types";

const Toggle = ({ htmlFor, label, ...moreProps }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleToggle = () => {
    setIsChecked(!isChecked); //Lo seteamos para que se convierta en el valor booleano contrario
  };

  return (
    <div className="toggle" {...moreProps}>
      <p>{label} </p>
      <label className="switch" htmlFor={htmlFor}>
        <input type="checkbox" checked={isChecked} onChange={handleToggle} />
        <span className="slider"></span>
      </label>
    </div>
  );
};

Toggle.propTypes = {
  htmlFor: PropTypes.string,
  label: PropTypes.string,
};

export { Toggle };
