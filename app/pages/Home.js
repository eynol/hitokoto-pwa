import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {home} from './Home.css';
class Home extends Component {
  constructor(props) {
    super(props);
  }
  shouldComponetUpdate(nextProps, nextState) {
    console.log(nextProps, nextState);
    return true;
  }
  render() {
    let {location: {
        pathname
      }, path} = this.props;
    if (pathname == path) {} else {
      // return null
    }
    return (
      <div key='home' className={home}>
        <h1>lottole</h1>
      </div>
    );
  }
}

export default withRouter(Home)