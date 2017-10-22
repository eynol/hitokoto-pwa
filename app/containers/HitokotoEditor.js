import React, {Component} from 'react';
import {connect} from 'react-redux'

import HitokotoEditor from '../pages/HitokotoEditor'

import {refreshHitokotoList, previewHitokoto} from '../actions'
const mapStoreToProps = (state) => ({layout: state.layout, within: state.collections.within, preview: state.collections.preview, nickname: state.user.nickname})
const mapActionToProps = (dispatch) => ({
  refreshHitokotoList: () => dispatch(refreshHitokotoList()),
  handlePreview: (...hitokoto) => dispatch(previewHitokoto(...hitokoto))
})
export default connect(mapStoreToProps, mapActionToProps)(HitokotoEditor)