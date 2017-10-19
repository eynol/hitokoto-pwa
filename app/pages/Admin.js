import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import FullPageCard from '../component/FullPageCard'

function Managements(props) {
  return (
    <FullPageCard cardname="后台管理">
      <div className="lum-list">
        <ul>
          <li>
            <Link to="/admin/review">
              <h4>审核句子</h4>
              <p>通过或者Block句子。</p>
            </Link>
          </li>
          <li>
            <Link to="/admin/users">
              <h4>用户管理</h4>
              <p>禁用用户</p>
            </Link>
          </li>
          <li>
            <Link to="/admin/broadcast">
              <h4>通知公告</h4>
              <p>广播公告给所有用户</p>
            </Link>
          </li>
        </ul>
      </div>
    </FullPageCard>
  )
}
export default Managements
// export default About