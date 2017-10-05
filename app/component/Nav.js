import React from 'react';
import PropTypes from 'prop-types';
import QueueAnim from 'rc-queue-anim';
import {withRouter, HashRouter as Router, Route, Link} from 'react-router-dom'

import hitokotoDriver from '../API/hitokotoDriver';

import {PANEL_OPEN} from '../actions'

import style from './Nav.css';
let {navWrapper, nav, navPhone, navPhoneDimmer, hamburger} = style;

let beforeLogin = (props) => (
  <ul>
    <li>
      <a href='javascript:' onClick={props.showLogin}>登录</a>
    </li>
    <li>
      <a href='javascript:' onClick={props.showRegist}>注册</a>
    </li>
    <li>
      <Link to='/explore'>探索</Link>
    </li>
    <li>
      <Link to='/nav-management'>管理</Link>
    </li>
    <li>
      <Link to='/about'>关于</Link>
    </li>
  </ul>
)

let online = (props) => (
  <ul>
    <li>
      <Link to='/home' title="前往个人中心">个人中心</Link>
    </li>
    <li>
      <Link to='/explore'>探索</Link>
    </li>
    <li>
      <Link to='/nav-management'>管理</Link>
    </li>
    <li>
      <Link to='/about'>关于</Link>
    </li>
    <li>
      <a href='javascript:' onClick={props.logout}>注销</a>
    </li>
  </ul>
)

function Nav(props) {
  let Child,
    PhoneChild = null,
    PhoneChildDimmer = null;
  if (props.user.nickname) {
    Child = online;
  } else {
    Child = beforeLogin;
  }
  let pathname = props.location.pathname;

  let panel = props.panel;
  if (panel === PANEL_OPEN + 'nav') {
    PhoneChildDimmer = (
      <div
        key="nav-dimmer"
        onClick={() => {
        hitokotoDriver.start();
        props.hideNav();
      }}
        className={navPhoneDimmer}>
        <i className="iconfont icon-close"></i>
      </div>
    );
    PhoneChild = (
      <div key="nav" className={navPhone}>
        {Child(props)}
      </div>
    )

  };

  if (/preview$/.test(pathname)) {
    return (
      <div className={navWrapper}>
        {/**
      * <a className={hamburger} onClick={props.showNav}>&#9776;</a>
      */}
        <a className={hamburger}>
          <span></span>
        </a>
      </div>
    )
  }
  return (
    <div className={navWrapper}>
      {/**
      * <a className={hamburger} onClick={props.showNav}>&#9776;</a>
      */}
      <a
        className={hamburger}
        onClick={() => {
        hitokotoDriver.stop();
        props.showNav();
      }}>
        <span></span>
      </a>

      <div className={nav}>
        {Child(props)}
      </div>
      <QueueAnim
        animConfig={[
        {
          opacity: [1, 0]
        }, {
          opacity: [1, 0]
        }
      ]}
        ease={['easeOutQuart', 'easeInOutQuart']}>
        {PhoneChildDimmer}
      </QueueAnim>
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

export default withRouter(Nav);