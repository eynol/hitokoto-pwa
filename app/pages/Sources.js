import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import QueueAnim from 'rc-queue-anim';

import {GLOBAL_ANIMATE_TYPE} from '../configs'

import hitokotoDriver from '../API/hitokotoDriver'

import {removeOneSource} from "../actions";
import store from '../store';

import FullPageCard from '../component/FullPageCard'
import SourceEditor from './SourceEditor'
import Modal from '../component/Modal';

const patterManager = hitokotoDriver.patterManager;

class Sources extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deleteSourceModal: null
    }

    this.showDeleteModal = this.showDeleteModal.bind(this);
    this.hideDeleteModal = this.hideDeleteModal.bind(this);
    this.handleDeleteSource = this.handleDeleteSource.bind(this);
  }

  showDeleteModal(id) {
    this.setState({deleteSourceModal: id});
  }
  hideDeleteModal() {
    this.setState({deleteSourceModal: null});
  }
  handleDeleteSource() {
    let id = this.state.deleteSourceModal;

    let source = hitokotoDriver.patterManager.deleteSource(id);
    store.dispatch(removeOneSource(source));
    this.hideDeleteModal();
    this.forceUpdate();
  }

  render() {
    let lists = patterManager.sources.map((source) => {
      return (
        <li key={source.id}>
          <div>
            <h4 className="ellipsis">{source.name}</h4>
            <p className="ellipsis txt-sm">
              <span >{source.url}</span>
            </p>
            <p className="acts">
              <button
                onClick={() => this.props.history.push(this.props.location.pathname + '/' + source.id + '/update')}>修改</button>
              <button
                className="color-red"
                onClick={(evt) => {
                this.showDeleteModal(source.id);
              }}>删除</button>
            </p>
          </div>
        </li>
      )
    })

    return (
      <FullPageCard cardname="来源管理">
        <p>
          <i className="iconfont icon-tishi"></i>
          在这里新增其他域名下的hitokoto一言接口，然后在「模式管理」中使用哦~
        </p>
        <div className="lum-list ">
          <ul>
            {lists}
            <li key="new">
              <div className="pointer">
                <h3
                  href="javascript:"
                  onClick={() => this.props.history.push(this.props.location.pathname + '/new')}>
                  <i className="iconfont icon-add"></i>&nbsp;新增
                </h3>
              </div>
            </li>
          </ul>
        </div>{this.state.deleteSourceModal
          ? <Modal exit={this.hideDeleteModal}>
              <h1>你确定要删除该来源?</h1>
              <div className="clearfix">
                <span className="pull-right">
                  <button role="exit">取消</button>
                  <button onClick={this.handleDeleteSource}>确定</button>
                </span>
              </div>
            </Modal>
          : null}
      </FullPageCard>
    );
  }
}

export default withRouter(Sources);