import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';

import httpManager from '../API/httpManager';
import $encode from '../API/PublicEncrypt';
import showNotification from '../API/showNotification';

import FullPageCard from '../component/FullPageCard'

import {mb20} from './Profile.css';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: 0,
      emailDelay: 0,
      password: 0,
      useremail: '*****'
    }

    this.sendOldCode = this.sendOldCode.bind(this);
    this.verifyOldCode = this.verifyOldCode.bind(this);
    this.sendNewEmailCode = this.sendNewEmailCode.bind(this);
    this.verifyNewEmailCode = this.verifyNewEmailCode.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
  }
  componentWillMount() {
    this.getUserEmail();
  }
  getUserEmail() {
    httpManager.API_getUserEmail().then(ret => {
      if (ret.err) {
        showNotification(ret.err, 'error');
      } else {
        this.setState({useremail: ret.email})
      }
    })
  }
  sendOldCode() {
    httpManager.API_sendOldEmailCode().then(result => {
      if (result.err) {
        showNotification(result.err, 'error');
      } else {
        showNotification('发送验证码至旧邮箱成功！');
        this.setState({email: 1, emailDelay: 59});
        let timmer = setInterval(() => {
          if (this.state.emailDelay != 0) {
            this.setState(state => {
              state.emailDelay -= 1;
              return state;
            });
          } else {
            clearInterval(timmer);
          }
        }, 1000)
      }
    });
  }
  verifyOldCode() {
    httpManager.API_verifyOldEmailCode(this.refs.oldemailcode.value.trim()).then(ret => {
      if (ret.err) {
        showNotification(ret.err, 'error');
      } else {
        showNotification('旧邮箱验证成功！');
        this.setState({email: 2, emailDelay: 0});
      }
    })
  }

  sendNewEmailCode() {
    let email = this.refs.newemail.value.trim()

    if (!/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(email)) {
      showNotification('请输入正确的邮箱！', 'error');
      return;
    }

    httpManager.API_sendNewEmailCode(email).then(ret => {
      if (ret.err) {
        showNotification(ret.err, 'error');
      } else {
        showNotification('成功发送新的验证码至您的新邮箱！');
        this.setState({email: 3, emailDelay: 59});
        let timmer = setInterval(() => {
          if (this.state.emailDelay != 0) {
            this.setState(state => {
              state.emailDelay -= 1;
              return state;
            });
          } else {
            clearInterval(timmer);
          }
        }, 1000)
      }
    })
  }
  verifyNewEmailCode() {
    let email = this.refs.newemail.value.trim(),
      code = this.refs.newemailcode.value.trim();
    httpManager.API_verifyNewEmailCode(email, code).then(ret => {
      if (ret.err) {
        showNotification(ret.err, 'error');
      } else {
        showNotification('绑定新邮箱成功！');
        this.setState({email: 0, emailDelay: 0});
        this.getUserEmail();
      }
    })
  }
  updatePassword() {
    let oldpassword = this.refs.originpass.value;
    let password = this.refs.newpass.value;
    let password2 = this.refs.newpasscheck.value;

    if (oldpassword.trim().length == 0) {
      showNotification('原密码不能为空！\n若不能输入中文，可以复制粘贴。', 'error');
      return;
    }
    if (password.trim().length == 0) {
      showNotification('密码不能为空！\n若不能输入中文，可以复制粘贴。', 'error');
      return;
    }
    if (password2 != password) {
      showNotification('两次密码不一致！\n若不能输入中文，可以复制粘贴。', 'error');
      return;
    }

    httpManager.API_updatePassword($encode(oldpassword), $encode(password)).then(ret => {
      if (ret.err) {
        showNotification(ret.err, 'error');

      } else {
        showNotification('修改密码成功！');
        this.refs.originpass.value = '';
        this.refs.newpass.value = '';
        this.refs.newpasscheck.value = '';
      };
    })
  }
  render() {
    let {path, location, user} = this.props;
    let state = this.state;
    return (
      <FullPageCard cardname="账户设置">
        <div className="form">
          <div className={mb20}>
            <h4>基本信息</h4><hr/>
            <label htmlFor="">昵称(暂不开放修改)：</label>
            <span>{user.nickname}</span>
          </div>
          <div className={mb20}>
            <h4>修改验证邮箱</h4><hr/>
            <label htmlFor="">原验证邮箱:</label>{state.useremail}<br/>
            <i className="iconfont icon-tishi"></i>
            <small>若无法接收验证邮件，请联系网站管理员</small><br/>
            <div className={state.email == 0
              ? ''
              : 'hide'}>
              <button
                onClick={this.sendOldCode}
                className={state.emailDelay == 0
                ? ''
                : 'disabled'}>发送验证码</button>

            </div>
            <div className={state.email == 1
              ? ''
              : 'hide'}>
              <div className="text-filed">
                <input type="text" ref="oldemailcode" required/>
                <label data-content="请输入您收到的验证码">请输入您收到的验证码</label>
              </div><br/>
              <button onClick={this.verifyOldCode}>立即验证</button>&nbsp;
              <button
                onClick={this.sendOldCode}
                className={state.emailDelay == 0
                ? ''
                : 'disabled'}>重新发送验证码{state.emailDelay == 0
                  ? ''
                  : `(${state.emailDelay})`}</button>
            </div>
            <div className={state.email == 2
              ? ''
              : 'hide'}>
              <div className="text-filed">
                <input type="text" ref="newemail" required/>
                <label data-content="请输入新的验证邮箱">请输入新的验证邮箱</label>
              </div><br/>
              <button
                onClick={this.sendNewEmailCode}
                className={state.emailDelay == 0
                ? ''
                : 'disabled'}>发送新邮箱验证码{state.emailDelay == 0
                  ? ''
                  : `(${state.emailDelay})`}</button>
            </div>
            <div className={state.email == 3
              ? ''
              : 'hide'}>
              <div className="text-filed">
                <input type="text" ref="newemailcode" required/>
                <label data-content="确认新邮箱收到的验证码">确认新邮箱收到的验证码</label>
              </div><br/>
              <button
                onClick={() => {
                this.setState({email: 2})
              }}>上一步</button>
              <button onClick={this.verifyNewEmailCode}>完成验证</button>
              <button
                onClick={this.sendNewEmailCode}
                className={state.emailDelay == 0
                ? ''
                : 'disabled'}>重新发送验证码{state.emailDelay == 0
                  ? ''
                  : `(${state.emailDelay})`}</button>
            </div>
          </div>
          <div className={mb20}>
            <h4>修改密码</h4><hr/>
            <div className="text-filed">
              <input type="password" ref="originpass" required/>
              <label data-content="原密码">原密码</label>
            </div><br/>
            <div className="text-filed">
              <input type="password" ref="newpass" required/>
              <label data-content="新密码">新密码</label>
            </div><br/>
            <div className="text-filed">
              <input type="password" ref="newpasscheck" required/>
              <label data-content="再次确认新密码">再次确认新密码</label>
            </div><br/>
            <div>
              <button onClick={this.updatePassword}>确认修改密码</button>
            </div>
          </div>
        </div>
      </FullPageCard>
    )
  }
}
export default withRouter(Profile)
// export default About