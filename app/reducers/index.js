import {combineReducers} from 'redux'
import layout from './layout'
import user from './user'
import panel from './panel'
import collections from './collections'
import notify from './notify'
import sources from './sources'

let hitokotoApp = combineReducers({
  panel,
  user,
  layout,
  collections,
  notify,
  sources
})
// hitokotoApp = layout
export default hitokotoApp;