import PropTypes from "prop-types";
import { forwardRef

 } from "react";
const Input = forwardRef(
  (
    { label, type = "text", placeholder, name, value, onChange, error, sign, ...moreProps },
    ref
  ) => {
    return (
      <div className="input-group">
       
        {label && <label>{label}</label>}

        <div>
          
        </div>
        {sign ? (
            <div className='input-sign'>
              <p className='input-sign__sign'>{sign}</p>
              <input ref={ref} className='input-sign__input' type={type} {...moreProps} />
            </div>
        ): (
          <input
            ref={ref}
            id={name}
            type={type}
            placeholder={placeholder}
            name={name}
            {...(type === "file" ? {} : { value })}
            onChange={onChange}
            {...moreProps}
          />
        )}
        <p className="input-error">{error}</p>
      </div>
    );
  }
);

Input.displayName = "Input";

Input.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), 
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  error: PropTypes.string,
  sign: PropTypes.oneOf(["%", "$"])
};

export { Input };
