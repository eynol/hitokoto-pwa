import React, {Component} from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import {Provider} from 'react-redux'

import store from '../store'

import AppContainer from '../Controller/AppContainer'
/**
 * var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
var fullscreenEnabled = document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled;
 */

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <AppContainer></AppContainer>
        </Router>
      </Provider>
    );
  }
}

export default App
