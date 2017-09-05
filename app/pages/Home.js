import React, {Component} from 'react';
import {Link, Route, withRouter} from 'react-router-dom';
import QueueAnim from 'rc-queue-anim';
import PropTypes from 'prop-types'

import NewHitokoto from '../pages/NewHitokoto'
import hitokotoDriver from '../API/hitokotoDriver';
import HitoCollection from '../containers/HitoCollection';
import HitoList from '../containers/HitoList';
import HitokotoPreview from './HitokotoPreview';

let httpManager = hitokotoDriver.httpManager;

import {home, username, menu, left, right} from './Home.css';
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collections: [],
      horizon: true,
      currentCollectionName: '',
      hitokotos: [],
      previewHitokoto: ''
    }
    this.previewHitokoto = this.previewHitokoto.bind(this);
    this.pubulishHitokoto = this.pubulishHitokoto.bind(this);
    this.switchLayout = this.switchLayout.bind(this);
  }
  componentDidMount() {
    console.log('[home]CDM')
  }

  switchLayout() {
    this.setState(state => {
      state.horizon = !state.horizon;
      return state;
    })
  }

  previewHitokoto(hitokoto) {
    hitokoto.creator = this.props.user.nickname;
    let date = new Date();
    hitokoto.id = '' + date.getFullYear() + date.getMonth() + date.getDate()
    this.setState({previewHitokoto: hitokoto})
    this.props.history.replace(this.props.location.pathname.replace(/new$/im, 'preview'));
  }
  pubulishHitokoto(hitokoto) {

    let reg = /^\/home\/([^\/]*)\/(new|preview)$/im,
      matchs = reg.exec(this.props.location.pathname);
    let collectionName = matchs[1];
    let form = new FormData();

    form.append('hitokoto', hitokoto.hitokoto);
    form.append('from', hitokoto.from);
    form.append('creator', this.props.user.nickname);
    form.append('type', hitokoto.type);
    return httpManager.API_newHitokoto(collectionName, form).then(result => {
      console.log(result);
      if (result.err) {
        alert(result.err)
      } else {
        this.props.history.push('/home/' + collectionName);
        this.props.requestCollectionHitokotos(collectionName)
      }
      return result
    });
  }

  componentWillUpdate(e) {
    console.log('[home]CWU')
  }

  componentWillReceiveProps(props) {
    console.log('[home]CWRP')
  }

  componentDidUpdate(d) {
    console.log('[home]CDU', d)
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
      frameToShow = (<HitoCollection key='hitocollections'/>)
    } else if (/^\/home\/[^\/]*/gim.test(pathname)) {
      frameToShow = (<HitoList key='hitolist'/>)
    }

    return (
      <div key='home' className={home}>
        <div className={left}>
          <p className={username}>{nickname}</p>
          <ul className={menu}>
            <li>
              <Link to='/'>返回首页</Link>
            </li>
            <li>
              <Link to='/home'>所有句集</Link>
            </li>
            <li>资料设置</li>
            <li>修改密码</li>
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
          <NewHitokoto
            path='/home/hitokoto/new'
            publish={this.pubulishHitokoto}
            preview={this.previewHitokoto}/>
        </QueueAnim>
        <HitokotoPreview
          path="/home/hitokoto/preview"
          layout={this.props.layout}
          switchLayout={this.switchLayout}
          publish={this.pubulishHitokoto}
          hitokoto={this.state.previewHitokoto}
          layoutHorizon={this.state.horizon}/>
      </div>
    );
  }
}

Home.propTypes = {
  layout: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
}
export default withRouter(Home)