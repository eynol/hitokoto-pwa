import React, {Component} from 'react';

import QueueAnim from 'rc-queue-anim';
import {contianer} from './Notification.css';

import Notification from './Notification';

class GlobalNotificationContainer extends Component {
  constructor(props) {
    super(props);
    this.showError = this.showError.bind(this);
  }
  showError(evt) {
    console.log(evt);
    this.props.sendNotification('运行错误！\n未捕获的全局错误\n' + evt.error.stack, 'error', true)
  }
  componentWillMount() {
    window.addEventListener('error', this.showError)
  }
  componentWillUnmount() {
    window.removeEventListener('error', this.showError)
  }
  render() {
    let {notifications, removeNotification} = this.props;
    return (
      <QueueAnim className={contianer}>{notifications.map(noti => (<Notification data={noti} key={noti.id} remove={removeNotification}/>))}</QueueAnim>
    )
  }
}

export default GlobalNotificationContainer;