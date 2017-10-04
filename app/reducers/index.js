import {combineReducers} from 'redux'
import layout from './layout'
import user from './user'
import panel from './panel'
import collections from './collections'

let hitokotoApp = combineReducers({panel, user, layout, collections})
// hitokotoApp = layout
export default hitokotoApp;