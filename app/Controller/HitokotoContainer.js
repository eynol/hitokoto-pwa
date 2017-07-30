import React, {Component} from 'react'
import style from '../component/HitokotoLayout.css'

import getHitokoto from '../API/hitokoto'
import Card from '../component/Card'
import LayoutHorizon from '../component/LayoutHorizon'
import LayoutVertical from '../component/LayoutVertical'
import Action from '../component/Action'

import nextImg from '../img/next.png'

let PROCESSING = false;

class HitokotoContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      words: '你看那个人好像一条狗欸~',
      from: '中二病的世界花样多',
      hitoid: 23,
      creator: '超长待机飞利浦防水手机',
      vertical: true,
      song:true
    }
  }
  componentDidMount() {
    this.handleNext();
  }
  handleNext() {
    if (!PROCESSING) {
      PROCESSING = true;
      getHitokoto(this.handleNext.bind(this)).then(json => {
        PROCESSING = false;
        this.setState({words: json.hitokoto, from: json.from, hitoid: json.id, creator: json.creator})
      }).catch(err => {
        PROCESSING = false;
      })
    }
  }
  changeLayout() {
    this.setState({
      vertical: !this.state.vertical
    });
  }
  render() {
    let callbacks = {
      changeLayout: this
        .changeLayout
        .bind(this),
      handleNext: this
        .handleNext
        .bind(this)
    };

    if (!this.state.vertical) {
      return (<LayoutHorizon
        hitoid={this.state.hitoid}
        creator={this.state.creator}
        img={'nothing'}
        hitokoto={this.state.words}
        from={this.state.from}
        callbacks={callbacks}/>)
    } else {
      return (<LayoutVertical
        hitoid={this.state.hitoid}
        creator={this.state.creator}
        img={'nothing'}
        hitokoto={this.state.words}
        from={this.state.from}
        callbacks={callbacks}/>)
    }

  }

}
export default HitokotoContainer