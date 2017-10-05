import React, {Component} from 'react';
import {connect} from 'react-redux'
import HitoCollectionList from '../pages/HitoCollectionList'

import {fetchHitokotosSuccess, leaveCollection, requestCollectionHitokotos} from '../actions'
const mapStoreToProps = (state) => {
  console.log(state);
  return ({hitokotos: state.collections.hitokotos, user: state.user, currentCollection: state.collections.currentCollection})
};
const mapActionToProps = (dispatch) => ({
  requestCollectionHitokotos: (name) => dispatch(requestCollectionHitokotos(name)),
  fetchHitokotosSuccess: (hitokotos) => dispatch(fetchHitokotosSuccess(hitokotos)),
  leaveCollection: () => dispatch(leaveCollection())
})
export default connect(mapStoreToProps, mapActionToProps)(HitoCollectionList)