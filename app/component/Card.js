import React, {Component} from 'react'
import style from './Card.css'

export default function Card(props) {
  return (
    <div className={style.Card}>
      {props.children}
    </div>
  )
}