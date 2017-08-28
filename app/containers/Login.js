import React, {Component} from 'react';
import {connect} from 'react-redux'
import {userLogin, showPanel, hidePanel, PANEL_OPEN, PANEL_HIDE} from '../actions'

import Login from '../pages/Login'

const mapStoreToProps = (state) => {
  return ({layout: state.layout, panel: state.panel, user: state.user})
}
const mapActionToProps = (dispatch) => ({
  showRegist: () => dispatch(showPanel('regist')),
  hideLogin: () => dispatch(hidePanel('login')),
  loginDone: ret => dispatch(userLogin(ret))
})
export default connect(mapStoreToProps, mapActionToProps)(Login)