import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import {Link, withRouter, Route, Switch} from 'react-router-dom';
import FullPageCard from '../component/FullPageCard'
import QueueAnim from 'rc-queue-anim';

import httpManager from '../API/httpManager';
import showNotification from '../API/showNotification';

import ExploreUser from './ExploreUser'
import ExploreUserCollection from './ExploreUserCollection'

import Pagination from '../component/Pagination';
import PublicHitokoto from '../component/PublicHitokoto';
import Loading from '../component/Loading';

import {ANIMATE_CONFIG_NEXT} from '../configs'

class NavManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inited: false,
      error: null,
      currentPage: 1,
      totalPages: 0,
      publicHitokotos: [],
      userProfile: {},
      isUnmouted: false
    }
    this.getAllPublicHitokotos = this.getAllPublicHitokotos.bind(this);
  }
  componentWillMount() {
    this.getAllPublicHitokotos();
  }
  componentWillUnmount() {
    this.setState({isUnmouted: true})
  }
  getAllPublicHitokotos(page = 1) {
    let element = ReactDOM.findDOMNode(this);
    if (element) {
      if (element.scrollIntoView) {
        element.firstElementChild.scrollIntoView({behavior: 'smooth', block: "start", inline: "nearest"});
      } else {
        element.scrollTop = 0;
      }
    }
    this.setState({inited: false})
    httpManager.API_getAllPublicHitokotos(page, 10).then(result => {
      this.setState({inited: true, error: null, totalPages: result.total, currentPage: result.current, publicHitokotos: result.hitokotos})
    }).catch(e => {
      this.setState({
        error: e.message || e || '获取失败',
        inited: false
      });
      showNotification('获取所有公开数据失败', 'error');
    })
  }
  uidByName(name) {
    let uid,
      list = this.state.publicHitokotos;
    for (var i = 0; i < list.length; i++) {
      if (list[i].creator === name) {
        uid = list[i].creator_id;
        break;
      }
    };
    return uid;
  }
  render() {
    let {path, location} = this.props;
    return (
      <FullPageCard cardname="探索">
        <Switch>
          <Route
            exact
            path="/explore"
            render={() => {
            return (
              <div className='hitokoto-list'>
                <QueueAnim
                  ease='easeOutQuart'
                  animConfig={[
                  {
                    opacity: [1, 0]
                  }, {
                    left: '0',
                    right: '0',
                    position: 'absolute',
                    opacity: [1, 0]
                  }
                ]}>
                  {this.state.inited
                    ? null
                    : <Loading
                      error={this.state.error}
                      retry={() => this.getAllPublicHitokotos(this.state.currentPage)}
                      key="loading"/>}
                  <div className="view">{this.state.publicHitokotos.map(hito => (
                      <PublicHitokoto data={hito}>
                        <a href="javascript:">
                          <i className="iconfont icon-like"></i>
                        </a>
                        <a href="javascript:">
                          <i className="iconfont icon-favor"></i>
                        </a>
                      </PublicHitokoto>
                    ))}</div>
                </QueueAnim>
                <Pagination
                  current={this.state.currentPage || 1}
                  total={this.state.totalPages || 1}
                  limit={10}
                  func={this.getAllPublicHitokotos}></Pagination>
              </div>
            )
          }}/>
          <Route
            exact
            path="/explore/:user"
            render={({
            match: {
              params: {
                user
              }
            }
          }) => {
            return (<ExploreUser userName={user} uid={this.uidByName(user)}/>)
          }}/>
          <Route
            exact
            path="/explore/:user/:collection"
            render={({
            match: {
              params: {
                user,
                collection
              }
            }
          }) => {
            return (<ExploreUserCollection collectionName={collection} uid={this.uidByName(user)}/>)
          }}/>
        </Switch>
      </FullPageCard>
    )
  }
}
export default withRouter(NavManagement)
// export default About