import React, {Component} from 'react';
import QueueAnim from 'rc-queue-anim';
import {Link, withRouter} from 'react-router-dom';
import here$you$are from '../API/PublicEncrypt';
import style from './login.css';
import FullPage from '../component/FullPage'
import TextFiledCss from '../component/TextFiled.css'

let {'text-filed': textFiled} = TextFiledCss;

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
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: undefined,
      password: undefined,
      errinfo: undefined
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.location.pathname == nextProps.path || this.props.location.pathname == nextProps.path;
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

    this.setState({errinfo: undefined});

    let $username = here$you$are(username);
    let $password = here$you$are(password);

    console.log('encrypted username', $username);
    console.log('encrypted password', $password);
    let form = new FormData();
    form.append('username', $username);
    form.append('password', $password)
    this
      .props
      .loginCallback(form)
      .then((resp) => {
        if (resp.err) {
          this.setState({errinfo: resp.err})
        } else {
          this
            .props
            .loginDone(resp)
          console.log(resp);
          this
            .props
            .history
            .replace('/')
        }

      })
      .catch(err => {
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
    let {location, path} = this.props;
    return (
      <QueueAnim type={['left', 'right']} ease={['easeOutQuart', 'easeInOutQuart']}>{location.pathname == path
          ? <FullPage
              key={path}
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
                <h1>登录</h1>
                <div className={textFiled}><input
                  type="text"
                  onChange={this
              .handleUsernameChange
              .bind(this)}
                  required/>
                  <label data-content="账号">账号</label>
                </div>
                <div className={textFiled}><input
                  type="password"
                  onChange={this
              .handlePasswordChange
              .bind(this)}
                  required
                  onKeyPress={this
              .handleKeyPress
              .bind(this)}/>
                  <label data-content="密码">密码</label>
                </div>
                {errinfo}
                <br/>
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
          : null}
      </QueueAnim>
    )
  }
}
export default withRouter(Login)