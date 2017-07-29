import 'whatwg-fetch';

const URL = 'http://api.hitokoto.cn/';

export default function getHitokoto(injected_handler) {

  try {
    return fetch(URL)
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
