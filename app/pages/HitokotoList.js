import React, {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import QueueAnim from 'rc-queue-anim';
import hitokotoDriver from '../API/hitokotoDriver';

let httpMangaer = hitokotoDriver.httpManager;

import {Card, Card_options, Card_content} from './HitoCollection.css'
import {menu} from './Home.css'
import {ellipsis} from './UI.css'

import HitoView from '../component/HitoView'

class HitokotoList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 'collections'
    }
  }
  newHitokoto() {
    this
      .props
      .history
      .push('/home/hitokoto/new');
  }
  render() {
    let {status} = this.state;
    let {hitokotos, location: {
          pathname
        }, loading} = this.props,
      ListToShow = [< HitoView newone = {
          true
        }
        newHitokoto = {
          this
            .newHitokoto
            .bind(this)
        }
        key = 'newone' />];

    if (hitokotos.length > 0) {
      ListToShow = ListToShow.concat(hitokotos.map((hitokoto) => (<HitoView key={hitokoto.id} data={hitokoto}/>)));;
    }

    console.log(ListToShow);
    return (
      <QueueAnim
        animConfig={[
        {
          opacity: [
            1, 0
          ],
          translateX: [0, -50]
        }, {
          opacity: [
            1, 0
          ],
          position: 'absolute',
          translateX: [0, 50]
        }
      ]}
        className='HitokotoList'>{ListToShow}</QueueAnim>
    )
  }
}
export default withRouter(HitokotoList)