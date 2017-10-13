import React, {Component} from 'react'
import {Link, withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import {connect} from 'react-redux'

import showNotification from '../API/showNotification';
import hitokotoDriver from '../API/hitokotoDriver'
const patterManager = hitokotoDriver.patterManager;

import style from './CollectionBox.css'

let {
  'Card--change': cardChange,
  hide,
  newone,
  Card,
  Card_options,
  Card_content
} = style;

import {newOneSource, removeOneSource} from '../actions'
const mapStoreToProps = (state) => ({nickname: state.user.nickname})
const mapActionToProps = (dispatch) => ({
  newSource: (source) => dispatch(newOneSource(source)),
  removeSource: (source) => dispatch(removeOneSource(source))
})
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

    this.addToSources = this.addToSources.bind(this);
    this.removeFromSources = this.removeFromSources.bind(this);

  }
  handleViewClick() {
    this.props.view(this.props.data.name);
  }
  handleChangeClick(e) {
    showNotification('重命名后，原来的添加的来源将无法使用！需要重新添加来源！', 'error', true)
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

  removeFromSources(evt) {
    evt.stopPropagation();
    let {
        nickname,
        ownerName,
        data: {
          name: colleName,
          owner,
          _id
        },
        isPublic
      } = this.props,
      result;

    if (isPublic && ownerName != nickname) {
      result = patterManager.removeSourceWithUsernameAndCol(nickname, colleName, true);
    } else {
      result = patterManager.removeSourceWithUsernameAndCol(owner, _id, false);
    }
    if (this.props.removeSource) {
      this.props.removeSource(result);
    } else {
      showNotification('将「' + colleName + '」从来源中删除成功！', 'info', false, 4);
    }
    this.forceUpdate();
  }
  addToSources(evt) {
    evt.stopPropagation();
    let {
        nickname,
        ownerName,
        data: {
          name: colleName,
          owner,
          _id
        },
        isPublic
      } = this.props,
      result;

    if (isPublic && ownerName != nickname) {
      result = patterManager.newSourceWithUsernameAndCol(ownerName, colleName, true);
    } else {
      result = patterManager.newSourceWithUsernameAndCol(nickname, colleName, false, owner, _id);
    }
    if (this.props.newSource) {
      this.props.newSource(result);
    } else {
      showNotification('将「' + colleName + '」加入来源成功！\n该来源可以获取「公开」和「私密」的所有句子。', 'success');
    }
    this.forceUpdate();
  }

  isSourcesContians() {
    let {
        nickname,
        ownerName,
        data: {
          name: colleName,
          owner,
          _id
        },
        isPublic
      } = this.props,
      url;

    if (isPublic && ownerName != nickname) {
      url = patterManager.getUrlOfUserCol(ownerName, colleName, true);
    } else {
      url = patterManager.getUrlOfUserCol(owner, _id, false);
    }
    return patterManager.isSourceExsit(url);
  }
  render() {
    let {
        tabIndex,
        view,
        data: {
          name,
          count,
          owner,
          _id
        },
        'newone': pnewone,
        isPublic
      } = this.props,
      currentState = this.state.status;

    if (isPublic) {
      return (
        <div
          tabIndex={tabIndex}
          className={Card}
          title="点击查看该句集"
          onClick={this.handleViewClick}>
          <div className={Card_content}>
            <p className="ellipsis">{name}</p>
            <span>{count}条</span>
            <div className={Card_options}>{this.isSourcesContians()
                ? <a
                    tabIndex={tabIndex}
                    href="javascript:"
                    title="点击删除该句集"
                    onClick={this.removeFromSources}>撤销来源</a>
                : <a
                  tabIndex={tabIndex}
                  href="javascript:"
                  title="点击删除该句集"
                  onClick={this.addToSources}>加入来源</a>}&nbsp;
            </div>
          </div>
        </div>
      )
    }

    if (pnewone && currentState == 'normal') {
      return (
        <div
          tabIndex={1}
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
              <a href="javascript:" onClick={this.newOne} tabIndex={tabIndex}>新增</a>&nbsp;
              <a href="javascript:" onClick={this.returnToNormal} tabIndex={tabIndex}>取消</a>
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
            <div className={Card_options}>{this.isSourcesContians()
                ? <a
                    tabIndex={tabIndex}
                    href="javascript:"
                    title="点击删除该句集"
                    onClick={this.removeFromSources}>撤销来源</a>
                : <a
                  tabIndex={tabIndex}
                  href="javascript:"
                  title="点击删除该句集"
                  onClick={this.addToSources}>加入来源</a>}&nbsp;
              <a
                tabIndex={tabIndex}
                href="javascript:"
                title="点击修改该句集名称"
                className={name == '默认句集'
                ? 'hide color-red'
                : 'color-red'}
                onClick={this.handleChangeClick}>重命名</a>&nbsp;
              <a
                tabIndex={tabIndex}
                href="javascript:"
                title="点击删除该句集"
                className={name == '默认句集'
                ? 'hide color-red'
                : 'color-red'}
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
CollectionBox.propTypes = {
  nickname: PropTypes.string.isRequired
}
export default connect(mapStoreToProps, mapActionToProps)(CollectionBox)