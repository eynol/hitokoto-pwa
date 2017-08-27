import {connect} from 'react-redux'
import Index from '../pages/Index'

const mapStoreToProps = (state) => ({layout: state.layout, user: state.user})

export default connect(mapStoreToProps)(Index)