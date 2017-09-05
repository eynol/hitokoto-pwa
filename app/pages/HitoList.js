import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {matchPath} from 'react-router'
import {Link, withRouter} from 'react-router-dom'
import QueueAnim from 'rc-queue-anim';
import httpManager from '../API/httpManager';

import {Card, Card_options, Card_content} from './HitoCollection.css'
import {menu} from './Home.css'
import {ellipsis} from './UI.css'

import HitoView from '../component/HitoView'

class HitoList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 'collections'
    }
  }

  componentDidMount() {
    console.log('cdu');
    this.fetchHitokotos();
  }
  componentWillUnmount() {
    this.props.leaveCollection()
  }
  fetchHitokotos() {
    let pathname = this.props.location.pathname;
    if (pathname == '/home/') {
      this.props.history.replace('/home');
      return;
    }
    let match = matchPath(pathname, {path: '/home/:name'})

    let {params: {
        name
      }} = match;
    if (name && name.length) {
      this.props.requestCollectionHitokotos(name).then(result => {
        console.log(result)
      }, (e) => {
        console.log(e)
      })
    } else {
      alert('路径名不正确');
      this.props.history.push('/home');
    }

  }
  newHitokoto() {
    this.props.history.push(this.props.location.pathname + '/new');
  }
  render() {
    let {status} = this.state;
    let {hitokotos, location: {
          pathname
        }} = this.props,
      ListToShow = [(<HitoView newone={true} newHitokoto={this.newHitokoto.bind(this)} key='newone'/>)];

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
          translateY: [0, 50]
        }, {
          opacity: [
            1, 0
          ],
          position: 'absolute',
          translateY: [0, -50]
        }
      ]}
        className='HitokotoList'>{ListToShow}</QueueAnim>
    )
  }
}

HitoList.propTypes = {
  hitokotos: PropTypes.arrayOf(PropTypes.object).isRequired,
  leaveCollection: PropTypes.func.isRequired
}
export default withRouter(HitoList)