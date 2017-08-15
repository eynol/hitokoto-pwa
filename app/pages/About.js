import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import FullPage from '../component/FullPage'
import style from './UI.css';

let {
  manageBox,
  clearfix,
  'close-button': closeButton,
  icon,
  close,
  sourcesList,
  back,
  backButton,
  ellipsis
} = style;

export default class About extends Component {
  render() {
    return (
      <FullPage style={{
        padding: '30px'
      }}>
        <header className={manageBox}>
          <h1 className={clearfix}>关于hitokoto
            <Link to='/' className={closeButton}>
              <i className={icon + ' ' + close}></i>
            </Link>
            <Link to='/' className={backButton}>
              <i className={icon + ' ' + back}></i>
            </Link>
          </h1>
          <hr/>
          <div>
            <blockquote>
              <p>
                简单来说，一言（ヒトコト）指的是就是一句话，可以是动漫中的台词，可以是小说中的语句，也可以是网络上的各种小段子。<br/>或是感动，或是开心，又或是单纯的回忆，来到这里，留下你所喜欢的那一句句话，与大家分享，这就是一言存在的目的。<br/>*:本段文本源自<a href="http://hitokoto.us" target="_blank">hitokoto.us.</a>
              </p>
            </blockquote>
          </div>
        </header>
      </FullPage>
    )
  }
}