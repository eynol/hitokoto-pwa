import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Link} from 'react-router-dom';

import indexedDBManager from '../API/IndexedDBManager'
import offlineWatcher from '../API/Offline'
import hitokotoDriver from '../API/hitokotoDriver'
const patterManager = hitokotoDriver.patterManager;

import FullPageCard from '../component/FullPageCard'

class Sync extends Component {
  constructor(props) {
    super(props);
    this.state = {
      swSupported: null,
      count: null
    }
  }
  componentWillMount() {
    this.setState(state => {
      if ('serviceWorker' in navigator) {
        state.swSupported = true;
      };
      if (offlineWatcher.online) {
        //在线，去请求每一个来源，获得总数

      } else {
        //离线
      }
      return state;
    });
    Promise.all(patterManager.sources.map(source => {
      return indexedDBManager.getHitokotoCount(source.url)
    })).then(result => {
      if (ReactDOM.findDOMNode(this)) {
        this.setState({count: result})
      }
    })
  }
  render() {
    let list;
    if (this.state.count === null) {
      list = patterManager.sources.map(src => (
        <li key={src.id}>
          <div>
            <h3>{src.name}</h3>
            <i className="iconfont icon-loading-anim"></i>
          </div>
        </li>
      ))
    } else {
      list = patterManager.sources.map((src, index) => (
        <li key={src.id}>
          <div>
            <h4>{src.name}</h4>
            <p>已缓存{this.state.count[index]}条</p>
            <p>
              <a href="javascript:">立即更新</a>
            </p>
          </div>
        </li>
      ))
    }
    return (
      <FullPageCard cardname="离线同步">
        <div className="lum-list tryFlexContainer">
          <ul>
            {list}
          </ul>
        </div>
      </FullPageCard>
    )
  }
}
export default Sync
