import React, {Component} from 'react';
import {connect} from 'react-redux'
import Profile from '../pages/Profile'

import {removeHitokotosSuccess} from '../actions'
const mapStoreToProps = (state) => ({user: state.user})
const mapActionToProps = (dispatch) => ({})
export default connect(mapStoreToProps, mapActionToProps)(Profile)