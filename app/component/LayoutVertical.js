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
    },
    actions: actionsList,
    animateConfig
  } = props;
  let overLoad = false;

  if (hitokoto && hitokoto.length > JUDESIZE) {
    overLoad = true;
  };

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
      <Nav/> {/*<div className={info} data-id={id}>
        <b title="创建者">{creator}</b>
  </div>*/}

      <QueueAnim
        duration='1000'
        className={verticalAnimate}
        animConfig={animateConfig}>
        <div className={oprations} key="fff">
          <ul component="ul" className={actions}>
            {actionsList}
          </ul>
        </div>
        {Child}
      </QueueAnim>
    </div>
  )
}
