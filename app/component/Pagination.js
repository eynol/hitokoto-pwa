import React from 'react';
import style from './Logo.css'

import RequestFullscreen from '../API/RequestFullscreen'
export default function Logo(props) {
  return (
    <div
      className={style.logo}
      onClick={RequestFullscreen.toggleFullScreen.bind(RequestFullscreen)}>
      <h1 title="点击此处开启全屏或退出全屏">一言</h1>
    </div>
  )
}
