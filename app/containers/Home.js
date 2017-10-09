import React, {Component} from 'react';
import {connect} from 'react-redux'
import Home from '../pages/Home'

import {fetchCollectionSuccess, refreshHitokotoList, removeHitokotosSuccess} from '../actions'
const mapStoreToProps = (state) => ({layout: state.layout, collections: state.collections, user: state.user})
const mapActionToProps = (dispatch) => ({
  refreshHitokotoList: () => dispatch(refreshHitokotoList()),
  fetchCollectionSuccess: (data) => dispatch(fetchCollectionSuccess(data)),
  removeHitokotosSuccess: (_id) => dispatch(removeHitokotosSuccess(_id))
})
export default connect(mapStoreToProps, mapActionToProps)(Home)