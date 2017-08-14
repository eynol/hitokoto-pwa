import React, {Component} from 'react';
import FullPage from '../component/FullPage'

import hitokotoDriver from '../API/hitokotoDriver'

import style from './UI.css';
import {Link} from 'react-router-dom';

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
class Patterns extends Component {
  constructor(props) {
    super(props);
    this.state = {
      patterns: hitokotoDriver.patterManager.patterns
    }
  }

  render() {

    let lists = this
      .state
      .patterns
      .map((pattern) => {
        return (
          <li key={pattern.id}>
            <p className={ellipsis}>
              <button >修改</button>
              {pattern.name}
              - {pattern.url}</p>
          </li>
        )
      })

    return (
      <FullPage style={{
        padding: '50px 30px'
      }}>
        <div className={manageBox}>
          <input type="radio" name="pattern-tab" value="pattern" hidden/>
          <input type="radio" name="pattern-tab" value="api" hidden/>
          <h1>模式管理
            <Link to='/' className={closeButton}>
              <i className={icon + ' ' + close}></i>
            </Link>
            <Link to='/' className={backButton}>
              <i className={icon + ' ' + back}></i>
            </Link>
          </h1>
          <hr/>
          <div>
            <ul className={sourcesList}>
              {lists}
              <li>
                <button >添加</button>
              </li>
            </ul>
          </div>
        </div>
      </FullPage>
    );
  }
}

export default Patterns;