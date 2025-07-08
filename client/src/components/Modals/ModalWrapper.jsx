import React from 'react'
import PropTypes from 'prop-types'

const ModalWrapper = ({children, centered, onClose}) => {
   const handleOverlayClick = (e) => {
    // Cierra solo si el clic vino directamente sobre el overlay
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  return (
    <section className={`modal__overlay ${centered ? "modal__overlay--centered" : ""}`} onClick={handleOverlayClick}>
      {children}
    </section>
  )
}

ModalWrapper.propTypes = {
    children: PropTypes.any,
    centered: PropTypes.bool,
    onClose: PropTypes.func
}

export {ModalWrapper}
