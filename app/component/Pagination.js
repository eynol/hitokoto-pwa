import React, {Component} from 'react';

import PropTypes from 'prop-types';
import {wrapper} from './Pagination.css';

/**
 *  得到范围的起点；
 *
 * @param {number} current
 * @param {number} total
 * @param {number} [limit=10]
 * @returns {number}
 */
const getRangeStart = (current, total, limit = 10) => {
  if (total <= limit) {
    return 1;
  } else {
    let halfRange = Math.floor(limit / 2), //  间隔
      isOdd = limit & 1, //  奇偶
      bottom = current - halfRange,
      top = current + halfRange + (isOdd
        ? 0
        : -1);
    //  先获取范围的一半
    if (bottom < 1) {
      return 1;
    } else if (top > total) {
      return total - limit;
    } else {
      return bottom;
    }
  }
}

class Pagination extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rangeStart: 1
    }
    this.go = this.go.bind(this);
    this.toBegin = this.toBegin.bind(this);
    this.toEnd = this.toEnd.bind(this);
    this.lastOne = this.lastOne.bind(this);
    this.nextOne = this.nextOne.bind(this);
    this.lastRange = this.lastRange.bind(this);
    this.nextRange = this.nextRange.bind(this);
  }
  componentWillMount() {
    let {current, total, limit} = this.props;

    this.setState({
      rangeStart: getRangeStart(current, total, limit)
    });

  }

  componentWillReceiveProps(nextProps) {
    let {current, total, limit} = nextProps;

    this.setState({
      rangeStart: getRangeStart(current, total, limit)
    });

  }
  go(event) {
    event.target.blur();
    console.log(event.target);
    console.log(event.target.textContent);
    this.props.func(event.target.textContent, this.props.limit || 20);

  }
  toBegin(event) {
    event.target.blur();
    this.props.func(1, this.props.limit || 20);
  }
  toEnd(event) {
    event.target.blur();
    this.props.func(this.props.total, this.props.limit || 20);
  }
  lastOne(event) {
    event.target.blur();
    this.props.func(this.props.current - 1, this.props.limit || 20);
  }
  nextOne(event) {
    event.target.blur();
    this.props.func(this.props.current + 1, this.props.limit || 20);
  }
  lastRange(event) {
    event.target.blur();
    let currentRange = this.state.rangeStart,
      lastRange;
    let {current, total, limit} = this.props;

    lastRange = currentRange - limit;
    if (lastRange < 1) {
      this.setState({rangeStart: 1})
    } else {
      this.setState({rangeStart: lastRange})
    }
  }
  nextRange(event) {
    event.target.blur();
    let currentRange = this.state.rangeStart,
      nextRange,
      top;
    let {current, total, limit} = this.props;

    nextRange = currentRange + limit;
    top = total - limit;

    if (nextRange > top) {
      this.setState({rangeStart: top})
    } else {
      this.setState({rangeStart: nextRange})
    }
  }
  render(props) {
    let {
      current,
      total,
      func,
      limit = 10
    } = this.props;
    let range = this.state.rangeStart,
      List = [],
      displayCount = total < limit
        ? total
        : limit;
    if (total == 1) {
      return null;
    }
    //last one button
    List.push((
      <button
        key='lastone'
        className={current == 1
        ? 'disabled'
        : ''}
        onClick={this.lastOne}>
        <i className="iconfont icon-next1"></i>
      </button>
    ))

    //to begin
    if (range > 2) {
      List.push(
        <button onClick={this.toBegin} key='tobegin'>1</button>
      );
      List.push(
        <button onClick={this.lastRange} key='lastrange'>
          <i className="iconfont icon-more"></i>
        </button>
      );
    }

    //  middle
    let _current = 0;
    for (var i = 0; i < displayCount; i++) {
      _current = range + i;
      List.push(
        <button
          key={_current}
          onClick={this.go}
          className={_current == current
          ? 'disabled'
          : ''}>{_current}</button>
      )
    }

    //  next Range
    let ceil = range + displayCount;
    if (ceil < total - 2) {
      List.push(
        <button onClick={this.nextRange} key='nextrange'>
          <i className="iconfont icon-more"></i>
        </button>
      );
      List.push(
        <button onClick={this.toEnd} key='toEnd'>{total}</button>
      );
    }

    //next one button
    List.push((
      <button
        key="nextone"
        className={current == total
        ? 'disabled'
        : ''}
        onClick={this.nextOne}>
        <i className="iconfont icon-next"></i>
      </button>
    ))

    return (
      <div className={wrapper}>
        {List}
      </div>
    )
  }
}

Pagination.propTypes = {
  func: PropTypes.func.isRequired,
  total: PropTypes.number.isRequired,
  current: PropTypes.number.isRequired
}
export default Pagination