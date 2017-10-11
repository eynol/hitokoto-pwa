import React, {Component} from 'react';
import QueueAnim from 'rc-queue-anim';
import style from '../component/HitokotoLayout.css';
import {HashRouter as Router, withRouter, Route, Redirect} from 'react-router-dom';

import Patterns from '../pages/Patterns'
import PatternEditor from '../pages/PatternEditor'
import Sources from '../pages/Sources'
import SourceEditor from '../pages/SourceEditor'
import About from '../pages/About'
import Tools from '../pages/Tools'
import Managements from '../pages/Managements'
import Explore from '../pages/Explore'

import Login from '../containers/Login'
import Regist from '../containers/Regist'
import Index from '../containers/Index'
import Profile from '../containers/Profile'
import UserSpace from '../pages/UserSpace'

import UserCollections from '../containers/UserCollections'
import UserCollection from '../containers/UserCollection'
import HitokotoPreview from '../containers/HitokotoPreview'
import HitokotoEditor from '../containers/HitokotoEditor'

import NotificationContainer from '../containers/Notification.Container'

import {ANIMATE_CONFIG_NEXT, GLOBAL_ANIMATE_TYPE} from '../configs'
const ROUTES = [
  {
    to: /^(\/|\/login)$/,
    component: Index,
    name: '首页'
  }, {
    to: /^\/managements\/?$/,
    component: Managements,
    name: '管理导航页面'
  }, {
    to: /^\/managements\/sources$/,
    component: Sources,
    name: '来源管理'
  }, {
    to: /^\/managements\/sources\/(new|\d+)(\/update)?$/,
    component: SourceEditor,
    name: '来源编辑页面'
  }, {
    to: /^\/managements\/patterns$/,
    component: Patterns,
    name: '模式管理'
  }, {
    to: /^\/managements\/patterns\/(new|\d+)(\/update)?$/,
    component: PatternEditor,
    name: '模式编辑页面'
  }, {
    to: /^\/explore\/?/,
    component: Explore,
    name: '广场页面'
  }, {
    to: /^\/about\/?$/,
    component: About,
    name: '关于页面'
  }, {
    to: /^\/myspace\/?$/,
    component: UserSpace,
    name: '个人中心页面'
  }, {
    to: /^\/myspace\/collections\/?$/,
    component: UserCollections,
    name: '我的全部句集页面'
  }, {
    to: /^\/myspace\/collections\/([^\/]+)\/?$/,
    component: UserCollection,
    name: '句集详情页面'
  }, {
    to: /^\/myspace\/collections\/([^\/]+)(\/update|\/new)?\/preview$/,
    component: HitokotoPreview,
    name: '句子预览页面'
  }, {
    to: /^\/myspace\/collections\/([^\/]+)\/(new|update)$/,
    component: HitokotoEditor,
    name: '句子编辑页面'
  }, {
    to: /^\/myspace\/profiles$/,
    component: Profile,
    name: '账号设置'
  }, {
    to: /^\/tools/,
    component: Tools,
    name: '工具页面'
  }
];

class AppContainer extends Component {
  constructor(props) {
    super(props)
  }
  getChildren(props) {
    const {location} = props;
    const matched = ROUTES.map(item => {
      if (item.to.test(location.pathname)) {
        return item;
      }
    }).filter(item => item)[0];
    const routeInfo = matched.to.exec(location.pathname);
    const Child = matched.component;
    return (
      <div
        style={{
        width: '100%',
        position: 'relative',
        height: '100%',
        backgroundColor: 'white'
      }}>
        <QueueAnim
          style={{
          width: '100%',
          position: 'relative',
          height: '100%',
          backgroundColor: 'white',
          overflow: 'hidden',
          'willChange': 'contents'
        }}
          key="frameChange"
          duration="900"
          animConfig={ANIMATE_CONFIG_NEXT}>
          {/**这里动画组件设置的计时器会因为没有触发而导致动画倒放，
          必须要等到动画结束后等待一段时间，之前的组件才会消失。
          如果在动画结束后，马上路由返回，先前的组件就会反向出现。
         只好每次都重新渲染*/}
          <Child key={matched.name} rinfo={routeInfo}/>
        </QueueAnim>
        <Regist/>
        <Login/>
        <NotificationContainer/>
      </div>
    );
  }
  render() {
    return (<Route render={this.getChildren}/>);
  }
}

export default AppContainer;
