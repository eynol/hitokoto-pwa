import React, {Component} from 'react'
import css from './Card.css'

export default function Card(props) {
  return (
    <div className={css.Card}>
      {props.children}
    </div>
  )
}