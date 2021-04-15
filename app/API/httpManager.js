import broadcastManager from './broadcastManager';
import indexedDBManager from './IndexedDBManager';
import showNotification from '../API/showNotification';

import { userLogout } from '../actions';
import store from '../store';

const TOKEN_NAME = 'hitokotoToken'

function $getLSToken() {
  return localStorage.getItem(TOKEN_NAME + 'localStored');
}
function $setLSToken(token) {
  localStorage.setItem(TOKEN_NAME + 'localStored', token);
}

const toString = Object.prototype.toString;

const GET_HITOKOTO_PRIVATE_URL = new RegExp('^' + location.protocol + '//' + location.host + '/api/sources/[^/]+/[^/]+');
export const SAME_ORIGIN = new RegExp('^' + location.protocol + '//' + location.host);

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
  return key === undefined || Object.prototype.hasOwnProperty.call.call(obj, key);
}
/**
 * 传入超时时间和一个promise.
 * 如果超过指定时间后，会返回一个Rejected的Promise。
 * @param {Number} ms
 * @param {Promise} promise
 * @returns {Promise}
 */
export function timeoutPromise(ms, promise) {
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
function NOTIFY_ERROR(reason) {
  console.log(reason);
  console.warn(reason);
  if (typeof reason == 'string') {
    showNotification(reason, 'error', true);
  } else if (typeof reason == 'object' && reason.message) {
    if (/Failed to fetch/m.test(reason.message)) {
      showNotification(`请求未发送成功！
      可能的原因:
      1.您的网络异常
      2.服务器未上线
  
      详细:${reason.stack}`, 'error', true)
    } else {
      showNotification(reason.message, 'error', true)
    }
  } else {
    showNotification('请求出错，错误：' + JSON.stringify(reason), 'error', true)
  }
  return Promise.reject(reason);
}

class HTTPManager {
  constructor() {

    this.initQ = []; //  暂存Promise未polyfill完成前的请求；
    this.token = $getLSToken() || '';
    this.responseHeaderResolver = this.responseHeaderResolver.bind(this);
  }
  /**
   *
   *
   * @param {Response} resp
   * @returns
   * @memberof HTTPManager
   */
  responseHeaderResolver(res) {
    //处理紧急消息的逻辑
    if (process.env.NODE_ENV !== 'production') {
      console.log(res)
    }

    if (SAME_ORIGIN.test(res.url)) {
      //  读取头部信息
      let raw_message = res.headers.get('broadcast');
      if (raw_message) {
        //如果有消息；
        let broadcasts = raw_message.split('|').map(t => t.replace(/"/gm, ''));
        let getMessage = broadcasts.some(d => !broadcastManager.hasDisplayed(d))
        if (getMessage) {
          this.API_Admin_getBroadcasts().then(res => {
            let messages = res.messages;
            if (messages && messages.length) {
              messages.forEach(msg => {
                if (!broadcastManager.hasDisplayed(msg.endAt)) {
                  broadcastManager.add(msg.endAt);
                  showNotification(msg.message, 'info', true);
                }
              })
            }
          })
        }
      }
    }

    return res;
  }
  /**
   *
   *
   * @param {Response} res
   * @returns
   * @memberof HTTPManager
   */
  parseToJSON(res) {
    console.log('enter parseToJSON')
    if (res.status === 200) {
      return res.json();
    } else {
      return res.clone().json().catch(wrong => {
        console.log(wrong);

        if (typeof wrong == 'string') {
          console.log(wrong);

          if (/^Uncaught SyntaxError/.test(wrong)) {
            console.log(wrong);
            return Promise.reject(wrong);
          } else {
            return Promise.reject(wrong);
          }
        } else if (typeof wrong == 'object') {
          if (wrong instanceof SyntaxError) {
            let syntaxMessage = wrong.message;
            return res.clone().text().catch(wrong => {
              console.log(wrong);
              return Promise.reject(wrong);
            }).then(text => {
              text = text.trim();
              if (text.length == 0) {
                return Promise.reject(`${res.status}-${res.statusText}\n尝试转换为JSON，错误：${syntaxMessage}\n尝试转换为文本，文本长度为0.`);
              } else {

                console.log(text);
                return Promise.reject(text);
              }
            });
            console.log('syntaxError');
          } else if (wrong instanceof TypeError) {

            return Promise.reject('请求失败：' + wrong.message)

          } else {
            return Promise.reject(wrong);
          }

        }

        return Promise.reject(`${res.status} - ${res.statusText}`)

      }).then(json => {
        // 转换为json字符串成功
        if (typeof json == 'string') {
          console.log(json);
          return Promise.reject(json);
        } else if (typeof json == 'object') {

          let message = json.message;
          if (message == '授权过期，请重新登录') {
            //重新登录;
            store.dispatch(userLogout());
            alert('授权已过期，需要重新登录');
            window.location = '/';
          }
          return Promise.reject(message);
        } else {

          return Promise.reject(json);
        }
      })
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

  getHitokoto(url, type, source) {
    let _that = this;

    //  判断next
    if (type == 'next') {
      let query = this.parseQeuery({
        seed: source.count
      });

      if (/\?/.test(url)) {
        //不可能为0
        url += '&' + query;
      } else {
        url += '?' + query;
      }
    }
    if (GET_HITOKOTO_PRIVATE_URL.test(url)) {
      return timeoutPromise(13000, fetch(url, {
        headers: {
          'X-API-TOKEN': this.token
        }
      })).then(this.responseHeaderResolver).then(this.parseToJSON)
    } else {
      return timeoutPromise(13000, fetch(url)).then(this.responseHeaderResolver).then(this.parseToJSON)
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
    } else if (!phpStyle && typeof obj === 'object' && !obj.length && isPlainObject(obj)) {
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
      if (~['number', 'string', 'boolean'].indexOf(typeof value)) {
        form.append(key, String(value));

      } else if (~(['[object Blob]', '[object File]'].indexOf(toString.call(obj)))) {
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
    if (~['get', 'head'].indexOf(method)) {
      _query = this.parseQeuery(data);
    } else if (~['post', 'put', 'delete'].indexOf(method)) {
      _body = this.parseFormData(data);

    }
    return fetch(url + (_query
        ? '?' + _query
        : ''), {
        method: method,
        body: _body
      }).then(this.responseHeaderResolver).then(this.parseToJSON).catch(NOTIFY_ERROR)
  }
  fetchAuthJSON(method, url, data) {
    let _query,
      _body;

    method = method.toLowerCase();
    if (~['get', 'head'].indexOf(method)) {
      _query = this.parseQeuery(data);
    } else if (~['post', 'put', 'delete'].indexOf(method)) {
      _body = this.parseFormData(data);
    }
    return fetch(url + (_query
        ? '?' + _query
        : ''), {
        method: method,
        body: _body,
        headers: {
          'X-API-TOKEN': this.token
        }
      }).then(this.responseHeaderResolver).then(this.parseToJSON).catch(NOTIFY_ERROR)
  }
  API_sync(url, data) {
    if (!data) {
      data = ({})
    }
    if (!data.sync) {
      data.sync = true;
    }

    let query = this.parseQeuery(data);

    if (/\?/.test(url)) {
      //不可能为0
      url += '&' + query;
    } else {
      url += '?' + query;
    }

    if (GET_HITOKOTO_PRIVATE_URL.test(url)) {
      return fetch(url, {
        headers: {
          'X-API-TOKEN': this.token
        }
      }).then(this.responseHeaderResolver).then(this.parseToJSON).catch(NOTIFY_ERROR)
    } else {
      return fetch(url).then(this.responseHeaderResolver).then(this.parseToJSON).catch(NOTIFY_ERROR)
    }
  }
  //   Without Auth Token
  API_login(formData) {
    return this.fetchJSON('post', '/api/login', formData)
  }
  API_regist(formData) {
    return this.fetchJSON('post', '/api/regist', formData)
  }
  API_getAllPublicHitokotos(page = 1, perpage = 20) {
    return this.fetchJSON('get', '/api/explore', {
      page,
      perpage
    })
  }
  API_getPublicUserDetail(uid) {
    return this.fetchJSON('get', '/api/explore/users/' + uid)
  }
  API_getPublicUserHitokotos(uid, collection, page, perpage) {
    return this.fetchJSON('get', '/api/explore/users/' + uid + '/' + collection, {
      page,
      perpage
    })
  }

  //  Need Auth Token
  API_updatePassword(oldpass, newpass) {
    return this.fetchAuthJSON('post', '/api/password', {
      oldpass,
      newpass
    })
  }
  API_getUserEmail() {
    return this.fetchAuthJSON('get', '/api/useremail')
  }
  API_sendOldEmailCode() {
    return this.fetchAuthJSON('get', '/api/oldemailcode')
  }
  API_verifyOldEmailCode(code) {
    return this.fetchAuthJSON('post', '/api/oldemailcode', {
      code
    })
  }
  API_sendNewEmailCode(email) {
    return this.fetchAuthJSON('get', '/api/newemailcode', {
      email
    })
  }
  API_verifyNewEmailCode(email, code) {
    return this.fetchAuthJSON('post', '/api/newemailcode', {
      email,
      code
    })
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

  API_viewCollection(name, page, perpage) {
    return this.fetchAuthJSON('get', '/api/collections/' + name, {
      page,
      perpage
    })
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
  API_backup(formData) {
    return this.fetchAuthJSON('post', '/api/backups', formData)
  }
  API_restore() {
    return this.fetchAuthJSON('get', '/api/backups')
  }

  //Admin API
  API_Admin_getNeedReviewHitokotos(page, perpage) {
    return this.fetchAuthJSON('get', '/api/admin/hitokotos/review', {
      page,
      perpage
    })
  }
  API_Admin_changeHitokotoState(hid, state) {
    return this.fetchAuthJSON('post', '/api/admin/hitokotos/review', {
      hid,
      state
    })
  }
  //broadcast
  API_Admin_putBroadcast(data) {
    return this.fetchAuthJSON('put', '/api/admin/broadcasts', data)
  }
  API_Admin_updateBroadcast(data) {
    return this.fetchAuthJSON('post', '/api/admin/broadcasts', data)
  }
  API_Admin_deleteBroadcast(data) {
    return this.fetchAuthJSON('delete', '/api/admin/broadcasts', data)
  }
  API_Admin_getBroadcasts() {
    return this.fetchAuthJSON('get', '/api/admin/broadcasts')
  }

}

export default new HTTPManager();