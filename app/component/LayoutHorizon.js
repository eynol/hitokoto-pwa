import React from 'react'
import PropTypes from 'prop-types'
import QueueAnim from 'rc-queue-anim';
import windowSize from '../API/windowSize'

import Logo from './Logo';

import {layout_horizon, Content, info, actions, overLoadHitokoto} from './HitokotoLayout.css'

import {FONT_MAP, ANIMATE_CONFIG_HORIZON} from '../configs'
import Nav from '../containers/Nav'

let JUDESIZE = windowSize.width > 768
  ? 140
  : 40;
windowSize.subscriptb(() => {
  JUDESIZE = windowSize.width > 768
    ? 140
    : 40;
})

function LayoutHorizon(props) {
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
      backgroundColor,
      font,
      fontWeight
    },
    animateConfig
  } = props;
  let OptionsChildren = null,
    overLoad = false;

  if (hitokoto.length > JUDESIZE) {
    overLoad = true;
  }
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
    <div
      className={layout_horizon}
      style={{
      backgroundColor: backgroundColor
    }}>
      <Logo/>
      <Nav/>
      <QueueAnim
        animConfig={animateConfig}
        className={Content + (overLoad
        ? ' ' + overLoadHitokoto
        : '')}>
        <div className={info} key={id + 'info'} data-id={id}>
          <b title="创建者">
            {creator}
          </b>
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
LayoutHorizon.PropTypes = {
  hitokoto: PropTypes.object.isRequired,
  layout: PropTypes.object.isRequired
}

export default LayoutHorizon