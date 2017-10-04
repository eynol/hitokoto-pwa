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
    this.goBack = this.goBack.bind(this);

  }

  goBack() {
    this.props.history.goBack();
  }
  render() {
    let {hitokoto, layout, layoutHorizon, path, location: {
          pathname
        }} = this.props,
      id = hitokoto.id,
      pathReg = /^\/home\/[^\/]*\/preview$/;

    if (!pathReg.test(pathname)) {
      return null;
    }
    if (typeof hitokoto == 'string') {
      return <FullPageCard>
        <h1>
          <i className="iconfont icon-prompt_fill color-red"></i>hitokoto已被清空</h1>
        <button onClick={this.goBack}>返回</button>
      </FullPageCard>
    }
    let Actions = (
      <ul data-role="actions">
        <li key={id + 'return'}>
          <a href="javascript:" onClick={this.goBack}>返回</a>
        </li>
        <li key={id + 'style'}>
          <a href="javascript:" onClick={this.props.switchLayout}>更换排版</a>
        </li>
      </ul>
    );

    if (layoutHorizon) {
      return (
        <FullPage style={{
          backgroundColor: layout.backgroundColor
        }}>
          <QueueAnim
            animConfig={[
            {
              opacity: [1, 0]
            }, {
              opacity: [
                1, 0
              ],
              position: 'absolute'
            }
          ]}
            ease={['easeOutQuart', 'easeInOutQuart']}
            className="animate-none-sense"
            style={{
            position: 'relative',
            height: '100%',
            width: '100%'
          }}>
            <LayoutHorizon key={id} hitokoto={hitokoto} layout={layout}>
              {Actions}
            </LayoutHorizon>
          </QueueAnim>
        </FullPage>
      )
    } else {
      return (
        <FullPage style={{
          backgroundColor: layout.backgroundColor
        }}>
          <LayoutVertical key={id} hitokoto={hitokoto} layout={layout}>
            {Actions}</LayoutVertical>
        </FullPage>
      )
    }
  }
}

export default withRouter(HitokotoPreview);