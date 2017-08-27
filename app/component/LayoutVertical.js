import React from 'react';
import Logo from './Logo'
import QueueAnim from 'rc-queue-anim';
import {
  layout_vertical,
  info,
  oprations,
  actions,
  Content,
  love
} from './HitokotoLayout.css'

import {FONT_MAP} from '../configs'

export default function LayoutVertical(props) {
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
    <div className={layout_vertical}>
      <Logo/>
      <div className={info}>
        <h1>
          <span title="序号">{id}</span>
        </h1>
        <p>
          <span title="创建者">{creator}</span>
        </p>
        <div className={oprations}>
          <QueueAnim component="ul" className={actions}>
            {OptionsChildren}
          </QueueAnim>
        </div>
      </div>
      <QueueAnim
        animConfig={[
        {
          opacity: [
            1, 0
          ],
          translateX: [0, -50]
        }, {
          opacity: [
            1, 0
          ],
          position: 'absolute',
          translateX: [0, 50]
        }
      ]}
        className="animate-none-sense">
        <div
          className={Content}
          style={{
          fontFamily: FONT_MAP[font],
          fontWeight: fontWeight
        }}
          key={id}>
          <h1>{hitokoto}</h1>
          <p>
            <i>——</i>&nbsp;&nbsp;&nbsp;{fromwhere}</p>
        </div>
      </QueueAnim>
    </div>
  )
}
