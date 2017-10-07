import {SHOW_NOTIFICATION, REMOVE_NOTIFICATION} from '../actions'
import update from 'immutability-helper';

const notifications = (notifications = [], action) => {
  switch (action.type) {
    case SHOW_NOTIFICATION:
      return update(notifications, {
        $push: [
          {
            id: action.id,
            type: action.ntype,
            msg: action.value,
            interactive: action.interactive
          }
        ]
      });

    case REMOVE_NOTIFICATION:
      let index = notifications.findIndex(item => item.id == action.value);

      return update(notifications, {
        $splice: [
          [index, 1]
        ]
      })

    default:
      return notifications;
  }
};
export default notifications;