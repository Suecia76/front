import React from 'react'
import PropTypes from 'prop-types';

const InputDetail = ({label, value, type = "text"}) => {
  return (
     <div className='transaction__input-container'>
        <label className='transaction__input-label'>{label}</label>

        <input className='transaction__input' type={type} value={value} />
    </div>
  )
}

InputDetail.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  type: PropTypes.string
};

export {InputDetail}
