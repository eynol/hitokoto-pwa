import React, {Component} from 'react';
import QueueAnim from 'rc-queue-anim';

import LayoutHorizon from './LayoutHorizon'
import LayoutVertical from './LayoutVertical'
import {Link} from 'react-router-dom'

import {love} from './HitokotoLayout.css'
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
class HitokotoDisplay extends Component {
  render() {

    let {hitokoto, layout, callbacks: {
          handleNext
        }, processing} = this.props,
      id = hitokoto.id,
      layoutHorizon = layout.layoutHorizon,
      nextHorizon = processing
        ? (
          <a href="javascript:;">...</a>
        )
        : (
          <a href="javascript:" onClick={handleNext}>下一条</a>
        ),
      nextVertical = processing
        ? (
          <li key={id + 'processing'}>
            <a href="javascript:">...</a>
          </li>
        )
        : (
          <li key={id + 'next'}>
            <a href="javascript:" onClick={handleNext}>下一条</a>
          </li>
        );

    if (processing) {}
    let ActionsHorizon = (
      <ul data-role="actions">
        <li>
          <a href="javascript:" className={love}></a>·<Link to="/layoutsetting">显示设置</Link>
        </li>
        <li>
          {nextHorizon}
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
        {nextVertical}
      </ul>
    )

    if (layoutHorizon) {
      return (
        <QueueAnim
          animConfig={ANIMATE_CONFIG}
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