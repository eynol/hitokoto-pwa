import React, {Component} from 'react';
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'

import UserCollection from '../pages/UserCollection'

import {fetchHitokotosSuccess, leaveCollection, refreshCollectionHitokotoSuccess, requestCollectionHitokotos, previewHitokoto} from '../actions'

const mapStoreToProps = (state) => {
  return ({hitokotos: state.collections.hitokotos, needRefresh: state.collections.needRefreshHikotokos, user: state.user})
};

const mapActionToProps = (dispatch) => ({
  fetchHitokotosSuccess: (hitokotos) => dispatch(fetchHitokotosSuccess(hitokotos)),
  refreshCollectionHitokotoSuccess: () => dispatch(refreshCollectionHitokotoSuccess()),
  leaveCollection: () => dispatch(leaveCollection()),
  preview: (...hitokoto) => dispatch(previewHitokoto(...hitokoto))
})

export default withRouter(connect(mapStoreToProps, mapActionToProps)(UserCollection))