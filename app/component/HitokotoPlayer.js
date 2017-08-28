import React, {Component} from 'react';
import {connect} from 'react-redux'

import QueueAnim from 'rc-queue-anim';
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'

import LayoutHorizon from './LayoutHorizon'
import LayoutVertical from './LayoutVertical'
import {love, setting} from './HitokotoLayout.css'
import {showPanel} from '../actions'

import {ANIMATE_CONFIG_LAST, ANIMATE_CONFIG_NEXT} from '../configs'

class HitokotoPlayer extends Component {
  constructor(props) {
    super(props)
  }
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
        processing,
        showLayoutSetting
      } = this.props,
      id = hitokoto.id,
      layoutHorizon = layout.layoutHorizon;

    let ActionsHorizon = (
      <ul data-role="actions">
        <li>
          {lastCount > 1
            ? <button href='javascript:' onClick={handleLast}>上一条</button>
            : null}
          <button onClick={handleNext}>{processing
              ? 'emm..'
              : '下一条'}</button>
          <div style={{
            float: "right"
          }}>
            <a href="javascript:" className={love}></a>&nbsp;
            <a href="javascript:" onClick={showLayoutSetting} className={setting}></a>
          </div>
        </li>
      </ul>
    );
    let ActionsVertical = (
      <ul data-role="actions">
        <li key={id + 'love'}>
          <a href="javascript:" className={love}></a>&nbsp;
        </li>
        <li key={id + 'setting'}>
          <a href="javascript:" onClick={showLayoutSetting} className={setting}></a>
        </li>
        {lastCount > 1
          ? <li key={id + 'last'}>
              <button href='javascript:' onClick={handleLast}>上一条</button>
            </li>
          : null}
        <li key={id + 'next'}>
          <button href="javascript:" onClick={handleNext}>{processing
              ? 'emm..'
              : '下一条'}</button>
        </li>
      </ul>
    )
    console.log(direction);
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
  processing: PropTypes.bool,
  showLayoutSetting: PropTypes.func.isRequired
}

let mapStateToProps = (state) => ({layout: state.layout});
let mapActionsToProps = (dispatch) => ({
  showLayoutSetting: () => dispatch(showPanel("layoutSetting"))
});
export default connect(mapStateToProps, mapActionsToProps)(HitokotoPlayer)