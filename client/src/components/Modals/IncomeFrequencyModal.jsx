import React from 'react'
import { RadioOption } from '../Forms/RadioOption'

const IncomeFrequencyModal = () => {
    const options = [
      
        {
            id: 1,
            name: "mensual",
            label: "Una vez al mes",
        },
        {
            id: 2,
            name: "quincenal",
            label: "Cada quince días",
        },
        {
            id: 3,
            name: "semanal",
            label: "Una vez por semana",
        },
        {
            id: 4,
            name: "personalizada",
            label: "Elegir fechas en el calendario",
        }
    ]
        
    

  return (
    <div className='modal-overlay'>
      <div className='modal-options'>
        <form className='modal-options__options' action="#">
            <h2>Frecuencia del ingreso</h2>

            {options.map ((option) => (
                <RadioOption key={option.id} label={option.label} name={option.name} value ={option.id}/>
            ))}
        </form>
      </div>
    </div>
  )
}

export {IncomeFrequencyModal}
