import React, {Component} from 'react'
import style from '../component/HitokotoLayout.css'

import getHitokoto from '../API/hitokoto'
import Card from '../component/Card'
import LayoutHorizon from '../component/LayoutHorizon'
import LayoutVertical from '../component/LayoutVertical'
import Action from '../component/Action'

import nextImg from '../img/next.png'

let PROCESSING = false;
let ClassMap = {
  'default':'inherit',
  'simsun':"'Noto Serif CJK SC', 'Source Han Serif SC', 'Source Han Serif', source-han-serif-sc, '宋体', SimSun, '华文细黑', STXihei, serif",
  'fangsong':'Georgia,"Times New Roman", "FangSong", "仿宋", STFangSong, "华文仿宋", serif',
  'kai':'"楷体",serif'
}

class HitokotoContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      words: '你看那个人好像一条狗欸~',
      from: '中二病的世界花样多',
      hitoid: 23,
      creator: '超长待机飞利浦防水手机',
      song: true
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

  render() {
    let callbacks = {
     
      handleNext: this
        .handleNext
        .bind(this)
    };

    let {font, fontWeight,layoutHorizon, backgroundColor} = this.props.layout;

    if (layoutHorizon) {
      return (<LayoutHorizon
        hitoid={this.state.hitoid}
        creator={this.state.creator}
        img={'nothing'}
        hitokoto={this.state.words}
        from={this.state.from}
        callbacks={callbacks}
        fontFamily={ClassMap[font]}
        fontWeight={fontWeight}/>)
    } else {
      return (<LayoutVertical
        hitoid={this.state.hitoid}
        creator={this.state.creator}
        img={'nothing'}
        hitokoto={this.state.words}
        from={this.state.from}
        callbacks={callbacks}
        fontFamily={ClassMap[font]}
        fontWeight={fontWeight}/>)
    }

  }

}
export default HitokotoContainer