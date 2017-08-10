import React from 'react';
import style from './HitokotoLayout.css'
import {Link} from 'react-router-dom'

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
        <div className={style.oprations}>
          <ul className={style.actions}>
            <li>
              <a href="javascript:" className={style.love}></a>
            </li>
            <li>
             <Link to="/setting">设置</Link>
            </li>
            <li>
              <a href="javascript:" onClick={props.callbacks.handleNext}>下一条</a>
            </li>
          </ul>
        </div>
      </div>
      <div className={style.Content} style={{
        fontFamily:props.fontFamily,
        fontWeight:props.fontWeight
      }}>
        <h1 className={props.song
          ? style.song
          : ''}>{props.hitokoto}</h1>
        <p>
          <i>——</i>&nbsp;&nbsp;&nbsp;{props.from}</p>
      </div>
    </div>
  )
}
