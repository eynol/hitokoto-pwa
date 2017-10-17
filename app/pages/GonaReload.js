import React, {Component} from 'react';
import FullPageCard from '../component/FullPageCard';
import {Link} from 'react-router-dom';

export default function (props) {
  return (
    <FullPageCard cardname="更新">
      <h1 className="color-red">自动刷新页面。。。</h1>
    </FullPageCard>
  )
}