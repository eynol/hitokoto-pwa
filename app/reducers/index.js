import {combineReducers} from 'redux'
import layout from './layout'
import user from './user'
import panel from './panel'
import collections from './collections'
import notify from './notify'

let hitokotoApp = combineReducers({panel, user, layout, collections, notify})
// hitokotoApp = layout
export default hitokotoApp;