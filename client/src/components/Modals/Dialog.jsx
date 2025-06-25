import PropTypes from 'prop-types'
import { Button } from '../Button'

//This component should be used when the decision is mandatory

const Dialog = ({title, text, option1, option2}) => {
  return (
    <div className='dialog'>
      <h2 className='dialog__title'>{title}</h2>
      <p className='dialog__text'>{text}</p>

      <div className='dialog__buttons'>
        <Button className='dialog__button' label={option1}/>
        <Button className='dialog__button' label={option2}/>
      </div>
    </div>
  )
}

Dialog.displayName = "Dialog"
Dialog.propTypes = {
  title: PropTypes.string,
  text: PropTypes.string,
  option1: PropTypes.string,
  option2: PropTypes.string
}

export {Dialog}
