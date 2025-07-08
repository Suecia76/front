import React from "react";
import { ModalWrapper } from "./ModalWrapper";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Cookies from "js-cookie";
import axios from "axios";

const CategoryPicker = ({ onClose, handleCategoryClick }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const [defaultCategories, setDefaultCategories] = useState([]);
  const [userCategories, setUserCategories] = useState([]);
  const [error, setError] = useState(null);

  const url = "https://back-1-1j7o.onrender.com/uploads/";
  // const extension = ".png";

  useEffect(() => {
    const fetchCategories = async () => {
      if (!user) {
        console.error("El usuario no está definido.");
        return;
      }

      setLoading(true);

      try {
        const defaultResponse = await axios.get(
          "https://back-1-1j7o.onrender.com/categorias"
        );

        setDefaultCategories(defaultResponse.data);

        const userResponse = await axios.get(
          `https://back-1-1j7o.onrender.com/categorias/usuario/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        );

        setUserCategories(userResponse.data);
      } catch (err) {
        z;
        console.error("Error al obtener las categorías:", err);
        setError(
          "Error al cargar las categorías. Por favor, inténtalo de nuevo más tarde."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [user]);

  return (
    <ModalWrapper onClose={onClose} centered={true}>
      <div onClick={onClose}>
        <div className="modal__content" onClick={(e) => e.stopPropagation()}>
          <button className="btn-close" onClick={onClose}>
            &times;
          </button>
          <h2>Categorías</h2>

          <Link to={"/categories/add"} className="btn btn--text-blue">
            Crear una nueva categoría
          </Link>

          {loading && <p>Cargando categorías...</p>}
          {error && <p className="error-message">{error}</p>}

          <div className="categories">
            <div className="categories__list">
              {defaultCategories.map((cat) => (
                <div
                  key={cat._id}
                  className="category"
                  onClick={() => handleCategoryClick(cat)}
                >
                  <img
                    className="category__icon"
                    src={`${url + cat.imagen}.png` || "./default-icon.png"}
                    alt={cat.nombre}
                  />
                  <div>
                    <p>{cat.nombre}</p>
                  </div>
                </div>
              ))}
            </div>

            {userCategories.length > 0 && (
              <>
                <h3>Tus categorías</h3>
                <div className="categories__list">
                  {userCategories.map((cat) => (
                    <div
                      key={cat._id}
                      className="category"
                      onClick={() => handleCategoryClick(cat)}
                    >
                      <img
                        className="category__icon"
                        src={url + cat.imagen || "./default-icon.png"}
                        alt={cat.nombre}
                      />
                      <p>{cat.nombre}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};

CategoryPicker.propTypes = {
  onClose: PropTypes.func.isRequired,
  handleCategoryClick: PropTypes.func.isRequired,
};

export { CategoryPicker };
