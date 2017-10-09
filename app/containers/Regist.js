import React, {Component} from 'react';
import {connect} from 'react-redux'
import {userLogin, showPanel, hidePanel, PANEL_OPEN, PANEL_HIDE} from '../actions'

import Regist from '../pages/Regist'

const mapStoreToProps = (state, props) => {
  return ({layout: state.layout, panel: state.panel, user: state.user})
}
const mapActionToProps = (dispatch) => ({
  hideRegist: () => dispatch(hidePanel('regist')),
  showLogin: () => dispatch(showPanel('login')),
  registDone: (ret) => dispatch(userLogin(ret))
});
export default connect(mapStoreToProps, mapActionToProps)(Regist)