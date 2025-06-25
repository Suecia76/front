import PropTypes from 'prop-types'
import { Button } from './Button'

const StatusBar = ({label}) => {
  return (
    <div className='status-bar'>

      {/* <Button/> */} {/* Botón para volver atrás. Ver cómo se hace */}

      <h2 className='h6'>{label}</h2>
    </div>
  )
}

StatusBar.propTypes = {
  label: PropTypes.string
}

export {StatusBar}
