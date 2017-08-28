import React from 'react';
import PropTypes from 'prop-types';
import style from './Nav.css';
import QueueAnim from 'rc-queue-anim';
import {HashRouter as Router, Route, Link} from 'react-router-dom'
import {PANEL_OPEN} from '../actions'
let {
  'nav-state': navState,
  'menu-open': menuOpen,
  navWrapper,
  nav,
  navPhone,
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
    <li>
      <Link to='/tools'>清除工具（用于测试）</Link>
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
  let Child,
    PhoneChild = null;
  if (props.user.nickname) {
    Child = online;
  } else {
    Child = beforeLogin;
  }
  let panel = props.panel;
  if (panel === PANEL_OPEN + 'nav') {

    PhoneChild = <div key="nav" className={navPhone}>
      {Child(props)}
      <button onClick={props.hideNav}>关闭</button>
    </div>
  };
  return (
    <div className={navWrapper}>
      <a className={hamburger} onClick={props.showNav}>&#9776;</a>
      <div className={menuDimmer}></div>
      <div className={nav}>
        {Child(props)}
      </div>
      <QueueAnim
        animConfig={[
        {
          translateX: [0, "-100"]
        }, {
          translateX: [0, "-100%"]
        }
      ]}
        ease={['easeOutQuart', 'easeInOutQuart']}>
        {PhoneChild}
      </QueueAnim>
    </div>
  )
};

Nav.propTypes = {
  user: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired,
  showLogin: PropTypes.func.isRequired,
  showRegist: PropTypes.func.isRequired,
  panel: PropTypes.string.isRequired,
  showNav: PropTypes.func.isRequired,
  hideNav: PropTypes.func.isRequired
}

export default Nav;