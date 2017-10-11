import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';

import FullPageCard from '../component/FullPageCard'

class Managements extends Component {

  render() {
    let {path, location} = this.props;
    return (
      <FullPageCard cardname="管理">
        <div className="routes tryFlexContainer">
          <ul>
            <li>
              <Link to="/managements/sources">
                <h4>来源管理</h4>
                <p>管理添加获取句子的URL</p>
              </Link>
            </li>
            <li>
              <Link to="/managements/patterns">
                <h4>模式管理</h4>
                <p>根据自己喜好选择来源形成模式</p>
              </Link>
            </li>
          </ul>
        </div>
      </FullPageCard>
    )
  }
}
export default withRouter(Managements)
// export default About