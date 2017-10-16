import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import showNotification from '../API/showNotification'

import FullPageCard from '../component/FullPageCard';
import idbm from '../API/IndexedDBManager';
class Tools extends Component {
  goBack() {
    this.props.history.go(-1);
  }
  clearLS() {
    window.localStorage.clear();
    showNotification('localstorage已清空,将在3秒后回到首页', 'success');
    setTimeout(() => {
      location.href = '#';
      location.reload();
    }, 3000)
  }
  clearIDB() {
    idbm.DROP_DB().then(() => {
      showNotification(`全删了！快跑！
Uncaught (in promise) Error: IndexedDB database has been deleted.
\tat indexedManager.js:46
\tat (anonymous)`, 'error');
      setTimeout(() => {
        location.href = '#';
        location.reload();
      }, 3000)
    }, e => {
      showNotification(e, 'error')
    });

  }
  render() {
    let {path, location} = this.props;
    return (
      <FullPageCard cardname="工具箱">
        <h3>开发期间，如果您发现样式大变或者操作有错误，建议点击以下按钮，清除部分数据。</h3>
        <dl>
          <dt>
            <a href="javascript:" onClick={() => this.clearLS()}>清除Localstorage缓存</a>
          </dt>
          <dd>将会清除 模式，来源，还有页面设置</dd>
        </dl>
        <dl>
          <dt>
            <a href="javascript:" onClick={() => this.clearIDB()}>删库跑路</a>
          </dt>
          <dd>将会删除本地的indexedDB数据库</dd>
        </dl>
      </FullPageCard>
    )
  }
}
export default withRouter(Tools)
// export default About