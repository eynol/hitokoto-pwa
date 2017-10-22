import React, {Component} from 'react';

import * as OfflinePluginRuntime from 'offline-plugin/runtime';

import showNotification from '../API/showNotification'
import idbm from '../API/IndexedDBManager';

import FullPageCard from '../component/FullPageCard';

class Tools extends Component {
  goBack() {
    this.props.history.go(-1);
  }
  clearLS() {
    if (!confirm('你确定？')) {
      return;
    }
    window.localStorage.clear();
    showNotification('localstorage已清空,将在3秒后回到首页', 'success');
    setTimeout(() => {
      location.href = '/';

    }, 3000)
  }
  clearIDB() {
    if (!confirm('你确定？')) {
      return;
    }
    idbm.DROP_DB().then(() => {
      showNotification(`全删了！快跑！
Uncaught (in promise) Error: IndexedDB database has been deleted.
\tat indexedManager.js:46
\tat (anonymous)`, 'error');
      setTimeout(() => {
        location.href = '/';

      }, 3000)
    }, e => {
      showNotification(e, 'error')
    });

  }
  render() {
    let {path, location} = this.props;
    return (
      <FullPageCard cardname="工具箱">

        <div className="lum-list ">
          <h1 className="color-red">下列的按钮很危险！如果你不知道自己在做什么，请返回。</h1>

          <ul>
            <li>
              <a href="javascript:" onClick={() => this.clearLS()}>
                <h4>清除Localstorage缓存</h4>
                <p>将会清除 模式，来源，页面设置，用户登录信息。</p>
              </a>
            </li>
            <li>
              <a href="javascript:" onClick={() => this.clearIDB()}>
                <h4>删库跑路</h4>
                <p>将会删除本地的indexedDB数据库，包括缓存的hitokto，思源宋体字体文件、我的收藏。</p>
              </a>
            </li>
          </ul>
        </div>
      </FullPageCard>
    )
  }
}
export default Tools
