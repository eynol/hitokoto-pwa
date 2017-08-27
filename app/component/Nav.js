import React from 'react';
import PropTypes from 'prop-types';
import style from './Nav.css';
import QueueAnim from 'rc-queue-anim';
import {HashRouter as Router, Route, Link} from 'react-router-dom'

let {
  'nav-state': navState,
  'menu-open': menuOpen,
  navWrapper,
  nav,
  'menu-dimmer': menuDimmer,
  hamburger
} = style;

let beforeLogin = (props) => (
  <ul>
    <li>
      <a href='javascript:' onClick={props.showLogin}>登录</a>
    </li>
    <li>
      <a href='javascript:' onClick={props.showRegist}>注册</a>
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
      <Link to='/home' title="前往个人中心" replace>{props.user.nickname}</Link>
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
    <li>
      <a href='javascript:' onClick={props.logout}>注销</a>
    </li>
  </ul>
)

function Nav(props) {
  let Child = null;
  if (props.user.nickname) {
    Child = online;
  } else {
    Child = beforeLogin;
  }
  return (
    <div className={navWrapper}>
      <input type="checkbox" id={navState} hidden/>
      <label id={menuOpen} htmlFor={navState} className={hamburger}>&#9776;</label>
      <label htmlFor={navState} className={menuDimmer}></label>
      <div className={nav}>
        {Child(props)}
      </div>
    </div>
  )
};

Nav.propTypes = {
  user: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired,
  showLogin: PropTypes.func.isRequired,
  showRegist: PropTypes.func.isRequired
}

export default Nav;