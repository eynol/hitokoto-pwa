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

    if (this.props.vertical) {
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