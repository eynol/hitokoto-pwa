import React, {Component} from 'react'

import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import QueueAnim from 'rc-queue-anim';
import hitokotoDriver from '../API/hitokotoDriver';

import {hitokoto, time, actions} from './HitoView.css'

let httpManager = hitokotoDriver.httpManager;
import tranformDate from '../API/social-time-transform'

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
          <button onClick={newHitokoto}>新增一言</button>
          {this.props.children}
        </div>
      )
    } else {
      let hitokotoText = data.hitokoto,
        source = data.source;
      return (
        <div className={hitokoto}>

          <p>{hitokotoText}</p>
          <span>—— {source}</span>
          <span>
            <p className={time}>{tranformDate(new Date(data.created_at))}</p>
          </span>
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