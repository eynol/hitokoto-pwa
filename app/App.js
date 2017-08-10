import React, {Component} from 'react';
import style from './App.css';

import UserContainer from './Controller/UserContainer'

import Tag from './component/Tag'

import Copyright from './component/Copyright'

let Logo = (props) => {
  return (
    <div className={style.logo}>
      <h1>Hitokoto</h1>
    </div>
  )
}

class App extends Component {

  render() {
    return (
      <div className={style.root}>
        <Logo/>
        <UserContainer></UserContainer>
        <Copyright/>
      </div>
    );
  }
}

export default App
