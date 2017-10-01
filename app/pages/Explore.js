import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';

import FullPageCard from '../component/FullPageCard'
import style from './UI.css';

let {
  manageBox,
  clearfix,
  'close-button': closeButton,
  icon,
  close,
  sourcesList,
  back,
  backButton,
  ellipsis,
  article
} = style;

class NavManagement extends Component {
  goBack() {
    this.props.history.go(-1);
  }

  render() {
    let {path, location} = this.props;
    return (
      <FullPageCard key={path}>
        <div className={manageBox}>
          <h1 className={clearfix}>管理
            <a href="javascript:" onClick={() => this.goBack()} className={closeButton}>
              <i className={icon + ' ' + close}></i>
            </a>
            <a href="javascript:" onClick={() => this.goBack()} className={backButton}>
              <i className={icon + ' ' + back}></i>
            </a>
          </h1>
          <ul>
            <li>
              <div>
                <Link to='/sources'>来源管理</Link>
              </div>
            </li>
            <li>
              <div>
                <Link to='/patterns'>模式管理</Link>
              </div>
            </li>
          </ul>

        </div>
      </FullPageCard>
    )
  }
}
export default withRouter(NavManagement)
// export default About