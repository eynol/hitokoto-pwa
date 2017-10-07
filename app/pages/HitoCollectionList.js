import React, {Component} from 'react'
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types'
import {matchPath} from 'react-router'
import {Link, withRouter} from 'react-router-dom'
import QueueAnim from 'rc-queue-anim';
import httpManager from '../API/httpManager';

import hitokotoDriver from '../API/hitokotoDriver'
import showNotification from '../API/showNotification';

import Pagination from '../component/Pagination';
import Loading from '../component/Loading'

import HitoView from '../component/HitoView'

class HitoCollectionList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inited: false,
      total: 1,
      current: 1,
      status: 'collections'
    };
    this.fetchHitokotos = this.fetchHitokotos.bind(this);
    this.newHitokoto = this.newHitokoto.bind(this);
    this.updateHitokoto = this.updateHitokoto.bind(this);
    this.isSourcesContians = this.isSourcesContians.bind(this);
  }

  componentDidMount() {
    this.fetchHitokotos();
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.needRefresh) {
      this.fetchHitokotos(this.state.current).then(() => {
        this.props.refreshCollectionHitokotoSuccess()
      })
    }
  }
  componentWillUnmount() {
    this.props.leaveCollection()
  }
  getURL() {
    let pathname = this.props.location.pathname;
    let match = matchPath(pathname, {path: '/home/:name'});
    if (match) {
      let collection = match.params.name;
      let username = this.props.user.nickname;
      let url = hitokotoDriver.patterManager.getCORSUrlOfUserCol(username, collection);
      return {username, url, collection}
    }
  }
  addToSources() {

    let url = this.getURL()
    if (url) {
      hitokotoDriver.patterManager.newSourceWithUsernameAndCol(url.username, url.collection);
      showNotification('将句集加入来源成功！');
      this.forceUpdate();
    }

  }

  isSourcesContians() {
    let url = this.getURL()
    if (!url) {
      return false;
    }
    return hitokotoDriver.patterManager.isSourceExsit(url.url);
  }
  fetchHitokotos(page, perpage) {
    let pathname = this.props.location.pathname;
    if (pathname == '/home/') {
      this.props.history.replace('/home');
      return;
    }
    let match = matchPath(pathname, {path: '/home/:name'})

    if (!match) {
      showNotification('当前路径错误');
      return;
    }

    let element = ReactDOM.findDOMNode(this);
    if (element) {
      if (element.scrollIntoView) {
        element.firstElementChild && element.firstElementChild.scrollIntoView({behavior: 'smooth', block: "start", inline: "nearest"});
      } else {
        element.scrollTop = 0;
      }
    }

    let {params: {
        name
      }} = match;
    if (name && name.length) {
      return httpManager.API_viewCollection(name, page, perpage).then(result => {
        if (result.err) {
          showNotification('获取用户句集列表失败！\n' + result.err, 'error');
          return Promise.reject(result.err);
        } else {
          this.props.fetchHitokotosSuccess(result.hitokotos);
          this.setState({inited: true, total: result.totalPage, current: result.currentPage})
        }
      })
    } else {

      this.props.history.push('/home');
    }

  }
  updateHitokoto(data) {
    this.props.updateHitokoto(data);
    this.props.history.push(this.props.location.pathname + '/update');
  }
  newHitokoto() {
    let pathname = this.props.location.pathname;
    if (!(/\/new$/.test(pathname))) {
      pathname += '/new';
    }
    this.props.history.push(pathname);
  }
  render() {
    let {status} = this.state;
    let {hitokotos, location: {
          pathname
        }} = this.props,
      ListToShow = [(
          <HitoView
            newone={true}
            update={this.updateHitokoto}
            newHitokoto={this.newHitokoto}
            key='newone'>
            {this.isSourcesContians()
              ? ''
              : <button onClick={() => {
                this.addToSources()
              }}>将此句集加入来源</button>}
            <button
              onClick={() => {
              showNotification('链接地址为：\n' + this.getURL().url, 'info', true)
            }}>API链接</button>
          </HitoView>
        )];

    if (hitokotos.length > 0) {
      ListToShow = ListToShow.concat(hitokotos.map((hitokoto) => (<HitoView
        key={hitokoto.id}
        preview={this.props.preview}
        update={this.updateHitokoto}
        remove={this.props.remove}
        data={hitokoto}/>)));;
    }

    return [(
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
          <div key="container" className='tryFlexContainer'>{ListToShow}</div>
          {this.state.inited
            ? null
            : <Loading key="loading-co"/>}
        </QueueAnim>
      ), (
        <Pagination
          current={this.state.current || 1}
          total={this.state.total || 1}
          limit={10}
          func={this.fetchHitokotos}></Pagination>
      )]
  }
}

HitoCollectionList.propTypes = {
  hitokotos: PropTypes.arrayOf(PropTypes.object).isRequired,
  leaveCollection: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  updateHitokoto: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
  preview: PropTypes.func.isRequired
}
export default withRouter(HitoCollectionList)