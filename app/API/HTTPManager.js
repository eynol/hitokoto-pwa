import indexedDBManager from './IndexedDBManager'
const TOKEN_NAME = 'hitokotoToken'

function $getLSToken() {
  return localStorage.getItem(TOKEN_NAME + 'localStored');
}
function $setLSToken(token) {
  localStorage.setItem(TOKEN_NAME + 'localStored', token);
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
      return resp.json();
    } else {
      console.log(resp);
      return Promise.reject('请求出错！')
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
      return timeoutPromise(13000, fetch(url)).then(this.parseToJSON).catch(e => {
        console.log(e)
        return Promise.reject('请求出错！' + e)
      })
    } else {

      let chain = []; // store then and catch functions;
      let ret = {
        then: function (func) {
          chain.push({t: true, f: func}); // store as then function
          return this;
        }, catch: function (func) {
          chain.push({t: false, f: func}); //store as catch function
          return this;
        }
      }
      let walker = function () {
        let req = fetch(url).then(resp => resp.json());
        while (chain.length) {
          let atempt = chain.shift();
          if (atempt.t) {
            req.then(atempt.f);
          } else {
            req.catch(atempt.f);
          }
        }
        chain = null;
      }
      this.initQ.push(walker); //

      return ret
    }
  }
  AUTH_requst() {}

  API_login(formData) {
    return fetch('/api/login', {
      method: 'POST',
      body: formData
    }).then(this.parseToJSON).catch(e => Promise.reject('请求出错：' + e))
  }
  API_regist(formData) {
    return fetch('/api/regist', {
      method: 'POST',
      body: formData
    }).then(this.parseToJSON).catch(e => Promise.reject('请求出错：' + e))
  }

  API_myCollections() {
    return fetch('/api/collections', {
      method: 'get',
      headers: {
        'X-API-TOKEN': this.token
      }
    }).then(this.parseToJSON).catch(e => Promise.reject('请求出错：' + e))
  }
  API_newCollection(formData) {
    return fetch('/api/collections', {
      method: 'put',
      headers: {
        'X-API-TOKEN': this.token
      },
      body: formData
    }).then(this.parseToJSON).catch(e => Promise.reject('请求出错：' + e))
  }
  API_updateCollectionName(formData) {
    return fetch('/api/collections', {
      method: 'post',
      headers: {
        'X-API-TOKEN': this.token
      },
      body: formData
    }).then(this.parseToJSON).catch(e => Promise.reject('请求出错：' + e))
  }
  API_deleteCollection(formData) {
    return fetch('/api/collections', {
      method: 'delete',
      headers: {
        'X-API-TOKEN': this.token
      },
      body: formData
    }).then(this.parseToJSON).catch(e => Promise.reject('请求出错：' + e))
  }
  API_viewCollection(name) {
    return fetch('/api/collections/' + name, {
      method: 'get',
      headers: {
        'X-API-TOKEN': this.token
      }
    }).then(this.parseToJSON).catch(e => Promise.reject('请求出错：' + e))
  }

  API_newHitokoto(name, formData) {
    return fetch('/api/collections/' + name, {
      method: 'put',
      headers: {
        'X-API-TOKEN': this.token
      },
      body: formData
    }).then(this.parseToJSON).catch(e => Promise.reject('请求出错：' + e))
  }
}

export default new HTTPManager();