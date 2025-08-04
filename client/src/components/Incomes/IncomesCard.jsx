import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Cookies from "js-cookie";
import axios from "axios";

const IncomesCard = ({
  title,
  categoria_fk,
  amount,
  state,
  stateClassName,
  date,
  _id,
  cuotasTotales,
  cuotasProcesadas,
}) => {
  const [category, setCategory] = useState(null);

  useEffect(() => {
    const fetchCategory = async (id) => {
      try {
        const token = Cookies.get("token") || null;
        const response = await axios.get(
          `https://back-fbch.onrender.comcategorias/${id}`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );
        setCategory(response.data);
      } catch (error) {
        console.error("Error al cargar la categoría:", error.response?.data);
      }
    };

    fetchCategory(categoria_fk);
  }, [categoria_fk]);

  return (
    <article className="transaction-card">
      <a className="transaction-card__link" href={`/incomes/${_id}`}>
        <figure className="transaction-card__icon-container">
          {category?.predeterminada === true ? (
            <img
              className="transaction-card__icon"
              src={
                category?.imagen
                  ? `assets/icons/${category.imagen}.png`
                  : "/assets/icons/default.svg"
              }
              alt={category?.nombre || "icono"}
            />
          ) : (
            <img
              className="transaction-card__icon"
              src={
                category?.imagen
                  ? `https://back-fbch.onrender.comuploads/${category.imagen}`
                  : "/assets/icons/default.svg"
              }
              alt={category?.nombre || "icono"}
            />
          )}
        </figure>
        <div className="transaction-card__info">
          <h3 className="transaction-card__title">
            <span className="transaction-card__amount">${amount}</span> -{" "}
            {title}
          </h3>
          <p className="transaction-card__category">
            <span>Categoría: </span>
            {category?.nombre || "Cargando..."}
          </p>
          <p className={`income-card__state--${stateClassName}`}>
            <span>Estado: {state}</span>
          </p>

          {cuotasTotales > 1 && cuotasProcesadas > 0 && (
            <p>
              Cuotas: {cuotasProcesadas}/{cuotasTotales}
            </p>
          )}
        </div>

        <div className="transaction-card__date-container">
          <p className="transaction-card__date">{date}</p>
        </div>
      </a>
    </article>
  );
};

IncomesCard.displayName = "IncomesCard";

IncomesCard.propTypes = {
  title: PropTypes.string,
  categoria_fk: PropTypes.any,
  amount: PropTypes.number,
  state: PropTypes.any,
  stateClassName: PropTypes.string,
  date: PropTypes.string,
  _id: PropTypes.any.isRequired,
  cuotasTotales: PropTypes.number,
  cuotasProcesadas: PropTypes.number,
};

export { IncomesCard };
