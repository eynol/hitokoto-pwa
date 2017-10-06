import React, {Children} from 'react';
import Logo from './Logo'
import QueueAnim from 'rc-queue-anim';
import windowSize from '../API/windowSize'

let JUDESIZE = windowSize.width > 768
  ? 140
  : 40;
windowSize.subscriptb(() => {
  JUDESIZE = windowSize.width > 768
    ? 140
    : 40;
})

import {
  layout_vertical,
  info,
  oprations,
  actions,
  Content,
  verticalAnimate,
  overLoadHitokoto
} from './HitokotoLayout.css'

import {FONT_MAP} from '../configs'
import Nav from '../containers/Nav'

export default function LayoutVertical(props) {
  let {
    hitokoto: {
      id,
      source,
      author,
      hitokoto,
      creator,
      created_at,
      type
    },
    layout: {
      backgroundColor,
      font,
      fontWeight
    }
  } = props;
  let OptionsChildren = null,
    overLoad = false;

  if (hitokoto && hitokoto.length > JUDESIZE) {
    overLoad = true;
  };

  Children.forEach(props.children, (one) => {
    if (one.props['data-role'] == 'actions') {
      OptionsChildren = one.props.children;
    }
  })

  let Child = (
    <div
      className={Content + (overLoad
      ? ' ' + overLoadHitokoto
      : '')}
      style={{
      fontFamily: FONT_MAP[font],
      fontWeight: fontWeight
    }}
      key={id}>
      <h1>{hitokoto}</h1>
      {author || source
        ? <p>
            <i>——</i>&nbsp;&nbsp;{author
              ? author
              : ''}{author
              ? ' '
              : ''}{source}</p>
        : ''}

    </div>
  )

  return (
    <div
      className={layout_vertical}
      style={{
      backgroundColor: backgroundColor,
      overflow: 'hidden'
    }}>
      <Logo/>
      <Nav/>
      <div className={info} data-id={id}>
        <b title="创建者">{creator}</b>
      </div>
      <div className={oprations}>
        <QueueAnim component="ul" className={actions}>
          {OptionsChildren}
        </QueueAnim>
      </div>
      <QueueAnim duration='1000' className={verticalAnimate}>
        {Child}
      </QueueAnim>
    </div>
  )
}
