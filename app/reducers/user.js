import update from 'immutability-helper';
import httpManager from '../API/httpManager'
import {USER_LOGIN, USER_LOGOUT, USER_UPDATE_USERNICKNAME} from '../actions'
const user = (user = $getUser(), action) => {
  switch (action.type) {
    case USER_LOGIN:
      {
        let ret = action.value,
          nextUser = update(user, {
            $set: {
              nickname: ret.nickname,
              token: ret.token,
              uid: ret.uid
            }
          });
        $setUser(nextUser);
        httpManager.updateToken(ret.token)
        return nextUser;
      }

    case USER_LOGOUT:
      {
        $setUser({nickname: '', token: '', uid: ''})
        httpManager.updateToken('')
        return {nickname: '', token: '', uid: ''}
      }

    case USER_UPDATE_USERNICKNAME:
    default:
      return user
  }
}

export default user;

const LS_USER = 'ls_user';
function $getUser() {
  let string = localStorage.getItem(LS_USER);
  if (!string) {
    return {};
  }
  return JSON.parse(string);
}
function $setUser(user) {
  localStorage.setItem(LS_USER, JSON.stringify(user));
}
