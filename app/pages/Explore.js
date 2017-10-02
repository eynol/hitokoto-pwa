import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';

class NavManagement extends Component {

  render() {
    let {path, location} = this.props;
    return (
      <FullPageCard cardname="探索">
        <div>
          tansuo
        </div>

      </FullPageCard>
    )
  }
}
export default withRouter(NavManagement)
// export default About