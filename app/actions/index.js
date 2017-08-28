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