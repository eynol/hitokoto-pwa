import React, {Component} from 'react'
import style from '../component/HitokotoLayout.css'

import getHitokoto from '../API/hitokoto'
import Card from '../component/Card'
import LayoutHorizon from '../component/LayoutHorizon'
import Action from '../component/Action'

let PROCESSING = false;

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
    this.handleNext();
  }
  handleNext() {
    if (!PROCESSING) {
      PROCESSING = true;
      getHitokoto().then(json => {
        PROCESSING = false;
        this.setState({words: json.hitokoto, from: json.from, id: json.id, creator: json.creator})
      }).catch(err=>{
        PROCESSING = false;
      })
    }
  }
  render() {
    return (
      <div>
        <div className={style.info}>
    <h1 title="序号">{this.state.id}</h1>
    <p title="创建者">{this.state.creator}</p>
        </div>
        <LayoutHorizon
          img={'nothing'}
          hitokoto={this.state.words}
          from={this.state.from}/>
        <div className='oprations'>
          <ul className={style.actions}>
            <li className={style.next}>
            <Action onClick={this.handleNext.bind(this)}>下一条</Action>
            </li>
            <li>
            <Action >喜欢</Action>
            </li>
            <li>
            <Action >查看留言</Action>
          </li>
          </ul>
        </div>
      </div>
    )
  }

}
export default HitokotoContainer