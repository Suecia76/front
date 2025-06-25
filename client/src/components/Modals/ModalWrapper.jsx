import React from 'react'
import PropTypes from 'prop-types'

const ModalWrapper = ({children, centered, onClose}) => {
  return (
    <section className={`modal__overlay ${centered ? "modal__overlay--centered" : ""}`} onClick={onClose}>
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
