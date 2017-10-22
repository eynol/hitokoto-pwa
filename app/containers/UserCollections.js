import React, {Component} from 'react';

import {connect} from 'react-redux'
import UserCollections from '../pages/UserCollections'

import {fetchCollectionSuccess} from '../actions'
const mapStoreToProps = (state) => ({layout: state.layout, collections: state.collections, user: state.user})
const mapActionToProps = (dispatch) => ({
  fetchCollectionSuccess: (data) => dispatch(fetchCollectionSuccess(data))
})
export default connect(mapStoreToProps, mapActionToProps)(UserCollections)