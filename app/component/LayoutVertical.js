import React from 'react';
import style from './HitokotoLayout.css'
import {Link} from 'react-router-dom'
import QueueAnim from 'rc-queue-anim';
export default function LayoutVertical(props) {
  return (
    <div className={style.layout_vertical}>
      <div className={style.info}>
        <h1>
          <span title="序号">{props.hitoid}</span>
        </h1>
        <p>
          <span title="创建者">{props.creator}</span>
        </p>
        <div className={style.oprations}>
          <QueueAnim component="ul" className={style.actions}>

            <li key={props.hitoid + 'love'}>
              <a href="javascript:" className={style.love}></a>
            </li>
            <li key={props.hitoid + 'pagesetting'}>
              <Link to="/setting">设置</Link>
            </li>
            <li key={props.hitoid + 'next'}>
              <a href="javascript:" onClick={props.callbacks.handleNext}>下一条</a>
            </li>

          </QueueAnim>
        </div>
      </div>
      <QueueAnim
        animConfig={[
        {
          opacity: [
            1, 0
          ],
          translateY: [0, -30]
        }, {
          opacity: [
            1, 0
          ],
          position: 'absolute',
          translateY: [0, 50]
        }
      ]}
        ease={['easeOutBack', 'easeInOutCirc']}
        className="animate-none-sense">
        <div
          className={style.Content}
          style={{
          fontFamily: props.fontFamily,
          fontWeight: props.fontWeight
        }}
          key={props.hitoid}>
          <h1 className={props.song
            ? style.song
            : ''}>{props.hitokoto}</h1>
          <p>
            <i>——</i>&nbsp;&nbsp;&nbsp;{props.from}</p>
        </div>
      </QueueAnim>
    </div>
  )
}
