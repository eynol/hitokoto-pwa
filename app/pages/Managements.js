import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import FullPageCard from '../component/FullPageCard'

function Managements(props) {
  return (
    <FullPageCard cardname="管理">
      <div className="lum-list tryFlexContainer">
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
          <li>
            <Link to="/managements/sync">
              <h4>离线同步</h4>
              <p>将来源的全部句子缓存到本地，离线时也可以使用</p>
            </Link>
          </li>
        </ul>
      </div>
    </FullPageCard>
  )
}
export default Managements
// export default About