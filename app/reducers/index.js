import {combineReducers} from 'redux'
import layout from './layout'
import user from './user'
import panel from './panel'

let hitokotoApp = combineReducers({panel, user, layout})
// hitokotoApp = layout
export default hitokotoApp;