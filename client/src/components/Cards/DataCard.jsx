import React from 'react'
import PropTypes from 'prop-types'
import { IconButton } from '../Buttons/IconButton'

const DataCard = ({title, children, small, onClick}) => {
  return (
    <article className={`data-card ${small && "data-card--small"}`}>
      <h3 className='data-card__title'>{title}</h3>
      {children}
    </article>
  )
}

DataCard.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  small: PropTypes.bool,
  onClick: PropTypes.func,
};

export {DataCard}
