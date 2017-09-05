import React, {Component} from 'react'
import {Link, withRouter} from 'react-router-dom';

import {Card, Card_options, Card_content, default as style} from '../pages/HitoCollection.css'
import {menu} from '../pages/Home.css'
import {ellipsis} from '../pages/UI.css'
import TextFiledCss from '../component/TextFiled.css'

let {'text-filed': textFiled} = TextFiledCss;
let {'Card--change': cardChange, hide, newone} = style;

/****
 * 显示一个句集的盒子，有显示(normal) 修改(change) 新增按钮()新增(newone)四个状态
 */
class CollectionBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 'normal'
    }
  }
  handleViewClick() {
    this.props.view(this.props.data.name);
  }
  handleChangeClick(e) {
    if (this.props.data.name == '默认句集') {
      setTimeout(() => {
        alert('默认句集无法修改！')
      }, 4)
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
      setTimeout(() => {
        alert('无法命名为默认句集无法修改！')
      }, 4)
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
      setTimeout(() => {
        alert('默认句集无法修改！')
      }, 4)
      return;
    }
    if (name == oldName) {
      alert('两次名称相等！无法修改');
    } else {

      this.props.changeName(oldName, name);
    }
  }
  doDelete(e) {
    let oldName = this.props.data.name;
    if (oldName == '默认句集') {
      setTimeout(() => {
        alert('默认句集无法修改！')
      }, 4)
      return;
    }
    if (confirm('是否删除该句集？\n删除后，将会把该集合中所有的Hitokoto转入默认句集中')) {
      this.props.delete(oldName);
    }
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
          count,
          'default': defaultcol
        },
        'newone': pnewone
      } = this.props,
      currentState = this.state.status;

    if (pnewone && currentState == 'normal') {
      return (
        <div
          tabIndex={tabIndex}
          className={Card}
          title="点击新增句集"
          onClick={this.handleNewOneClick.bind(this)}>
          <div className={Card_content}>
            <span className={newone}>+</span>
          </div>
        </div>
      )
    }
    if (currentState == 'newone') {
      return (
        <div className={Card + ' ' + cardChange} tabIndex={tabIndex}>
          <div className={Card_content}>
            <div className={textFiled}>
              <input
                type="text"
                required
                ref='name'
                onKeyPress={this.handleKeyPress.bind(this)}
                tabIndex={tabIndex}/>
              <label data-content="句集的名称">句集的名称</label>
            </div>
            <div className={menu + ' ' + Card_options}>
              <a href="javascript:" onClick={this.newOne.bind(this)} tabIndex={0}>确认添加</a>&nbsp;
              <a href="javascript:" onClick={this.returnToNormal.bind(this)} tabIndex={0}>取消</a>
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
          onClick={this.handleViewClick.bind(this)}>
          <div className={Card_content}>
            <p className={ellipsis}>{name}</p>
            <span>{count}条</span>
            <div
              className={menu + ' ' + Card_options + (name == '默认句集'
              ? ' ' + hide
              : '')}>
              <a
                tabIndex={tabIndex}
                href="javascript:"
                title="点击修改该句集名称"
                onClick={this.handleChangeClick.bind(this)}>修改</a>&nbsp;
              <a
                tabIndex={tabIndex}
                href="javascript:"
                title="点击删除该句集"
                onClick={this.doDelete.bind(this)}>删除</a>
            </div>
          </div>
        </div>
      )
    } else if (currentState == 'change') {
      return (
        <div className={Card + ' ' + cardChange} tabIndex={tabIndex}>
          <div className={Card_content}>
            <div className={textFiled}>
              <input
                type="text"
                required
                ref='name'
                defaultValue={name}
                onKeyPress={this.handleChangeKeyPress.bind(this)}/>
              <label data-content="句集的名称">句集的名称</label>
            </div>
            <div className={menu + ' ' + Card_options}>
              <a href="javascript:" onClick={this.doChange.bind(this)} tabIndex={0}>确认修改</a>&nbsp;
              <a href="javascript:" onClick={this.returnToNormal.bind(this)} tabIndex={0}>取消</a>
            </div>
          </div>
        </div>
      )
    }
  }
}
export default CollectionBox