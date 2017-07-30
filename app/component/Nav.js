import React from 'react';
import style from './Nav.css';

let {'nav-state': navState, 'menu-open': menuOpen, navWrapper, nav, 'menu-dimmer': menuDimmer} = style;

export default function Nav(props) {
  return (
    <div className={navWrapper}>
      <input type="checkbox" id={navState} hidden/>
      <label id={menuOpen} htmlFor={navState}>&#9776;</label>
      <label htmlFor={navState} className={menuDimmer}></label>
      <div className={nav}>
        <ul>
          <li>
            <a href="javascript:">API</a>
          </li>
          <li>
            <a href="javascript:">登录</a>
          </li>
          <li>
            <a href="javascript:">注册</a>
          </li>
          <li>
            <a href="javascript:">关于Hitokoto</a>
          </li>
        </ul>
      </div>
    </div>
  )
};