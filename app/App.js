import React, {Component} from 'react';
import style from './App.css';

import AppContainer from './Controller/AppContainer'

/**
 * var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
var fullscreenEnabled = document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled;
 */

class App extends Component {

  render() {
    return (
      <div className={style.root}>
        <AppContainer></AppContainer>
      </div>
    );
  }
}

export default App
