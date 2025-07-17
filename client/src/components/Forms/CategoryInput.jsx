import React, { useState, useEffect, forwardRef } from "react";
import PropTypes from "prop-types";
import { useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { AuthContext } from "../../context/AuthContext";
import { CategoryPicker } from "../../components/Modals/CategoryPicker";
import { ModalWrapper } from "../Modals/ModalWrapper";

const CategoryInput = forwardRef(
  ({ onCategorySelect, selectedCategory, errorMessage }, ref) => {
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleOpenModal = () => {
      setShowModal(true);
    };

    const handleCloseModal = () => {
      setShowModal(false);
    };

    const handleCategoryClick = (category) => {
      onCategorySelect(category);
      setShowModal(false);
    };

    let url = "https://back-fbch.onrender.com/uploads/";

    return (
      <div ref={ref}>
        <p className="label categories__select-label">Seleccionar categoría</p>
        <button className="categories__select-button" onClick={handleOpenModal}>
          {selectedCategory ? (
            <div className="selected-category">
              <img
                className="selected-category__icon"
                src={`/./assets/icons/${selectedCategory.imagen}.png`}
                alt={selectedCategory.nombre}
              />

              {selectedCategory.nombre}
            </div>
          ) : (
            <>
              Seleccionar categoría
              <img
                className="arrow-down"
                src="/./assets/icons/arrow-left-light.svg"
                alt="Seleccionar categoría"
              />
            </>
          )}
        </button>

        <p className="input-error">{errorMessage}</p>

        {showModal && (
          <CategoryPicker
            onClose={handleCloseModal}
            handleCategoryClick={handleCategoryClick}
          />
        )}
      </div>
    );
  }
);

CategoryInput.displayName = "CategoryPicker";

CategoryInput.propTypes = {
  onCategorySelect: PropTypes.func.isRequired,
  selectedCategory: PropTypes.any,
  errorMessage: PropTypes.string,
};

export { CategoryInput };
