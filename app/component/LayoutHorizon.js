import React from 'react'
import style from './HitokotoLayout.css'

export default function LayoutHorizon(props) {
  let img,
    body,
    detail;
  if (!props.img) {
    img = (
      <div className={style.header}>
        <img src="./ignore/thumb.jpg"/>
      </div>
    )
  }

  return (
    <div className={style.layout_horizon}>
      {img}
      <div className={style.Content}>
        <h1 className={props.song
          ? style.song
          : ''}>{props.hitokoto}</h1>
        <p><i>from</i>&nbsp;&nbsp;&nbsp;{props.from}</p>
      </div>
    </div>
  );
}
