import React from 'react'

const Tab = ({label, isSelected, onSelect, value}) => {
  return (
    <button 
        value={value} 
        className={`tab ${isSelected ? 'tab--active' : ''}`}
        onClick={onSelect} 
        role="tab" 
        aria-selected={isSelected}
>
      {label}
    </button>
  )
}

export {Tab}
