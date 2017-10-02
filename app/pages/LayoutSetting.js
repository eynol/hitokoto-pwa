import React, {Component} from 'react';
import PropTypes from 'prop-types'

import {Link, withRouter} from 'react-router-dom';
import QueueAnim from 'rc-queue-anim';
import FullPage from '../component/FullPage';
import hitokotoDriver from '../API/hitokotoDriver'

import {settingWrapper, left, right} from './LayoutSetting.css'
import {PANEL_OPEN} from '../actions'
import {GLOBAL_ANIMATE_TYPE} from '../configs'

class LayoutSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPatternID: hitokotoDriver.pattern.id
    }
  }
  handlePatternChange(id) {
    console.log('pattern change', id);
    if (id !== hitokotoDriver.pattern.id) {
      let pattern = hitokotoDriver.patterManager.getPatternById(id);
      hitokotoDriver.drive(pattern).start();
      this.setState({currentPatternID: id})
    }
  }
  render() {
    let {
      changeLayout,
      layout: {
        font,
        fontWeight,
        layoutHorizon,
        backgroundColor
      },
      hide,
      patternChange,
      panel
    } = this.props;

    let patterns = hitokotoDriver.patterManager.patterns,
      currentPatternID = this.state.currentPatternID;
    let patternOptions;
    if (patterns) {
      patternOptions = patterns.map((pattern) => (
        <option key={pattern.id} value={pattern.id}>{pattern.name}</option>
      ))
      console.log(currentPatternID);
      patternOptions = (
        <dl key="s-pattern">
          <dt>模式</dt>
          <dd>
            <select
              name="mode"
              onChange={event => {
              this.handlePatternChange(Number(event.target.value));
            }}
              defaultValue={currentPatternID}>{patternOptions}</select>
          </dd>
        </dl>
      )
    }
    let Child;
    if (panel === PANEL_OPEN + 'layoutSetting') {
      Child = (
        <FullPage
          style={{
          backgroundColor: "rgba(255,255,255,.01)"
        }}
          key='layoutsetting'
          onClick={hide}>
          <div
            className={settingWrapper}
            onClick={e => {
            console.dir(e);
            e.stopPropagation();
            return false;
          }}>
            <div className="clearfix">
              <dl>
                <dt>字体</dt>
                <dd>
                  <select
                    value={font}
                    onChange={(event) => {
                    changeLayout('font', event.target.value)
                  }}>
                    <option value="default">默认</option>
                    <option value="simsun">宋体</option>
                    <option value="fangsong">仿宋</option>
                    <option value="kai">楷体</option>
                  </select>
                </dd>
              </dl>
              <dl key="s-frontw">
                <dt>字重</dt>
                <dd>
                  <select
                    defaultValue={fontWeight}
                    onChange={(event) => {
                    changeLayout('fontWeight', event.target.value)
                  }}>
                    <option value="100">100</option>
                    <option value="200">200</option>
                    <option value="300">300</option>
                    <option value="400">400</option>
                    <option value="500">500</option>
                    <option value="600">600</option>
                    <option value="700">700</option>
                    <option value="800">800</option>
                    <option value="900">900</option>

                  </select>
                </dd>
              </dl>
              <dl key="s-frontd">
                <dt>文字方向</dt>
                <dd>
                  <select
                    defaultValue={layoutHorizon}
                    onChange={event => {
                    changeLayout('layoutHorizon', event.target.value == 'true')
                  }}>
                    <option value="true">横向</option>
                    <option value="false">竖向</option>
                  </select>
                </dd>
              </dl>
              <dl key="s-bgc">
                <dt>页面背景颜色</dt>
                <dd>
                  <input
                    type="color"
                    onChange={(event) => {
                    changeLayout('backgroundColor', event.target.value)
                  }}
                    defaultValue={backgroundColor}/>
                </dd>
              </dl>
              {patternOptions}
            </div>
          </div>
        </FullPage>
      )
    } else {
      Child = <div key='none'></div>
    }
    return (
      <QueueAnim type={GLOBAL_ANIMATE_TYPE} ease={['easeOutQuart', 'easeInOutQuart']}>
        {Child}
      </QueueAnim>
    );
  }
}
LayoutSetting.propTypes = {
  changeLayout: PropTypes.func.isRequired,
  layout: PropTypes.shape({font: PropTypes.string.isRequired, fontWeight: PropTypes.string.isRequired, layoutHorizon: PropTypes.bool.isRequired, backgroundColor: PropTypes.string.isRequired}),
  hide: PropTypes.func.isRequired,
  panel: PropTypes.string.isRequired
}

export default withRouter(LayoutSetting)