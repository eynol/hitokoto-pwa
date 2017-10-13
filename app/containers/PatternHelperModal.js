import React, {Component} from 'react';
import {connect} from 'react-redux'
import {newOneSourceDone, removeOneSourceDone} from '../actions'

import PatternHelperModal from '../pages/PatternHelperModal'

const mapStoreToProps = (state) => {
  return ({sourceNew: state.sources.sourceNew, sourceRemove: state.sources.sourceRemove})
}
const mapActionToProps = (dispatch) => ({
  newOneSourceDone: () => dispatch(newOneSourceDone()),
  removeOneSourceDone: () => dispatch(removeOneSourceDone())
})
export default connect(mapStoreToProps, mapActionToProps)(PatternHelperModal)