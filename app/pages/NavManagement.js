import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';

import FullPageCard from '../component/FullPageCard'

import {navList, nav} from './NavManagement.css';

class NavManagement extends Component {

  render() {
    let {path, location} = this.props;
    return (
      <FullPageCard cardname="管理">
        <ul className={navList}>
          <li>
            <div className={nav}>
              <button>
                <Link to='/sources'>来源管理</Link>
              </button>
            </div>
          </li>
          <li>
            <div className={nav}>
              <button>
                <Link to='/patterns'>模式管理</Link>
              </button>
            </div>
          </li>
        </ul>
      </FullPageCard>
    )
  }
}
export default withRouter(NavManagement)
// export default About