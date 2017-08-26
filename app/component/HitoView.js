import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import QueueAnim from 'rc-queue-anim';
import hitokotoDriver from '../API/hitokotoDriver';

let httpMangaer = hitokotoDriver.httpManager;

import FullPageCard from '../component/FullPageCard'

import {Card, Card_options, Card_content} from '../pages/HitoCollection.css'
import {menu} from '../pages/Home.css'
import style from '../pages/UI.css'
let {
  ellipsis,
  manageBox,
  clearfix,
  'close-button': closeButton,
  icon,
  close,
  back,
  backButton
} = style

class HitoView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: ''
    }
  }

  render() {
    console.log(this.props)

    let {newone, newHitokoto, data} = this.props;
    if (newone) {
      return (
        <div>
          <button onClick={newHitokoto}>添加hitokoto</button>
        </div>
      )
    } else {
      let hitokoto = data.hitokoto,
        source = data.from,
        date = new Date(data.created_at);
      console.log(data);
      return (
        <div>
          <span>
            <p>{date.toLocaleString()}</p>
          </span>
          <p>{hitokoto}</p>
          <span>—— {source}</span>
        </div>
      )
    }

  }
}
export default HitoView