import React, {Component} from 'react';
import QueueAnim from 'rc-queue-anim';
import style from '../component/HitokotoLayout.css';
import {HashRouter as Router, Route, Redirect} from 'react-router-dom';

import hitokotoDriver from '../API/hitokotoDriver'
import Card from '../component/Card'

import HitokotoContainer from './HitokotoContainer'
import Nav from '../component/Nav'

import Login from '../pages/Login'
import Regist from '../pages/Regist'
import Setting from '../pages/Setting'
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
class UserContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      words: 'example',
      from: '??',
      id: 23,
      creator: 'nou',
      layout: $getInstantLayout(),
      nickname: $getNickname()

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
    let pattern = hitokotoDriver
      .patterManager
      .getPatternById(id);
    hitokotoDriver.drive(pattern);
    hitokotoDriver.start();
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
    let loginWrap = ({match, location, history}) => (<Login
      loginCallback={this
      .handleSignIn
      .bind(this)}
      loginDone={this
      .updateNameAndToken
      .bind(this)}
      match={match}
      location={location}
      history
      ={history}/>)

    let registWrap = ({match, location, history}) => (<Regist
      registCallback={this
      .handleSignUp
      .bind(this)}
      registDone={this
      .updateNameAndToken
      .bind(this)}
      match={match}
      location={location}
      history
      ={history}/>);

    let settingWrap = ({match, location, history}) => (<Setting
      layout={this.state.layout}
      changeLayout={this
      .handleLayoutChange
      .bind(this)}
      patterns={hitokotoDriver.patterManager.patterns}
      patternChange={this
      .handlePatternChange
      .bind(this)}
      match={match}
      location={location}
      history
      ={history}/>)

    return (
      <Router>
        <div
          style={{
          backgroundColor: this.state.layout.backgroundColor,
          height: '100%',
          overflow: 'auto'
        }}>
          <HitokotoContainer layout={this.state.layout}/>
          <Nav
            inline={true}
            nickname={this.state.nickname}
            navCallbacks={{
            exit: this
              .handleSignOut
              .bind(this)
          }}/>
          <Route path='/login' render={loginWrap}/>
          <Route path='/about' component={About}/>
          <Route path='/regist' render={registWrap}/>
          <Route path='/setting' render={settingWrap}/>
          <Route path='/patterns' component={Patterns}/>
          <Route path='/sources' params={this.state.layout} component={Sources}/>
          <Route path='/new' component={NewHitokoto}/>
          <Route
            path='/exit'
            render={({match, location, history}) => {
            setTimeout(() => {
              this.handleSignOut();
            }, 200);
            return (<Redirect to="/"/>)
          }}/>
        </div>
      </Router>
    )
  }

}
export default UserContainer;

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