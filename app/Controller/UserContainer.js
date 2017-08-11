import React, {Component} from 'react'
import style from '../component/HitokotoLayout.css'
import {HashRouter as Router, Route, Redirect} from 'react-router-dom'

import getHitokoto from '../API/hitokotoDriver'
import Card from '../component/Card'

import HitokotoContainer from './HitokotoContainer'
import Nav from '../component/Nav'

import Login from '../pages/Login'
import Regist from '../pages/Regist'
import Setting from '../pages/Setting'
import Apis from '../pages/Apis'

const INSTANT_LAYOUT_NAME = 'instant_layout';
const DEFAULT_LAYOUT ={
  font: 'simsun',
  fontWeight:'600',
  layoutHorizon: false,
  backgroundColor: '#ffffff'
}


class UserContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      words: 'example',
      from: '??',
      id: 23,
      creator: 'nou',
      user: null,
      layout: getInstantLayout()
    }
  }

  handleLayoutChange(item, nextVal) {
    let layout = this.state.layout;
    if (layout[item] != nextVal) {
      layout[item] = nextVal;
      this.setState({'layout': layout});
      setInstantLayout(layout);
    }
    console.log(nextVal);
  }

  handleSignUp(info, success, error) {}
  handleSignIn(user, success, error) {
    try {
      if (user.username == 'heitao' && user.password == '123456') {
        success()
        this.setState({user: user})

      } else {
        error('用户名或密码错误')
      }
    } catch (e) {
      console.log('[UserContainer.handleSignIn]', e)
      error || error();
    }
  }
  handleSignOut() {
    console.log('sign out');
    this.setState({user: undefined});
  }
  render() {
    let loginWrap = ({match, location, history}) => (<Login
      loginCallback={this
      .handleSignIn
      .bind(this)}
      match={match}
      location={location}
      history
      ={history}/>)

    let registWrap = ({match, location, history}) => (<Regist
      registCallback={this
      .handleSignUp
      .bind(this)}
      match={match}
      location={location}
      history
      ={history}/>);

    let settingWrap = ({match, location, history}) => (<Setting
      layout={this.state.layout}
      changeLayout={this.handleLayoutChange.bind(this)}
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
          <Nav
            inline={true}
            user={this.state.user}
            navCallbacks={{
            exit: this
              .handleSignOut
              .bind(this)
          }}/>
          <HitokotoContainer layout={this.state.layout}/>
          <Route path='/login' render={loginWrap}/>
          <Route path='/regist' render={registWrap}/>
          <Route path='/setting' render={settingWrap}/>
          <Route path='/apis' component={Apis}/>
          <Route
            path='/exit'
            render={({match, location, history}) => {
            return (<Redirect to="/somewhere/else"/>)
          }}/>
        </div>
      </Router>
    )
  }

}
export default UserContainer;

function getInstantLayout(){
  let string = localStorage.getItem(INSTANT_LAYOUT_NAME);
  if (!string) {
    return DEFAULT_LAYOUT;
  }
  return JSON.parse(string);
}
function setInstantLayout(layout){
   localStorage.setItem(INSTANT_LAYOUT_NAME,JSON.stringify(layout));
}