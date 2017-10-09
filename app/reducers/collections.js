import update from 'immutability-helper';
import {
  COLLECTIONS_FETCHED_FAILED,
  COLLECTIONS_FETCHED_SUCCESS,
  ENTER_COLLECTION,
  LEAVE_COLLECTION,
  FETCH_COLLECTION_HITO_SUCCESS,
  REFRESH_COLLECTION_HITO,
  REFRESH_COLLECTION_HITO_DONE,
  REMOVE_ONE_HITO_SUCCESS,
  PREVIEW_HITOKOTO,
  CLEAN_PREVIEW
} from '../actions'

const DEFAULT_COLLECTIONS = {
  data: [],
  hitokotos: [],
  needRefreshHikotokos: false,
  within: null,
  preview: null
}

const collectionReducer = (collections = DEFAULT_COLLECTIONS, action) => {
  switch (action.type) {
    case COLLECTIONS_FETCHED_SUCCESS:
      return update(collections, {
        data: {
          $set: action.value
        }
      });

    case LEAVE_COLLECTION:
      return update(collections, {
        hitokotos: {
          $set: []
        }
      })
    case REFRESH_COLLECTION_HITO:
      return update(collections, {
        needRefreshHikotokos: {
          $set: true
        }
      })
    case REFRESH_COLLECTION_HITO_DONE:
      return update(collections, {
        needRefreshHikotokos: {
          $set: false
        }
      })
    case FETCH_COLLECTION_HITO_SUCCESS:
      return update(collections, {
        hitokotos: {
          $set: action.value
        }
      })

    case REMOVE_ONE_HITO_SUCCESS:
      let index = collections.hitokotos.findIndex(item => item._id === action.value);
      if (~ index) {
        return update(collections, {
          hitokotos: {
            $splice: [
              [index, 1]
            ]
          }
        })
      } else {
        return collections
      }
    case PREVIEW_HITOKOTO:
      return update(collections, {
        [action.ptype]: {
          $set: action.value
        }
      })

    case CLEAN_PREVIEW:
      return update(collections, {
        [action.ptype]: {
          $set: null
        }
      })
    default:
      return collections;
  }
}
export default collectionReducer
