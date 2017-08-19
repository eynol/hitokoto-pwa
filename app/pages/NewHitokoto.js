import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import QueueAnim from 'rc-queue-anim';
import FullPageCard from '../component/FullPageCard'
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
      <FullPageCard>
        <header className={manageBox}>
          <h1 className={clearfix}>关于hitokoto
            <Link to='/' className={closeButton}>
              <i className={icon + ' ' + close}></i>
            </Link>
            <Link to='/' className={backButton}>
              <i className={icon + ' ' + back}></i>
            </Link>
          </h1>
          <br/>
          <div>
            <header>请输入来源</header>
            <input type="text"/>
            <div>
              <textarea name="" id="" cols="30" rows="10" placeholder="请在此输入hitokoto"></textarea>
            </div>
          </div>
        </header>
      </FullPageCard>
    )
  }
}