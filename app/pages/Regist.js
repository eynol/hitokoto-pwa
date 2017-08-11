import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import style from './login.css';
import FullPage from '../component/FullPage'

export default class Regist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: undefined,
      password: undefined,
      showPasswordDiff: false,
      email: undefined
    }
  }
  handleUsernameChange(event) {
    this.setState({username: event.target.value})
  }
  handlePasswordChange(event) {
    this.setState({password: event.target.value})
  }
  handlePassword2Change(event) {
    this.setState({username: event.target.value})
  }
  render() {
    return (
      <FullPage style={{backgroundColor:'transparent'}}  onClick={e => {this.props.history.replace('/');}} >
        <div className={style['login-box']}  onClick={e => {e.stopPropagation();return false; }} >
          <h1>注册</h1>
          <p><input type="text" placeholder="请输入您的账号"/></p>
          <p><input type="password" placeholder="请输入您的密码"/></p>
          <p><input type="password" placeholder="请再次确认您的密码"/></p>
          <p><input type="text" placeholder="请输入验证邮箱"/></p>
          <p>
            <button>确认注册</button>
          </p>
          <p><br/>
            <Link to='/'>返回首页</Link>&nbsp;
            <Link to='/login' replace>马上登录</Link>
          </p>
        </div>
      </FullPage>
    );
  }
}