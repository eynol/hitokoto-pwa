import React, {Component} from 'react';
import {connect} from 'react-redux'
import Home from '../pages/Home'

const mapStoreToProps = (state) => ({layout: state.layout, user: state.user})

export default connect(mapStoreToProps)(Home)