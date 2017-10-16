import store from '../store';
import {updateTask, removeTask} from '../actions'
export default class Task {
  constructor() {
    this.id = '' + new Date().getTime() + Math.random();
  }
  update(info) {
    store.dispatch(updateTask(this.id, info));
  }
  success(info) {
    store.dispatch(updateTask(this.id, info, true));

  }
  failed(info) {
    store.dispatch(updateTask(this.id, info, false));
  }
  remove() {
    store.dispatch(removeTask(this.id));
  }
}