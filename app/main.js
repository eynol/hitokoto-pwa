import './normalize.css';
import './font/iconfont.css';
import './ui.css';
import 'core-js/es6/array';
import 'core-js/es6/promise';
import 'core-js/es6/map';
import 'core-js/es6/set';

import React from 'react';
import {render} from 'react-dom';

import App from './withRedux/App';

render(
  <App/>, document.getElementById('root'));
