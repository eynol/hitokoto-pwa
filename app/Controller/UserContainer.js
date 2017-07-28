import React, {Component} from 'react'
import style from '../component/HitokotoLayout.css'

import getHitokoto from '../API/hitokoto'
import Card from '../component/Card'
import LayoutHorizon from '../component/LayoutHorizon'

class UserContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      words: 'example',
      from: '??',
      id: 23,
      creator: 'nou'
    }
  }
  componentDidMount() {
    this.handleNext();
  }
  handleSignIn(){

  }
  handleSignOut(){

  }
  render() {
    return (
      <div>
        <ul>
          <li><a href="javascript:">登录</a></li>
          <li><a href="javascript:">登录</a></li>
        </ul>
      </div>
    )
  }

}
export default UserContainer