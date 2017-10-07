import React, {Component} from 'react';
import {connect} from 'react-redux'
import {sendNotification, removeNotification} from '../actions'

import NotificationContainer from '../component/Notification.Container'

const mapStoreToProps = (state) => {
  return ({notifications: state.notify})
}
const mapActionToProps = (dispatch) => ({
  sendNotification: (...d) => dispatch(sendNotification(...d)),
  removeNotification: (id) => dispatch(removeNotification(id))
})
export default connect(mapStoreToProps, mapActionToProps)(NotificationContainer)