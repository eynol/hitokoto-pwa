import React, {Component} from 'react';
import PropTypes from 'prop-types';
import QueueAnim from 'rc-queue-anim';
import {Link, withRouter} from 'react-router-dom';

import here$you$are from '../API/PublicEncrypt';
import hitokotoDriver from '../API/hitokotoDriver'
import httpManager from '../API/httpManager'
import showNotification from '../API/showNotification';

import FullPage from '../component/FullPage'

import {PANEL_OPEN} from '../actions'
import {GLOBAL_ANIMATE_TYPE} from '../configs'

import style from './login.css';

let ERROR_STYLE = {
  display: 'inline-block',
  margin: '5px',
  padding: '14px 15px',
  backgroundColor: " #ffd9ea",
  border: 'solid 1px pink',
  borderRadius: '4px',
  width: '200px',
  whiteSpace: 'pre-line'
}

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: undefined,
      password: undefined,
      errinfo: undefined
    }

    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSigninClick = this.handleSigninClick.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
  }
  componentWillMount() {
    hitokotoDriver.stop();
  }
  componentWillUnmount() {
    hitokotoDriver.start();
  }
  handleUsernameChange(event) {
    this.setState({username: event.target.value})
  }
  handlePasswordChange(event) {
    this.setState({password: event.target.value})
  }
  handleKeyPress(event) {
    if (event.key.toLowerCase() == 'enter') {
      this.handleSigninClick();
    }

  }
  handleSigninClick(event) {
    let {username, password} = this.state;

    if (typeof username == 'undefined') {
      this.setState({errinfo: '用户名不能为空！'});
      return;
    }
    if (username.trim().length == 0) {
      this.setState({errinfo: '用户名不能为空！'});
      return;
    }
    if (typeof password == 'undefined') {
      this.setState({errinfo: '密码不能为空'});
      return;
    }
    if (password.trim().length == 0) {
      this.setState({errinfo: '密码不能为空'});
      return;
    }

    this.setState({errinfo: ''});

    let $username = here$you$are(username);
    let $password = here$you$are(password);

    if (process.env.NODE_ENV !== 'production') {

      console.log('encrypted username', $username);
      console.log('encrypted password', $password);

    }

    httpManager.API_login({username: $username, password: $password}).then((resp) => {
      if (resp.err) {
        this.setState({errinfo: resp.err})
      } else {

        showNotification('登录成功！', 'success');
        // login done!!!!
        this.props.loginDone(resp)

        this.props.hideLogin()
      }

    }).catch(err => {
      this.setState({errinfo: err})
    })
  }

  render() {
    let {hideLogin, showRegist, panel} = this.props;
    let Child;
    if (panel === PANEL_OPEN + 'login') {
      Child = <FullPage
        key="login0panel"
        style={{
        backgroundColor: 'transparent'
      }}
        onClick={hideLogin}>
        <div
          className={style['login-box']}
          onClick={e => {
          e.stopPropagation();
          return false;
        }}>
          <h1>登录</h1>
          <div className="text-filed"><input type="text" onChange={this.handleUsernameChange} required/>
            <label data-content="账号">账号</label>
          </div>
          <div className="text-filed"><input
            type="password"
            onChange={this.handlePasswordChange}
            required
            onKeyPress={this.handleKeyPress}/>
            <label data-content="密码">密码</label>
          </div>
          {this.state.errinfo
            ? <p>
                <span style={ERROR_STYLE}>{this.state.errinfo}</span>
              </p>
            : null}
          <br/>
          <p>
            <button onClick={this.handleSigninClick}>立即登录</button>
            <button onClick={showRegist}>前往注册</button>
          </p>
          <p><br/>
            <button onClick={hideLogin}>关闭</button>
          </p>
        </div>
      </FullPage>

    } else {
      Child = <div></div>; // QueueAnim can't resolve null children;
    }
    return (
      <QueueAnim type={GLOBAL_ANIMATE_TYPE} ease={['easeOutQuart', 'easeInOutQuart']}>
        {Child}
      </QueueAnim>
    )
  }
}

Login.propTypes = {
  hideLogin: PropTypes.func.isRequired,
  showRegist: PropTypes.func.isRequired,
  loginDone: PropTypes.func.isRequired
}
export default Login