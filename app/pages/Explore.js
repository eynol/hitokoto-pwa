import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import {Link, withRouter, Route, Switch} from 'react-router-dom';
import FullPageCard from '../component/FullPageCard'
import QueueAnim from 'rc-queue-anim';

import httpManager from '../API/httpManager';
import showNotification from '../API/showNotification';
import indexedDBManager from '../API/IndexedDBManager';

import ExploreUser from './ExploreUser'
import ExploreUserCollection from './ExploreUserCollection'

import Pagination from '../component/Pagination';
import PublicHitokoto from '../component/PublicHitokoto';
import Loading from '../component/Loading';

import {ANIMATE_CONFIG_NEXT} from '../configs'

class Explore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inited: false,
      error: null,
      currentPage: 1,
      totalPages: 0,
      publicHitokotos: [],
      favorites: [],
      userProfile: {},
      isUnmouted: false
    }
    this.getAllPublicHitokotos = this.getAllPublicHitokotos.bind(this);

    this.addToFavorite = this.addToFavorite.bind(this);
    this.removeFromRavorite = this.removeFromRavorite.bind(this);
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
      this.setState({
        inited: true,
        error: null,
        totalPages: result.total,
        currentPage: result.current,
        publicHitokotos: result.hitokotos,
        favorites: new Array(result.hitokotos)
      });

      //检测是否收藏 获取是否已加入收藏
      result.hitokotos.map((h, i) => {
        indexedDBManager.isInFavorite(h).then(yes => {
          if (yes) {
            this.setState(state => {
              state.favorites[i] = true;
              return state;
            })
          } else {
            this.setState(state => {
              state.favorites[i] = false;
              return state;
            })
          }
        })
      })
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
  addToFavorite(evt) {
    let index = evt.target.getAttribute('data-index');

    indexedDBManager.addToFavorite(this.state.publicHitokotos[index]).then(result => {
      this.setState(state => {
        showNotification('加入收藏成功！', 'success')

        state.favorites[index] = true;
        return state;
      })
    })
  }
  removeFromRavorite(evt) {
    let index = evt.target.getAttribute('data-index');
    indexedDBManager.removeFromFavorite(this.state.publicHitokotos[index]).then(result => {
      this.setState(state => {
        showNotification('取消收藏成功！', 'info')
        state.favorites[index] = false;
        return state;
      })
    })
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
                  <div className="view">{this.state.publicHitokotos.map((hito, index) => (
                      <PublicHitokoto data={hito} key={hito.id}>
                        {this.state.favorites[index]
                          ? (
                            <a href="javascript:">
                              <i
                                className="iconfont icon-favorfill"
                                title="已收藏"
                                data-index={index}
                                onClick={this.removeFromRavorite}></i>
                            </a>
                          )
                          : (
                            <a href="javascript:">
                              <i
                                className="iconfont icon-favor"
                                title="点击加入收藏"
                                data-index={index}
                                onClick={this.addToFavorite}></i>
                            </a>
                          )}
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
            return (<ExploreUser userName={user} uid={this.uidByName(user) || window.trickyUid}/>)
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
            return (<ExploreUserCollection
              collectionName={collection}
              uid={this.uidByName(user) || window.trickyUid}/>)
          }}/>
        </Switch>
      </FullPageCard>
    )
  }
}
export default withRouter(Explore)
// export default About