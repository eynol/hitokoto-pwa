import React, {Component} from 'react';
import {connect} from 'react-redux'
import PropTypes from 'prop-types';
import QueueAnim from 'rc-queue-anim';
import hitokotoDriver from '../API/hitokotoDriver'

import Login from '../containers/Login'
import Regist from '../pages/Regist'
import LayoutSetting from '../pages/LayoutSetting'
import Copyright from '../component/Copyright'
import HitokotoContainer from '../Controller/HitokotoContainer'

import {GLOBAL_ANIMATE_TYPE, ANIMATE_CONFIG_NEXT} from '../configs'
import Nav from '../component/Nav'

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

    //bind this
    this.handleLayoutChange = this.handleLayoutChange.bind(this)
    this.showLogin = this.showLogin.bind(this);
    this.showRegist = this.showRegist.bind(this);
    this.hideLogin = this.hideRegist = this.hideLayoutSetting = this.hidePanel.bind(this);

    this.showLayoutSetting = this.showLayoutSetting.bind(this);
  }
  handleLayoutChange(item, nextVal) {
    let layout = this.props.layout;
    if (layout[item] != nextVal) {
      layout[item] = nextVal;
      this.setState({'layout': layout});
      $setInstantLayout(layout);
    }
    console.log(nextVal);
  }
  handlePatternChange(id) {
    console.log('pattern change', id);
    if (id !== hitokotoDriver.pattern.id) {
      let pattern = hitokotoDriver.patterManager.getPatternById(id);
      hitokotoDriver.drive(pattern).start();
      this.setState({currentPatternID: id})
    }
  }
  updateNameAndToken({nickname, token}) {
    this.setState({nickname: nickname});
    $setNickname(nickname)
    hitokotoDriver.httpManager.updateToken(token);
  }
  hidePanel() {
    this.setState({status: ''})
  }
  showLogin() {
    this.setState({status: 'show login'})
  }
  showRegist() {
    this.setState({status: 'show regist'})
  }
  showLayoutSetting() {
    this.setState({status: 'show layoutsetting'})
  }

  handleSignOut() {
    console.log('sign out');
    this.updateNameAndToken({nickname: '', token: ''});
  }
  render() {
    let {user, layout} = this.props,
      backgroundColor = layout.backgroundColor;

    let wrapperConfig = {
      backgroundColor: backgroundColor,
      height: "100%",
      width: "100%",
      overflow: "hidden"
    };

    let Child = null;
    if (this.state.status === 'show login') {
      Child = (<Login key='login' hideLogin={this.hideLogin} showRegist={this.showRegist}/>)
    } else if (this.state.status === 'show regist') {
      Child = <Regist key='regist' hideRegist={this.hideRegist} showLogin={this.showLogin}/>
    } else if (this.state.status === 'show layoutsetting') {
      Child = <LayoutSetting
        key='/layoutsetting'
        layout={this.props.layout}
        changeLayout={this.handleLayoutChange.bind(this)}
        patterns={hitokotoDriver.patterManager.patterns}
        currentPatternID={this.state.currentPatternID}
        patternChange={this.handlePatternChange.bind(this)}
        hide={this.hideLayoutSetting}/>
    }

    return (
      <div key="firstFrame" style={wrapperConfig}>
        <HitokotoContainer showLayoutSetting={this.showLayoutSetting} layout={layout}/>
        <Nav
          user={user}
          logout={() => {}}
          showLogin={this.showLogin}
          showRegist={this.showRegist}/>
        <QueueAnim type={GLOBAL_ANIMATE_TYPE} ease={['easeOutQuart', 'easeInOutQuart']}>
          {Child}
        </QueueAnim>
        <Copyright/>
      </div>
    )
  }

}
Index.propTypes = {
  layout: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
}
let mapStateToProp = (state) => ({layout: state.layout, user: state.user})
export default connect(mapStateToProp)(Index);