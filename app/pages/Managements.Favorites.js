import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';

import Task from '../API/Task';
import showNotification from '../API/showNotification';
import timeTransform from '../API/social-time-transform';
import httpManager from '../API/httpManager';
import indexedDBManager from '../API/IndexedDBManager'
import offlineWatcher from '../API/Offline'
import hitokotoDriver from '../API/hitokotoDriver'
const patterManager = hitokotoDriver.patterManager;

import FullPageCard from '../component/FullPageCard'
import Modal from '../component/Modal'
import PublicHitokoto from '../component/PublicHitokoto';

class Favorites extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hitokotos: null,
      chooseModal: false,
      deleteFavorite: null
    }

    this.showDelete = this.showDelete.bind(this);
    this.hideDelete = this.hideDelete.bind(this);
    this.confirmDelete = this.confirmDelete.bind(this);

    this.showChooseModal = this.showChooseModal.bind(this);

    this.userNameClickProxy = this.userNameClickProxy.bind(this);
    this.collectionClickProxy = this.collectionClickProxy.bind(this);
  }
  componentWillMount() {
    indexedDBManager.getAllFavorite().then(list => {
      this.setState({hitokotos: list});
    })
  }
  showDelete(evt) {
    let index = parseInt(evt.target.getAttribute('data-index'));
    this.setState({deleteFavorite: index})
  }
  confirmDelete() {
    let hitokotos = this.state.hitokotos,
      index = this.state.deleteFavorite,
      hitokoto = hitokotos[index - 1];
    indexedDBManager.removeFromFavorite(hitokoto).then((count) => {
      showNotification('已删除！');
      this.setState(state => {
        state.hitokotos.splice(index - 1, 1);
        return state;
      })
    }).catch(e => {
      showNotification('删除失败！' + e, 'error')
    });
    this.hideDelete();
  }
  hideDelete() {
    this.setState({deleteFavorite: null});
  }
  showChooseModal(url) {
    this.setState({chooseModal: url});
  }
  export(type) {
    let task = new Task(),
      hitokotos = this.state.hitokotos,
      file;

    task.update('数据准备完成，格式转换中...');

    if (type == 'txt') {
      //
      file = new Blob(hitokotos.map(h => {
        return `\n${h.id}
${h.hitokoto}
${h.source}
由 ${h.author} 创建于
${h.created_at}\n\n`
      }), {type: 'text/plain'})
    } else if (type == 'json') {
      //
      file = new Blob([JSON.stringify(hitokotos)], {type: 'application/json'});
    }

    //插入页面中
    let a = document.createElement('a');
    a.href = URL.createObjectURL(file);
    a.download = new Date().toLocaleString() + '.' + type;

    a.onclick = () => {
      URL.revokeObjectURL(file)
    };

    a = document.body.appendChild(a);
    a.click();

    task.success('格式转换完成，尝试下载');

    this.hideChooseModal()
  }
  hideChooseModal() {
    this.setState({chooseModal: false})
  }

  userNameClickProxy(index) {
    let target = this.state.hitokotos[index];
    if (target.creator_id && target.creator) {
      window.trickyUid = target.creator_id;
      this.props.history.push('/explore/' + target.creator);
    } else {
      showNotification('无法跳转到用户详情，可能句子不是本网站的。');
    }
  }
  collectionClickProxy(index) {
    let target = this.state.hitokotos[index];
    if (target.creator_id && target.creator && target.collection) {
      window.trickyUid = target.creator_id;
      this.props.history.push('/explore/' + target.creator + '/' + target.collection);
    } else {
      showNotification('无法跳转到句集详情，可能句子不是本网站的。');
    }
  }
  render() {
    let {hitokotos} = this.state,
      list;

    if (hitokotos) {

      list = hitokotos.map((hitokoto, index) => {

        return (
          <PublicHitokoto
            data={hitokoto}
            key={index}
            usernameProxy={() => this.userNameClickProxy(index)}
            collectionProxy={() => this.collectionClickProxy(index)}>
            <button className="color-red" data-index={index + 1} onClick={this.showDelete}>删除</button>
          </PublicHitokoto>
        )
      })
    } else {
      list = (
        <div key="loading">
          <h1>
            <i className="iconfont icon-loading-anim"></i>载入中</h1>
        </div>
      )
    }

    if (hitokotos && hitokotos.length == 0) {
      list = (
        <div key="zero">
          <h1 className="color-red">
            <i className="iconfont icon-tishi"></i>空空如也</h1>
          <p>这里还没有收藏句子</p>
        </div>
      )
    }
    return (
      <FullPageCard
        cardname="我的收藏"
        actions={[(
          <a
            key="export"
            href="javascript:"
            title=""
            onClick={this.showChooseModal}
            data-text="导出数据">
            <i className="iconfont icon-pulldown hide-pc"></i>
          </a>
        )]}>
        <p>收藏的句子保存在本地，清空浏览器缓存可能导致数据丢失。</p>
        <div className="lum-list ">
          {list}
        </div>
        {this.state.chooseModal
          ? (
            <Modal exit={() => this.hideChooseModal()}>
              <h1>导出收藏的句子，请选择导出的类型：</h1>
              <p>
                <button onClick={() => this.export('txt')}>纯文本</button>
                <button onClick={() => this.export('json')}>JSON</button>
              </p>
            </Modal>
          )
          : null}
        {this.state.deleteFavorite
          ? (
            <Modal exit={() => this.hideDelete()}>
              <h1 className="color-red">从收藏里删除该句子？</h1>
              <p className="clearfix">
                <span className="pull-right">
                  <button role="exit" className="color-basic">取消</button>
                  <button onClick={this.confirmDelete} className="color-red">确认删除</button>
                </span>
              </p>
            </Modal>
          )
          : null}
      </FullPageCard>
    )
  }
}
export default withRouter(Favorites)
