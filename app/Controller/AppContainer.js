import React, {Component} from 'react';
import QueueAnim from 'rc-queue-anim';
import style from '../component/HitokotoLayout.css';
import {withRouter, Route, Redirect} from 'react-router-dom';

import Task from '../API/Task';
import showNotification from '../API/showNotification';
import offlineWatcher from '../API/Offline';
import Patterns from '../pages/Patterns'
import PatternEditor from '../pages/PatternEditor'
import Sources from '../pages/Sources'
import SourceEditor from '../pages/SourceEditor'
import About from '../pages/About'
import Doc from '../pages/Doc'
import Tools from '../pages/Tools'
import Managements from '../pages/Managements'
import Explore from '../pages/Explore'
import Admin from '../pages/Admin'
import Review from '../pages/Admin.Review'
import Broadcast from '../pages/Admin.Broadcast'
import License from '../pages/License'

import Login from '../containers/Login'
import Regist from '../containers/Regist'
import Index from '../containers/Index'
import Profile from '../containers/Profile'
import UserSpace from '../pages/UserSpace'
import NotFound from '../pages/NotFound'
import Sync from '../pages/Managements.Sync';
import Cleaner from '../pages/Managements.Cleaner';
import GonaReload from '../pages/GonaReload';
import Favorites from '../pages/Managements.Favorites';
import Backup from '../pages/Managements.Backup';

import UserCollections from '../containers/UserCollections'
import UserCollection from '../containers/UserCollection'
import HitokotoPreview from '../containers/HitokotoPreview'
import HitokotoEditor from '../containers/HitokotoEditor'

import sourceHanFont from '../plugins/SourceHan.font';

import NotificationContainer from '../containers/Notification.Container'
import PatternHelperModal from '../containers/PatternHelperModal'

import {ANIMATE_CONFIG_NEXT, GLOBAL_ANIMATE_TYPE} from '../configs'
const ROUTES = [
  {
    to: /^(\/|\/login)$/,
    component: Index,
    name: '首页',
    reload: true
  }, {
    to: /^\/managements\/?$/,
    component: Managements,
    name: '管理导航页面',
    reload: true
  }, {
    to: /^\/admin\/?$/,
    component: Admin,
    name: '后台管理页面',
    reload: true
  }, {
    to: /^\/admin\/review\/?$/,
    component: Review,
    name: '审核句子页面',
    reload: true
  }, {
    to: /^\/admin\/broadcast\/?$/,
    component: Broadcast,
    name: '广播页面',
    reload: true
  }, {
    to: /^\/managements\/sources$/,
    component: Sources,
    name: '来源管理',
    reload: true
  }, {
    to: /^\/managements\/sources\/(new|\d+)(\/update)?$/,
    component: SourceEditor,
    name: '来源编辑页面'
  }, {
    to: /^\/managements\/patterns$/,
    component: Patterns,
    name: '模式管理',
    reload: true
  }, {
    to: /^\/managements\/patterns\/(new|\d+)(\/update)?$/,
    component: PatternEditor,
    name: '模式编辑页面'
  }, {
    to: /^\/managements\/sync$/,
    component: Sync,
    name: '离线缓存页面',
    reload: true
  }, {
    to: /^\/managements\/cleaner$/,
    component: Cleaner,
    name: '缓存清理页面',
    reload: true
  }, {
    to: /^\/managements\/favorites$/,
    component: Favorites,
    name: '我的收藏页面',
    reload: true
  }, {
    to: /^\/managements\/backup$/,
    component: Backup,
    name: '备份还原页面',
    reload: true
  }, {
    to: /^\/explore\/?/,
    component: Explore,
    name: '广场页面',
    reload: true
  }, {
    to: /^\/about\/?$/,
    component: About,
    name: '关于页面',
    reload: true
  }, {
    to: /^\/doc\/?$/,
    component: Doc,
    name: '接口文档页面',
    reload: true
  }, {
    to: /^\/myspace\/?$/,
    component: UserSpace,
    name: '个人中心页面',
    reload: true
  }, {
    to: /^\/myspace\/collections\/?$/,
    component: UserCollections,
    name: '我的全部句集页面',
    reload: true
  }, {
    to: /^\/myspace\/collections\/([^\/]+)\/?$/,
    component: UserCollection,
    name: '句集详情页面',
    reload: true
  }, {
    to: /^\/myspace\/collections\/([^\/]+)(\/update|\/new)?\/preview$/,
    component: HitokotoPreview,
    name: '句子预览页面'
  }, {
    to: /^\/myspace\/collections\/([^\/]+)\/(new|update)$/,
    component: HitokotoEditor,
    name: '句子编辑页面'
  }, {
    to: /^\/myspace\/profiles$/,
    component: Profile,
    name: '账号设置',
    reload: true
  }, {
    to: /^\/tools/,
    component: Tools,
    name: '工具页面',
    reload: true
  }, {
    to: /^\/license/,
    component: License,
    name: '开源协议页面',
    reload: true
  }, {
    to: /\w*/,
    component: NotFound,
    name: '404页面',
    reload: true
  }
];

offlineWatcher.whenOnline(() => showNotification('检测到网络已上线', 'success'))
offlineWatcher.whenOffline(() => showNotification('检测到网络已离线', 'error'))

class AppContainer extends Component {
  constructor(props) {
    super(props)
    this.getChildren.bind(this);
  }
  getChildren(props) {
    const {location, history} = props;
    const matched = ROUTES.map(item => {
      if (item.to.test(location.pathname)) {
        return item;
      }
    }).filter(item => item)[0];
    const routeInfo = matched.to.exec(location.pathname);
    const Child = matched.component;

    //    需要刷新页面以使用新资源，如果路由reload为true,并且window.swUpdate 为true的话，就跳转过去，否则不刷新页面
    if (matched.reload && window.swUpdate) {

      window.location.href = props.location.pathname;
      return <GonaReload/>;
    }

    return (
      <div
        style={{
        width: '100%',
        position: 'relative',
        height: '100%',
        backgroundColor: 'white'
      }}>
        <QueueAnim
          style={{
          width: '100%',
          position: 'relative',
          height: '100%',
          backgroundColor: 'white',
          overflow: 'hidden',
          'willChange': 'contents'
        }}
          key="frameChange"
          duration="900"
          animConfig={ANIMATE_CONFIG_NEXT}>
          {/**这里动画组件设置的计时器会因为没有触发而导致动画倒放，
          必须要等到动画结束后等待一段时间，之前的组件才会消失。
          如果在动画结束后，马上路由返回，先前的组件就会反向出现。
         只好每次都重新渲染*/}
          <Child
            key={matched.name}
            rinfo={routeInfo}
            location={location}
            history={history}/>
        </QueueAnim>
        <Regist/>
        <Login/>
        <NotificationContainer/>
        <PatternHelperModal/>
      </div>
    );
  }
  render() {
    return (<Route key="appcontainer" render={this.getChildren}/>);
  }
}

export default withRouter(AppContainer);
