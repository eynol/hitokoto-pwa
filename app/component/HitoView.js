import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import QueueAnim from 'rc-queue-anim';

import hitokotoDriver from '../API/hitokotoDriver';
import tranformDate from '../API/social-time-transform'

import {hitokoto, time, actions, hitoSource} from './HitoView.css'

let httpManager = hitokotoDriver.httpManager;

class HitoView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: ''
    }
  }

  render() {

    let {
      newone,
      newHitokoto,
      data,
      update,
      remove,
      preview,
      viewonly
    } = this.props;
    if (newone) {
      return (
        <div>
          <button onClick={newHitokoto}>新增一言</button>
          {this.props.children}
        </div>
      )
    } else if (viewonly) {
      let hitokotoText = data.hitokoto,
        author = data.author,
        source = data.source;
      return (
        <div className={hitokoto}>
          <p className={time}>发布于&nbsp;&nbsp;{tranformDate(new Date(data.created_at))}</p>
          <p>{hitokotoText}</p>
          <span className={hitoSource}>—— {author
              ? author + ' '
              : ''}{source}</span>
          <div className={actions}>
            <button onClick={() => {
              preview(data);
            }}>预览</button>
            <button onClick={() => {
              update(data);
            }}>喜欢</button>
            <button onClick={() => {
              update(data);
            }}>收藏</button>

          </div>
        </div>
      )
    } else {
      let hitokotoText = data.hitokoto,
        author = data.author,
        source = data.source;
      return (
        <div className={hitokoto}>
          <p className={time}>发布于&nbsp;&nbsp;{tranformDate(new Date(data.created_at))}</p>
          <p>{hitokotoText}</p>
          <span className={hitoSource}>—— {author
              ? author + ' '
              : ''}{source}</span>
          <div className={actions}>
            <button onClick={() => {
              preview(data);
            }}>预览</button>
            <button onClick={() => {
              update(data);
            }}>修改</button>
            <button
              onClick={() => {
              remove(data)
            }}
              className="color-red">删除</button>
          </div>
        </div>
      )
    }

  }
}
HitoView.propTypes = {
  preview: PropTypes.func,
  update: PropTypes.func,
  remove: PropTypes.func
}
export default HitoView