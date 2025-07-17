import React, { forwardRef } from "react";
import PropTypes from "prop-types";

const Select = forwardRef(function Select(
  { options, labelField, ...otherProps },
  ref
) {
  if (!options || !Array.isArray(options)) {
    console.error("Select component requires an array of options.");
    return null;
  }

  return (
    <>
      <label>{labelField}</label>
      <select className="selectField" {...otherProps} ref={ref}>
        {options.map((option) => (
          <option
            className="selectField__option"
            key={option.value}
            value={option.value}
            disabled={option.disabled || option.enabled}
            selected={option.selected}
          >
            {option.label}
          </option>
        ))}
      </select>
    </>
  );
});

Select.displayName = "Select";

Select.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      label: PropTypes.string.isRequired,
      disabled: PropTypes.bool,
      selected: PropTypes.bool,
    })
  ).isRequired,
  labelField: PropTypes.string,
};

export { Select };
