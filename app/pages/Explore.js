import React, {Component} from 'react';
import {Link, withRouter, Route, Switch} from 'react-router-dom';
import FullPageCard from '../component/FullPageCard'
import QueueAnim from 'rc-queue-anim';

import PublicHitokotosList from '../component/PublicHitokotosList'
import ExploreUser from './ExploreUser'
import ExploreUserCollection from './ExploreUserCollection'

import httpManager from '../API/httpManager';
class NavManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inited: false,
      currentPage: 1,
      totalPages: 0,
      publicHitokotos: [],
      userProfile: {}
    }
  }
  componentWillMount() {
    this.getAllPublicHitokotos();
  }
  getAllPublicHitokotos(page = 1) {
    httpManager.API_getAllPublicHitokotos(page).then(result => {
      console.log(result);
      this.setState({inited: true, totalPages: result.total, currentPage: result.current, publicHitokotos: result.hitokotos})
    })
  }
  uidByName(name) {
    let uid,
      list = this.state.publicHitokotos;
    for (var i = 0; i < list.length; i++) {
      if (list[i].creator === name) {
        uid = list[i].creator_id;
        break;
      }
    };
    return uid;
  }
  render() {
    let {path, location} = this.props;
    return (
      <FullPageCard cardname="探索">
        <Switch>
          <Route
            exact
            path="/explore"
            render={() => {
            return (<PublicHitokotosList
              inited={this.state.inited}
              hitokotos={this.state.publicHitokotos}/>)
          }}/>
          <Route
            exact
            path="/explore/:user"
            render={({
            match: {
              params: {
                user
              }
            }
          }) => {
            return (<ExploreUser userName={user} uid={this.uidByName(user)}/>)
          }}/>
          <Route
            exact
            path="/explore/:user/:collection"
            render={({
            match: {
              params: {
                user,
                collection
              }
            }
          }) => {
            return (<ExploreUserCollection collectionName={collection} uid={this.uidByName(user)}/>)
          }}/>
        </Switch>
      </FullPageCard>
    )
  }
}
export default withRouter(NavManagement)
// export default About