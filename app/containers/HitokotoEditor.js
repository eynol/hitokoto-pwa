import React, {Component} from 'react';
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import HitokotoEditor from '../pages/HitokotoEditor'

import {refreshHitokotoList, previewHitokoto} from '../actions'
const mapStoreToProps = (state) => ({layout: state.layout, within: state.collections.within, nickname: state.user.nickname})
const mapActionToProps = (dispatch) => ({
  refreshHitokotoList: () => dispatch(refreshHitokotoList()),
  preview: (...hitokoto) => dispatch(previewHitokoto(...hitokoto))
})
export default withRouter(connect(mapStoreToProps, mapActionToProps)(HitokotoEditor))