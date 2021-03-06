import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import QueueAnim from 'rc-queue-anim';

import here$you$are from '../API/PublicEncrypt';
import showNotification from '../API/showNotification';
import httpManager from '../API/httpManager'

import FullPage from '../component/FullPage'

import {PANEL_OPEN} from '../actions'
import {GLOBAL_ANIMATE_TYPE} from '../configs'

import style from './login.css';

class Regist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: undefined,
      password: undefined,
      password2: undefined,
      showPasswordDiff: false,
      passwordBlur: 0,
      email: undefined,
      emailBlur: 0,
      nickname: undefined,
      errinfo: undefined,
      code: null,
      step: 1,
      user: {}
    };

    this.handleUsernameChange = this.handleUsernameChange.bind(this);

    this.handlePasswordBlur = this.handlePasswordBlur.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handlePassword2Change = this.handlePassword2Change.bind(this);

    this.handleEmailBlur = this.handleEmailBlur.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);

    this.handleNicknameChange = this.handleNicknameChange.bind(this);

    this.handleRegist = this.handleRegist.bind(this);

    this.handleCodeChange = this.handleCodeChange.bind(this);
    this.handleCodeBlur = this.handleCodeBlur.bind(this);

    this.handleRegist2 = this.handleRegist2.bind(this);
  }

  handleUsernameChange(event) {
    this.setState({username: event.target.value})
  }

  //Password
  handlePasswordBlur() {
    let {password, password2} = this.state;

    if (password !== undefined && password2 !== undefined) {
      this.setState({showPasswordDiff: true});
      this.validatePassword();
    }
  }
  handlePasswordChange(event) {
    let pass = event.target.value;
    this.setState({password: pass})
    if (this.state.showPasswordDiff) {
      this.validatePassword(pass, this.state.password2);
    }
  }
  handlePassword2Change(event) {
    let pd2 = event.target.value;
    this.setState({password2: pd2})
    if (this.state.showPasswordDiff) {
      this.validatePassword(this.state.password, pd2);
    }

  }
  validatePassword(p1, p2) {
    if (!p1) {
      p1 = this.state.password;
    }
    if (!p2) {
      p2 = this.state.password2;
    }
    if (typeof p1 == 'undefined' || typeof p2 == 'undefined') {
      this.setState({errinfo: '密码不能为空！\n若不能输入中文，可以复制粘贴。'});
      return false;
    }
    if (p1.trim().length == 0 || p2.trim().length == 0) {
      this.setState({errinfo: '密码不能为空！\n若不能输入中文，可以复制粘贴。'});
      return false;
    }
    if (p1 != p2) {
      this.setState({errinfo: '两次密码不一致！\n若不能输入中文，可以复制粘贴。'});
      return false;
    }
    this.setState({errinfo: ''});
    return true;
  }
  handleNicknameChange(event) {
    this.setState({nickname: event.target.value})
  }

  //Email
  handleEmailBlur() {
    this.validateEmail();
  }
  handleEmailChange(event) {
    let email = event.target.value;
    this.setState({email: email})
  }
  validateEmail(email) {
    if (!email) {
      email = this.state.email;
    }
    if (!/^[a-z0-9]+([\.\_\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(email)) {
      this.setState({errinfo: '请输入正确的邮箱'});
      return false;
    }

    this.setState({errinfo: undefined});
    return true;
  }

  //Code
  handleCodeBlur() {
    this.validateCode();
  }
  validateCode(code) {
    if (!code) {
      code = this.state.code;
    }
    if (!/^[a-z0-9]{4}$/.test(code)) {
      this.setState({errinfo: '请输入正确的验证码'});
      return false;
    }
    this.setState({errinfo: undefined});
    return true;
  }
  handleCodeChange(event) {
    let code = event.target.value.toLowerCase();
    this.setState({code: code})
  }

  //Regist
  handleRegist() {

    let {username, password, password2, email, nickname} = this.state;

    if (typeof username == 'undefined') {
      this.setState({errinfo: '用户名不能为空！\n用户名至少7位任意字符，包括中文!'});
      return;
    }
    if (username.trim().length == 0) {
      this.setState({errinfo: '用户名不能为空！\n用户名至少7位任意字符，包括中文!'});
      return;
    }
    if (username.length < 7) {
      this.setState({errinfo: '用户名过短！\n至少要7位任意字符，包括中文。'})
    }

    if (!this.validatePassword()) {
      return;
    }

    if (!this.validateEmail()) {
      return;
    }

    this.setState({errinfo: undefined});

    let $username = here$you$are(username);
    let $password = here$you$are(password);

    if (process.env.NODE_ENV !== 'production') {

      console.log('encrypted username', $username);
      console.log('encrypted password', $password);

    }

    this.setState({
      user: {
        username: $username,
        password: $password,
        email: email,
        nickname: nickname
      }
    });

    httpManager.API_regist({username: $username, password: $password, email, nickname}).then(res => {

      showNotification(res.message, 'success');
      this.setState({step: 2})

    })
  }

  handleRegist2() {
    let {code} = this.state;
    let {username, password, email, nickname} = this.state.user;

    if (!this.validateCode()) {
      return;
    }

    httpManager.API_regist({code, username, password, email, nickname}).then((resp) => {

      //注册成功！
      showNotification(resp.message, 'success', true);
      //httpManager.updateToken(resp.token); update token in reducer
      this.props.registDone(resp);
      this.setState({
        username: undefined,
        password: undefined,
        password2: undefined,
        showPasswordDiff: false,
        email: undefined,
        nickname: undefined,
        errinfo: undefined,
        code: null,
        step: 1
      })
      this.props.hideRegist()

    })
  }
  render() {
    let errinfo = '';
    if (this.state.errinfo) {
      errinfo = (
        <p>
          <span
            style={{
            display: 'inline-block',
            margin: '5px',
            padding: '14px 15px',
            backgroundColor: " #ffd9ea",
            border: 'solid 1px pink',
            borderRadius: '4px',
            width: '200px',
            whiteSpace: 'pre-line'
          }}>{this.state.errinfo}</span>
        </p>
      )
    };
    let {panel, showLogin, hideRegist} = this.props,
      Child;

    if (panel === PANEL_OPEN + 'regist') {
      if (this.state.step == 1) {
        Child = (
          <FullPage
            key="regist-step1"
            style={{
            backgroundColor: 'transparent'
          }}
            onClick={this.props.hideRegist}
            key='step1'>
            <div
              className={style['login-box']}
              onClick={e => {
              e.stopPropagation();
              return false;
            }}>
              <h1>注册</h1>
              <div className="text-filed"><input
                type="text"
                required
                onChange={this.handleUsernameChange}
                defaultValue={this.state.username}/>
                <label data-content="用户名(仅登录时使用)">用户名(仅登录时使用)</label>
              </div>
              <div className="text-filed"><input
                type="password"
                required
                onChange={this.handlePasswordChange}
                onBlur={this.handlePasswordBlur}
                defaultValue={this.state.password}/>
                <label data-content="密码(任意字符至少七位)">密码</label>
              </div>
              <div className="text-filed"><input
                type="password"
                required
                onBlur={this.handlePasswordBlur}
                onChange={this.handlePassword2Change}
                defaultValue={this.state.password2}/>
                <label data-content="请再次确认您的密码">请再次确认您的密码</label>
              </div>
              <div className="text-filed"><input
                type="text"
                required
                onChange={this.handleEmailChange}
                onBlur={this.handleEmailBlur}
                defaultValue={this.state.email}/>
                <label data-content="验证邮箱(非常重要)">验证邮箱(非常重要)</label>
              </div>
              <div className="text-filed"><input
                type="text"
                required
                maxLength="20"
                onChange={this.handleNicknameChange}
                defaultValue={this.state.nickname}/>
                <label data-content="显示的昵称(不可修改)">显示的昵称(不可修改)</label>
              </div>
              {errinfo}
              <p>
                <br/>
                <button onClick={this.handleRegist}>下一步</button>
                <button onClick={this.props.showLogin}>前往登录</button>
              </p>
              <p><br/>
                <button href="javascript:" onClick={this.props.hideRegist}>关闭</button>
              </p>
            </div>
          </FullPage>
        )
      } else {
        Child = (
          <FullPage
            key="regist-step2"
            style={{
            backgroundColor: 'transparent'
          }}
            key='step2'>
            <div className={style['login-box']}>
              <h1>请输入您收到的验证码</h1>
              <p>
                <div className="text-filed">
                  <input
                    type="text"
                    required
                    maxLength="4"
                    onBlur={this.handleCodeBlur}
                    onChange={this.handleCodeChange}/>

                  <label data-content="验证码">验证码</label>
                </div>
              </p>
              {errinfo}
              <p>没有收到验证码？
                <button onClick={this.handleRegist}>重新发送</button>
              </p>
              <p>
                <br/>
                <button
                  onClick={(e) => {
                  this.setState({step: 1, errinfo: undefined})
                }}>上一步</button>&nbsp;
                <button onClick={this.handleRegist2}>立即注册</button>
              </p>
            </div>
          </FullPage>
        );
      }
    } else {
      Child = <div key='none'></div>
    }

    return (
      <QueueAnim type={GLOBAL_ANIMATE_TYPE} ease={['easeOutQuart', 'easeInOutQuart']}>
        {Child}
      </QueueAnim>
    )

  }
}

Regist.propTypes = {
  registDone: PropTypes.func.isRequired,
  showLogin: PropTypes.func.isRequired,
  hideRegist: PropTypes.func.isRequired,
  panel: PropTypes.string.isRequired
}
export default Regist