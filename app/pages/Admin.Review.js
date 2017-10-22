import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import QueueAnim from 'rc-queue-anim';

import httpManager from '../API/httpManager';
import hitokotoDriver from '../API/hitokotoDriver';
import indexedDBManager from '../API/IndexedDBManager';
import showNotification from '../API/showNotification';

import PublicHitokoto from '../component/PublicHitokoto'
import FullPageCard from '../component/FullPageCard'
import Pagination from '../component/Pagination';
import Loading from '../component/Loading'

class Review extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hitokotos: [],
      passed: [],
      inited: false,
      error: null,
      total: 1,
      current: 1
    }

    this.getNeedReviewHitokotos = this.getNeedReviewHitokotos.bind(this);

    this.allow = this.allow.bind(this);
    this.regret = this.regret.bind(this);
    this.reject = this.reject.bind(this);
    this.detail = this.detail.bind(this);
    this.refresh = this.refresh.bind(this);
  }
  componentWillMount() {
    this.getNeedReviewHitokotos(1);
  }
  refresh() {
    this.getNeedReviewHitokotos(this.state.current, this.state.total);
  }
  getNeedReviewHitokotos(page, perpage = 10) {

    let element = ReactDOM.findDOMNode(this);
    if (element) {
      if (element.scrollIntoView) {
        element.scrollIntoView({behavior: 'smooth', block: "start", inline: "nearest"});
      } else {
        element.scrollTop = 0;
      }
    }

    this.setState({inited: false})
    httpManager.API_Admin_getNeedReviewHitokotos(page, perpage).then(result => {
      this.setState({
        inited: true,
        error: null,
        hitokotos: result.hitokotos,
        passed: new Array(result.hitokotos.length).fill(null),
        current: result.currentPage,
        total: result.totalPage
      });
    }).catch(e => {
      showNotification('获取失败！' + e.message || e, 'error');
      this.setState({
        error: e.message || e || '获取句集内容失败！',
        inited: false
      });
    })
  }
  allow(evt) {
    let index = evt.target.getAttribute('data-index');
    let hitokoto = this.state.hitokotos[index];
    httpManager.API_Admin_changeHitokotoState(hitokoto._id, 'public').then(res => {
      //
      this.setState(state => {
        state.passed[index] = true;
        return state;
      });
    })
  }
  regret(evt) {
    let index = evt.target.getAttribute('data-index');
    let hitokoto = this.state.hitokotos[index];
    httpManager.API_Admin_changeHitokotoState(hitokoto._id, 'reviewing').then(res => {
      //

      this.setState(state => {
        state.passed[index] = null;
        return state;
      });
    })
  }
  reject(evt) {
    let index = evt.target.getAttribute('data-index');
    let hitokoto = this.state.hitokotos[index];
    httpManager.API_Admin_changeHitokotoState(hitokoto._id, 'rejected').then(res => {
      //

      this.setState(state => {
        state.passed[index] = false;
        return state;
      });
    })
  }
  detail(evt) {
    let index = evt.target.getAttribute('data-index');
    let hitokoto = this.state.hitokotos[index];
    showNotification(JSON.stringify(hitokoto, null, 2), 'info', true);
  }

  userNameClickProxy(index) {
    let target = this.state.hitokotos[index];
    if (target.creator_id && target.creator) {
      window.trickyUid = target.creator_id;
      this.props.history.push('/explore/' + target.creator);
    } else {
      showNotification('无法跳转到用户详情，可能句子不是本网站的。');
    }
  }
  collectionClickProxy(index) {
    let target = this.state.hitokotos[index];
    if (target.creator_id && target.creator && target.collection) {
      window.trickyUid = target.creator_id;
      this.props.history.push('/explore/' + target.creator + '/' + target.collection);
    } else {
      showNotification('无法跳转到句集详情，可能句子不是本网站的。');
    }
  }
  render() {

    let hitokotos = this.state.hitokotos,
      ListToShow = null;
    if (this.state.inited) {
      if (hitokotos.length == 0) {
        ListToShow = (
          <div key='empty' className='align-center'>
            <h1 className="color-red">没有待审核的句子！</h1>
            <p>这里什么都没有</p>
          </div>
        )
      } else {
        let passed = this.state.passed;
        ListToShow = hitokotos.map((hitokoto, index) => (
          <PublicHitokoto
            key={hitokoto._id}
            data={hitokoto}
            usernameProxy={() => this.userNameClickProxy(index)}
            collectionProxy={() => this.collectionClickProxy(index)}>
            <button data-index={index} onClick={this.detail}>详细信息</button>
            {passed[index] === null
              ? [(
                  <button key={index + 'pass'} data-index={index} onClick={this.allow}>通过</button>
                ), (
                  <button
                    key={index + 'block'}
                    data-index={index}
                    className="color-red"
                    onClick={this.reject}>驳回</button>
                )]
              : (
                <button data-index={index} onClick={this.regret}>需要再考虑一次</button>
              )}
          </PublicHitokoto>
        ))
      }
    }

    return (
      <FullPageCard cardname="审核">
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
              this.getNeedReviewHitokotos(this.state.current)
            }}
              key="loading"/>}
          <div className="view">{ListToShow}</div>
        </QueueAnim>

        <div className="align-center">
          <button onClick={this.refresh}>刷新本页</button>
        </div>

        <Pagination
          current={this.state.current || 1}
          total={this.state.total || 1}
          limit={10}
          func={this.getNeedReviewHitokotos}></Pagination>
      </FullPageCard>
    )
  }
}
export default Review
