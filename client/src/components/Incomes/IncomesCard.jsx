import React from "react";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";

const IncomesCard = ({
  icon,
  iconName,
  title,
  categoria_fk,
  amount,
  state,
  stateClassName,
  date,
  _id,
}) => {
  const [category, setCategory] = useState(null);

  async function fetchCategory(id) {
    // if (!user) {};
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

      const categoryName = response.data;

      return categoryName;
    } catch (error) {
      console.error("Error al cargar la categoría:", error.response?.data);
      return;
    }
  }

  useEffect(() => {
    fetchCategory(categoria_fk).then(setCategory);
  }, [categoria_fk]);

  return (
    <article key={_id} className="transaction-card">
      <a className="transaction-card__link" href={`/incomes/${_id}`}>
        <figure className="transaction-card__icon-container">
          <img className="transaction-card__icon" src={icon} alt={iconName} />
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
  icon: PropTypes.string,
  iconName: PropTypes.string,
  title: PropTypes.string,
  category: PropTypes.any,
  state: PropTypes.any,
  stateClassName: PropTypes.string,
  date: PropTypes.string,
  amount: PropTypes.number,
  _id: PropTypes.any.isRequired,
  categoria_fk: PropTypes.any,
};

export { IncomesCard };
