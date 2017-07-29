import React from 'react';
import style from './HitokotoLayout.css'

export default function LayoutVertical(props) {
  return (
    <div className={style.layout_vertical}>
      <div className={style.info}>
        <h1>
          <span title="序号">{props.hitoid}</span>
        </h1>
        <p >
          <span title="创建者">{props.creator}</span>
        </p>
        <div className='oprations'>
          <ul className={style.actions}>
            <li>
              <a href="javascript:" className={style.love}></a>
              <a
                href="javascript:"
                onClick={props.callbacks.handleNext}
                className={style.next}></a>
            </li>
          </ul>
        </div>
      </div>
      <div className={style.Content}>
        <h1 className={props.song
          ? style.song
          : ''}>{props.hitokoto}</h1>
        <p>
          <i>——</i>&nbsp;&nbsp;&nbsp;{props.from}</p>
      </div>
    </div>
  )
}
