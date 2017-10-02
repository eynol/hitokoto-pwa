import React, {Component} from 'react';
import FullPageCard from '../component/FullPageCard'
import PatternDisplay from '../component/PatternDisplay'
import QueueAnim from 'rc-queue-anim';

import {GLOBAL_ANIMATE_TYPE} from '../configs'
import hitokotoDriver from '../API/hitokotoDriver';
import {Link, withRouter} from 'react-router-dom';

class Patterns extends Component {
  constructor(props) {
    super(props);
    this.state = {
      patterns: hitokotoDriver.patterManager.patterns,
      update: undefined,
      newPattern: undefined
    }

    this.showUpdate = this.showUpdate.bind(this);
  }
  showUpdate(id) {
    this.setState({update: id});
  }
  handleUpdate(id, pattern) {
    hitokotoDriver.updatePattern(id, pattern);
    this.hideUpdate();
    this.setState({pattern: this.state.patterns})
  }
  hideUpdate() {
    this.setState({update: undefined})
  }
  handleDelete(id) {
    if (confirm('你确认要删除该模式？')) {
      hitokotoDriver.patterManager.deletePattern(id);
      this.hideUpdate()
    }
  }
  showNewPattern() {
    this.setState({newPattern: Date.now()});
  }
  hideNewPattern() {
    this.setState({newPattern: undefined});
  }
  handleNewPattern(pattern) {
    hitokotoDriver.patterManager.newPattern(pattern);
    this.hideNewPattern();
    this.setState({
      pattern: JSON.parse(JSON.stringify(hitokotoDriver.patterManager.patterns))
    });

  }

  render() {

    let lists = this.state.patterns.map((pattern) => {
      return (
        <li key={pattern.id}>
          <p className="ellipsis">
            <button onClick={this.showUpdate.bind(this, pattern.id)}>修改</button>&nbsp; {pattern.name}{pattern.default
              ? '（当前默认模式）'
              : ''}
          </p>
        </li>
      )
    })

    let patternDisplay = null;
    if (this.state.update) {
      let patternToUpdate = this.state.patterns.find((p) => {
        if (p.id == this.state.update) {
          return true;
        } else {
          return false;
        }
      })

      patternDisplay = (<PatternDisplay
        pattern={patternToUpdate}
        title="修改模式"
        key={this.state.update}
        sources={hitokotoDriver.patterManager.sources}
        hook={{
        hide: this.hideUpdate.bind(this),
        update: this.handleUpdate.bind(this),
        delete: this.handleDelete.bind(this)
      }}/>)
    } else if (this.state.newPattern) {
      patternDisplay = (<PatternDisplay
        title="添加模式"
        sources={hitokotoDriver.patterManager.sources}
        key={this.state.newPattern}
        hook={{
        hide: this.hideNewPattern.bind(this),
        newPattern: this.handleNewPattern.bind(this)
      }}/>)
    }
    let {location, path} = this.props;
    return (
      <FullPageCard cardname="模式管理">
        <QueueAnim
          component="ul"
          type={GLOBAL_ANIMATE_TYPE}
          ease={['easeOutQuart', 'easeInOutQuart']}>
          {lists}
          <li key="new">
            <button
              onClick={this.showNewPattern.bind(this)}
              style={{
              float: 'right'
            }}>添加</button>
          </li>
        </QueueAnim>
        <QueueAnim type={GLOBAL_ANIMATE_TYPE} ease={['easeOutQuart', 'easeInOutQuart']}>{patternDisplay}</QueueAnim>

      </FullPageCard>
    )

  }
}

export default withRouter(Patterns);