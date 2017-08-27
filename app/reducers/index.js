import {combineReducers} from 'redux'
import layout from './layout'
import user from './user'
import hitokotoDisplay from './hitokotoDisplay'

let hitokotoApp = combineReducers({hitokotoDisplay, user, layout})
// hitokotoApp = layout
export default hitokotoApp;