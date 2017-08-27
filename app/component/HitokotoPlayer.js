import React, {Component} from 'react';
import {connect} from 'react-redux'

import QueueAnim from 'rc-queue-anim';
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'

import LayoutHorizon from './LayoutHorizon'
import LayoutVertical from './LayoutVertical'
import {love} from './HitokotoLayout.css'

import {ANIMATE_CONFIG_LAST, ANIMATE_CONFIG_NEXT} from '../configs'

class HitokotoPlayer extends Component {
  render() {

    let {
        hitokoto,
        layout,
        callbacks: {
          handleNext,
          handleLast
        },
        direction,
        lastCount,
        nextCount,
        processing

      } = this.props,
      id = hitokoto.id,
      layoutHorizon = layout.layoutHorizon;

    let ActionsHorizon = (
      <ul data-role="actions">
        <li>
          <a href="javascript:" className={love}></a>
        </li>
        <li>
          <Link to="/layoutsetting">显示设置</Link>
          {lastCount > 1
            ? '·'
            : null}
          {lastCount > 1
            ? <a href='javascript:' onClick={handleLast}>上一条</a>
            : null}
          ·
          <a href="javascript:" onClick={handleNext}>{processing
              ? 'emm..'
              : '下一条'}</a>
        </li>
      </ul>
    );
    let ActionsVertical = (
      <ul data-role="actions">
        <li key={id + 'love'}>
          <a href="javascript:" className={love}></a>
        </li>
        <li key={id + 'pagesetting'}>
          <Link to="/layoutsetting">显示设置</Link>
        </li>
        {lastCount > 1
          ? <li key={id + 'last'}>
              <a href='javascript:' onClick={handleLast}>上一条</a>
            </li>
          : null}
        <li key={id + 'next'}>
          <a href="javascript:" onClick={handleNext}>{processing
              ? 'emm..'
              : '下一条'}</a>
        </li>
      </ul>
    )
    console.log(direction);
    if (layoutHorizon) {
      return (
        <QueueAnim
          animConfig={ANIMATE_CONFIG_NEXT}
          ease={['easeOutQuart', 'easeInOutQuart']}
          className="animate-none-sense"
          style={{
          position: 'relative',
          height: '100%',
          width: '100%'
        }}>
          <LayoutHorizon
            animateConfig={direction == 'next'
            ? ANIMATE_CONFIG_NEXT
            : ANIMATE_CONFIG_LAST}
            key={id}
            hitokoto={hitokoto}
            layout={layout}>
            {ActionsHorizon}
          </LayoutHorizon>
        </QueueAnim>
      )
    } else {
      return (
        <LayoutVertical key={id} hitokoto={hitokoto} layout={layout}>
          {ActionsVertical}</LayoutVertical>
      )
    }
  }
}

HitokotoPlayer.PropTypes = {
  hitokoto: PropTypes.object.isRequired,
  layout: PropTypes.object.isRequired,
  callbacks: PropTypes.shape({handleNext: PropTypes.func, handleLast: PropTypes.func}),
  direction: PropTypes.string.isRequired,
  lastCount: PropTypes.number,
  nextCount: PropTypes.number,
  processing: PropTypes.bool
}

let mapStateToProps = (state) => ({})
export default connect(mapStateToProps)(HitokotoPlayer)