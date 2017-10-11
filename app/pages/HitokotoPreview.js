import React, {Component} from 'react';
import QueueAnim from 'rc-queue-anim';
import {Link, withRouter} from 'react-router-dom';

import LayoutHorizon from '../component/LayoutHorizon'
import LayoutVertical from '../component/LayoutVertical'
import FullPage from '../component/FullPage'
import FullPageCard from '../component/FullPage'

class HitokotoPreview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      horizon: true
    }
    this.goBack = this.goBack.bind(this);
    this.switchLayout = this.switchLayout.bind(this);
  }
  switchLayout() {
    this.setState(state => {
      state.horizon = !state.horizon;
      return state
    })
  }

  goBack() {
    this.props.history.goBack();
  }
  render() {
    let {layout, path, history, preview: hitokoto} = this.props,
      pathname = history.location.pathname;

    console.log(pathname, hitokoto, this.props)

    if (!hitokoto) {
      return (
        <FullPageCard>
          <h1>
            <i className="iconfont icon-prompt_fill color-red"></i>hitokoto已被清空</h1>
          <button onClick={() => this.props.history.goBack()}>返回</button>
          <button onClick={() => this.props.history.push('/')}>前往首页</button>
        </FullPageCard>
      )
    }

    let id = hitokoto.id;
    let Actions = (
      <ul data-role="actions">
        <li key={id + 'style'}>
          <a href="javascript:" onClick={this.switchLayout}>
            <i className="iconfont icon-settings"></i>
          </a>
        </li>
        <li key={id + 'return'}>
          <a href="javascript:" onClick={this.goBack}>
            <i className="iconfont icon-check"></i>
          </a>
        </li>
      </ul>
    );

    if (this.state.horizon) {
      return (
        <FullPage style={{
          backgroundColor: layout.backgroundColor
        }}>
          <LayoutHorizon hitokoto={hitokoto} layout={layout} actions={Actions}></LayoutHorizon>
        </FullPage>
      )
    } else {
      return (
        <FullPage style={{
          backgroundColor: layout.backgroundColor
        }}>
          <LayoutVertical hitokoto={hitokoto} layout={layout} actions={Actions}></LayoutVertical>
        </FullPage>
      )
    }
  }
}

export default HitokotoPreview;