import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';

import FullPageCard from '../component/FullPageCard'

import {form} from '../component/PatternDisplay.css'

import {navList, nav} from './NavManagement.css';

class Profile extends Component {

  render() {
    let {path, location} = this.props;
    return (
      <FullPageCard cardname="账户设置">
        <div>
          用户名：乏味发威
        </div>
      </FullPageCard>
    )
  }
}
export default withRouter(Profile)
// export default About