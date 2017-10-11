import React, {Component} from 'react';
import QueueAnim from 'rc-queue-anim';
import {Link, withRouter} from 'react-router-dom';

import hitokotoDriver from '../API/hitokotoDriver';

import FullPageCard from '../component/FullPageCard'

import Modal from '../component/Modal';

import {GLOBAL_ANIMATE_TYPE} from '../configs'

const patterManager = hitokotoDriver.patterManager;

class Patterns extends Component {
  constructor(props) {
    super(props);
    this.state = {
      patterns: patterManager.patterns,
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
  showUpdate(id) {}
  handleUpdate(id, pattern) {

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
    this.forceUpdate();
  }
  showNewPattern() {}
  hideNewPattern() {}
  handleNewPattern(pattern) {
    hitokotoDriver.patterManager.newPattern(pattern);
    this.hideNewPattern();
    this.setState({
      patterns: JSON.parse(JSON.stringify(hitokotoDriver.patterManager.patterns))
    });

  }

  render() {
    let {history, location} = this.props;

    let lists = patterManager.patterns.map((pattern) => {
      return (
        <li key={pattern.id}>
          <p className="ellipsis">
            <button
              onClick={() => history.push(location.pathname + '/' + pattern.id + '/update')}>修改</button>
            <button className="color-red" onClick={() => this.showDeleteModal(pattern.id)}>删除</button>&nbsp;{pattern.name}{pattern.default
              ? '（默认）'
              : ''}<br/>

          </p>
        </li>
      )
    })

    return (
      <FullPageCard cardname="模式管理">
        <QueueAnim
          component="ul"
          type={GLOBAL_ANIMATE_TYPE}
          ease={['easeOutQuart', 'easeInOutQuart']}>
          {lists}
          <li key="new">
            <button
              onClick={() => history.push(location.pathname + '/new')}
              style={{
              float: 'right'
            }}>新增</button>
          </li>
        </QueueAnim>{this.state.deletePaternModal
          ? <Modal exit={this.hideDeleteModal}>
              <h1>你确定要删除该模式?</h1>
              <div className="clearfix">
                <span className="pull-right">
                  <button role="exit">取消</button>
                  <button onClick={this.handleDelete}>确定</button>
                </span>
              </div>
            </Modal>
          : null}
      </FullPageCard>
    )
  }
}

export default withRouter(Patterns);