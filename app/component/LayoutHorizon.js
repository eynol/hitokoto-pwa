import React from 'react'
import style from './HitokotoLayout.css'
import {Link} from 'react-router-dom'
export default function LayoutHorizon(props) {
  let img,
    body,
    detail;
  if (!props.img) {
    img = (
      <div className={style.Header}>
        <img src="./ignore/thumb.jpg"/>
      </div>
    )
  }

  return (
    <div className={style.layout_horizon}>

      {img}

      <div className={style.Content}>
        <div className={style.info}>
          <h1>
            <span title="序号">{props.hitoid}</span>
          </h1>
          <p >
            <span title="创建者">{props.creator}</span>
          </p>
        </div>
        <h1
          style={{
          fontFamily: props.fontFamily,
          fontWeight: props.fontWeight
        }}>{props.hitokoto}</h1>
        <p>——&nbsp;&nbsp;&nbsp;{props.from}</p>
        <div className='oprations'>
          <ul className={style.actions}>
            <li>
              <a href="javascript:" className={style.love}></a>
            </li>
            <li>
              <Link to="/setting">设置</Link>·<a href="javascript:" onClick={props.callbacks.handleNext}>下一条</a>
            </li>
          </ul>
        </div>
      </div>

    </div>
  );
}
