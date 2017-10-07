import React, {Component} from 'react';
import {connect} from 'react-redux'
import HitoCollectionList from '../pages/HitoCollectionList'

import {fetchHitokotosSuccess, leaveCollection, refreshCollectionHitokotoSuccess, requestCollectionHitokotos} from '../actions'
const mapStoreToProps = (state) => {
  return ({hitokotos: state.collections.hitokotos, needRefresh: state.collections.needRefreshHikotokos, user: state.user, currentCollection: state.collections.currentCollection})
};
const mapActionToProps = (dispatch) => ({
  fetchHitokotosSuccess: (hitokotos) => dispatch(fetchHitokotosSuccess(hitokotos)),
  refreshCollectionHitokotoSuccess: () => dispatch(refreshCollectionHitokotoSuccess()),
  leaveCollection: () => dispatch(leaveCollection())
})
export default connect(mapStoreToProps, mapActionToProps)(HitoCollectionList)