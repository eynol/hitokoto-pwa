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

import App from './withRedux/App';
import * as OfflinePluginRuntime from 'offline-plugin/runtime';
import showNotification from './API/showNotification';

OfflinePluginRuntime.install({
  onInstalled: () => showNotification('应用安装完成！您已可以在离线时使用。', 'success', true),
  onUpdating: () => showNotification('新版本下载中....', 'info', false, 5),
  onUpdateReady: () => OfflinePluginRuntime.applyUpdate(),
  onUpdateFailed: () => showNotification('更新失败！', 'error', 'error'),
  onUpdated: () => {
    window.swUpdate = true;
    // showNotification('应用已更新至新版本！您可以手动刷新页面使用新版本了', 'success')
  }
});

render(
  <App/>, document.getElementById('root'));
