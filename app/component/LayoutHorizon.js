import React from 'react'
import css from './HitokotoLayout.css'

export default function LayoutHorizon(props) {
  let img,
    body,
    detail;
  if (!props.img) {
    img = (
      <div className={css.header}>
        <img src="./ignore/thumb.jpg"/>
      </div>
    )
  }

  return (
    <div className={css.layout_horizon}>
      {img}
      <div className={css.Content}>
        <h1 className={props.song
          ? css.song
          : ''}>{props.hitokoto}</h1>
        <p>
          ——「 {props.from}」
        </p>
      </div>
    </div>
  );
}
