import React from 'react';
import {loading} from './Loading.css';
export default(props) => (
  <div className={loading}>
    <h1>
      <i className="iconfont icon-loading-anim"></i>
    </h1>
    <p>Loading...</p>
  </div>
)
