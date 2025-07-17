import React, { forwardRef } from 'react'
import PropTypes from 'prop-types';

const InputDetail = forwardRef(({label, type, error, typeCantidad, ...otherProps}, ref) => {
  return (
     <div className='transaction__input-container'>
        <label className='transaction__input-label'>{label}</label>

      {typeCantidad && typeCantidad === 'true' ? (
          <div className='transaction__input--cantidad'>
            <p className='transaction__input-sign'>$</p>
            <input ref={ref} className='transaction__input' type={type} {...otherProps} />
          </div>
        ) : (
          <>
            <input ref={ref} className='transaction__input' type={type} {...otherProps} />
            {error?.length > 0 && (
              <p className="input-error">{error}</p>
            )}
          </>
        )}
    </div>
  );
});

InputDetail.displayName = "InputDetail";

InputDetail.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  error: PropTypes.string,
  typeCantidad: PropTypes.bool,
};

export {InputDetail}
