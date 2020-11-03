import React from 'react'
import './index.css'

const Input = (props) => {
  return (
    <input className={props.className || ''}
      value={props.value}
      onChange={props.onChange}
      onKeyPress={props.onKeyPress}
      placeholder={props.placeholder}
    />
  )
}

export default Input
