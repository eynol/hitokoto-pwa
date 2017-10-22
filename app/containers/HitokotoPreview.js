import React, {Component} from 'react';
import {connect} from 'react-redux'

import HitokotoPreview from '../pages/HitokotoPreview'

import {cleanPreview} from '../actions';

const mapStoreToProps = ({collections, layout}) => {
  return ({preview: collections.preview, layout})
};
const mapActionToProps = (dispacth) => {
  return ({
    cleanPreview: (ntype) => dispacth(cleanPreview(ntype))
  })
}
export default connect(mapStoreToProps, mapActionToProps)(HitokotoPreview)