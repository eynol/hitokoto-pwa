import 'whatwg-fetch';

/**
 * 这个文件包含所有的hitokoto来源接口，模式，对接口的禁用修改都在此处。，
 * 模式包含：
 *      启用的API（HTTP,IndexedDB）
 *      定时刷新，
 *      是否遍历
 *
 *
 *
 *
 **/

const URL = 'http://api.hitokoto.cn/';

const VERSION = '20170810'; //版本号，按照
const SOURCES = [
  {
    name: 'hitokoto.cn',
    url: 'http://api.hitokoto.cn/',
    map: function (json_response) {}
  }
];
const ENABLED = [0];

let _version,
  _sources,
  _enabled;

const PREFIX = 'hikotoko'
//1.获取本地版本号,_Version，如果没有,将VERSION保存到本地，返回文件中的静态变量VERSION
_version = getVersion()
if (!_version) {
  setVersion(VERSION);
  _version = VERSION;
}

//2.获取本地存储的所有的hikotoko来源,_Sources，如果本地没有，将SOURCE保存到本地并作为结果返回
_sources = getSources();
if (!_sources) {
  setSources(SOURCES);
  _sources = SOURCES;
}

/**
 * 3.如果VERSION高于_Verision，执行以下步骤，否则执行第4步。
 *    3.1   从SOURCE中找出_Sources中缺少的来源，追加到_Sources中。依据的标准是URL
 *    3.2   如果有修改，保存_Sources到本地;
 */
if (VERSION > _version) {
  //用map缓存已有的本地的url
  let urlMap = {};
  let needUpdateSource = false;
  _sources.forEach(function (item) {
    urlMap[item.url] = true;
  });
  SOURCES.forEach(function (src) {
    if (!urlMap[src.url]) {
      //url不存在,添加至_sources
      _sources.push(src);
      needUpdateSource = true;
    }
  });
  if (needUpdateSource) {
    setSources(_sources);
  }
}

//4.获取本地启用的ID列表,_Enabled，保存的是启用的API的索引。如果没有，保存ENABLED 到本地并作为结果返回，
_enabled = getEnabled();
if (!_enabled) {
  setEnabled(ENABLED);
  _enabled = ENABLED;
}

//    工具函数开始 ///////////////////////////////////////////////////
function getVersion() {
  return localStorage.getItem(PREFIX + '_version');
}
function setVersion(version) {
  localStorage.setItem(PREFIX + '_version', version);
}

function getSources() {
  return getFrom('_sources')
}
function setSources(sources) {
  setTo('_sources', sources);
}

function getEnabled() {
  return getFrom('_enabled');
}
function setEnabled(enabled) {
  setTo('_enabled', enabled);
}

function getFrom(name) {
  let str = localStorage.getItem(PREFIX + name);
  if (str) {
    return JSON.parse(str);
  } else {
    return str;
  }
}
function setTo(name, newValues) {
  if (newValues == null) {
    return;
  }
  if (typeof newValues == 'object') {
    localStorage.setItem(PREFIX + name, JSON.stringify(newValues));
  } else if (typeof newValues == 'string') {
    localStorage.setItem(PREFIX + name, newValues);
  }
}

function newSource(source) {
  _sources.push(source);
  setSources(_sources);
}
function deleteSource(url) {
  let deletedIndex = -1;
  for (var i = 0, len = _sources.length; i < len; i++) {
    if (_sources[i].url == url) {
      deletedIndex = i;
      _sources.splice(i, 1);
      i--;
      len--;
    }
  }
  setSources(_sources);
  if (~ deletedIndex) {
    for (var j = 0; j < _enabled.length; j++) {
      let tempJ = _enabled[j];
      if (tempJ >= deletedIndex) {
        _enabled[j] = tempJ - 1;
      };

    }
    setEnabled(_enabled);
  }
}
function updateSource(index, source) {
  _sources[index] = source;
  setSources(_sources);
}

//  工具函数结束 ///////////////////////////////////////////////////////// 得到一个随机的url

function getRandomURL() {
  return _sources[Math.floor(Math.random() * _enabled.length)].url
}

function getHitokoto(injected_handler) {

  try {
    return fetch(getRandomURL())
      .then(resp => resp.json())
      .then(json => {
        return json
      })
  } catch (e) {
    console.log('[API.hitokoto]:', e);
    if (/promise/i.test(e.message)) {
      console.log('不支持Promise');
      //load promise polyfill
      var s = document.createElement('script');
      s.onload = function () {
        if (injected_handler) {
          injected_handler();
          console.log('injected handler has been called')
        } else {
          alert('已经修复错误，请手动点击下一条')
        }
      }
      s.src = 'http://cdn.heitaov.cn/promise.min.js';
      document
        .body
        .appendChild(s);
    }
    var ret = {
      then: function () {
        return this;
      }, catch: function (func) {
        func(); //let the caller to handle the error
        return this;
      }
    }

    return ret
  }
}

export default ({
  'version' : _version,
  getSources : () => (_sources),
  newSource,
  deleteSource,
  updateSource,
  getHitokoto : getHitokoto
})