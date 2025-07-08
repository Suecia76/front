import React, {useState} from 'react'
import { Button } from '../Button'
import { ModalWrapper } from '../Modals/ModalWrapper';
import { Dialog } from '../Modals/Dialog';
import PropTypes from 'prop-types';

const ConfirmTransaction = ({type, openModal}) => {

    return (
    <div className='confirmation' >
      <p>Confirmar {type === "ingreso" ? "recepción" : "pago"} del {type} </p>
        <Button className="btn btn--filled-blue" label="Confirmar" onClick={openModal}/>
    </div>
  )
}

ConfirmTransaction.propTypes = {
    type: PropTypes.string,
    confirmTransaction: PropTypes.func,
    openModal: PropTypes.func
}

export {ConfirmTransaction}
