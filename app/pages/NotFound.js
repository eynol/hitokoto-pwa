import React, {Component} from 'react';
import FullPageCard from '../component/FullPageCard';
import {Link} from 'react-router-dom';

export default function (props) {
  return (
    <FullPageCard cardname="404 - Not Found">
      <h1 className="color-red">众里寻他千百度，<br/>那人却在灯火阑珊处。</h1>
      <p>
        <button>
          <Link to="/">回到首页</Link>
        </button>
      </p>
    </FullPageCard>
  )
}