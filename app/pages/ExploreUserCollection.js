import React, {Component} from 'react';
import {Link, withRouter, Route} from 'react-router-dom';
import FullPageCard from '../component/FullPageCard'
import Loading from '../component/Loading'
import PublicHitokotosList from '../component/PublicHitokotosList'
import httpManager from '../API/httpManager';
import QueueAnim from 'rc-queue-anim';
import CollectionBox from '../component/CollectionBox';

import hitokotoDriver from '../API/hitokotoDriver';
import HitoView from '../component/HitoView'

import {CardContainer} from '../component/CollectionBox.css'

class ExploreUserCollection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hitokotos: [],
      inited: false
    }
    this.handleView = this.handleView.bind(this);
  }
  componentWillMount() {
    this.exploreUserCollection();
  }
  exploreUserCollection() {
    let {uid, collectionName} = this.props;
    if (!uid) {
      return this.props.history.push('/');
    }

    httpManager.API_getPublicUserHitokotos(uid, collectionName).then(result => {
      this.setState({inited: true, hitokotos: result.hitokotos})
    })
  }
  handleView(colname) {
    this.props.history.push(this.props.location.pathname + '/' + colname);
  }
  addToSource(colname, event) {
    hitokotoDriver.patterManager.newSourceWithUsernameAndCol(this.props.userName, colname);
    this.forceUpdate();
    event.stopPropagation();
  }
  render() {
    let {path, location, collectionName} = this.props;
    let hitokotos = this.state.hitokotos,
      ListToShow = null;
    if (this.state.inited) {
      if (hitokotos.length == 0) {
        ListToShow = (
          <div key='empty' className='align-center'>
            <div class="pacman">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
            <p>当前句集还没有发布句子哦！</p>
          </div>
        )
      } else {

        ListToShow = hitokotos.map((hitokoto, index) => (<HitoView viewonly key={hitokoto.hitokoto} data={hitokoto}/>))
      }
    }

    return (
      <FullPageCard cardname={collectionName}>
        {this.state.inited
          ? (
            <QueueAnim
              animConfig={[
              {
                opacity: [
                  1, 0
                ],
                translateX: [0, 50]
              }, {
                opacity: [
                  1, 0
                ],
                position: 'absolute',
                translateX: [0, -50]
              }
            ]}>{ListToShow}</QueueAnim>
          )
          : (<Loading key="loading"/>)}
      </FullPageCard>
    )
  }
}
export default withRouter(ExploreUserCollection)
