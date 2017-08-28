import React, {Component} from 'react';
import {connect} from 'react-redux'
import {
  showPanel,
  hidePanel,
  PANEL_OPEN,
  PANEL_HIDE,
  LAYOUT_CHANGE,
  changeLayout
} from '../actions'

import LayoutSetting from '../pages/LayoutSetting'

const mapStoreToProps = (state) => {
  return ({layout: state.layout, panel: state.panel})
}
const mapActionToProps = (dispatch) => ({
  changeLayout: (prop, value) => dispatch(changeLayout(prop, value)),
  hide: () => dispatch(hidePanel('layoutSetting'))
})
export default connect(mapStoreToProps, mapActionToProps)(LayoutSetting)