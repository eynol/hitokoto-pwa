import indexedDBManager from './IndexedDBManager'
const TOKEN_NAME = 'hitokotoToken'

function $getLSToken() {
  return localStorage.getItem(TOKEN_NAME + 'localStored');
}
function $setLSToken(token) {
  localStorage.setItem(TOKEN_NAME + 'localStored', token);
}

const toString = Object.prototype.toString;
const isPlainObject = (obj) => {
  if (!obj || typeof obj !== "object" || obj.nodeType || (obj != null && obj == obj.window)) {
    return false;
  }

  try {
    if (obj.constructor && !Object.prototype.hasOwnProperty.call(obj, "constructor") && !Object.prototype.hasOwnProperty.call(obj.constructor.prototype, "isPrototypeOf")) {
      return false;
    }
  } catch (e) {
    return false;
  }

  var key;
  for (key in obj) {}
  return key === undefined || hasOwn.call(obj, key);
}
/**
 * 传入超时时间和一个promise.
 * 如果超过指定时间后，会返回一个Rejected的Promise。
 * @param {Number} ms
 * @param {Promise} promise
 * @returns {Promise}
 */
function timeoutPromise(ms, promise) {
  return new Promise((resolve, reject) => {
    let timeoutId = setTimeout(() => {
      timeoutId = undefined;
      reject(new Error("请求超时！"))
    }, ms);
    promise.then((res) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        resolve(res);
      }
    }, (err) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        reject(err);
      }
    });
  })
}

/**
 *
 *
 * @param {String} reason
 * @returns Promise
 */
function FETCHREJECT(reason) {
  return Promise.reject('请求失败：' + reason)
}

class HTTPManager {
  constructor() {

    this.initQ = []; //  暂存Promise未polyfill完成前的请求；
    this.token = $getLSToken() || '';
    //promise polyfill
    let _that = this;

    try {
      var p = Promise.resolve(2);

      _that.inited = true;
      _that.afterInited();
    } catch (e) {
      console.log('[API.hitokoto]:', e);
      if (/promise/i.test(e.message)) {
        console.log('不支持Promise');
        //load promise polyfill
        var s = document.createElement('script');
        s.onload = function () {
          _that.inited = true;
          _that.afterInited();
          console.log('injected handler has been called')
        }
        s.src = 'http://cdn.heitaov.cn/promise.min.js';
        document.body.appendChild(s);
      }

    }
  }
  parseToJSON(resp) {
    if (resp.status === 200) {
      try {
        return resp.json();
      } catch (e) {
        return Promise.reject(`转换成JSON格式失败！\n ${resp.status} - ${resp.statusText}`)
      }
    } else {
      console.log(resp);
      return Promise.reject(`${resp.status} - ${resp.statusText}`)
    }
  }
  updateToken(token) {
    this.token = token;
    $setLSToken(token);
  }
  afterInited() {
    while (this.initQ.length) {
      let walker = this.initQ.shift();
      if (walker) {
        walker();
      }
    }
  }

