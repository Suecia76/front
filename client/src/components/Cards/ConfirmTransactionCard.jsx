import React from "react";
import { IconButton } from "../Buttons/IconButton";
import PropTypes from "prop-types";

const ConfirmTransactionCard = ({
  title,
  amount,
  onConfirm,
  _id,
  category,
  type,
  date,
  totalInstallments,
  payedInstallments,
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
                  ? `assets/icons/${category.imagen}.png`
                  : `/assets/icons/${type}.svg`
              }
              alt={category?.nombre || "icono"}
            />
          </figure>

          <div className="transaction-card__info">
            <h3 className="transaction-card__title">
              {title} -
              <span className="transaction-card__amount">
                ${(amount / totalInstallments).toFixed(2)}{" "}
                {totalInstallments > 1 && "por cuota"}
              </span>{" "}
            </h3>
            {/*  <p className="transaction-card__category">
                        <span>Categoría: </span>{category?.nombre || "Cargando..."}
                    </p> */}

            <p className="transaction-card__date">{date}</p>
            {totalInstallments > 1 && (
              <p className="transaction-card__date">
                Cuotas: {payedInstallments}/{totalInstallments} (Total a pagar:
                ${amount})
              </p>
            )}
          </div>
        </a>

        <div className="transaction-card__actions">
          <IconButton icon="checkmark" label="Confirmar" onClick={onConfirm} />
        </div>
      </div>
    </article>
  );
};

ConfirmTransactionCard.propTypes = {
  title: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  onConfirm: PropTypes.func.isRequired,
  _id: PropTypes.string.isRequired,
  category: PropTypes.shape({
    imagen: PropTypes.string,
    nombre: PropTypes.string,
  }),
  type: PropTypes.oneOf(["income", "outcome"]).isRequired,
  date: PropTypes.string.isRequired,
  totalInstallments: PropTypes.number.isRequired,
  payedInstallments: PropTypes.number.isRequired,
};

export { ConfirmTransactionCard };
