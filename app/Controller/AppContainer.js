import React, {Component} from 'react';
import QueueAnim from 'rc-queue-anim';
import style from '../component/HitokotoLayout.css';
import {HashRouter as Router, withRouter, Route, Redirect} from 'react-router-dom';

import Patterns from '../pages/Patterns'
import Sources from '../pages/Sources'
import About from '../pages/About'
import Tools from '../pages/Tools'
import NavManagement from '../pages/NavManagement'
import Explore from '../pages/Explore'

import Login from '../containers/Login'
import Regist from '../containers/Regist'
import Home from '../containers/Home'
import Index from '../containers/Index'
import Profile from '../containers/Profile'

import NotificationContainer from '../containers/Notification.Container'

import {ANIMATE_CONFIG_NEXT, GLOBAL_ANIMATE_TYPE} from '../configs'
const ROUTES = [
  {
    to: /^(\/|\/login)$/,
    component: Index,
    name: '首页'
  }, {
    to: /^\/nav-management$/,
    component: NavManagement,
    name: '管理导航页面'
  }, {
    to: /^\/sources/,
    component: Sources,
    name: '来源管理'
  }, {
    to: /^\/patterns/,
    component: Patterns,
    name: '模式管理'
  }, {
    to: /^\/home\/?/,
    component: Home,
    name: '个人中心页面'
  }, {
    to: /^\/profile$/,
    component: Profile,
    name: '账户设置'
  }, {
    to: /^\/explore/,
    component: Explore,
    name: '广场页面'
  }, {
    to: /^\/about/,
    component: About,
    name: '关于页面'
  }, {
    to: /^\/tools/,
    component: Tools,
    name: '工具页面'
  }
];

const USER_NICKNAME = 'hitoUserNickname';
class AppContainer extends Component {
  constructor(props) {
    super(props)
  }
  getChildren(props) {
    const {location} = props;
    const mathPath = ROUTES.map(item => {
      if (item.to.test(location.pathname)) {
        return item;
      }
    }).filter(item => item)[0];
    const Child = mathPath.component;
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
          <Child key={mathPath.name}/>
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
