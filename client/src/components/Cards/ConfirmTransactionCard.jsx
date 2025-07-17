import React from "react";
import { IconButton } from "../Buttons/IconButton";

const ConfirmTransactionCard = ({
  title,
  amount,
  onConfirm,
  _id,
  category,
  type,
  date,
}) => {
  return (
    <article className="transaction-card">
      <div className="transaction-card__content">
        <a className="transaction-card__link" href={`/${type}s/${_id}`}>
          <figure className="transaction-card__icon-container">
            <img
              className="transaction-card__icon"
              src={
                category?.imagen
                  ? `./assets/icons/${category.imagen}.png`
                  : `/./assets/icons/${type}.svg`
              }
              alt={category?.nombre || "icono"}
            />
          </figure>

          <div className="transaction-card__info">
            <h3 className="transaction-card__title">
              <span className="transaction-card__amount">${amount}</span> -{" "}
              {title}
            </h3>
            {/*  <p className="transaction-card__category">
                        <span>Categoría: </span>{category?.nombre || "Cargando..."}
                    </p> */}

            <p className="transaction-card__date">{date}</p>
          </div>
        </a>

        <div className="transaction-card__actions">
          <IconButton icon="checkmark" label="Confirmar" onClick={onConfirm} />
        </div>
      </div>
    </article>
  );
};

export { ConfirmTransactionCard };
