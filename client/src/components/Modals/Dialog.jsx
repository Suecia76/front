import PropTypes from 'prop-types'
import { Button } from '../Button'

//This component should be used when the decision is mandatory

const Dialog = ({title, text, option1, option2, onClick1, onClick2}) => {
  return (
    <div className='dialog'>
      <h2 className='dialog__title'>{title}</h2>
      <p className='dialog__text'>{text}</p>

      <div className='dialog__buttons'>
        <Button onClick={onClick1} className='dialog__button' label={option1}/>
        <Button onClick={onClick2} className='dialog__button' label={option2}/>
      </div>
    </div>
  )
}

Dialog.displayName = "Dialog"
Dialog.propTypes = {
  title: PropTypes.string,
  text: PropTypes.string,
  option1: PropTypes.string,
  option2: PropTypes.string,
  onClick1: PropTypes.func,
  onClick2: PropTypes.func
}

export {Dialog}
