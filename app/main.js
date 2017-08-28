import './normalize.css';

import React from 'react';
import {render} from 'react-dom';

import App from './withRedux/App';

if (!('find' in Array.prototype)) {
  Array.prototype.find = function (func, that) {
    if (typeof func !== 'function') {
      throw new TypeError(func + 'is not a function')
    }
    var ctx = that || this,
      i = 0,
      len = this.length,
      done = false;

    for (; i < len; i++) {
      done = func.call(ctx, this[i], i, this);
      if (done) {
        return this[i];
      }
    }
    return undefined;
  }
}
render(
  <App/>, document.getElementById('root'));
