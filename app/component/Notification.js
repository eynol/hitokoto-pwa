import React from 'react';
import {
  NWrapper,
  notification,
  info,
  success,
  error,
  content,
  actions
} from './Notification.css';

const getClass = (type) => {
  switch (type) {
    case 'info':
      return info;
    case 'success':
      return success;
    case 'error':
      return error;
    default:
      return info;
  }
}
export default({data, remove}) => {
  let action = data.interactive
    ? <div className={actions} onClick={() => remove(data.id)}>
        <i className="iconfont icon-roundclose icon-paceholder"></i>
      </div>
    : <div className={actions}>
      <i className="iconfont icon-loading-anim icon-paceholder"></i>
    </div>;

  let icon;
  switch (data.type) {

    case 'success':
      icon = (
        <div className="pull-left">
          <i className="iconfont icon-check icon-paceholder"></i>
        </div>
      );
      break;
    case 'error':
      icon = (
        <div className="pull-left">
          <i className="iconfont icon-error-message icon-paceholder"></i>
        </div>
      );
      break;
    case 'info':
    default:
      icon = (
        <div className="pull-left">
          <i className="iconfont icon-info icon-paceholder"></i>
        </div>
      );
      break;
  }

  let detail = data.detail
    ? (
      <div>详情</div>
    )
    : null;

  return [(
      <div
        key={data.id}
        className={NWrapper}
        onClick={data.interactive
        ? null
        : () => remove(data.id)}>
        <div className={notification + ' clearfix ' + getClass(data.type)}>
          {action}
          {icon}
          <div className={content}>
            <span>{data.msg}</span>
            {detail}
          </div>
        </div>
      </div>
    ), (<br key={'br' + data.id}/>)]
}
