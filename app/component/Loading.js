import React from 'react';
import {loading} from './Loading.css';
export default({inited, error, retry}) => {

  if (!inited) {
    if (error) {
      return (
        <div className={loading}>
          <h1 className="color-red">
            <i className="iconfont icon-error-message">Oooops....</i>
          </h1>
          <p>似乎出了点状况<button onClick={retry}>重试</button>
          </p>
        </div>
      )
    } else {
      return (
        <div className={loading}>
          <h1>
            <i className="iconfont icon-loading-anim"></i>
          </h1>
          <p>Loading...</p>
        </div>
      )
    }
  } else {
    return null;
  }
}
