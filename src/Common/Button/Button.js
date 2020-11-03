import React from 'react'
import './index.css'

const Button = ({ children, ...props }) => {
  return (
    <button className={'btn ' + (props.className || '')}
      onClick={props.onClick}
      disabled={props.disabled}>
      {children}
    </button>
  )
}

export default Button
