import React, {Component} from 'react';
import {connect} from 'react-redux'
import HitoList from '../pages/HitoList'

import {fetchHitokotosSuccess, leaveCollection, requestCollectionHitokotos} from '../actions'
const mapStoreToProps = (state) => {
  console.log(state);
  return ({hitokotos: state.collections.hitokotos, currentCollection: state.collections.currentCollection})
};
const mapActionToProps = (dispatch) => ({
  requestCollectionHitokotos: (name) => dispatch(requestCollectionHitokotos(name)),
  fetchHitokotosSuccess: (hitokotos) => dispatch(fetchHitokotosSuccess(hitokotos)),
  leaveCollection: () => dispatch(leaveCollection())
})
export default connect(mapStoreToProps, mapActionToProps)(HitoList)