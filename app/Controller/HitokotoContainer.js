import React, {Component} from 'react'
import style from '../component/HitokotoLayout.css'

import QueueAnim from 'rc-queue-anim';
import hitokotoDriver from '../API/hitokotoDriver'

import HitokotoDisplay from '../component/HitokotoDisplay'

import nextImg from '../img/next.png'

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
    let _instantHitokoto = getInstantHitokoto()
    this.state = {
      instant: _instantHitokoto,
      hitokoto: null,
      processing: false,
      direction: 'next',
      lastCount: 1,
      nextCount: 5
    };
    hitokotoDriver
      .initRollback(_instantHitokoto)
      .registNextHitokotoHandler(this.nextHitokotoHandler.bind(this))
      .registLastHitokotoHandler(this.lastHitokotoHandler.bind(this))
      .registUIProcessingHandler(this.processingHandler.bind(this))
      .start()
  }

  componentDidMount() {
    if (/^\/$|^\/layoutsetting/.test(this.props.location.pathname)) {
      console.log('componentDidMount start hitokoto')
      hitokotoDriver.start()
    } else {
      console.log('componentDidMount stop hito')
      hitokotoDriver.stop();
    }
  }
  componentWillUnmount() {
    hitokotoDriver.stop()
  }
  componentWillReceiveProps(nextProps) {
    console.log('nextProps ', nextProps)

    if (/^\/$|^\/layoutsetting/.test(nextProps.location.pathname)) {
      console.log('start hitokoto')
      hitokotoDriver.start()
    } else {
      console.log('stop hito')
      hitokotoDriver.stop();
    }
  }
  processingHandler(processing) {
    this.setState({processing: processing})
  }
  nextHitokotoHandler(hitokoto, {lastCount, nextCount}) {
    console.log(hitokoto, lastCount, nextCount)
    this.setState({hitokoto: hitokoto, direction: 'next', lastCount, nextCount});
    setInstantHitokoto(hitokoto);
  }
  lastHitokotoHandler(hitokoto, {lastCount, nextCount}) {
    console.log(hitokoto, lastCount, nextCount)
    this.setState({hitokoto: hitokoto, direction: 'back', lastCount, nextCount});
  }
  handleNext() {
    if (this.state.processing) {} else {
      hitokotoDriver.next()
    }
  }
  handleLast() {
    hitokotoDriver.last()
  }

  render() {
    let callbacks = {
      handleNext: this
        .handleNext
        .bind(this),
      handleLast: this
        .handleLast
        .bind(this)
    };
    let hitokoto = this.state.hitokoto || this.state.instant;
    return (
      <HitokotoDisplay
        hitokoto={hitokoto}
        callbacks={callbacks}
        direction={this.state.direction}
        lastCount={this.state.lastCount}
        nextCount={this.state.nextCount}
        layout={this.props.layout}
        processing={this.state.processing}></HitokotoDisplay>
    )
  }

}
export default HitokotoContainer;

function getInstantHitokoto() {
  let string = localStorage.getItem(INSTANT_HITOKOTO_NAME);
  if (!string || string == 'undefined') {
    return DEFAULT_HITOKOTO;
  }
  return JSON.parse(string);
}

function setInstantHitokoto(hitokoto) {
  localStorage.setItem(INSTANT_HITOKOTO_NAME, JSON.stringify(hitokoto));
}
