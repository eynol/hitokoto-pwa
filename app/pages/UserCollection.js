import React, {Component} from 'react'
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types'
import {matchPath} from 'react-router'

import QueueAnim from 'rc-queue-anim';
import httpManager from '../API/httpManager';
import indexedDBManager from '../API/IndexedDBManager';

import hitokotoDriver from '../API/hitokotoDriver'
import showNotification from '../API/showNotification';

import Modal from '../component/Modal';
import Pagination from '../component/Pagination';
import PublicHitokoto from '../component/PublicHitokoto';
import Loading from '../component/Loading'

import FullPageCard from '../component/FullPageCard'

class UserCollection extends Component {
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
    if (this.props.rinfo) {
      let collection = this.props.rinfo[1];
      let username = this.props.user.nickname;
      let url = hitokotoDriver.patterManager.getUrlOfUserCol(username, collection, true);
      return {username, url, collection}
    }
  }

  fetchHitokotos(page = 1, perpage = 10) {

    let pathname = this.props.location.pathname;
    let colleName = this.props.rinfo[1];

    let element = ReactDOM.findDOMNode(this);
    if (element) {
      if (element.scrollIntoView) {
        element.firstElementChild && element.firstElementChild.scrollIntoView({behavior: 'smooth', block: "start", inline: "nearest"});
      } else {
        element.scrollTop = 0;
      }
    }

    if (colleName && colleName.length) {
      return httpManager.API_viewCollection(colleName, page, perpage).then(result => {
        let hitokotoBundle = result.hitokotos.slice(0);
        this.props.fetchHitokotosSuccess(result.hitokotos);
        this.setState({inited: true, error: null, total: result.totalPage, current: result.currentPage});

        //OFFLINE:cache HITOKOTOS
        if (hitokotoBundle.length) {
          let one = hitokotoBundle[0];
          let uid = one.creator_id;
          let fid = one.fid;
          let url = hitokotoDriver.patterManager.getUrlOfUserCol(uid, fid, false);
          indexedDBManager.putHitokotoBulk(url, hitokotoBundle);
        }

      }).catch(e => {
        showNotification('获取用户hitokoto失败！', 'error');
        this.setState({
          error: e.message || e,
          inited: false
        });
        return Promise.reject(e);
      })
    } else {
      this.props.history.push('/myspace/collections');
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
    let collectionName = this.props.rinfo[1];

    return httpManager.API_deleteHitokoto(collectionName, {id: hitokotoToRemove._id}).then(result => {

      indexedDBManager.removeHitokoto(hitokotoToRemove._id);
      showNotification(result.message, 'success');
      this.hideDelModal();
      this.fetchHitokotos(this.state.current);

      return result
    });
  }
  render() {

    let {hitokotos, location: {
          pathname
        }} = this.props,
      ListToShow;

    if (hitokotos.length > 0) {
      ListToShow = hitokotos.map((hitokoto) => (
        <PublicHitokoto key={hitokoto.id} data={hitokoto} viewonly showState>
          <button onClick={this.preview.bind(this, hitokoto)}>预览</button>
          <button onClick={() => this.updateHitokoto(hitokoto)}>修改</button>
          <button onClick={() => this.showDelModal(hitokoto)} className="color-red">删除</button>
        </PublicHitokoto>
      ));
    } else if (!this.state.error && this.state.inited) {
      ListToShow = (
        <div key='empty' className='align-center'>
          <h1>哦豁...</h1>
          <p>当前句集没有任何东西，点击「新增」添加句子</p>
        </div>
      )
    }

    return (
      <FullPageCard
        cardname={this.props.rinfo[1]}
        actions={[(
          <a
            key="newone-hito"
            href="javascript:"
            title=""
            onClick={this.newHitokoto}
            data-text="新增">
            <i className="iconfont icon-add hide-pc"></i>
          </a>
        ), (
          <a
            key="pub-api-hito"
            href="javascript:"
            title=""
            data-text="公开API地址"
            onClick={() => {
            showNotification('该句集的公开API地址为：\n' + this.getURL().url + '\n该地址支持跨域调用，仅可以获取所有「公开」的句子。', 'info', true)
          }}>
            <i className="iconfont icon-link"></i>
          </a>
        )]}>
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
          <div key="container">{ListToShow}</div>
          {this.state.inited
            ? null
            : <Loading
              error={this.state.error}
              retry={() => this.fetchHitokotos(this.state.current, 10)}
              key="loading-co"/>}
        </QueueAnim>

        <Pagination
          current={this.state.current || 1}
          total={this.state.total || 1}
          limit={10}
          func={this.fetchHitokotos}></Pagination>
        {this.state.delModal
          ? <Modal exit={this.hideDelModal.bind(this)}>
              <h1>你确定要删除该hitokoto?</h1>
              <div className="clearfix">
                <span className="pull-right">
                  <button role="exit">取消</button>
                  <button onClick={this.removeHitokoto.bind(this)}>确定</button>
                </span>
              </div>
            </Modal>
          : null}
      </FullPageCard>
    )
  }
}

UserCollection.propTypes = {
  hitokotos: PropTypes.arrayOf(PropTypes.object).isRequired,
  leaveCollection: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  rinfo: PropTypes.array.isRequired,
  preview: PropTypes.func.isRequired
}
export default UserCollection