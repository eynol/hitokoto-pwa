import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import showNotification from '../API/showNotification';
import hitokotoDriver from '../API/hitokotoDriver';

const patterManager = hitokotoDriver.patterManager;

import Modal from '../component/Modal';

import {patternsList, active} from './PatternHelperModal.css';

class PatternHelperModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activeList: null,
      alldown: null
    }
  }
  componentWillReceiveProps(nextProps) {
    let {sourceNew, sourceRemove} = nextProps,
      url,
      activeList;

    if (sourceNew || sourceRemove) {
      //
      url = (sourceNew && sourceNew.url) || (sourceRemove && sourceRemove.url);
      //找到在移除前激活的来源;
      activeList = patterManager.patterns.map((pattern, index) => {
        if (~ pattern.sources.findIndex(src => src.url == url)) {
          //这个模式有这个来源
          return true;
        } else {
          return false;
        }
      });
      let alldown = false;
      if (sourceRemove) {
        alldown = activeList.every(v => v == false);
      }

      this.setState({activeList, alldown});
    } else {
      //清空state
      this.setState({activeList: null});
    }
  }

  handleClick(index) {
    let {sourceNew, sourceRemove} = this.props,
      url = (sourceNew && sourceNew.url) || (sourceRemove && sourceRemove.url),
      pattern = patterManager.patterns[index];;

    if (this.state.activeList[index]) {
      /*
      激活状态，需要从模式中移除该句集。 这里合并了sourceNew 和sourceRemove的两种情况
      在sourceRemove存在的状况下 ，能够触发点击事件的只能是在activeList中为true,而不能
      从false变为true，这里合并了这个情况到
      */
      if (pattern.sources.length == 1) {
        showNotification('该模式只有一个来源，请在「模式管理」中移除。', 'error');
      } else {
        // 模式中有多个来源
        let tobeDelete = pattern.sources.findIndex(src => src.url == url); //找到索引
        pattern.sources.splice(tobeDelete, 1); //删除
        hitokotoDriver.updatePattern(pattern.id, JSON.parse(JSON.stringify(pattern))); //修改操作
        this.setState({
          activeList: this.state.activeList.map((bool, i) => i == index
            ? false
            : bool)
        }) //更新组件state

      }
    } else {
      //未激活状态，需要将该来源加入模式中,只能是在删除来源的状态中
      let _src = JSON.parse(JSON.stringify(sourceNew));
      _src.online = true;
      _src.local = true;
      pattern.sources.push(_src);
      //加入了模式；
      hitokotoDriver.updatePattern(pattern.id, JSON.parse(JSON.stringify(pattern))); //修改操作
      this.setState({
        activeList: this.state.activeList.map((bool, i) => i == index
          ? true
          : bool)
      }) //更新组件state
    }
  }
  render() {
    let {sourceNew, sourceRemove} = this.props,
      activeList = this.state.activeList;

    if (sourceNew) {
      return (
        <Modal focus exit={this.props.newOneSourceDone}>
          <h3>{sourceNew.name}
            加入来源成功!</h3>
          <p>是否将「{sourceNew.name}」在下列模式中激活？(点击激活)</p>
          <hr/>
          <div>
            <ul className={patternsList}>
              {patterManager.patterns.map((pattern, i) => (
                <li
                  className={activeList[i]
                  ? active
                  : ''}
                  key={pattern.id}
                  onClick={() => this.handleClick(i)}>{pattern.name}</li>
              ))}
            </ul>
          </div>
          <hr/>
          <div className="clearfix">
            <button>
              <Link role="exit" to="/managements/patterns/new">添加模式</Link>
            </button>
            <span className="pull-right">
              <button className="color-basic" role="exit">以后再说</button>
              <button role="exit">确定</button>
            </span>
          </div>
        </Modal>
      )
    } else if (sourceRemove) {

      if (this.state.alldown) {
        return (
          <Modal exit={this.props.removeOneSourceDone}>
            <h3>从来源移除「{sourceRemove.name}」成功!</h3>
            <div className="clearfix">
              <span className="pull-right">
                <button role="exit">确定</button>
              </span>
            </div>
          </Modal>
        )
      }
      return (
        <Modal focus exit={this.props.removeOneSourceDone}>
          <h3>「{sourceRemove.name}」移除成功!</h3>
          <p>是否将「{sourceRemove.name}」从下列模式中移除？(点击移除)</p>
          <hr/>
          <div>
            <ul className={patternsList}>
              {patterManager.patterns.map((pattern, i) => (
                <li
                  className={activeList[i]
                  ? active
                  : 'disabled'}
                  key={pattern.id}
                  onClick={() => this.handleClick(i)}>{pattern.name}</li>
              ))}
            </ul>
          </div>
          <hr/>
          <div className="clearfix">
            <span className="pull-right">
              <button className="color-basic" role="exit">以后再说</button>
              <button role="exit">确定</button>
            </span>
          </div>
        </Modal>
      )
    } else {
      return null;
    }
  }
}

export default PatternHelperModal;