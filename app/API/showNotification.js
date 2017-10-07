import store from '../store';
import {sendNotification} from '../actions'

export default(...d) => store.dispatch(sendNotification(...d));