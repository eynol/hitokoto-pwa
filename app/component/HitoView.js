import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import QueueAnim from 'rc-queue-anim';
import hitokotoDriver from '../API/hitokotoDriver';

import {hitokoto} from './HitoView.css'
let httpManager = hitokotoDriver.httpManager;

class HitoView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: ''
    }
  }

  render() {

    let {newone, newHitokoto, data} = this.props;
    if (newone) {
      return (
        <div>
          <button onClick={newHitokoto}>添加hitokoto</button>
        </div>
      )
    } else {
      let hitokotoText = data.hitokoto,
        source = data.from,
        date = new Date(data.created_at);
      return (
        <div className={hitokoto}>
          <p>{hitokotoText}</p>
          <span>
            <p>{date.toLocaleString()}</p>
          </span>
          <span>—— {source}</span>
        </div>
      )
    }

  }
}
export default HitoView