import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';

import FullPageCard from '../component/FullPageCard';
import idbm from '../API/IndexedDBManager';
class Tools extends Component {
  goBack() {
    this.props.history.go(-1);
  }
  clearLS() {
    window.localStorage.clear();
    location.href = '#';
    location.reload();
  }
  clearIDB() {
    idbm.DEBUG_CLEAR_ALL();
    location.href = '#';
    location.reload();
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
            <a href="javascript:" onClick={() => this.clearIDB()}>清除本地离线数据</a>
          </dt>
          <dd>将会已经缓存的所有数据</dd>
        </dl>
      </FullPageCard>
    )
  }
}
export default withRouter(Tools)
// export default About