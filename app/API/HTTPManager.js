const TOKEN_NAME = 'hitokotoToken'

function $getLSToken() {
  return localStorage.getItem(TOKEN_NAME + 'localStored');
}
function $setLSToken(token) {
  localStorage.setItem(TOKEN_NAME + 'localStored', token);
}

function timeoutPromise(ms, promise) {
  return new Promise((resolve, reject) => {
    let timeoutId = setTimeout(() => {
      timeoutId = undefined;
      reject(new Error("promise timeout"))
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

export default class HTTPManager {
  constructor() {

    this.initQ = []; //  暂存Promise未polyfill完成前的请求；
    this.token = $getLSToken() || '';
    //promise polyfill
    let _that = this;

    try {
      var p = Promise.resolve(2);
      console.log(p.then);
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
        document
          .body
          .appendChild(s);
      }

    }
  }
  updateToken(token) {
    this.token = token;
    $setLSToken(token);
  }
  afterInited() {
    while (this.initQ.length) {
      let walker = this
        .initQ
        .shift();
      if (walker) {
        walker();
      }
    }
  }

  request(url) {
    let _that = this;

    if (this.inited) {
      return timeoutPromise(10000, fetch(url)).then(resp => resp.json())
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
      this
        .initQ
        .push(walker); //

      return ret
    }
  }
  AUTH_requst() {}

  API_login(formData) {
    return fetch('/api/login', {
        method: 'POST',
        body: formData
      })
      .then(resp => resp.json())
      .catch(e => Promise.reject('请求出错：' + e))
  }
  API_regist(formData) {
    return fetch('/api/regist', {
        method: 'POST',
        body: formData
      })
      .then(resp => resp.json())
      .catch(e => Promise.reject('请求出错：' + e))
  }
}