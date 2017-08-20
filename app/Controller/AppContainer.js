import React, {Component} from 'react';
import QueueAnim from 'rc-queue-anim';
import style from '../component/HitokotoLayout.css';
import {HashRouter as Router, withRouter, Route, Redirect} from 'react-router-dom';

import hitokotoDriver from '../API/hitokotoDriver'
import Card from '../component/Card'

import HitokotoContainer from './HitokotoContainer'
import Nav from '../component/Nav'
import Logo from '../component/Logo'
import Copyright from '../component/Copyright'

import Login from '../pages/Login'
import Regist from '../pages/Regist'
import LayoutSetting from '../pages/LayoutSetting'
import Patterns from '../pages/Patterns'
import Sources from '../pages/Sources'
import About from '../pages/About'
import NewHitokoto from '../pages/NewHitokoto'

const INSTANT_LAYOUT_NAME = 'instant_layout';
const DEFAULT_LAYOUT = {
  font: 'simsun',
  fontWeight: '600',
  layoutHorizon: false,
  backgroundColor: '#ffffff'
}
const USER_NICKNAME = 'hitoUserNickname';
class AppContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      words: 'example',
      from: '??',
      id: 23,
      creator: 'nou',
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
      hitokotoDriver.drive(pattern);
      hitokotoDriver.start();
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
  render() {

    let firstFrame = (
      <div
        key="firstFrame"
        style={{
        backgroundColor: this.state.layout.backgroundColor,
        height: '100%',
        overflow: 'hidden'
      }}>
        <Logo/>
        <HitokotoContainer layout={this.state.layout}/>
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
        <NewHitokoto path='/new'/>
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

    return (
      <Router>
        <QueueAnim
          style={{
          width: '100%',
          position: 'relative',
          height: '100%'
        }}>
          {firstFrame}
        </QueueAnim>
      </Router>
    )
  }
}
function $getInstantLayout() {
  let string = localStorage.getItem(INSTANT_LAYOUT_NAME);
  if (!string) {
    return DEFAULT_LAYOUT;
  }
  return JSON.parse(string);
}
function $setInstantLayout(layout) {
  localStorage.setItem(INSTANT_LAYOUT_NAME, JSON.stringify(layout));
}

function $getNickname() {
  return localStorage.getItem(USER_NICKNAME) || '';
}
function $setNickname(name) {
  localStorage.setItem(USER_NICKNAME, name);
}

export default AppContainer;