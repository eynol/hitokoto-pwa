import React, {Component} from 'react'
import {Link, withRouter} from 'react-router-dom';
import showNotification from '../API/showNotification';

import style from './CollectionBox.css'

let {
  'Card--change': cardChange,
  hide,
  newone,
  Card,
  Card_options,
  Card_content
} = style;

/****
 * 显示一个句集的盒子，有显示(normal) 修改(change) 新增按钮()新增(newone)四个状态
 */
class CollectionBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 'normal'
    };
    this.handleViewClick = this.handleViewClick.bind(this);
    this.handleChangeClick = this.handleChangeClick.bind(this);
    this.doChange = this.doChange.bind(this);
    this.doDelete = this.doDelete.bind(this);
    this.handleChangeKeyPress = this.handleChangeKeyPress.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleNewOneClick = this.handleNewOneClick.bind(this);
    this.newOne = this.newOne.bind(this);
    this.returnToNormal = this.returnToNormal.bind(this);
  }
  handleViewClick() {
    this.props.view(this.props.data.name);
  }
  handleChangeClick(e) {
    if (this.props.data.name == '默认句集') {
      showNotification('默认句集无法修改！', 'error')
      return;
    }
    this.setState({status: 'change'});
    e.stopPropagation()
  }
  handleNewOneClick(e) {
    this.setState({status: 'newone'})
    e.stopPropagation()
  }
  newOne() {
    let name = this.refs.name.value.trim();
    if (name == '默认句集') {
      showNotification('无法命名为默认句集无法修改！', 'error')
      return;
    }
    this.props.newCollection(name).then(() => {
      this.refs.name.value = '';
      this.setState({status: 'normal'})
    })
  }
  doChange() {
    let name = this.refs.name.value.trim(),
      oldName = this.props.data.name;
    if (oldName == '默认句集') {
      showNotification('默认句集无法修改！', 'error')
      return;
    }
    if (name == oldName) {
      showNotification('两次名称相等！无法修改', 'error')
    } else {
      this.props.changeName(oldName, name);
    }
  }
  doDelete(e) {
    let oldName = this.props.data.name;
    if (oldName == '默认句集') {
      showNotification('默认句集无法删除！', 'error')
      return;
    }
    this.props.delete(oldName);
    e.stopPropagation()
  }
  returnToNormal() {
    this.setState({status: 'normal'})
  }
  handleKeyPress(event) {
    if (event.key.toLowerCase() == 'enter') {
      this.newOne();
    }
  }
  handleChangeKeyPress(event) {
    if (event.key.toLowerCase() == 'enter') {
      this.doChange();
    }
  }
  render() {
    let {
        tabIndex,
        view,
        data: {
          name,
          count
        },
        'newone': pnewone,
        viewonly
      } = this.props,
      currentState = this.state.status;

    if (viewonly) {
      return (
        <div
          tabIndex={tabIndex}
          className={Card}
          title="点击查看该句集"
          onClick={this.handleViewClick}>
          <div className={Card_content}>
            <p className="ellipsis">{name}</p>
            <span>{count}条</span>
            <div className={Card_options}>
              {this.props.children}
            </div>
          </div>
        </div>
      )
    }

    if (pnewone && currentState == 'normal') {
      return (
        <div
          tabIndex={tabIndex}
          className={Card}
          title="点击新增句集"
          onClick={this.handleNewOneClick}>
          <div className={Card_content}>
            <span className={newone}>
              <i className="iconfont icon-add"></i>
            </span>
          </div>
        </div>
      )
    }
    if (currentState == 'newone') {
      return (
        <div className={Card + ' ' + cardChange} tabIndex={tabIndex}>
          <div className={Card_content}>
            <div className="text-filed">
              <input
                type="text"
                required
                ref='name'
                onKeyPress={this.handleKeyPress}
                tabIndex={tabIndex}/>
              <label data-content="句集的名称">句集的名称</label>
            </div>
            <div className={Card_options}>
              <a href="javascript:" onClick={this.newOne} tabIndex={0}>新增</a>&nbsp;
              <a href="javascript:" onClick={this.returnToNormal} tabIndex={0}>取消</a>
            </div>
          </div>
        </div>
      )
    } else if (currentState == 'normal') {

      return (
        <div
          tabIndex={tabIndex}
          className={Card}
          title="点击查看该句集"
          onClick={this.handleViewClick}>
          <div className={Card_content}>
            <p className="ellipsis">{name}</p>
            <span>{count}条</span>
            <div
              className={Card_options + (name == '默认句集'
              ? ' ' + hide
              : '')}>
              <a
                tabIndex={tabIndex}
                href="javascript:"
                title="点击修改该句集名称"
                onClick={this.handleChangeClick}>重命名</a>&nbsp;
              <a
                tabIndex={tabIndex}
                href="javascript:"
                title="点击删除该句集"
                className="color-red"
                onClick={this.doDelete}>删除</a>
            </div>
          </div>
        </div>
      )
    } else if (currentState == 'change') {
      return (
        <div className={Card + ' ' + cardChange} tabIndex={tabIndex}>
          <div className={Card_content}>
            <div className="text-filed">
              <input
                type="text"
                required
                ref='name'
                defaultValue={name}
                onKeyPress={this.handleChangeKeyPress}/>
              <label data-content="句集的名称">句集的名称</label>
            </div>
            <div className={Card_options}>
              <a href="javascript:" onClick={this.doChange} tabIndex={0}>确认修改</a>&nbsp;
              <a href="javascript:" onClick={this.returnToNormal} tabIndex={0}>取消</a>
            </div>
          </div>
        </div>
      )
    }
  }
}
export default CollectionBox