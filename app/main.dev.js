import 'react-hot-loader/patch';
import './normalize.css';
import './font/iconfont.css';
import './ui.css';
import 'core-js/es6/array';
import 'core-js/es6/promise';
import 'core-js/es6/map';
import 'core-js/es6/set';
import React from 'react';
import {render} from 'react-dom';
import {AppContainer} from 'react-hot-loader';
import App from './withRedux/App';

render(
  <AppContainer><App/></AppContainer>, document.getElementById('root'));
if (module.hot) {
  module.hot.accept('./withRedux/App', () => {
    let App = require('./withRedux/App').default;

    render(
      <AppContainer><App/></AppContainer>, document.getElementById('root'))
  });
}