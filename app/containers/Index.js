import React, {Component} from 'react';
import {connect} from 'react-redux'
import Index from '../pages/Index'

import {hidePanel} from '../actions'

const mapStoreToProps = (state) => ({layout: state.layout, panel: state.panel, user: state.user})
const mapActionToProps = (dispatch) => ({
  hideNav: () => dispatch(hidePanel('nav'))
})
export default connect(mapStoreToProps, mapActionToProps)(Index)