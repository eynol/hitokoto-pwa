import httpManager from '../API/httpManager'

///   Panel (login ,regist,layoutSetting);
export const PANEL_OPEN = 'panel open';
export const PANEL_HIDE = 'panel hide';
export const showPanel = (whichone) => ({type: PANEL_OPEN, value: whichone})
export const hidePanel = (whichone) => ({type: PANEL_HIDE, value: whichone})

///    User
//
//
export const USER_LOGIN = 'user login';
export const USER_LOGOUT = 'user logout';

export const USER_UPDATE_USERNICKNAME = 'update user nickname';

export const userLogin = (ret) => ({type: USER_LOGIN, value: ret})

export const userLogout = () => dispatch => {
  httpManager.updateToken(''); //清除tokon
  return Promise.resolve({type: USER_LOGOUT}).then(action => dispatch(action))
}
export const updateNickname = (nickname) => ({type: USER_UPDATE_USERNICKNAME, value: nickname})

///    Hitokoto
//
//

export const HITOKOTO_NEXT = 'hitokoto next';
export const HITOKOTO_PROCESSING = 'hitokoto processing';

export const hitokotoProcessing = () => ({type: HITOKOTO_PROCESSING})

export const hitokotoNext = () => dispatch => {
  return fetch(`http://www.reddit.com/r/joke.json`).then(response => {
    return response.json()
  }).then(json => dispatch(receivePosts(subreddit, json)))
};

export const LAYOUT_CHANGE = 'layout change';
export const changeLayout = (prop, value) => ({type: LAYOUT_CHANGE, prop, value})

export const COLLECTIONS_FETCHED_SUCCESS = 'collection fetched success'
export const COLLECTIONS_FETCHED_FAILED = 'collection fetched failed'
export const fetchCollectionSuccess = (collections) => ({type: COLLECTIONS_FETCHED_SUCCESS, value: collections})
export const fetchCollectionFailed = (reason) => ({type: COLLECTIONS_FETCHED_FAILED, value: reason})

export const LEAVE_COLLECTION = 'collection leave';
export const leaveCollection = () => ({type: LEAVE_COLLECTION, value: ''})

export const FETCH_COLLECTION_HITO_SUCCESS = 'hitokotos of collection'
export const fetchHitokotosSuccess = (hitokotos) => ({type: FETCH_COLLECTION_HITO_SUCCESS, value: hitokotos})

export const REFRESH_COLLECTION_HITO = 'refresh collection-hitokoto';
export const refreshHitokotoList = () => ({type: REFRESH_COLLECTION_HITO})

export const REFRESH_COLLECTION_HITO_DONE = 'refresh collection-hitokoto done'
export const refreshCollectionHitokotoSuccess = () => ({type: REFRESH_COLLECTION_HITO_DONE})

export const REMOVE_ONE_HITO_SUCCESS = 'hitokotos remove one success'
export const removeHitokotosSuccess = (_id) => ({type: REMOVE_ONE_HITO_SUCCESS, value: _id})

export const PREVIEW_HITOKOTO = 'preview hitokoto';
export const previewHitokoto = (hitokoto, type) => ({type: PREVIEW_HITOKOTO, value: hitokoto, ptype: type})

export const CLEAN_PREVIEW = 'clean preview';
export const cleanPreview = (type) => ({type: CLEAN_PREVIEW, ptype: type});
/**
 *  Notifications
 *
*/

export const SHOW_NOTIFICATION = 'show notification'
export const REMOVE_NOTIFICATION = 'remove notification'

/**
 * @param {String} type
 * @param {String} msg
 * @param {boolean} [interactive=false]
 */
export const sendNotification = (value, type = 'info', interactive = false, timeout = 3) => dispatch => {
  let id = Date.now();
  if (!interactive) {
    setTimeout(() => {
      dispatch(removeNotification(id));
    }, timeout * 1000);
  }
  dispatch({type: SHOW_NOTIFICATION, id, value, ntype: type, interactive});
}
export const removeNotification = (id) => ({type: REMOVE_NOTIFICATION, value: id})