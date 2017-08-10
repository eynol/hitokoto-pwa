import React, {Component} from 'react';
import style from './App.css';

import UserContainer from './Controller/UserContainer'

import Tag from './component/Tag'

import Copyright from './component/Copyright'

function launchIntoFullscreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
}

function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
}

let Logo = (props) => {
  return (
    <div className={style.logo} onClick={props.clickCallback} style={{cursor: 'pointer'}}>
      <h1 title="点击此处开启全屏或退出全屏">Hitokoto</h1>
    </div>
  )
}

/**
 * var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
var fullscreenEnabled = document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled;
 */

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exitFS:false,
      fullscreenEnabled: document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled || document.msFullscreenEnabled
    }
  }
  requestFullScreen(event) {
    if(this.state.fullscreenEnabled){
      let  fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
      if(fullscreenElement){
        exitFullscreen();
      }else{
        launchIntoFullscreen(document.documentElement||this.refs.root);
      }
    }
    console.log('[App.js -> requestFullScreen]Click Event');
  }
  render() {
    return (
      <div className={style.root} ref="root">
        <Logo clickCallback={this
          .requestFullScreen
          .bind(this)}/>
        <UserContainer></UserContainer>
        <Copyright/>
      </div>
    );
  }
}

export default App
