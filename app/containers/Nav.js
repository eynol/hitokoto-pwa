import React, {Component} from 'react';
import {connect} from 'react-redux'
import {userLogout, showPanel, hidePanel, PANEL_OPEN, PANEL_HIDE} from '../actions'

import Nav from '../component/Nav'

const mapStoreToProps = (state) => {
  return ({layout: state.layout, panel: state.panel, user: state.user})
}
const mapActionToProps = (dispatch) => ({
  showRegist: () => dispatch(showPanel('regist')),
  showLogin: () => dispatch(showPanel('login')),
  logout: () => dispatch(userLogout()),
  showNav: () => dispatch(showPanel('nav')),
  hideNav: () => dispatch(hidePanel('nav'))
})
export default connect(mapStoreToProps, mapActionToProps)(Nav)