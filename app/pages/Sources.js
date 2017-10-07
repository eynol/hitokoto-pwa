import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import QueueAnim from 'rc-queue-anim';

import {GLOBAL_ANIMATE_TYPE} from '../configs'

import hitokotoDriver from '../API/hitokotoDriver'

import FullPageCard from '../component/FullPageCard'
import SourceDisplay from '../component/SourceDisplay'
import Modal from '../component/Modal';

class Sources extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sources: hitokotoDriver.patterManager.sources,
      update: undefined,
      newSource: undefined,
      deleteSourceModal: null
    }

    this.showNewSource = this.showNewSource.bind(this);
    this.handleNewSource = this.handleNewSource.bind(this);
    this.hideNewSource = this.hideNewSource.bind(this);

    this.showUpdate = this.showUpdate.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.hideUpdate = this.hideUpdate.bind(this);

    this.showDeleteModal = this.showDeleteModal.bind(this);
    this.hideDeleteModal = this.hideDeleteModal.bind(this);
    this.handleDeleteSource = this.handleDeleteSource.bind(this);
  }

  showNewSource() {
    this.setState({newSource: Date.now()})
  }
  handleNewSource(source, error) {
    if (source.adapter) {
      hitokotoDriver.testSourceAdapter(source.url, source.adapter).then(() => {
        hitokotoDriver.patterManager.newSource(source);
        this.setState({sources: hitokotoDriver.patterManager.sources, newSource: undefined})
      }).catch((e) => {
        if (typeof e == 'string') {
          alert(e);
        } else if (typeof e == 'object') {
          alert(e.message || e.err.message);
        }
      })

    } else {
      hitokotoDriver.patterManager.newSource(source);
      this.setState({newSource: undefined})
    }

  }
  hideNewSource() {
    this.setState({newSource: undefined})
  }
  showUpdate(id) {
    this.setState({update: id});
  }
  handleUpdate(source) {
    if (source.adapter) {
      hitokotoDriver.testSourceAdapter(source.url, source.adapter).then(() => {
        hitokotoDriver.patterManager.updateSource(source.id, source);
        this.setState({update: undefined})
      }).catch((e) => {
        if (typeof e == 'string') {
          alert(e);
        } else if (typeof e == 'object') {
          alert(e.message || e.err.message);
        }
      })

    } else {
      hitokotoDriver.patterManager.updateSource(source.id, source);
      this.setState({update: undefined})
    }
  }
  showDeleteModal(id) {
    this.setState({deleteSourceModal: id});
  }
  hideDeleteModal() {
    this.setState({deleteSourceModal: null});
  }
  handleDeleteSource() {
    let id = this.state.deleteSourceModal;

    hitokotoDriver.patterManager.deleteSource(id);
    this.hideDeleteModal();

  }
  hideUpdate() {
    this.setState({update: undefined});
  }

  render() {
    let lists = this.state.sources.map((source) => {
      return (
        <li key={source.id}>
          <p className="ellipsis">
            <button onClick={() => this.showUpdate(source.id)}>修改</button>
            <button className="color-red" onClick={() => this.showDeleteModal(source.id)}>删除</button>&nbsp; {source.name}
            - {source.url}</p>
        </li>
      )
    })

    let sourceDisplayC = null;
    if (this.state.update) {
      let sourceToUpdate = this.state.sources.find(source => {
        if (source.id == this.state.update) {
          return true;
        } else {
          return false;
        }
      })
      sourceDisplayC = (<SourceDisplay
        key={this.state.update}
        title='修改来源'
        sid={this.state.update}
        hook={{
        update: this.handleUpdate,
        hide: this.hideUpdate
      }}
        source={sourceToUpdate}/>)
    } else if (this.state.newSource) {
      sourceDisplayC = (<SourceDisplay
        key={this.state.newSource}
        title='添加来源'
        hook={{
        newSource: this.handleNewSource,
        hide: this.hideNewSource
      }}/>)
    }

    return [
      (
        <FullPageCard cardname="来源管理">
          <p>
            <i className="iconfont icon-tishi"></i>
            在这里添加其他域名下的hitokoto一言接口，然后在<Link to='/patterns'>模式管理</Link>中使用哦~</p>
          <div>
            <QueueAnim
              component="ul"
              type={GLOBAL_ANIMATE_TYPE}
              ease={['easeOutQuart', 'easeInOutQuart']}>
              {lists}
              <li key="new">
                <button
                  onClick={this.showNewSource}
                  style={{
                  float: 'right'
                }}>添加</button>
              </li>
            </QueueAnim>
          </div>
        </FullPageCard>
      ), (
        <QueueAnim type={['right', 'left']} ease={['easeOutQuart', 'easeInOutQuart']}>
          {sourceDisplayC}</QueueAnim>
      ), this.state.deleteSourceModal
        ? <Modal exit={this.hideDeleteModal}>
            <h1>你确定要删除该来源?</h1>
            <div className="clearfix">
              <span className="pull-right">
                <button role="exit">取消</button>
                <button onClick={this.handleDeleteSource}>确定</button>
              </span>
            </div>
          </Modal>
        : null
    ];
  }
}

export default withRouter(Sources);