import {connect} from 'react-redux'
import {userLogin} from '../actions'

import Login from '../pages/Login'

const mapStoreToProps = (state, props) => {
  console.log(state, props);
  return ({layout: state.layout, user: state.user})
}
const mapActionToProps = (dispatch) => ({
  loginDone: ret => dispatch(userLogin(ret))
})
export default connect(mapStoreToProps, mapActionToProps)(Login)