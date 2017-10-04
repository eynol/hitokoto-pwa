import React, {Component} from 'react'
import PropTypes from 'prop-types';
import style from '../component/HitokotoLayout.css'

import QueueAnim from 'rc-queue-anim';
import hitokotoDriver from '../API/hitokotoDriver'

import HitokotoPlayer from '../component/HitokotoPlayer'

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

    //bind functions
    this.handleLast = this.handleLast.bind(this);
    this.handleNext = this.handleNext.bind(this);

    //regist resolver
    hitokotoDriver.initRollback(_instantHitokoto).registNextHitokotoHandler(this.nextHitokotoHandler.bind(this)).registLastHitokotoHandler(this.lastHitokotoHandler.bind(this)).registUIProcessingHandler(this.processingHandler.bind(this)).start()
  }

  componentDidMount() {

    console.log('componentDidMount start hitokoto')
    hitokotoDriver.start()
  }
  componentWillUnmount() {

    hitokotoDriver.registNextHitokotoHandler(Function.prototype).registLastHitokotoHandler(Function.prototype).registUIProcessingHandler(Function.prototype).stop();

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
    let hitokoto = this.state.hitokoto || this.state.instant;
    return (<HitokotoPlayer
      hitokoto={hitokoto}
      callbacks={{
      handleNext: this.handleNext,
      handleLast: this.handleLast
    }}
      direction={this.state.direction}
      lastCount={this.state.lastCount}
      nextCount={this.state.nextCount}
      processing={this.state.processing}/>)
  }

}

// HitokotoContainer.propTypes = {   layout: PropTypes.object }
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
