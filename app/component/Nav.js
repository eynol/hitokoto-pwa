import React from 'react';
import style from './Nav.css';

import {HashRouter as Router, Route, Link} from 'react-router-dom'

let {'nav-state': navState, 'menu-open': menuOpen, navWrapper, nav, 'menu-dimmer': menuDimmer} = style;

let beforeLogin = (props) => (
  <ul>
    {/**
     * <li>
      <Link to='/api'>API</Link>
    </li>
     */}
    <li>
      <Link to='/login'>登录</Link>
    </li>
    <li>
      <Link to='/regist'>注册</Link>
    </li>
    <li>
    <Link to='/sources'>来源管理</Link>
  </li>
    <li>
      <Link to='/patterns'>模式管理</Link>
    </li>
    <li>
      <Link to='/about'>关于Hitokoto</Link>
    </li>
  </ul>
)

let online = (props) => (
  <ul>
    <li>
      <Link to='/dashboard' title="前往个人中心">{props.user.username}</Link>
    </li>
    <li>
      <Link to='/new'>新增</Link>
    </li>
    <li>
      <Link to='/exit' onClick={props.navCallbacks.exit}>退出</Link>
    </li>
    <li><hr/></li>
    <li>
    <Link to='/sources'>来源管理</Link>
    </li>
    <li>
      <Link to='/patterns'>模式管理</Link>
    </li>
    <li>
      <Link to='/about'>关于Hitokoto</Link>
    </li>
  </ul>
)

export default function Nav(props) {
  let Child = null;
  if (props.user) {
    Child = online;
  } else {
    Child = beforeLogin;
  }
  return (
    <div className={navWrapper}>
      <input type="checkbox" id={navState} hidden/>
      <label id={menuOpen} htmlFor={navState}>&#9776;</label>
      <label htmlFor={navState} className={menuDimmer}></label>
      <div className={nav}>
        {Child(props)}
      </div>
    </div>
  )
};