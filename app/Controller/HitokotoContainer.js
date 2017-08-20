import React, {Component} from 'react'
import style from '../component/HitokotoLayout.css'

import QueueAnim from 'rc-queue-anim';
import hitokotoDriver from '../API/hitokotoDriver'

import HitokotoDisplay from '../component/HitokotoDisplay'
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

class HitokotoContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      instant: getInstantHitokoto(),
      hitokoto: null,
      processing: false
    };
    hitokotoDriver
      .registHitokotoHandler(this.hitokotoHandler.bind(this))
      .registUIProcessingHandler(this.processingHandler.bind(this))
      .start()

    // this.state = {   hitokoto: '你看那个人好像一条狗欸~',   from: '中二病的世界花样多',   id: 23,
    // creator: '超长待机飞利浦防水手机' }
  }

  processingHandler(processing) {

    this.setState({processing: processing})

  }
  hitokotoHandler(hitokoto) {
    console.log(hitokoto)
    this.setState({hitokoto: hitokoto});
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
    let hitokoto = this.state.hitokoto || this.state.instant;
    return (
      <HitokotoDisplay
        hitokoto={hitokoto}
        callbacks={callbacks}
        layout={this.props.layout}
        processing={this.state.processing}></HitokotoDisplay>
    )
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
  localStorage.setItem(INSTANT_HITOKOTO_NAME, JSON.stringify(hitokoto));
}
