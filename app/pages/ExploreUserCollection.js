import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Link, withRouter, Route} from 'react-router-dom';
import FullPageCard from '../component/FullPageCard'

import httpManager from '../API/httpManager';
import QueueAnim from 'rc-queue-anim';
import CollectionBox from '../component/CollectionBox';

import hitokotoDriver from '../API/hitokotoDriver';
import showNotification from '../API/showNotification';

import PublicHitokoto from '../component/PublicHitokoto'
import Pagination from '../component/Pagination';
import Loading from '../component/Loading'

import {CardContainer} from '../component/CollectionBox.css'

class ExploreUserCollection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hitokotos: [],
      inited: false,
      error: null,
      total: 1,
      current: 1
    }
    this.handleView = this.handleView.bind(this);
    this.exploreUserCollection = this.exploreUserCollection.bind(this);

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
      this.setState({inited: true, error: null, hitokotos: result.hitokotos, current: result.currentPage, total: result.totalPage})
    }).catch(e => {
      showNotification('获取句集内容失败！', 'error');
      this.setState({
        error: e.message || e || '获取句集内容失败！',
        inited: false
      });
    })
  }
  handleView(colname) {
    this.props.history.push(this.props.location.pathname + '/' + colname);
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
          <PublicHitokoto key={hitokoto._id} data={hitokoto}>
            <a href="javascript:">
              <i className="iconfont icon-like"></i>
            </a>
            <a href="javascript:">
              <i className="iconfont icon-favor"></i>
            </a>
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
