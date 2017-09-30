import update from 'immutability-helper';
import {
  COLLECTIONS_FETCHED_FAILED,
  COLLECTIONS_FETCHED_SUCCESS,
  ENTER_COLLECTION,
  LEAVE_COLLECTION,
  FETCH_COLLECTION_HITO_SUCCESS,
  REMOVE_ONE_HITO_SUCCESS
} from '../actions'

const DEFAULT_COLLECTIONS = {
  inited: false,
  data: [],
  hitokotos: [],
  editing: {}
}

const collection = (collections = DEFAULT_COLLECTIONS, action) => {
  switch (action.type) {
    case COLLECTIONS_FETCHED_SUCCESS:
      return update(collections, {
        inited: {
          $set: true
        },
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

    default:
      return collections;
  }
}
export default collection
