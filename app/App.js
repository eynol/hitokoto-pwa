import React, {Component} from 'react';
import {HashRouter as Router} from 'react-router-dom';
import AppContainer from './Controller/AppContainer'

/**
 * var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
var fullscreenEnabled = document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled;
 */

class App extends Component {

  render() {
    return (
      <Router>
        <AppContainer></AppContainer>
      </Router>
    );
  }
}

export default App
