import React, {Component} from 'react';
import {connect} from 'react-redux'
import NewHitokoto from '../pages/NewHitokoto'

import {refreshHitokotoList} from '../actions'
const mapStoreToProps = (state) => ({layout: state.layout, nickname: state.user.nickname})
const mapActionToProps = (dispatch) => ({
  refreshHitokotoList: () => dispatch(refreshHitokotoList())
})
export default connect(mapStoreToProps, mapActionToProps)(NewHitokoto)