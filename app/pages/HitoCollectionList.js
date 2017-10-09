import React, {Component} from 'react'
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types'
import {matchPath} from 'react-router'

import QueueAnim from 'rc-queue-anim';
import httpManager from '../API/httpManager';

import hitokotoDriver from '../API/hitokotoDriver'
import showNotification from '../API/showNotification';

import Modal from '../component/Modal';
import Pagination from '../component/Pagination';
import PublicHitokoto from '../component/PublicHitokoto';
import Loading from '../component/Loading'

import HitoView from '../component/HitoView'

class HitoCollectionList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inited: false,
      error: null,
      total: 1,
      current: 1,
      delModal: false
    };
    this.fetchHitokotos = this.fetchHitokotos.bind(this);
    this.newHitokoto = this.newHitokoto.bind(this);
    this.updateHitokoto = this.updateHitokoto.bind(this);
    this.isSourcesContians = this.isSourcesContians.bind(this);
  }

  componentWillMount() {
    this.fetchHitokotos();
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.needRefresh) {
      this.fetchHitokotos(this.state.current).then(() => {
        this.props.refreshCollectionHitokotoSuccess()
      })
    }
  }
  componentWillUnmount() {
    this.props.leaveCollection()
  }
  getURL() {
    let pathname = this.props.location.pathname;
    let match = matchPath(pathname, {path: '/home/:name'});
    if (match) {
      let collection = match.params.name;
      let username = this.props.user.nickname;
      let url = hitokotoDriver.patterManager.getCORSUrlOfUserCol(username, collection);
      return {username, url, collection}
    }
  }
  removeFromSource() {
    let url = this.getURL()
    if (url) {
      hitokotoDriver.patterManager.removeSourceWithUsernameAndCol(url.username, url.collection);
      showNotification('将句集从来源中删除成功！不影响已在模式中的来源！');
      this.forceUpdate();
    }
  }
  addToSources() {

    let url = this.getURL()
    if (url) {
      hitokotoDriver.patterManager.newSourceWithUsernameAndCol(url.username, url.collection);
      showNotification('将句集加入来源成功！');
      this.forceUpdate();
    }

  }

  isSourcesContians() {
    let url = this.getURL()
    if (!url) {
      return false;
    }
    return hitokotoDriver.patterManager.isSourceExsit(url.url);
  }
  fetchHitokotos(page = 1, perpage = 10) {
    let pathname = this.props.location.pathname;
    if (pathname == '/home/') {
      this.props.history.replace('/home');
      return;
    }
    let match = matchPath(pathname, {path: '/home/:name'})

    if (!match) {
      showNotification('当前路径错误');
      return;
    }

    let element = ReactDOM.findDOMNode(this);
    if (element) {
      if (element.scrollIntoView) {
        element.firstElementChild && element.firstElementChild.scrollIntoView({behavior: 'smooth', block: "start", inline: "nearest"});
      } else {
        element.scrollTop = 0;
      }
    }

    let {params: {
        name
      }} = match;
    if (name && name.length) {
      return httpManager.API_viewCollection(name, page, perpage).then(result => {
        if (result.err) {

          return Promise.reject(result.err);
        } else {
          this.props.fetchHitokotosSuccess(result.hitokotos);
          this.setState({inited: true, error: null, total: result.totalPage, current: result.currentPage})
        }
      }).catch(e => {
        showNotification('获取用户hitokoto失败！', 'error');
        this.setState({error: e, inited: false});
        return Promise.reject(e);
      })
    } else {

      this.props.history.push('/home');
    }
  }
  preview(hitokoto) {
    this.props.preview(hitokoto, 'preview');
    this.props.history.push(this.props.location.pathname + '/preview');
  }
  updateHitokoto(hitokoto) {
    this.props.preview(hitokoto, 'within');
    this.props.history.push(this.props.location.pathname + '/update');
  }
  newHitokoto() {
    let pathname = this.props.location.pathname;
    if (!(/\/new$/.test(pathname))) {
      pathname += '/new';
    }
    this.props.preview(null, 'within');
    this.props.history.push(pathname);
  }
  showDelModal(delModal) {
    this.setState({delModal});
  }
  hideDelModal() {
    this.setState({delModal: null});
  }

  removeHitokoto() {

    let hitokotoToRemove = this.state.delModal;

    let reg = /^\/home\/([^\/]*)$/,
      matchs = reg.exec(this.props.location.pathname),
      collectionName = matchs[1];

    return httpManager.API_deleteHitokoto(collectionName, {id: hitokotoToRemove._id}).then(result => {
      if (result.err) {
        showNotification(result.err, 'error');
      } else {
        showNotification('删除成功！', 'success');
        this.hideDelModal();
        this.fetchHitokotos(this.state.current);
      }
      return result
    });
  }
  render() {

    let {hitokotos, location: {
          pathname
        }} = this.props,
      ListToShow = [(
          <div key='menu'>

            <button onClick={() => this.props.history.goBack()}>返回</button>
            <button onClick={this.newHitokoto}>新增</button>
            {this.isSourcesContians()
              ? <button
                  onClick={() => {
                  this.removeFromSource()
                }}>从来源中取消该句集</button>
              : <button onClick={() => {
                this.addToSources()
              }}>将此句集加入来源</button>}
            <button
              onClick={() => {
              showNotification('该句集的API地址为：\n' + this.getURL().url, 'info', true)
            }}>
              <i className="iconfont icon-link">API</i>
            </button>
          </div>
        )];

    if (hitokotos.length > 0) {
      ListToShow = ListToShow.concat(hitokotos.map((hitokoto) => (
        <PublicHitokoto key={hitokoto.id} data={hitokoto}>
          <button onClick={this.preview.bind(this, hitokoto)}>预览</button>
          <button onClick={() => this.updateHitokoto(hitokoto)}>修改</button>
          <button onClick={() => this.showDelModal(hitokoto)} className="color-red">删除</button>
        </PublicHitokoto>
      )));;
    } else if (!this.state.error) {
      ListToShow.push(
        <div key='empty' className='align-center'>
          <h1>Oops...</h1>
          <p>当前句集还没有发布句子哦！</p>
        </div>
      )
    }

    return [
      (
        <QueueAnim
          ease='easeOutQuart'
          animConfig={[
          {
            opacity: [1, 0]
          }, {
            left: '0',
            right: '0',
            position: 'absolute',
            opacity: [1, 0]
          }
        ]}>
          <div key="container" className='tryFlexContainer'>{ListToShow}</div>
          {this.state.inited
            ? null
            : <Loading
              error={this.state.error}
              retry={() => this.fetchHitokotos(this.state.current, 10)}
              key="loading-co"/>}
        </QueueAnim>
      ), (
        <Pagination
          current={this.state.current || 1}
          total={this.state.total || 1}
          limit={10}
          func={this.fetchHitokotos}></Pagination>
      ), this.state.delModal
        ? <Modal exit={this.hideDelModal.bind(this)}>
            <h1>你确定要删除该hitokoto?</h1>
            <div className="clearfix">
              <span className="pull-right">
                <button role="exit">取消</button>
                <button onClick={this.removeHitokoto.bind(this)}>确定</button>
              </span>
            </div>
          </Modal>
        : null
    ]
  }
}

HitoCollectionList.propTypes = {
  hitokotos: PropTypes.arrayOf(PropTypes.object).isRequired,
  leaveCollection: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  remove: PropTypes.func.isRequired,
  preview: PropTypes.func.isRequired
}
export default HitoCollectionList