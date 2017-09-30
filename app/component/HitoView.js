import React, {Component} from 'react'

import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import QueueAnim from 'rc-queue-anim';
import hitokotoDriver from '../API/hitokotoDriver';

import {hitokoto, time, actions} from './HitoView.css'
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
      preview
    } = this.props;
    if (newone) {
      return (
        <div>
          <button onClick={newHitokoto}>添加hitokoto</button>
          {this.props.children}
        </div>
      )
    } else {
      let hitokotoText = data.hitokoto,
        source = data.from,
        date = new Date(data.created_at);
      return (
        <div className={hitokoto}>
          <span>
            <p className={time}>{date.toLocaleString()}</p>
          </span>
          <p>{hitokotoText}</p>
          <span>—— {source}</span>
          <div className={actions}>
            <button onClick={() => {
              preview(data);
            }}>预览</button>
            <button onClick={() => {
              update(data);
            }}>修改</button>
            <button onClick={() => {
              remove(data)
            }}>删除</button>
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