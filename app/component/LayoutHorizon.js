import React from 'react'
import QueueAnim from 'rc-queue-anim';

import {layout_horizon, Content, info, actions, love} from './HitokotoLayout.css'
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

let FONT_MAP = {
  'default': 'inherit',
  'simsun': "'Noto Serif CJK SC', 'Source Han Serif SC', 'Source Han Serif', source-han-serif" +
      "-sc, '宋体', SimSun, '华文细黑', STXihei, serif",
  'fangsong': 'Georgia,"Times New Roman", "FangSong", "仿宋", STFangSong, "华文仿宋", serif',
  'kai': '"楷体",serif'
}
export default function LayoutHorizon(props) {
  let body,
    detail;

  let {
    hitokoto: {
      id,
      'from': fromwhere,
      hitokoto,
      creator,
      created_at,
      type
    },
    layout: {
      font,
      fontWeight
    }
  } = props;
  let OptionsChildren = null;
  if (props.children.length) {
    for (let i = 0, len = props.children.length; i < len; i++) {
      let one = props.children[i];
      if (one.props['data-role'] == 'actions') {
        OptionsChildren = one.props.children;
      }
    }
  } else {
    if (props.children.props['data-role'] == 'actions') {
      OptionsChildren = props.children.props.children;
    }
  }

  return (
    <div className={layout_horizon}>
      <QueueAnim animConfig={ANIMATE_CONFIG} className={Content}>
        <div className={info} key={id + 'info'}>
          <h1>
            <span title="序号">{id}</span>
          </h1>
          <p >
            <span title="创建者">{creator}</span>
          </p>
        </div>

        <h1
          style={{
          fontFamily: FONT_MAP[font],
          fontWeight: fontWeight
        }}
          key={id + 'hito'}>{hitokoto}</h1>

        <p key={id + 'from'}>——&nbsp;&nbsp;&nbsp;{fromwhere}</p>
        <div className='oprations' key={id + 'oprations'}>
          <ul className={actions}>
            {OptionsChildren}
          </ul>
        </div>
      </QueueAnim>
    </div>
  );
}
