import React from 'react'
import TweenOne from 'rc-tween-one';
import QueueAnim from 'rc-queue-anim';
import style from './HitokotoLayout.css'
import {Link} from 'react-router-dom'

let ANIMATE_CONFIG = [
  {
    opacity: [
      1, 0
    ],
    translateX: [0, 50]
  }, {
    opacity: [
      1, 0
    ],
    position: 'absolute',
    translateX: [0, -50]
  }
]
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

      <QueueAnim animConfig={ANIMATE_CONFIG} className={style.Content}>
        <div className={style.info} key={props.hitoid + 'info'}>
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
        }}
          key={props.hitoid + 'hito'}>{props.hitokoto}</h1>

        <p key={props.hitoid + 'from'}>——&nbsp;&nbsp;&nbsp;{props.from}</p>
        <div className='oprations' key={props.hitoid + 'oprations'}>
          <ul className={style.actions}>
            <li>
              <a href="javascript:" className={style.love}></a>
            </li>
            <li>
              <Link to="/setting">设置</Link>·<a href="javascript:" onClick={props.callbacks.handleNext}>下一条</a>
            </li>
          </ul>
        </div>
      </QueueAnim>
    </div>
  );
}
