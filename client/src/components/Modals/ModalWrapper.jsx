import React from "react";
import PropTypes from "prop-types";

const ModalWrapper = ({ children, centered, onClose, loading }) => {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <section
      className={`modal__overlay ${centered ? "modal__overlay--centered" : ""}`}
      onClick={handleOverlayClick}
    >
      {loading && (
        <div className="modal__loading-overlay">
          <div className="modal__spinner">Cargando...</div>
        </div>
      )}

      {children}
    </section>
  );
};

ModalWrapper.propTypes = {
  children: PropTypes.any,
  centered: PropTypes.bool,
  onClose: PropTypes.func,
  loading: PropTypes.bool,
};

export { ModalWrapper };
