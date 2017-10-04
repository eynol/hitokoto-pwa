import React, {Component} from 'react';

import PropTypes from 'prop-types';

import hitokotoDriver from '../API/hitokotoDriver'

import Login from '../containers/Login'
import Regist from '../containers/Regist'
import LayoutSetting from '../containers/LayoutSetting'

import Copyright from '../component/Copyright'
import HitokotoContainer from '../Controller/HitokotoContainer'

import {GLOBAL_ANIMATE_TYPE, ANIMATE_CONFIG_NEXT} from '../configs'

let slyleobject = {
  width: '100%',
  position: 'relative',
  height: '100%',
  backgroundColor: 'white'
};

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: '',
      path: '/',
      currentPatternID: hitokotoDriver.pattern.id
    }
  }

  updateNameAndToken({nickname, token}) {
    this.setState({nickname: nickname});
    $setNickname(nickname)
    hitokotoDriver.httpManager.updateToken(token);
  }

  render() {
    let {user, layout, panel} = this.props,
      backgroundColor = layout.backgroundColor,
      revert2white = layout.revert2white;

    let wrapperConfig = {
      height: "100%",
      width: "100%",
      overflow: "hidden"
    };

    return (
      <div
        key="firstFrame"
        style={wrapperConfig}
        className={revert2white
        ? 'revert2white'
        : ''}>
        <HitokotoContainer/>
        <Regist/>
        <LayoutSetting/>
        <Login/>
        <Copyright/>
      </div>
    )
  }

}
Index.propTypes = {
  layout: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  panel: PropTypes.string.isRequired
};
export default Index;