import React from 'react';
import css from './FullPageCard.css'
let {wrapper, paper} = css;
import QueueAnim from 'rc-queue-anim';
export default function FullPage(props) {
  let {style, onClick} = props;
  return (
    <QueueAnim appear leaveReverse>
      <div key="default" style={style} className={wrapper} onClick={onClick}>
        <div className={paper}>
          {props.children}
        </div>
      </div>
    </QueueAnim>
  )
};