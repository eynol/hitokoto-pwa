import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import style from './login.css';
import FullPage from '../component/FullPage'

let errorStyle = {
  display: 'inline-block',
  margin: '5px',
  padding: '14px 15px',
  backgroundColor: " #ffd9ea",
  border: 'solid 1px pink',
  borderRadius: '4px'
}
let ErrorInfo = reason => (
  <span style={errorStyle}>{reason}</span>
);
export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: undefined,
      password: undefined,
      errinfo: undefined
    }
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
    if (typeof this.state.username == 'undefined') {
      this.setState({errinfo: '用户名不能为空！'});
      return;
    }
    if (this.state.username.trim().length == 0) {
      this.setState({errinfo: '用户名不能为空！'});
      return;
    }
    if (typeof this.state.password == 'undefined') {
      this.setState({errinfo: '密码不能为空'});
      return;
    }
    if (this.state.password.trim().length == 0) {
      this.setState({errinfo: '密码不能为空'});
      return;
    }

    this.setState({errinfo: undefined});
    
    this
      .props
      .loginCallback({username: this.state.username, password: this.state.password},()=>{
        this.props.history.replace('/')
      },(err)=>{
        this.setState({errinfo: err})
      })
  }

  render() {
    let errinfo = '';
    if (this.state.errinfo) {
      errinfo = (
        <p>{ErrorInfo(this.state.errinfo)}</p>
      )
    }

    return (
      <FullPage>
        <div className={style['login-box']}>
          <h1>登录</h1>
          <p><input
            type="text"
            placeholder="输入账号"
            onChange={this
        .handleUsernameChange
        .bind(this)}/></p>
          <p><input
            type="password"
            placeholder="密码"
            onChange={this
        .handlePasswordChange
        .bind(this)}
            onKeyPress={this
        .handleKeyPress
        .bind(this)}/></p>
          {errinfo}
          <p>
            <button
              onClick={this
              .handleSigninClick
              .bind(this)}>登录</button>
          </p>
          <p><br/>
            <Link to='/'>返回首页</Link>&nbsp;
            <Link to='/regist' replace>前往注册</Link>
          </p>
        </div>
      </FullPage>
    )
  }
}
