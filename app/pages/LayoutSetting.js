import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {Link, withRouter} from 'react-router-dom';
import QueueAnim from 'rc-queue-anim';

import Modal from '../component/Modal';
import FullPage from '../component/FullPage';
import hitokotoDriver from '../API/hitokotoDriver'
import showNotification from '../API/showNotification'

import fontPlugin from '../plugins/SourceHan.font'

import {settingWrapper, left, right} from './LayoutSetting.css'
import {PANEL_OPEN} from '../actions'
import {GLOBAL_ANIMATE_TYPE} from '../configs'

class LayoutSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPatternID: hitokotoDriver.pattern.id,
      showLoadFontModal: false
    }

    this.hideLoadFontModal = this.hideLoadFontModal.bind(this);
    this.confirmDownload = this.confirmDownload.bind(this);
  }
  handlePatternChange(id) {
    if (id !== hitokotoDriver.pattern.id) {
      let pattern = hitokotoDriver.patterManager.getPatternById(id);
      hitokotoDriver.drive(pattern).start();
      this.setState({currentPatternID: id})
    }
  }
  changedFont(evt) {
    let checked = evt.target.checked;
    if (checked) {
      //未开启->开启
      fontPlugin.enableFont().catch(e => {
        showNotification(e)
      });

    } else {
      //开启->未开启
      let task = fontPlugin.getTask();
      if (task) {
        task.abort();
      } else {
        fontPlugin.disableFont();
      }

    }
  }
  handleClickFont(evt) {

    let enabled = fontPlugin.getFontEabled();

    if (enabled == 'no') {
      //现在是关闭状态，用户要加载思源宋体

      if (!fontPlugin.isStored()) {
        //没有缓存
        evt.stopPropagation();
        evt.preventDefault(); //阻止触发onChange

        this.setState({showLoadFontModal: true});
      }
    }
  }

  confirmDownload() {
    this.hideLoadFontModal();
    this.refs.sourcehan.click();
    showNotification('再次提醒，要中断下载任务，可以刷新页面 或 关闭「加载思源宋体」开关！');
  }
  hideLoadFontModal() {
    this.setState({showLoadFontModal: false});
  }
  render() {
    let {
      changeLayout,
      layout: {
        font,
        fontWeight,
        layoutHorizon,
        backgroundColor,
        revert2white,
        showCover
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
              <dl key="s-r2w">
                <dt>使用白色UI</dt>
                <dd className="form">
                  <input
                    type="checkbox"
                    hidden
                    onChange={(event) => {
                    changeLayout('revert2white', event.target.checked)
                  }}
                    id="id-r2w"
                    defaultChecked={revert2white}/>
                  <label htmlFor="id-r2w"></label>
                </dd>
              </dl>
              <dl key="s-cover">
                <dt>隐藏PC导航</dt>
                <dd className="form">
                  <input
                    type="checkbox"
                    hidden
                    onChange={(event) => {
                    changeLayout('showCover', event.target.checked)
                  }}
                    id="id-cover"
                    defaultChecked={showCover}/>
                  <label htmlFor="id-cover"></label>
                </dd>
              </dl>
              <dl key="s-sh">
                <dt>加载思源宋体</dt>
                <dd className="form">
                  <input
                    type="checkbox"
                    hidden
                    id="id-sourcehan"
                    ref="sourcehan"
                    onChange={this.changedFont.bind(this)}
                    defaultChecked={fontPlugin.getFontEabled() == 'yes'}/>
                  <label htmlFor="id-sourcehan" onClick={this.handleClickFont.bind(this)}></label>
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
    return [
      (
        <QueueAnim
          key="panel"
          type={GLOBAL_ANIMATE_TYPE}
          ease={['easeOutQuart', 'easeInOutQuart']}>
          {Child}
        </QueueAnim>
      ), this.state.showLoadFontModal
        ? (
          <Modal key="modal" exit={this.hideLoadFontModal}>
            <h3 className="color-red">注意：下载字体将会消耗24MB的流量！</h3>
            <p>只有这一次下载会消耗24MB的流量，字体下载后，将会缓存到本地，以后将会直接从本地读取。建议电脑用户自行安装思源宋体，然后禁用该选项，这是最好的解决方式。</p>
            <p>可能出现的现象：进入页面后，页面中间的文字会消失1秒，然后恢复正常；由于字体文件过大，进入展示页面时会卡顿一次。</p>
            <p className="color-red">注意：如果要中断下载，可以刷新页面 或 关闭「加载思源宋体」开关！</p>
            <div className="clearfix">
              <span className="pull-right">
                <button role="exit">取消</button>
                <button onClick={this.confirmDownload}>下载思源宋体(24MB)</button>
              </span>
            </div>
          </Modal>
        )
        : null
    ];
  }
}
LayoutSetting.propTypes = {
  changeLayout: PropTypes.func.isRequired,
  layout: PropTypes.shape({font: PropTypes.string.isRequired, fontWeight: PropTypes.string.isRequired, layoutHorizon: PropTypes.bool.isRequired, backgroundColor: PropTypes.string.isRequired}),
  hide: PropTypes.func.isRequired,
  panel: PropTypes.string.isRequired
}

export default withRouter(LayoutSetting)