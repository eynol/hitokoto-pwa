import React from 'react';
import style from './Nav.css'

export default function Nav(props) {
  return (
    <div className={style.nav}>
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
  )
};