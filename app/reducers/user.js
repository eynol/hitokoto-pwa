import update from 'immutability-helper';
import {USER_LOGIN, USER_LOGOUT, USER_UPDATE_USERNICKNAME} from '../actions'
const user = (user = $getUser(), action) => {
  switch (action.type) {
    case USER_LOGIN:
      {
        let ret = action.value,
          nextUser = update(user, {
            $set: {
              nickname: ret.nickname,
              token: ret.token
            }
          });
        $setUser(nextUser);
        return nextUser;

      }

    case USER_LOGOUT:
      {
        $setUser({nickname: '', token: ''})
        return {nickname: '', token: ''}
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
