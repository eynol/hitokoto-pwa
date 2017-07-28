import React, {Component} from 'react'
import style from '../component/HitokotoLayout.css'

import getHitokoto from '../API/hitokoto'
import Card from '../component/Card'
import LayoutHorizon from '../component/LayoutHorizon'

class HitokotoContainer extends Component {

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
    getHitokoto().then(json => {
      this.setState({words: json.hitokoto, from: json.from, id: json.id, creator: json.creator})
    })
  }
  render() {
    return (
      <div>
        <div className={style.info}>
          <h1>{this.state.id}</h1>
          <p>{this.state.creator}</p>
        </div>
        <LayoutHorizon
          img={'nothing'}
          hitokoto={this.state.words}
          from={this.state.from}/>
        <div className='oprations'>
          <ul>
            <li><a href="####">下一条</a></li>
            <li><a href="####">喜欢</a></li>
            
          </ul>
        </div>
      </div>
    )
  }

}
export default HitokotoContainer