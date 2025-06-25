// import React from 'react'
import PropTypes from "prop-types";

const IconButton = ({icon, label, ...moreProps}) => {

  return (
    <button className='icon-btn'{...moreProps}>
          <img className='icon-btn__icon' src={`/assets/icons/${icon}.svg`} alt={label}/>      
    </button>
  )
}

IconButton.propTypes = {
  label: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
};

export {IconButton}
