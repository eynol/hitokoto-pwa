import React, {Component} from 'react';
import QueueAnim from 'rc-queue-anim';

import LayoutHorizon from './LayoutHorizon'
import LayoutVertical from './LayoutVertical'
import {Link} from 'react-router-dom'

import {love} from './HitokotoLayout.css'
let ANIMATE_CONFIG_NEXT = [
  {
    opacity: [
      1, 0
    ],
    translateZ: [
      0, 20
    ],
    translateX: [0, 100]
  }, {
    opacity: [
      1, 0
    ],
    position: 'absolute',
    zIndex: '100',
    translateX: [0, -100]
  }
]
let ANIMATE_CONFIG_LAST = [
  {
    opacity: [
      1, 0
    ],
    rotate: [
      0, '-90deg'
    ],
    translateY: [0, 50]
  }, {
    opacity: [
      1, 0
    ],
    position: 'absolute',
    zIndex: '100'
  }
]
class HitokotoDisplay extends Component {
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

    console.log(lastCount)
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

    if (layoutHorizon) {
      return (
        <QueueAnim
          animConfig={direction == 'next'
          ? ANIMATE_CONFIG_NEXT
          : ANIMATE_CONFIG_LAST}
          ease={['easeOutQuart', 'easeInOutQuart']}
          className="animate-none-sense"
          style={{
          position: 'relative',
          height: '100%',
          width: '100%'
        }}>
          <LayoutHorizon key={id} hitokoto={hitokoto} layout={layout}>
            {ActionsHorizon}
            <p>fawe</p>
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

export default HitokotoDisplay;