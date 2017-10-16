import {SHOW_NOTIFICATION, REMOVE_NOTIFICATION, UPDATE_TASK, REMOVE_TASK} from '../actions'
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

    case UPDATE_TASK:
      let t_index = notifications.findIndex(item => item.id == action.id);
      let t_type = action.done === undefined
        ? 'task'
        : (action.done === true
          ? 'success'
          : 'error');

      if (~ t_index) {
        //找到了 就替换，
        return update(notifications, {
          $splice: [
            [
              t_index,
              1, {
                id: action.id,
                type: t_type,
                msg: action.value,
                interactive: true
              }
            ]
          ]
        })
      } else {
        //没有找到，就推入
        return update(notifications, {
          $push: [
            {
              id: action.id,
              type: t_type,
              msg: action.value,
              interactive: true
            }
          ]
        })
      }

    case REMOVE_TASK:
      let task_to_remove = notifications.findIndex(item => item.id == action.value);
      return update(notifications, {
        $splice: [
          [task_to_remove, 1]
        ]
      })

    default:
      return notifications;
  }
};
export default notifications;