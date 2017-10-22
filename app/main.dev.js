import 'react-hot-loader/patch';
import './normalize.css';
import './fonts/iconfont.css';
import './fonts/iconfont-more.css';
import './ui.css';
import 'core-js/es6/array';
import 'core-js/es6/promise';
import 'core-js/es6/map';
import 'core-js/es6/set';
import React from 'react';
import {render} from 'react-dom';
import {AppContainer} from 'react-hot-loader';
import App from './withRedux/App';
import * as OfflinePluginRuntime from 'offline-plugin/runtime';
/*
//与Link标签有问题。

if (process.env.NODE_ENV !== 'production') {
  const {whyDidYouUpdate} = require('why-did-you-update')
  whyDidYouUpdate(React)
}*/

import showNotification from './API/showNotification';

OfflinePluginRuntime.install({
  onInstalled: () => showNotification('应用已可以在离线时使用了。', 'success', true),
  onUpdating: () => showNotification('新版本下载中....', 'info', false),
  onUpdateReady: () => OfflinePluginRuntime.applyUpdate(),
  onUpdateFailed: () => showNotification('更新失败！', 'error', true),
  onUpdated: () => {
    window.swUpdate = true;
    showNotification('应用已更新至新版本！但是现在展示是旧版本，您可以手动刷新页面使用新版本，或待会儿跳转页面时自动刷新', 'success', false, 5)
  }
});

render(
  <AppContainer><App/></AppContainer>, document.getElementById('root'));
if (module.hot) {
  module.hot.accept('./withRedux/App', () => {
    let App = require('./withRedux/App').default;

    render(
      <AppContainer><App/></AppContainer>, document.getElementById('root'))
  });
}