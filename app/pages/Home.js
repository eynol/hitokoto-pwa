import React, {Component} from 'react';
import {Link, Route, withRouter} from 'react-router-dom';

import update from 'immutability-helper';
import QueueAnim from 'rc-queue-anim';
import PropTypes from 'prop-types'

import hitokotoDriver from '../API/hitokotoDriver';
import showNotification from '../API/showNotification';

import HitokotoPreview from '../containers/HitokotoPreview';
import HitoCollection from '../containers/HitoCollection';
import UserCollection from '../containers/HitoCollectionList';
import HitokotoEditor from '../containers/HitokotoEditor';

let httpManager = hitokotoDriver.httpManager;

import {
  home,
  username,
  menu,
  left,
  right,
  active
} from './Home.css';
class Home extends Component {
  constructor(props) {
    super(props);

  }

  render() {
    let {location: {
        pathname
      }, layout: {
        backgroundColor
      }, user: {
        nickname
      }} = this.props;
    let frameToShow = null;

    if (/^\/home$/gim.test(pathname)) {
      frameToShow = (<HitoCollection/>)
    } else if (/^\/home\/[^\/]*/gim.test(pathname)) {
      frameToShow = (<UserCollection/>)
    }

    return (
      <div key='home' className={home}>
        <div className={left}>
          <ul className={menu}>
            <li>
              <Link to='/'>首页</Link>
            </li>
            <li>
              <Link
                to='/home'
                className={(/^\/home$/gim.test(pathname))
                ? active
                : ''}>所有句集</Link>
            </li>
            <li>
              <Link to='/profile'>账户设置</Link>
            </li>
          </ul>
        </div>
        <QueueAnim
          className={right}
          animConfig={[
          {
            opacity: [
              1, 0
            ],
            translateY: [0, -50]
          }, {
            opacity: [
              1, 0
            ],
            position: 'absolute',
            translateY: [0, 50]
          }
        ]}>
          {frameToShow}
        </QueueAnim>
        <HitokotoEditor/>
        <HitokotoPreview/>
      </div>
    );
  }
}

Home.propTypes = {
  layout: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  refreshHitokotoList: PropTypes.func.isRequired
}
export default withRouter(Home)