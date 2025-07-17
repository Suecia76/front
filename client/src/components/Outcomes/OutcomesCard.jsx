import React from "react";
import PropTypes, { number } from "prop-types";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";

const OutcomesCard = ({
  icon,
  iconName,
  title,
  amount,
  state,
  stateClassName,
  date,
  _id,
  categoria_fk,
  cuotasTotales,
  cuotasProcesadas,
}) => {
  const [category, setCategory] = useState(null);

  async function fetchCategory(id) {
    try {
      const token = Cookies.get("token") || null;
      const response = await axios.get(
        `https://back-fbch.onrender.com/categorias/${id}`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error al obtener la categoría:", error);
      return null;
    }
  }

  useEffect(() => {
    fetchCategory(categoria_fk).then(setCategory);
  }, [categoria_fk]);

  return (
    <article key={_id} className="transaction-card">
      <a className="transaction-card__link" href={`outcomes/${_id}`}>
        <figure className="transaction-card__icon-container">
          {category?.predeterminada === true ? (
            <img
              className="transaction-card__icon"
              src={
                category?.imagen
                  ? `./assets/icons/${category.imagen}.png`
                  : "/./assets/icons/default.svg"
              }
              alt={category?.nombre || "icono"}
            />
          ) : (
            <img
              className="transaction-card__icon"
              src={
                category?.imagen
                  ? `https://back-fbch.onrender.com/uploads/${category.imagen}`
                  : "/./assets/icons/default.svg"
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
            {category ? category.nombre : "Cargando..."}
          </p>
          <p className={`income-card__state--${stateClassName}`}>
            <span>Estado: </span>
            {state}
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

OutcomesCard.displayName = "OutcomesCard";

OutcomesCard.propTypes = {
  icon: PropTypes.string,
  iconName: PropTypes.string,
  title: PropTypes.string,
  category: PropTypes.any,
  state: PropTypes.any,
  stateClassName: PropTypes.string,
  date: PropTypes.string,
  _id: PropTypes.any.isRequired,
  amount: PropTypes.number,
  categoria_fk: PropTypes.any,
  cuotasTotales: PropTypes.number,
  cuotasProcesadas: PropTypes.number,
};

export { OutcomesCard };
