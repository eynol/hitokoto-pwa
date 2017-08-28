import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';

import FullPageCard from '../component/FullPageCard'
import style from './UI.css';
import style2 from './About.css';

let {
  manageBox,
  clearfix,
  'close-button': closeButton,
  icon,
  close,
  sourcesList,
  back,
  backButton,
  ellipsis,
  article
} = style;

let {thanksList} = style2;
class Tools extends Component {
  goBack() {
    this.props.history.go(-1);
  }
  clearLS() {
    window.localStorage.clear();
    alert('已清除！');
    location.href = '/';
  }
  render() {
    let {path, location} = this.props;
    return (
      <FullPageCard key={path}>
        <div className={manageBox}>
          <h1 className={clearfix}>工具箱
            <a href="javascript:" onClick={() => this.goBack()} className={closeButton}>
              <i className={icon + ' ' + close}></i>
            </a>
            <a href="javascript:" onClick={() => this.goBack()} className={backButton}>
              <i className={icon + ' ' + back}></i>
            </a>
          </h1>
          <br/>
          <h3>开发期间，如果您发现样式大便或者操作有错误，建议点击以下按钮，清除部分数据。</h3>
          <dl>
            <dt>
              <a href="javascript:" onClick={() => this.clearLS()}>清除Localstorage缓存</a>
            </dt>
            <dd>将会清除 模式，来源，还有页面设置</dd>
          </dl>

        </div>
      </FullPageCard>
    )
  }
}
export default withRouter(Tools)
// export default About