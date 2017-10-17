import React, {Component} from 'react';
import {connect} from 'react-redux'

import QueueAnim from 'rc-queue-anim';
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'

import {SAME_ORIGIN} from '../API/httpManager';
import indexedDBManager from '../API/IndexedDBManager';
import showNotification from '../API/showNotification';

import Modal from './Modal'
import LayoutHorizon from './LayoutHorizon'
import LayoutVertical from './LayoutVertical'
import {showPanel, PANEL_OPEN} from '../actions'

import {love, setting} from './HitokotoLayout.css'

import {ANIMATE_CONFIG_LAST, ANIMATE_CONFIG_NEXT} from '../configs'

class HitokotoPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      infoModal: false,
      favor: false
    }

    this.addToFavorite = this.addToFavorite.bind(this);
    this.removeFromFavorite = this.removeFromFavorite.bind(this);

    this.showInfo = this.showInfo.bind(this);
    this.hideInfo = this.hideInfo.bind(this);
  }
  componentWillMount() {
    let hitokoto = this.props.hitokoto;

    if (hitokoto) {
      indexedDBManager.isInFavorite(hitokoto).then(hito => {
        if (hito) {
          //
          this.setState({favor: hito.hitokoto})
        }
      })
    }
  }
  componentWillReceiveProps(nextProps) {
    let hitokoto = nextProps.hitokoto;
    if (hitokoto.hitokoto == this.props.hitokoto.hitokoto) {
      return;
    }

    this.setState({favor: null})
    if (hitokoto) {
      indexedDBManager.isInFavorite(hitokoto).then(hito => {
        if (hito) {
          //
          this.setState({favor: hito.hitokoto})
        }
      })
    }
  }
  addToFavorite() {
    let hitokoto = this.props.hitokoto;
    indexedDBManager.addToFavorite(hitokoto).then(() => {
      showNotification('加入收藏成功！', 'success');
      this.setState({favor: hitokoto.hitokoto});
    }).catch(e => {
      showNotification('操作失败' + e, 'error')
    })
  }
  removeFromFavorite() {
    let hitokoto = this.props.hitokoto;
    indexedDBManager.removeFromFavorite(hitokoto).then(() => {
      showNotification('移除成功！', 'info');
      this.setState({favor: null});
    }).catch(e => {
      showNotification('操作失败' + e, 'error')
    })
  }
  showInfo() {
    this.setState({infoModal: true});
  }
  hideInfo() {
    this.setState({infoModal: false});
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

    let Actions = [
      (
        <li key={id + 'info'}>
          <a href="javascript:" title="关于" onClick={this.showInfo}>
            <i className="iconfont icon-info"></i>
          </a>
        </li>
      ),
      (this.state.favor == hitokoto.hitokoto
        ? (
          <li key={id + 'love'}>
            <a href="javascript:" title="已收藏" onClick={this.removeFromFavorite}>
              <i className="iconfont icon-favorfill"></i>
            </a>
          </li>
        )
        : (
          <li key={id + 'love'}>
            <a href="javascript:" title="点击收藏" onClick={this.addToFavorite}>
              <i className="iconfont icon-favor"></i>
            </a>
          </li>
        )),
      (
        <li key={id + 'setting'} title="页面设置">
          <a href="javascript:" onClick={showLayoutSetting}>
            <i className="iconfont icon-shezhi"></i>
          </a>
        </li>
      ),
      lastCount > 1
        ? <li key={id + 'last'}>
            <a href='javascript:' onClick={handleLast} title="上一条">
              <i className="iconfont icon-last"></i>
            </a>
          </li>
        : null,
      (
        <li key={id + 'next'}>
          <a href="javascript:" onClick={handleNext} title="下一条">{processing
              ? <i className="iconfont icon-loading-anim"></i>
              : <i className="iconfont icon-next"></i>}</a>
        </li>
      )
    ];

    let modal = null;
    if (this.state.infoModal) {
      let time = hitokoto.created_at;
      if (!time) {
        time = "未知"
      } else {
        let timeDate = new Date(time).toLocaleString();
        if (timeDate != "Invalid Date") {
          time = timeDate
        }
      }
      if (SAME_ORIGIN.test(hitokoto.url)) {
        window.trickyUid = hitokoto.creator_id;
        modal = (
          <Modal exit={this.hideInfo} key="player-info-sameorigin">
            <p>ID：{hitokoto.id || '未知'}</p>
            <p>发布者：<Link to={"/explore/" + hitokoto.creator} role='exit'>{hitokoto.creator}</Link>
            </p>
            <p>所在句集：{hitokoto.f
                ? <Link to={"/explore/" + hitokoto.creator + '/' + hitokoto.f} role='exit'>{hitokoto.f}</Link>
                : '未知'}</p>
            <p>分类：{hitokoto.category || '未知'}</p>
            <p>发布时间：{time}</p>
          </Modal>
        )
      } else {

        modal = (
          <Modal exit={this.hideInfo} key="player-info">
            <p>ID：{hitokoto.id || '未知'}</p>
            <p>发布者：{hitokoto.creator || '未知'}</p>
            <p>所在句集：{hitokoto.f || '未知'}</p>
            <p>分类：{hitokoto.category || '未知'}</p>
            <p>发布时间：{time}</p>
          </Modal>
        )
      }

    }

    return [
      (layoutHorizon
        ? <LayoutHorizon
            key="player-horizon"
            overflowhide={this.props.panel === PANEL_OPEN + 'nav'}
            animateConfig={direction == 'next'
            ? ANIMATE_CONFIG_NEXT
            : ANIMATE_CONFIG_LAST}
            hitokoto={hitokoto}
            layout={layout}
            actions={Actions}></LayoutHorizon>
        : <LayoutVertical
          key="player-vertical"
          animateConfig={direction == 'next'
          ? ANIMATE_CONFIG_NEXT
          : ANIMATE_CONFIG_LAST}
          hitokoto={hitokoto}
          layout={layout}
          actions={Actions}></LayoutVertical>),
      (this.state.infoModal
        ? modal
        : null)
    ]
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

let mapStateToProps = (state) => ({layout: state.layout, panel: state.panel});
let mapActionsToProps = (dispatch) => ({
  showLayoutSetting: () => dispatch(showPanel("layoutSetting"))
});
export default connect(mapStateToProps, mapActionsToProps)(HitokotoPlayer)