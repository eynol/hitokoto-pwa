import httpManager from '../API/httpManager'

export const UPDATE_LAYOUT = 'update layout'
export const UPDATE_NICKNAME = 'update nickname'

export const changeLayout = (prop, value) => ({type: UPDATE_LAYOUT, prop, value})

///    User
//
//
export const USER_LOGIN = 'user login';
export const USER_LOGOUT = 'user logout';

export const USER_UPDATE_USERNICKNAME = 'update user nickname';

export const userLogin = (ret) => ({type: USER_LOGIN, value: ret})

export const userLogout = () => ({type: USER_LOGOUT})
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