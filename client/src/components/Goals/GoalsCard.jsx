import PropTypes from "prop-types";
import { IconButton } from "../Buttons/IconButton";
import { useNavigate } from "react-router-dom";

const GoalsCard = ({
  title,
  type,
  amount,
  percentage,
  // totalIncome,
  progress,
  date,
  id,
  currency,
  sign,
  ...otherProps
}) => {
  let navigate = useNavigate();

  return (
    <article
      {...otherProps}
      className={`goal-card ${
        progress === 100 ? "goal-card--complete" : "goal-card--incomplete"
      }`}
    >
      <div className="goal-card__info">
        <h3 className="goal-card__title">{title}</h3>

        <p className="goal-card__amount">Objetivo: ${amount}</p>
        {currency && (
          <p className="goal-card__amount">Moneda extranjera: {currency}</p>
        )}
        {/* Div contenedor */}
        <div className="progress-container">
          <div
            style={{
              width: `${percentage}%`,
              maxWidth: "100%",
              height: "1rem",
              backgroundColor:
                percentage < 40
                  ? "rgb(194, 0, 0)"
                  : percentage < 100
                  ? "#f0ad4e"
                  : "#28f1a4",
            }}
          ></div>
        </div>

        <p className="goal-percentage">
          Progreso: {percentage.toFixed(2)}% de {sign}
          {amount} ({sign}
          {((amount * percentage) / 100).toFixed(2)} ahorrados)
        </p>

        {date && (
          <div className="goal-card__date-container">
            <p className="goal-card__date">{date}</p>
          </div>
        )}
      </div>

      <div className="goal-card__buttons">
        <IconButton
          onClick={() => navigate(`/goals/edit/${id}`)}
          label="Editar"
          icon="edit"
        />
      </div>

      {/*   <div className='goal-card__buttons'>
        <IconButton label="Eliminar" icon="delete"/>
      </div>
 */}
      {/* Si el progreso está completo, le mostramos un bton para archivar la meta y la pintamos de */}
      {progress === 100 && (
        <div className="goal-card__buttons">
          <IconButton label="Archivar" icon="calendar" />
        </div>
      )}
    </article>
  );
};

GoalsCard.displayName = "GoalsCard";

GoalsCard.propTypes = {
  title: PropTypes.string,
  type: PropTypes.any,
  progress: PropTypes.number,
  percentage: PropTypes.number,
  totalIncome: PropTypes.number,
  date: PropTypes.string,
  // key: PropTypes.any,
  amount: PropTypes.number,
  id: PropTypes.string.isRequired,
  currency: PropTypes.any,
  sign: PropTypes.string,
};

export { GoalsCard };
