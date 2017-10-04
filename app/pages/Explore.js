import React, {Component} from 'react';
import {Link, withRouter, Route} from 'react-router-dom';
import FullPageCard from '../component/FullPageCard'

import PublicHitokotosList from '../component/PublicHitokotosList'

import httpManager from '../API/httpManager';
class NavManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      totalPages: 0,
      publicHitokotos: []
    }
  }
  componentWillMount() {
    this.getAllPublicHitokotos();
  }
  getAllPublicHitokotos(page = 1) {
    httpManager.API_getAllPublicHitokotos(page).then(result => {
      console.log(result);
      let totalPages = Math.ceil(result.total / 20);
      this.setState({totalPages: totalPages, currentPage: result.current, publicHitokotos: result.hitokotos})
    })
  }
  render() {
    let {path, location} = this.props;
    return (
      <FullPageCard cardname="探索">
        <Route
          path="/explore"
          exact
          render={() => {
          return <PublicHitokotosList hitokotos={this.state.publicHitokotos}/>
        }}/>
        <Route
          exact
          path="/explore/:user"
          render={() => {
          return <div>user<Link to="/explore/user/fawefawef">collection</Link>
          </div>
        }}/>
        <Route
          exact
          path="/explore/:user/:collection"
          render={() => {
          return <div>collection<Link to="/explore">expore</Link>
          </div>
        }}/>
      </FullPageCard>
    )
  }
}
export default withRouter(NavManagement)
// export default About