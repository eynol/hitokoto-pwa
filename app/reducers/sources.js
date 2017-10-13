import {SOURCES_NEW_ONE, SOURCES_NEW_ONE_DONE, SOURCES_REMOVE_ONE, SOURCES_REMOVE_ONE_DONE} from '../actions'
import update from 'immutability-helper';

const sourceReducer = (sources = {}, action) => {
  switch (action.type) {
    case SOURCES_NEW_ONE:
      return update(sources, {
        sourceNew: {
          $set: action.value
        }
      });

    case SOURCES_NEW_ONE_DONE:
      return update(sources, {
        sourceNew: {
          $set: null
        }
      });

    case SOURCES_REMOVE_ONE:
      return update(sources, {
        sourceRemove: {
          $set: action.value
        }
      });
    case SOURCES_REMOVE_ONE_DONE:
      return update(sources, {
        sourceRemove: {
          $set: null
        }
      })
    default:
      return sources;
  }
};
export default sourceReducer;