import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Link, withRouter, Route} from 'react-router-dom';
import QueueAnim from 'rc-queue-anim';
import Textarea from 'react-textarea-autosize';

import httpManager from '../API/httpManager';
import hitokotoDriver from '../API/hitokotoDriver';
import indexedDBManager from '../API/IndexedDBManager';
import showNotification from '../API/showNotification';

import PublicHitokoto from '../component/PublicHitokoto'
import FullPageCard from '../component/FullPageCard'
import Loading from '../component/Loading'
import Modal from '../component/Modal'

class Review extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      modal: null,
      editing: null,
      inited: false,
      error: null
    }
    this.showNewModal = this.showNewModal.bind(this);
    this.showUpdateModal = this.showUpdateModal.bind(this);
    this.hideModal = this.hideModal.bind(this);

    this.confirmCreate = this.confirmCreate.bind(this);
    this.confirmUpdate = this.confirmUpdate.bind(this);
    this.removeBroadcast = this.removeBroadcast.bind(this);
  }
  componentWillMount() {
    this.getAllMessage();
  }
  getAllMessage() {

    this.setState({inited: false})
    httpManager.API_Admin_getBroadcasts().then(result => {
      this.setState({inited: true, error: null, messages: result.messages});
    }).catch(e => {
      showNotification('获取失败！' + e.message || e, 'error');
      this.setState({
        error: e.message || e || '获取句集内容失败！',
        inited: false
      });
    })
  }
  showNewModal() {
    let now = new Date(),
      yyyy = now.getFullYear(),
      MM = now.getMonth(),
      dd = now.getDate(),
      hh = now.getHours(),
      mm = now.getMinutes(),
      ss = now.getSeconds();

    this.setState({
      modal: 'new',
      editing: {
        endAt: yyyy + '/' + (MM + 1) + '/' + dd + ' ' + hh + ':' + mm + ':' + ss,
        message: ''
      }
    })
  }
  showUpdateModal(evt) {
    let index = evt.target.getAttribute('data-index');
    let message = this.state.messages[index];

    let end = new Date(message.endAt),
      yyyy = end.getFullYear(),
      MM = end.getMonth(),
      dd = end.getDate(),
      hh = end.getHours(),
      mm = end.getMinutes(),
      ss = end.getSeconds();

    this.setState({
      modal: 'update',
      editing: {
        index: index,
        _id: message._id,
        endAt: yyyy + '/' + (MM + 1) + '/' + dd + ' ' + hh + ':' + mm + ':' + ss,
        message: message.message
      }
    })
  }
  removeBroadcast(evt) {
    let index = evt.target.getAttribute('data-index');
    let message = this.state.messages[index];

    httpManager.API_Admin_deleteBroadcast({_id: message._id}).then(() => {
      this.setState(state => {
        state.messages.splice(index, 1);
        return state;
      })
    })
  }
  hideModal() {
    this.setState({modal: null})
  }
  confirmUpdate() {
    let message = this.textarea.value;
    let timeString = this.refs.time.value.trim();

    let match = /(\d{4})\/(\d+)\/(\d+) (\d+):(\d+):(\d+)/.exec(timeString);

    if (match) {
      let endAt = new Date(match[1], match[2] - 1, match[3], match[4], match[5], match[6]);
      httpManager.API_Admin_updateBroadcast({endAt, _id: this.state.editing._id, message}).then(res => {
        this.hideModal();
        this.setState(state => {
          let index = state.editing.index;
          state.messages.splice(index, 1, res.message);
          return state;
        })
      })
    } else {
      showNotification('参数不合法！\n' + timeString, 'error');
    }
  }
  confirmCreate() {
    let message = this.textarea.value;
    let timeString = this.refs.time.value.trim();

    let match = /(\d{4})\/(\d+)\/(\d+) (\d+):(\d+):(\d+)/.exec(timeString);

    if (match) {
      let endAt = new Date(match[1], match[2] - 1, match[3], match[4], match[5], match[6]);
      httpManager.API_Admin_putBroadcast({endAt, message}).then(res => {
        this.hideModal();
        this.setState(state => {
          state.messages.push(res.message);
          return state;
        })
      })
    } else {
      showNotification('参数不合法！\n' + timeString, 'error');
    }
  }
  render() {
    let messages = this.state.messages,
      ListToShow = null;
    if (this.state.inited) {
      if (messages.length == 0) {
        ListToShow = (
          <div key='empty' className='align-center'>
            <h1 className="color-red">没有要广播的消息！</h1>
            <p>这里什么都没有</p>
          </div>
        )
      } else {
        let passed = this.state.passed;
        ListToShow = messages.map((msg, index) => (
          <div key={msg.endAt + msg.message}>
            <blockquote>{msg.message}<br/>{new Date(msg.endAt).toLocaleString()}</blockquote>
            <div className="clearfix">
              <span className="pull-right">
                <button data-index={index} onClick={this.showUpdateModal}>修改</button>
                <button data-index={index} onClick={this.removeBroadcast}>删除</button>
              </span>
            </div>
            <hr/>
          </div>
        ))
      }
    }

    return (
      <FullPageCard
        cardname="通知公告"
        actions={[(
          <a
            key="newone-hito"
            href="javascript:"
            title="点击新增"
            onClick={this.showNewModal}
            data-text="新增">
            <i className="iconfont icon-add hide-pc"></i>
          </a>
        )]}>
        <QueueAnim
          ease='easeOutQuart'
          animConfig={[
          {
            opacity: [1, 0]
          }, {
            left: '0',
            right: '0',
            position: 'absolute',
            opacity: [1, 0]
          }
        ]}>
          {this.state.inited
            ? null
            : <Loading
              error={this.state.error}
              retry={() => {
              this.getNeedReviewHitokotos(this.state.current)
            }}
              key="loading"/>}
          <div className="view">{ListToShow}</div>
        </QueueAnim>
        {this.state.modal
          ? <Modal exit={this.hideModal}>
              <Textarea
                minRows={3}
                style={{
                height: '200px',
                maxHeight: 300
              }}
                inputRef={textarea => this.textarea = textarea}
                placeholder="请在此输入hitokoto"
                defaultValue={this.state.editing.message}/>
              <p><input type="text" ref="time" defaultValue={this.state.editing.endAt}/></p>
              <p className="clearfix">
                <span className="pull-right">
                  {this.state.modal == 'new'
                    ? <button onClick={this.confirmCreate}>新增</button>
                    : <button onClick={this.confirmUpdate}>修改</button>}
                </span>
              </p>
            </Modal>
          : null}
      </FullPageCard>
    )
  }
}
export default withRouter(Review)
