import React, {Component} from 'react'
import style from '../component/HitokotoLayout.css'

import getHitokoto from '../API/hitokoto'
import Card from '../component/Card'
import LayoutHorizon from '../component/LayoutHorizon'
import Action from '../component/Action'

import nextImg from '../img/next.png'

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
      }).catch(err => {
        PROCESSING = false;
      })
    }
  }
  render() {
    return (
      <div>
        <div className={style.info}>
          <h1>
            <span title="序号">{this.state.id}</span>
          </h1>
          <p >
            <span title="创建者">{this.state.creator}</span>
          </p>
        </div>
        <LayoutHorizon
          img={'nothing'}
          hitokoto={this.state.words}
          from={this.state.from}/>
        <div className='oprations'>
          <ul className={style.actions}>
            <li>
              <a href="javascript:" className={style.love}></a>
              <a
                href="javascript:"
                onClick={this
                .handleNext
                .bind(this)}
                className={style.next}></a>
            </li>
            <li></li>
          </ul>
        </div>
      </div>
    )
  }

}
export default HitokotoContainer