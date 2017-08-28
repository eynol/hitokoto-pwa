import React, {Component} from 'react';
import {connect} from 'react-redux'
import Index from '../pages/Index'

const mapStoreToProps = (state) => ({layout: state.layout, panel: state.panel, user: state.user})

export default connect(mapStoreToProps)(Index)