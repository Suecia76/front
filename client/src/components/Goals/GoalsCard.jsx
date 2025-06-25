import { progress } from 'motion/react';
import PropTypes from 'prop-types'
import { IconButton } from '../Buttons/IconButton';

const GoalsCard = ({title, type, amount, percentage, totalIncome, progress, date, key }) => {
    return (

    <article key={key} className={`goal-card ${progress === 100 ? 'goal-card--complete' : 'goal-card--incomplete'}`}>
        
        <div className='goal-card__info'>
            <h3 className='goal-card__title'>{title}</h3>

            {/* <p className='goal-card__category'><span>Tipo de meta: </span>{type}</p> */}

            {amount ? (
                  <p className='goal-amount'>${amount}</p>            
            ) : (
            <p className='goal-percentage'>{percentage}% de {totalIncome} = ${totalIncome * percentage / 100}</p>
            )
            }

            { date && (
            <div className='goal-card__date-container'>
            <p className='goal-card__date'>{date}</p>
            </div>
            )
        }
        </div> 

      <div className='goal-card__buttons'>
        <IconButton label="Editar" icon="edit"/>
      </div>

      <div className='goal-card__buttons'>
        <IconButton label="Eliminar" icon="delete"/>
      </div>

    {/* Si el progreso está completo, le mostramos un bton para archivar la meta y la pintamos de */}
    { progress === 100 && (
        <div className='goal-card__buttons'>
        <IconButton label="Archivar" icon="calendar"/>
        </div>
        )
    }
        
    </article>
  )
}

GoalsCard.displayName = "GoalsCard";

GoalsCard.propTypes = {
    title: PropTypes.string,
    type: PropTypes.any,
    progress: PropTypes.number,
    percentage: PropTypes.number,
    totalIncome: PropTypes.number,
    date: PropTypes.string,
    key: PropTypes.any,
    amount: PropTypes.number
}

export {GoalsCard}
