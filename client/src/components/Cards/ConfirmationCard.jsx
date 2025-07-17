import React from 'react'
import { IconButton } from '../Buttons/IconButton'

const ConfirmationCard = ({editFunction, confirmFunction, title, amount, cuotas, type, installmentsPayed, installmentsTotal}) => {
  return (
    <div className='confirmation-card'>
      <h3 className="confirmation-card__title">{title} - ${amount}</h3>
        { cuotas > 1 && (
            // <p>Cuota {installmentsPayed}/{installmentsTotal}</p>
            <p className='confirmation-card__description'>Gasto en cuotas: {cuotas} pendientes de pago</p>
        )}


        <div className='confirmation-card__buttons'>
          <IconButton className="confirmation-card__button" icon="checkmark"  onClick={() => confirmFunction()} label="Confirm"/> 
          {/* <IconButton icon="edit" onClick={() => editFunction}/> */}
        </div>


    </div>
  )
}

export {ConfirmationCard}
