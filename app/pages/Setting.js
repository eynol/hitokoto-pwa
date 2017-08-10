import React, { Component } from 'react';
import {Link} from 'react-router-dom';

import FullPage from '../component/FullPage';

import {settingWrapper,left,right} from './Setting.css'

export default class Setting extends Component {
  
  render() {
    return (  
      <FullPage>
        <div className={settingWrapper}>
          <ul>
            <li>
              <div>
                <div className={left}>
                  <h1>使用宋体</h1>
                </div>
                <div className={right}>
                  <input type='checkbox' id="html-useFontSong"/>
                  <label htmlFor="html-useFontSong"></label>
                </div>
              </div>
            </li>
          </ul>
          <Link to="/" replace/>
        </div>
      </FullPage>
    );
  }
}