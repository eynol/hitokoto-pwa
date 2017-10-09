import React, {Component} from 'react';
import QueueAnim from 'rc-queue-anim';
import {Link, withRouter} from 'react-router-dom';

import hitokotoDriver from '../API/hitokotoDriver';

import FullPageCard from '../component/FullPageCard'
import PatternDisplay from '../component/PatternDisplay'
import Modal from '../component/Modal';

import {GLOBAL_ANIMATE_TYPE} from '../configs'

class Patterns extends Component {
  constructor(props) {
    super(props);
    this.state = {
      patterns: hitokotoDriver.patterManager.patterns,
      update: undefined,
      newPattern: undefined,
      deletePaternModal: null
    }

    this.showUpdate = this.showUpdate.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.hideUpdate = this.hideUpdate.bind(this);

    this.showDeleteModal = this.showDeleteModal.bind(this);
    this.hideDeleteModal = this.hideDeleteModal.bind(this);
    this.handleDelete = this.handleDelete.bind(this);

    this.showNewPattern = this.showNewPattern.bind(this);
    this.hideNewPattern = this.hideNewPattern.bind(this);
    this.handleNewPattern = this.handleNewPattern.bind(this);

  }
  showUpdate(id) {
    this.setState({update: id});
  }
  handleUpdate(id, pattern) {
    hitokotoDriver.updatePattern(id, pattern);
    this.hideUpdate();
    this.setState({pattern: this.state.patterns})
  }
  hideUpdate() {
    this.setState({update: undefined})
  }
  showDeleteModal(id) {
    this.setState({deletePaternModal: id});
  }
  hideDeleteModal() {
    this.setState({deletePaternModal: null});
  }
  handleDelete() {
    let id = this.state.deletePaternModal;
    hitokotoDriver.patterManager.deletePattern(id);
    this.hideUpdate();
    this.hideDeleteModal();
  }
  showNewPattern() {
    this.setState({newPattern: Date.now()});
  }
  hideNewPattern() {
    this.setState({newPattern: undefined});
  }
  handleNewPattern(pattern) {
    hitokotoDriver.patterManager.newPattern(pattern);
    this.hideNewPattern();
    this.setState({
      pattern: JSON.parse(JSON.stringify(hitokotoDriver.patterManager.patterns))
    });

  }

  render() {

    let lists = this.state.patterns.map((pattern) => {
      return (
        <li key={pattern.id}>
          <p className="ellipsis">
            <button onClick={() => this.showUpdate(pattern.id)}>修改</button>
            <button className="color-red" onClick={() => this.showDeleteModal(pattern.id)}>删除</button>&nbsp;{pattern.name}{pattern.default
              ? '（默认）'
              : ''}<br/>

          </p>
        </li>
      )
    })

    let patternDisplay = null;
    if (this.state.update) {
      let patternToUpdate = this.state.patterns.find((p) => {
        if (p.id == this.state.update) {
          return true;
        } else {
          return false;
        }
      })

      patternDisplay = (<PatternDisplay
        pattern={patternToUpdate}
        title="修改模式"
        key={this.state.update}
        sources={hitokotoDriver.patterManager.sources}
        hook={{
        hide: this.hideUpdate,
        update: this.handleUpdate
      }}/>)
    } else if (this.state.newPattern) {
      patternDisplay = (<PatternDisplay
        title="新增模式"
        sources={hitokotoDriver.patterManager.sources}
        key={this.state.newPattern}
        hook={{
        hide: this.hideNewPattern,
        newPattern: this.handleNewPattern
      }}/>)
    }
    let {location, path} = this.props;
    return [
      (
        <FullPageCard cardname="模式管理">
          <QueueAnim
            component="ul"
            type={GLOBAL_ANIMATE_TYPE}
            ease={['easeOutQuart', 'easeInOutQuart']}>
            {lists}
            <li key="new">
              <button
                onClick={this.showNewPattern}
                style={{
                float: 'right'
              }}>新增</button>
            </li>
          </QueueAnim>
        </FullPageCard>
      ), (
        <QueueAnim type={GLOBAL_ANIMATE_TYPE} ease={['easeOutQuart', 'easeInOutQuart']}>{patternDisplay}</QueueAnim>
      ), this.state.deletePaternModal
        ? <Modal exit={this.hideDeleteModal}>
            <h1>你确定要删除该模式?</h1>
            <div className="clearfix">
              <span className="pull-right">
                <button role="exit">取消</button>
                <button onClick={this.handleDelete}>确定</button>
              </span>
            </div>
          </Modal>
        : null
    ]

  }
}

export default withRouter(Patterns);