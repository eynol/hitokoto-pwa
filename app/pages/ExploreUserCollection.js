import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Link, withRouter, Route} from 'react-router-dom';
import QueueAnim from 'rc-queue-anim';

import httpManager from '../API/httpManager';
import hitokotoDriver from '../API/hitokotoDriver';
import indexedDBManager from '../API/IndexedDBManager';
import showNotification from '../API/showNotification';

import {CardContainer} from '../component/CollectionBox.css'
import PublicHitokoto from '../component/PublicHitokoto'
import CollectionBox from '../component/CollectionBox';
import FullPageCard from '../component/FullPageCard'
import Pagination from '../component/Pagination';
import Loading from '../component/Loading'

class ExploreUserCollection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hitokotos: [],
      favorites: [],
      inited: false,
      error: null,
      total: 1,
      current: 1
    }

    this.exploreUserCollection = this.exploreUserCollection.bind(this);

    this.addToFavorite = this.addToFavorite.bind(this);
    this.removeFromRavorite = this.removeFromRavorite.bind(this);
  }
  componentWillMount() {
    this.exploreUserCollection(1);
  }
  exploreUserCollection(page, perpage = 10) {
    let {uid, collectionName} = this.props;
    if (!uid) {
      return this.props.history.push('/');
    }
    let element = ReactDOM.findDOMNode(this);
    if (element) {
      if (element.scrollIntoView) {
        element.scrollIntoView({behavior: 'smooth', block: "start", inline: "nearest"});
      } else {
        element.scrollTop = 0;
      }
    }
    this.setState({inited: false})
    httpManager.API_getPublicUserHitokotos(uid, collectionName, page, perpage).then(result => {
      this.setState({
        inited: true,
        error: null,
        hitokotos: result.hitokotos,
        favorites: new Array(result.hitokotos.length).fill(null),
        current: result.currentPage,
        total: result.totalPage
      });

      //获取是否已加入收藏
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
      showNotification('获取句集内容失败！', 'error');
      this.setState({
        error: e.message || e || '获取句集内容失败！',
        inited: false
      });
    })
  }
  addToFavorite(evt) {
    let index = evt.target.getAttribute('data-index');

    indexedDBManager.addToFavorite(this.state.hitokotos[index]).then(result => {
      this.setState(state => {
        showNotification('加入收藏成功！', 'success')

        state.favorites[index] = true;
        return state;
      })
    })
  }
  removeFromRavorite(evt) {
    let index = evt.target.getAttribute('data-index');
    indexedDBManager.removeFromFavorite(this.state.hitokotos[index]).then(result => {
      this.setState(state => {
        showNotification('取消收藏成功！', 'info')
        state.favorites[index] = false;
        return state;
      })
    })
  }

  addToSource(colname, event) {
    hitokotoDriver.patterManager.newSourceWithUsernameAndCol(this.props.userName, colname);
    this.forceUpdate();
    event.stopPropagation();
  }
  render() {
    let {path, location, collectionName} = this.props;
    let hitokotos = this.state.hitokotos,
      ListToShow = null;
    if (this.state.inited) {
      if (hitokotos.length == 0) {
        ListToShow = (
          <div key='empty' className='align-center'>
            <h1>哦豁...</h1>
            <p>这里什么都没有</p>
          </div>
        )
      } else {

        ListToShow = hitokotos.map((hitokoto, index) => (
          <PublicHitokoto key={hitokoto._id} data={hitokoto} viewonly>
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
        ))
      }
    }

    return (
      <FullPageCard cardname={collectionName}>
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
              retry={() => {
              this.exploreUserCollection(this.state.current)
            }}
              key="loading"/>}
          <div className="view">{ListToShow}</div>
        </QueueAnim>
        <Pagination
          current={this.state.current || 1}
          total={this.state.total || 1}
          limit={10}
          func={this.exploreUserCollection}></Pagination>
      </FullPageCard>
    )
  }
}
export default withRouter(ExploreUserCollection)
