import React, {Component} from 'react';
import QueueAnim from 'rc-queue-anim';
import style from '../component/HitokotoLayout.css';
import {HashRouter as Router, withRouter, Route, Redirect} from 'react-router-dom';

import hitokotoDriver from '../API/hitokotoDriver'

import HitokotoContainer from './HitokotoContainer'
import Nav from '../component/Nav'

import Copyright from '../component/Copyright'

import Login from '../pages/Login'
import Regist from '../pages/Regist'
import LayoutSetting from '../pages/LayoutSetting'
import Patterns from '../pages/Patterns'
import Sources from '../pages/Sources'
import About from '../pages/About'
import Home from '../pages/Home'

const ROUTES = [
  {
    to: /^\/$/,
    component: About,
    name: '首页'
  }, {
    to: /^\/sources$/,
    component: Sources,
    name: '首页'
  }, {
    to: /^\/patterns$/,
    component: Patterns,
    name: '首页'
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

  constructor(props) {
    super(props);
    this.state = {
      layout: $getInstantLayout(),
      nickname: $getNickname(),
      path: '/',
      currentPatternID: hitokotoDriver.pattern.id
    }
  }

  handleLayoutChange(item, nextVal) {
    let layout = this.state.layout;
    if (layout[item] != nextVal) {
      layout[item] = nextVal;
      this.setState({'layout': layout});
      $setInstantLayout(layout);
    }
    console.log(nextVal);
  }
  handlePatternChange(id) {
    console.log('pattern change', id);
    if (id !== hitokotoDriver.pattern.id) {
      let pattern = hitokotoDriver
        .patterManager
        .getPatternById(id);
      hitokotoDriver
        .drive(pattern)
        .start();
      this.setState({currentPatternID: id})
    }
  }
  updateNameAndToken({nickname, token}) {
    this.setState({nickname: nickname});
    $setNickname(nickname)
    hitokotoDriver
      .httpManager
      .updateToken(token);
  }
  handleSignUp(formData) {
    return hitokotoDriver
      .httpManager
      .API_regist(formData)
  }
  handleSignIn(formData) {
    try {
      return hitokotoDriver
        .httpManager
        .API_login(formData)
    } catch (e) {
      console.log('[UserContainer.handleSignIn]', e)
      return Promise.reject(e);
    }
  }
  handleSignOut() {
    console.log('sign out');
    this.updateNameAndToken({nickname: '', token: ''});
  }
  getChildren(props) {
    const {location} = props;
    const mathPath = ROUTES
      .map(item => {
      if (item.to.test(location.pathname)) {
        return item;
      }
    })
      .filter(item => item)[0];
    const Child = mathPath.component;
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
        <Child key={location.pathname}/>
      </QueueAnim>
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
          exit: this
            .handleSignOut
            .bind(this)
        }}/>

        <About path='/about'/>
        <Login
          path='/login'
          loginCallback={this
          .handleSignIn
          .bind(this)}
          loginDone={this
          .updateNameAndToken
          .bind(this)}/>
        <Regist
          path='/regist'
          registCallback={this
          .handleSignUp
          .bind(this)}
          registDone={this
          .updateNameAndToken
          .bind(this)}/>

        <LayoutSetting
          path='/layoutsetting'
          layout={this.state.layout}
          changeLayout={this
          .handleLayoutChange
          .bind(this)}
          patterns={hitokotoDriver.patterManager.patterns}
          currentPatternID={this.state.currentPatternID}
          patternChange={this
          .handlePatternChange
          .bind(this)}/>
        <Patterns path='/patterns'/>
        <Sources path='/sources'/>
        <Route
          path='/exit'
          render={({match, location, history}) => {
          setTimeout(() => {
            this.handleSignOut();
          }, 200);
          return (<Redirect to="/"/>)
        }}/>
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

  function $getNickname() {
    return localStorage.getItem(USER_NICKNAME) || '';
  }
  function $setNickname(name) {
    localStorage.setItem(USER_NICKNAME, name);
  }