  getHitokoto(url) {
    let _that = this;

    if (this.inited) {
      return timeoutPromise(13000, fetch(url)).then(this.parseToJSON).catch(FETCHREJECT)
    } else {

      let chain = []; // store then and catch functions;
      let ret = {
        then: function (func) {
          chain.push({t: true, f: func}); // store as then function
          return this;
        }, catch: function (func) {
          func('Working on Promise Polyfill ...')
          chain.push({t: false, f: func}); //store as catch function
          return this;
        }
      }
      let walker = function () {
        let req = fetch(url).then(resp => resp.json());
        while (chain.length) {
          let atempt = chain.shift();
          if (atempt.t) {
            req = req.then(atempt.f);
          } else {
            req = req.catch(atempt.f);
          }
        }
        chain = null;
      }
      this.initQ.push(walker); //

      return ret
    }
  }
  _buildPrams(prefix, obj, traditional, add) {
    // jQeury._buildPrams v1.7.2
    if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        if (traditional || /\[\]$/.test(prefix)) {
          add(prefix, item);
        } else {
          this._buildPrams(prefix + "[" + (typeof item === "object"
            ? index
            : "") + "]", item, traditional, add);
        }
      })
    } else if (!traditional && typeof obj === 'object') {
      for (var name in obj) {
        this._buildPrams(prefix + "[" + name + "]", obj[name], traditional, add);
      }
    } else {
      add(prefix, obj);
    }
  }
  parseQeuery(obj = {}, traditional = false) {
    // jQeury.prams v1.7.2
    let ret = [],
      add = (key, value) => {
        ret.push(encodeURIComponent(key) + '=' + encodeURIComponent(value))
      };

    if (Array.isArray(obj) && isPlainObject(obj)) {
      obj.forEach((item, index) => {
        add(index, item);
      });
    } else {
      for (var prefix in obj) {
        this._buildPrams(prefix, obj[prefix], traditional, add);
      }
    }

    return ret.join('&').replace(/%20/g, '+');
  }

  /**
   *  将data对象处理成formdata对象
   *
   * @param {String} prefix
   * @param {Object} obj
   * @param {String} phpStyle
   * @param {Function} add
   * @memberof HTTPManager
   */
  _buildFormParams(prefix, obj, phpStyle, add) {
    //  主要处理数组，fileList file 类型。

    if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        if (phpStyle) {
          add(prefix + '[]', item);
        } else {
          this._buildFormParams(prefix, item, phpStyle, add);
        }
      })
    } else if (!phpStyle && typeof obj === 'object' && !obj.length) {
      //不是数组，是对象
      for (var name in obj) {
        this._buildFormParams(prefix + "[" + name + "]", obj[name], phpStyle, add);
      }
    } else if (toString.call(obj) === '[object FileList]') {
      for (var i = 0; i < obj.length; i++) {
        if (phpStyle) {
          add(prefix + '[]', obj[i])
        } else {
          add(prefix, obj[i])
        }
      }
    } else {
      add(prefix, obj);
    }
  }
  parseFormData(obj, phpStyle = false) {
    //  暂不支持二维数组
    console.log(obj);
    if (!obj) {
      return void 0;
    }
    if (toString.call(obj) === '[object FormData]') {
      return obj;
    }
    let form = new FormData();
    let add = (key, value) => {
      if (~ ['number', 'string', 'boolean'].indexOf(typeof value)) {
        form.append(key, String(value));

      } else if (~ (['[object Blob]', '[object File]'].indexOf(toString.call(obj)))) {
        form.append(key, value, value.name || '' + Date.now())

      } else {
        form.append(key, value);
      }
    };

    for (var prefix in obj) {
      this._buildFormParams(prefix, obj[prefix], phpStyle, add);
    }
    return form;
  }
  /**
   *
   *
   * @param {String} method
   * @param {String} url
   * @param {Object} data
   * @returns
   * @memberof HTTPManager
   */
  fetchJSON(method, url, data) {
    let _query,
      _body;

    method = method.toLowerCase();
    if (~ ['get', 'head'].indexOf(method)) {
      _query = this.parseQeuery(data);
    } else if (~ ['post', 'put', 'delete'].indexOf(method)) {
      _body = this.parseFormData(data);

    }
    return fetch(url + (_query
      ? '?' + _query
      : ''), {
      method: method,
      body: _body
    }).then(this.parseToJSON).catch(FETCHREJECT)
  }
  fetchAuthJSON(method, url, data) {
    let _query,
      _body;

    method = method.toLowerCase();
    if (~ ['get', 'head'].indexOf(method)) {
      _query = this.parseQeuery(data);
    } else if (~ ['post', 'put', 'delete'].indexOf(method)) {
      _body = this.parseFormData(data);
      console.log('getbody');
      console.log(_body.keys().next());

    }
    return fetch(url + (_query
      ? '?' + _query
      : ''), {
      method: method,
      body: _body,
      headers: {
        'X-API-TOKEN': this.token
      }
    }).then(this.parseToJSON).catch(FETCHREJECT)
  }

  //   Without Auth Token
  API_login(formData) {
    return this.fetchJSON('post', '/api/login', formData)
  }
  API_regist(formData) {
    return this.fetchJSON('post', '/api/regist', formData)
  }
  API_getAllPublicHitokotos(page = 1, perpage = 20) {
    return this.fetchJSON('get', '/api/explore', {page, perpage})
  }

  //  Need Auth Token
  API_updatePassword(oldpass, newpass) {
    return this.fetchAuthJSON('post', '/api/password', {oldpass, newpass})
  }
  API_getUserEmail() {
    return this.fetchAuthJSON('get', '/api/useremail')
  }
  API_sendOldEmailCode() {
    return this.fetchAuthJSON('get', '/api/oldemailcode')
  }
  API_verifyOldEmailCode(code) {
    return this.fetchAuthJSON('post', '/api/oldemailcode', {code})
  }
  API_sendNewEmailCode(email) {
    return this.fetchAuthJSON('get', '/api/newemailcode', {email})
  }
  API_verifyNewEmailCode(email, code) {
    return this.fetchAuthJSON('post', '/api/newemailcode', {email, code})
  }

  API_myCollections() {
    return this.fetchAuthJSON('get', '/api/collections')
  }
  API_newCollection(formData) {
    return this.fetchAuthJSON('put', '/api/collections', formData)
  }
  API_updateCollectionName(formData) {
    return this.fetchAuthJSON('post', '/api/collections', formData)
  }
  API_deleteCollection(formData) {
    return this.fetchAuthJSON('delete', '/api/collections', formData)
  }

  API_viewCollection(name) {
    return this.fetchAuthJSON('get', '/api/collections/' + name)
  }

  API_newHitokoto(name, formData) {
    return this.fetchAuthJSON('put', '/api/collections/' + name, formData)
  }
  API_updateHitokoto(name, formData) {
    return this.fetchAuthJSON('post', '/api/collections/' + name, formData)
  }
  API_deleteHitokoto(name, formData) {
    return this.fetchAuthJSON('delete', '/api/collections/' + name, formData)
  }

}

export default new HTTPManager();