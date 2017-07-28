import React from 'react'
import style from './Action.css'

export default function Action(props) {
  return (
    <a
      onClick={props.onClick}
      href="javascript:"
      className={[style.action]}>{props.children}</a>
  )
};