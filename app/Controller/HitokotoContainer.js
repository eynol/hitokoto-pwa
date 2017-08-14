import React, {Component} from 'react'
import style from '../component/HitokotoLayout.css'

import hitokotoDriver from '../API/hitokotoDriver'
import Card from '../component/Card'
import LayoutHorizon from '../component/LayoutHorizon'
import LayoutVertical from '../component/LayoutVertical'
import Action from '../component/Action'

import nextImg from '../img/next.png'

console.log(hitokotoDriver);
const INSTANT_HITOKOTO_NAME = "instantHitokoto";
const DEFAULT_HITOKOTO = {
  creator: "Tao.Da",
  from: "张嘉佳 从你的全世界路过",
  hitokoto: "在季节的车上，如果你要提前下车，请别推醒装睡的我，这样我可以沉睡到终点，假装不知道你已经离开。",
  id: "1995",
  type: "origin"
}
let PROCESSING = false;
let ClassMap = {
  'default': 'inherit',
  'simsun': "'Noto Serif CJK SC', 'Source Han Serif SC', 'Source Han Serif', source-han-serif" +
      "-sc, '宋体', SimSun, '华文细黑', STXihei, serif",
  'fangsong': 'Georgia,"Times New Roman", "FangSong", "仿宋", STFangSong, "华文仿宋", serif',
  'kai': '"楷体",serif'
}

class HitokotoContainer extends Component {

  constructor(props) {
    super(props);
    this.state = getInstantHitokoto();
    hitokotoDriver.registHitokotoHandler(this.hitokotoHandler.bind(this)).start()

    // this.state = {   hitokoto: '你看那个人好像一条狗欸~',   from: '中二病的世界花样多',   id: 23,
    // creator: '超长待机飞利浦防水手机' }
  }
  
  hitokotoHandler(hitokoto) {
    console.log(hitokoto)
    this.setState(hitokoto);
    setInstantHitokoto(hitokoto);
  }
  handleNext() {
    hitokotoDriver.next()
  }

  render() {
    let callbacks = {

      handleNext: this
        .handleNext
        .bind(this)
    };

    let {font, fontWeight, layoutHorizon, backgroundColor} = this.props.layout;

    if (layoutHorizon) {
      return (<LayoutHorizon
        hitoid={this.state.id}
        creator={this.state.creator}
        img={'nothing'}
        hitokoto={this.state.hitokoto}
        from={this.state.from}
        callbacks={callbacks}
        fontFamily={ClassMap[font]}
        fontWeight={fontWeight}/>)
    } else {
      return (<LayoutVertical
        hitoid={this.state.id}
        creator={this.state.creator}
        img={'nothing'}
        hitokoto={this.state.hitokoto}
        from={this.state.from}
        callbacks={callbacks}
        fontFamily={ClassMap[font]}
        fontWeight={fontWeight}/>)
    }

  }

}
export default HitokotoContainer;

function getInstantHitokoto() {
  let string = localStorage.getItem(INSTANT_HITOKOTO_NAME);
  if (!string) {
    return DEFAULT_HITOKOTO;
  }
  return JSON.parse(string);
}

function setInstantHitokoto(hitokoto) {
  localStorage.setItem(INSTANT_HITOKOTO_NAME,JSON.stringify(hitokoto));
}
