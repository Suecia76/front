import PropTypes from "prop-types";
import React, { useState } from "react";

const Toggle = ({ label, onChange, defaultChecked, ...moreProps }) => {
  const [isChecked, setIsChecked] = useState(defaultChecked || false);

  const handleToggle = () => {
    const newChecked = !isChecked;
    setIsChecked(newChecked);
    if (onChange) {
          onChange(newChecked); // ✅ comunicamos el nuevo estado
        }
  };

  return (
    <div className="toggle">
      <p>{label}</p>
      <label className="switch">
        <input type="checkbox" checked={isChecked} onChange={handleToggle} {...moreProps} />
        <span className="slider"></span>
      </label>
    </div>
  );
};

Toggle.propTypes = {
  label: PropTypes.string,
  onChange: PropTypes.func,
  defaultChecked: PropTypes.bool,
};

export { Toggle };
