import React, {Component} from 'react';
import QueueAnim from 'rc-queue-anim';
import style from '../component/HitokotoLayout.css';
import {HashRouter as Router, withRouter, Route, Redirect} from 'react-router-dom';

import Patterns from '../pages/Patterns'
import Sources from '../pages/Sources'
import About from '../pages/About'
import Home from '../containers/Home'

import Index from '../containers/Index'
import {ANIMATE_CONFIG_NEXT, GLOBAL_ANIMATE_TYPE} from '../configs'
const ROUTES = [
  {
    to: /^\/$/,
    component: Index,
    name: '首页'
  }, {
    to: /^\/sources$/,
    component: Sources,
    name: '来源管理'
  }, {
    to: /^\/patterns$/,
    component: Patterns,
    name: '模式管理'
  }, {
    to: /^\/home$/,
    component: Home,
    name: '个人中心页面'
  }, {
    to: /^\/about/,
    component: About,
    name: '关于页面'
  }
];

const USER_NICKNAME = 'hitoUserNickname';
class AppContainer extends Component {

  getChildren(props) {
    const {location} = props;
    const mathPath = ROUTES.map(item => {
      if (item.to.test(location.pathname)) {
        return item;
      }
    }).filter(item => item)[0];
    const Child = mathPath.component;
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
          backgroundColor: 'white'
        }}
          leaveReverse
          animConfig={ANIMATE_CONFIG_NEXT}
          duration='1000'>
          <Child key={Date.now()}/>
        </QueueAnim>
      </div>
    );
  }
  render() {
    return (<Route render={this.getChildren}/>);
  }
  renders() {
    console.log('app container render')
    let firstFrame = (
      <div
        key="firstFrame"
        style={{
        backgroundColor: this.state.layout.backgroundColor,
        height: '100%',
        overflow: 'hidden'
      }}>

        <HitokotoContainer location={this.props.location} layout={this.state.layout}/>
        <Nav
          inline={true}
          nickname={this.state.nickname}
          navCallbacks={{
          exit: this.handleSignOut.bind(this)
        }}/>

        <About path='/about'/>
        <Login
          path='/login'
          loginCallback={this.handleSignIn.bind(this)}
          loginDone={this.updateNameAndToken.bind(this)}/>
        <Regist
          path='/regist'
          registCallback={this.handleSignUp.bind(this)}
          registDone={this.updateNameAndToken.bind(this)}/>

        <LayoutSetting
          path='/layoutsetting'
          layout={this.state.layout}
          changeLayout={this.handleLayoutChange.bind(this)}
          patterns={hitokotoDriver.patterManager.patterns}
          currentPatternID={this.state.currentPatternID}
          patternChange={this.handlePatternChange.bind(this)}/>
        <Patterns path='/patterns'/>
        <Sources path='/sources'/>

        <Copyright/>
      </div>
    );

    let secondFrame = (<Home
      key='secondframe'
      nickname={this.state.nickname}
      layout={this.state.layout}
      path='/home'/>)
      let path = this.props.location.pathname,
        frameToShow;
      if (/(^\/home|^\/collections)/gim.test(path)) {
        frameToShow = secondFrame;
      } else {
        frameToShow = firstFrame;
      }

      return (
        <QueueAnim
          style={{
          width: '100%',
          position: 'relative',
          height: '100%',
          backgroundColor: 'white'
        }}
          duration='1000'
          animConfig={[
          {
            opacity: [
              1, 0
            ],
            translateX: [0, -50]
          }, {
            opacity: [
              1, 0
            ],
            position: 'absolute',
            translateX: [0, 50]
          }
        ]}>
          <Route path='/' key='/' render={Page1}/>
          <Route path='/home' key='/home' render={Page2}/>
        </QueueAnim>
      )
    }
  }

  export default AppContainer;
