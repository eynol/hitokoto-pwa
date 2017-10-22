import React, {Component} from 'react';
import QueueAnim from 'rc-queue-anim';
import {connect} from 'react-redux';

import {Link} from 'react-router-dom';

import FullPageCard from '../component/FullPageCard'

import NotificationContainer from '../containers/Notification.Container'

import {ANIMATE_CONFIG_NEXT, GLOBAL_ANIMATE_TYPE} from '../configs'

class UserSpace extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    let permission = this.props.permission;

    return (
      <FullPageCard cardname="个人中心">
        <div className="lum-list">
          <ul>
            <li>
              <Link to="/managements/favorites">
                <h4>我的收藏</h4>
                <p>查看、导出、删除收藏的句子。数据存储在本地，如果清除缓存，可能会导致数据丢失。</p>
              </Link>
            </li>
            <li>
              <Link to="/myspace/collections">
                <h4>我的句集</h4>
                <p>查看所有的句集</p>
              </Link>
            </li>
            <li>
              <Link to="/managements/sources">
                <h4>来源管理</h4>
                <p>管理添加获取句子的URL</p>
              </Link>
            </li>
            <li>
              <Link to="/managements/patterns">
                <h4>模式管理</h4>
                <p>根据自己喜好选择来源形成模式</p>
              </Link>
            </li>
            <li>
              <Link to="/managements/sync">
                <h4>离线缓存</h4>
                <p>将来源的全部句子缓存到本地，离线时也可以使用</p>
              </Link>
            </li>
            <li>
              <Link to="/managements/cleaner">
                <h4>缓存清理</h4>
                <p>清理本地缓存，例如已经删除了的来源的遗留下的缓存</p>
              </Link>
            </li>
            <li>
              <Link to="/managements/backup">
                <h4>备份还原</h4>
                <p>备份本地的所有模式和来源到服务器上，或者从服务器上还原之前备份的数据。</p>
              </Link>
            </li>
            <li>
              <Link to="/myspace/profiles">
                <h4>账号设置</h4>
                <p>修改邮箱，修改密码</p>
              </Link>
            </li>
            {permission
              ? <li>
                  <Link to="/admin">
                    <h4>后台管理</h4>
                    <p>审核句子，发布广播</p>
                  </Link>
                </li>
              : null}
          </ul>
        </div>
      </FullPageCard>
    );
  }
}

const mapStateToProps = (state) => {
  return ({permission: state.user.permission})
}

export default connect(mapStateToProps)(UserSpace)
