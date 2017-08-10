import React, {Component} from 'react'
import style from '../component/HitokotoLayout.css'
import {HashRouter as Router, Route, Redirect} from 'react-router-dom'

import getHitokoto from '../API/hitokoto'
import Card from '../component/Card'

import HitokotoContainer from './HitokotoContainer'
import Nav from '../component/Nav'

import Login from '../pages/Login'
import Regist from '../pages/Regist'
import Setting from '../pages/Setting'

class UserContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      words: 'example',
      from: '??',
      id: 23,
      creator: 'nou',
      background: '#fff',
      user: null
    }
  }

  handleChangeBGColor(color) {
    this.setState({background: color})
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

    let settingWrap = ({match, location, history}) => (<Setting match={match} location={location} history ={history}/>)

    return (
      <Router>
        <div style={{
          backgroundColor: this.state.background
        }}>
          <Nav
            inline={true}
            user={this.state.user}
            navCallbacks={{
            exit: this
              .handleSignOut
              .bind(this)
          }}/>
          <HitokotoContainer/>
          <Route path='/login' render={loginWrap}/>
          <Route path='/regist' render={registWrap}/>
          <Route path='/setting' render={settingWrap}/>
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
export default UserContainer