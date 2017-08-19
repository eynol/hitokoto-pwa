import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import QueueAnim from 'rc-queue-anim';
import here$you$are from '../API/PublicEncrypt';

import style from './login.css';
import FullPage from '../component/FullPage'

let errorStyle = {
  display: 'inline-block',
  margin: '5px',
  padding: '14px 15px',
  backgroundColor: " #ffd9ea",
  border: 'solid 1px pink',
  borderRadius: '4px',
  width: '200px',
  whiteSpace: 'pre-line'
}
let ErrorInfo = reason => (
  <span style={errorStyle}>{reason}</span>
);

export default class Regist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: undefined,
      password: undefined,
      password2: undefined,
      showPasswordDiff: false,
      email: undefined,
      nickname: undefined,
      errinfo: undefined,
      code: null,
      step: 1,
      user: {}
    }
  }
  handleUsernameChange(event) {
    this.setState({username: event.target.value})
  }

  handlePasswordChange(event) {
    let pass = event.target.value
    if (this.state.showPasswordDiff) {
      if (pass !== this.state.password2) {
        this.setState({password: pass, errinfo: '两次密码不一致!\n密码至少7位!\n密码可以使用任意字符，包括中文。\n若不能输入中文，可以复制粘贴。'})
      } else {
        this.setState({password: pass, errinfo: ''})
      }
    } else {
      this.setState({password: pass})
    }
  }
  handlePassword2Change(event) {
    let pd2 = event.target.value;
    if (!this.state.showPasswordDiff) {
      this.setState({showPasswordDiff: true})
    }
    if (pd2 != this.state.password) {
      this.setState({password2: pd2, errinfo: '两次密码不一致!\n密码至少7位!\n密码可以使用任意字符，包括中文。\n若不能输入中文，可以复制粘贴。'})
    } else {
      this.setState({password2: pd2, errinfo: ''})
    }
  }
  handleNicknameChange(event) {
    this.setState({nickname: event.target.value})
  }
  handleEmailChange(event) {
    let email = event.target.value
    if (!/^[a-z0-9]+([\.\_\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(email)) {
      this.setState({errinfo: '请输入正确的邮箱'});
      return;
    } else {
      this.setState({errinfo: undefined});
    }

    this.setState({email: email})
  }
  handleCodeChange(event) {
    let code = event
      .target
      .value
      .toLowerCase();
    if (!/^[a-z0-9]{4}$/.test(code)) {
      this.setState({errinfo: '请输入正确的验证码'});
      return;
    } else {
      this.setState({errinfo: undefined});
    }

    this.setState({code: code})
  }
  handleRegist() {

    let {username, password, password2, email, nickname} = this.state;

    if (typeof username == 'undefined') {
      this.setState({errinfo: '用户名不能为空！\n用户名至少7位!\n用户名可以使用任意字符，包括中文。'});
      return;
    }
    if (username.trim().length == 0) {
      this.setState({errinfo: '用户名不能为空！\n用户名至少7位!\n用户名可以使用任意字符，包括中文。'});
      return;
    }
    if (username.length < 7) {
      this.setState({errinfo: '用户名过短！至少要7位。\n用户名可以使用任意字符，包括中文。'})
    }
    if (typeof password == 'undefined') {
      this.setState({errinfo: '密码不能为空！\n密码至少7位!\n密码可以使用任意字符，包括中文。\n若不能输入中文，可以复制粘贴。'});
      return;
    }
    if (password.trim().length == 0) {
      this.setState({errinfo: '密码不能为空！\n密码至少7位!\n密码可以使用任意字符，包括中文。\n若不能输入中文，可以复制粘贴。'});
      return;
    }
    if (password2 != password) {
      this.setState({errinfo: '两次密码不一致！\n密码至少7位!\n密码可以使用任意字符，包括中文。\n若不能输入中文，可以复制粘贴。'});
      return;
    }

    if (!/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(email)) {
      this.setState({errinfo: '请输入正确的邮箱'});
      return;
    }

    this.setState({errinfo: undefined});

    let $username = here$you$are(username).toString();
    let $password = here$you$are(password).toString();
    console.log('encrypted username', $username);
    console.log('encrypted password', $password);
    this.setState({
      user: {
        username: $username,
        password: $password,
        email: email,
        nickname: nickname
      }
    });
    let form = new FormData();
    form.append('username', $username);
    form.append('password', $password);
    form.append('email', email);
    form.append('nickname', nickname);

    let that = this;
    this
      .props
      .registCallback(form)
      .then(resp => {
        if (resp.err) {
          return Promise.reject(resp.err);
        } else {
          that.setState({step: 2})
        }
      })
      .catch(reson => {
        if (typeof reson == 'string') {
          that.setState({errinfo: reson})
        } else {
          that.setState({errinfo: reson.message})
        }
      });
  }

  handleRegist2() {
    let {code} = this.state;
    let {username, password, email, nickname} = this.state.user;

    if (!/^[a-z0-9]{4}$/.test(code)) {
      this.setState({errinfo: '请输入正确的验证码'});
      return;
    } else {
      this.setState({errinfo: undefined});
    }

    let form = new FormData();
    form.append('code', code);
    form.append('username', username);
    form.append('password', password);
    form.append('email', email);
    form.append('nickname', nickname);

    let that = this;
    this
      .props
      .registCallback(form)
      .then((resp) => {
        if (resp.err) {
          return Promise.reject(resp.err);
        } else {
          //注册成功！
          this
            .props
            .history
            .go('/');
          this
            .props
            .registDone(resp);
        }
      })
      .catch(reson => {
        if (typeof reson == 'string') {
          that.setState({errinfo: reson})
        } else {
          that.setState({errinfo: reson.message})
        }
      })

  }
  render() {
    let errinfo = '';
    if (this.state.errinfo) {
      errinfo = (
        <p>{ErrorInfo(this.state.errinfo)}</p>
      )
    }

    let step1 = (
      <FullPage
        key="regist-step1"
        style={{
        backgroundColor: 'transparent'
      }}
        onClick={e => {
        this
          .props
          .history
          .replace('/');
      }}>
        <div
          className={style['login-box']}
          onClick={e => {
          e.stopPropagation();
          return false;
        }}>
          <h1>注册</h1>
          <p><input
            type="text"
            placeholder="用户名"
            onChange={this
        .handleUsernameChange
        .bind(this)}
            defaultValue={this.state.username}/></p>
          <p><input
            type="password"
            placeholder="密码"
            onChange={this
        .handlePasswordChange
        .bind(this)}
            defaultValue={this.state.password}/></p>
          <p><input
            type="password"
            placeholder="请再次确认您的密码"
            onChange={this
        .handlePassword2Change
        .bind(this)}
            defaultValue={this.state.password2}/></p>
          <p><input
            type="text"
            placeholder="验证邮箱(非常重要)"
            onChange={this
        .handleEmailChange
        .bind(this)}
            defaultValue={this.state.email}/></p>
          <p><input
            type="text"
            placeholder="显示的昵称"
            onChange={this
        .handleNicknameChange
        .bind(this)}
            defaultValue={this.state.nickname}/></p>
          {errinfo}
          <p>
            <button onClick={this
              .handleRegist
              .bind(this)}>下一步</button>
          </p>
          <p><br/>
            <Link to='/'>返回首页</Link>&nbsp;
            <Link to='/login' replace>马上登录</Link>
          </p>
        </div>
      </FullPage>
    )

    let step2 = (
      <FullPage
        key="regist-step2"
        style={{
        backgroundColor: 'transparent'
      }}>
        <div className={style['login-box']}>
          <h1>请输入您收到的验证码</h1>
          <p><input
            type="text"
            placeholder="验证码"
            onChange={this
        .handleCodeChange
        .bind(this)}/></p>
          {errinfo}
          <p>
            <button
              style={{
              backgroundColor: '#c6c7c8'
            }}
              onClick={(e) => {
              this.setState({step: 1, errinfo: undefined})
            }}>上一步</button>&nbsp;
            <button onClick={this
              .handleRegist2
              .bind(this)}>立即注册</button>
          </p>
          <p>没有收到？
            <a
              href="javascript:"
              onClick={this
              .handleRegist
              .bind(this)}>重新发送</a>
          </p>
        </div>
      </FullPage>
    );
    return (
      <QueueAnim>{this.state.step == 1
          ? step1
          : step2}</QueueAnim>
    );
  }
}