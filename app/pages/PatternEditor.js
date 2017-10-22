import React, {Component} from 'react';
import FullPageCard from '../component/FullPageCard'

import showNotification from '../API/showNotification';
import hitokotoDriver from '../API/hitokotoDriver'

import {timerbox, countBox} from './PatternEditor.css';

const tip = (info) => {
  showNotification(info, 'info', true)
};

const patterManager = hitokotoDriver.patterManager;

class PatternEditor extends Component {

  constructor(props) {
    super(props);

    let {rinfo} = this.props,
      pid = Number(rinfo[1]);

    let pattern = patterManager.patterns.find(p => p.id === pid);
    if (!pattern) {
      pattern = {}
    }
    //  source 添加其他来源。
    let sourceIDMap = {},
      needTobeAppend = [],
      sourcesCopy = JSON.parse(JSON.stringify(pattern.sources || []));

    //  取id做index的缓存
    sourcesCopy.forEach(function (element) {
      sourceIDMap[element.id] = true;
    });

    //  找到不在模式中使用的来源，添加到needTobeAppend
    patterManager.sources.forEach((source) => {
      if (!sourceIDMap[source.id]) {
        let copy = JSON.parse(JSON.stringify(source))
        copy.online = false; // 对于模式中没有包含的来源，应该为未开启状态
        copy.local = false;
        copy.count = 0, //  对于模式中没有包含的来源，循环计数器应该为0
        needTobeAppend.push(copy)
      }
    });

    //  拼接两个数组
    let concated = sourcesCopy.concat(needTobeAppend);

    this.state = {
      sourcesCopy: concated
    };

    //bind functions
    this.increase = this.increase.bind(this);
    this.decrease = this.decrease.bind(this);
    this.goBack = this.goBack.bind(this);
  }
  goBack() {
    this.props.history.goBack();
  }
  increase() {
    let interval = Number(this.refs.interval.value);
    if (interval !== interval) {
      interval = 0;
    } else {
      interval = interval < 0
        ? 0
        : interval + 1;
    }
    this.refs.interval.value = interval;
  }
  decrease() {
    let interval = Number(this.refs.interval.value);
    if (interval !== interval) {
      interval = 0;
    } else {
      interval = interval < 1
        ? 0
        : interval - 1;
    }
    this.refs.interval.value = interval;
  }
  resetCount(index, evt) {
    this.refs['count' + index].value = 0;
  }

  handleUpdate() {
    let {rinfo} = this.props,
      pid = Number(rinfo[1]);

    let name = this.refs.name.value;
    let defaultPattern = this.refs.default.checked;
    let interval = this.refs.interval.value;
    let type = this.refs.type.value;

    interval = Number(interval);

    //  将对应的count更改到source中
    let sources = this.state.sourcesCopy.map((source, index) => {
      let value = Number(this.refs['count' + index].value);
      if (value !== value) {
        value = 0;
      }
      source.count = value;
      return source;
    }).reduce((list, source) => {
      if (source.local || source.online) {
        list.push(source);
      }
      return list;
    }, []);

    let valid = this.validatePattern(name, interval, sources)
    if (valid.length != 0) {
      showNotification(valid.join('\n'), 'error');
    } else {
      let newPattern = {
        id: pid,
        name: name,
        default: defaultPattern,
        interval: interval,
        sources: sources,
        type: type
      }

      hitokotoDriver.updatePattern(newPattern.id, newPattern);
      showNotification('修改模式成功！', 'success');
      this.goBack()
    }
  }

  handleNewPattern() {

    let name = this.refs.name.value;
    let defaultPattern = this.refs.default.checked;
    let interval = this.refs.interval.value;
    let type = this.refs.type.value;

    interval = Number(interval);

    let sources = this.state.sourcesCopy.map((source, index) => {
      let value = Number(this.refs['count' + index].value);
      if (value !== value) {
        value = 0;
      }
      source.count = value;
      return source;
    }).reduce((list, source) => {
      if (source.local || source.online) {
        list.push(source);
      }
      return list;
    }, []);

    let valid = this.validatePattern(name, interval, sources)
    if (valid.length != 0) {
      showNotification(valid.join('\n'), 'error');
    } else {
      let pattern = {
        id: Date.now(),
        name: name,
        default: defaultPattern,
        interval: interval,
        sources: sources,
        type: type
      }

      patterManager.newPattern(pattern);
      showNotification('添加模式成功！', 'success');
      this.goBack()
    }
  }

  validatePattern(name, interval, sources) {
    let ret = []
    if (name.trim().length == 0) {
      ret.push('模式名字不能为空！')
    }
    if (interval != interval) {
      ret.push('请输入正确的刷新时间！')
    }
    if (interval < 0) {
      ret.push('刷新时间不能小于0!')
    }
    if (interval > 0 && interval < 5) {
      ret.push('刷新时间间隔太短!')
    }
    if (sources.length == 0) {
      ret.push('来源至少有一个为允许状态！')
    }
    return ret;
  }
  sourceChange(index, key, value) {
    let sourcesCopy = this.state.sourcesCopy;
    sourcesCopy[index][key] = value;
    this.setState({sourcesCopy: sourcesCopy});
  }

  render() {
    let {rinfo} = this.props,
      pid = rinfo[1],
      doNewone = pid === 'new',
      sources = patterManager.sources,
      pattern;

    if (!doNewone) {
      pid = Number(pid);
      pattern = patterManager.patterns.find(p => p.id == pid);
    }

    pattern = pattern || {};

    let sourcesList = this.state.sourcesCopy.map((src, index) => {
      return (
        <li
          key={src.id}
          className={(src.local || src.online)
          ? ''
          : "inactive"}>
          <h5 className="ellipsis">{src.name}({src.url})</h5>
          <div className={countBox}>
            <i
              className="iconfont icon-refresh"
              title="重置循环计数器为0"
              onClick={this.resetCount.bind(this, index)}></i>
            <input
              type="number"
              ref={'count' + index}
              title="循环计数器"
              defaultValue={src.count}/>
          </div>
          <div>
            <input
              hidden
              type="checkbox"
              id={src.id + 'ol'}
              defaultChecked={src.online}
              onChange={(e) => {
              this.sourceChange(index, 'online', e.target.checked);
            }}/>
            <label htmlFor={src.id + 'ol'}></label>
            允许使用网络<br/>
            <input
              hidden
              type="checkbox"
              id={src.id + 'local'}
              defaultChecked={src.local}
              onChange={(e) => {
              this.sourceChange(index, 'local', e.target.checked);
            }}/>
            <label htmlFor={src.id + 'local'}></label>
            允许使用本地缓存
          </div>
        </li>
      )
    });

    return (
      <FullPageCard cardname={doNewone
        ? '新增模式'
        : '修改模式'}>
        <div className="form">
          <div className="text-filed blocked">
            <input type="text" ref="name" required defaultValue={pattern.name}/>
            <label data-content="模式名称（取一个好名字吧）">模式名称</label>
          </div>
          <br/>
          <label htmlFor="">默认模式：</label>
          <input
            type="checkbox"
            id={pattern.id + 'default'}
            defaultChecked={pattern.default}
            ref='default'
            hidden/>
          <label htmlFor={pattern.id + 'default'}></label>
          <button onClick={() => tip('默认模式将在应用重新载入时被使用，不是修改后立即使用（在显示设置里修改模式将会立即启用）。')}>
            <i className="iconfont icon-question"></i>
          </button>
          <br/>
          <div className={timerbox}>
            <label htmlFor="">定时刷新：</label>
            <i className="iconfont icon-jian" onClick={this.decrease}></i>&nbsp;<input
              type="number"
              ref='interval'
              defaultValue={pattern.interval
        ? pattern.interval
        : 0}
              placeholder='秒数'/>&nbsp;
            <i className="iconfont icon-jia" onClick={this.increase}></i>&nbsp;
            <button onClick={() => tip('每隔指定秒数后自动刷新hitokoto。设置为0表示不使用定时刷新。秒数必须大于等于5秒。')}>
              <i className="iconfont icon-question"></i>
            </button>
          </div>
          <br/>

          <label htmlFor="">请求类型:</label>
          <select ref='type' defaultValue={pattern.type || 'random'}>
            <option value="random">随机</option>
            <option value="next">全部循环</option>
          </select>
          <button
            onClick={() => tip('全部循环时会发送对应来源的循环计数器的数字，每一次成功获取就加1（后台自动取模运算，用循环计数器和句集长度做模运算）。第三方网站不支持循环计数器时，全部循环将不' +
              '起作用。')}>
            <i className="iconfont icon-question"></i>
          </button>
          <br/>
          <label htmlFor="">来源</label>
          <button
            onClick={() => tip('允许使用网络：每个来源的hitokoto都会通过HTTP请求获取，并备份一份到本地缓存中。\n允许使用本地缓存：将会在「离线」时或者「从网络获取失败」时，从本地' +
              '缓存中获取缓存的hitokoto。\n\n如果只允许使用网络，那么每次获取都必须通过网络请求来获取，并且离线后将不能使用缓存的数据；如果只允许使用本地缓存，那么' +
              '不会消耗任何流量，将直接从本地缓存中获取（前提是本地缓存中有数据）；如果两个都开启，将会在「从网络中获取失败」或「请求超时」时使用本地缓存。')}>
            <i className="iconfont icon-question"></i>
          </button><br/>
          <ul>
            {sourcesList}
          </ul>
        </div>
        <div>
          {doNewone
            ? <button onClick={this.handleNewPattern.bind(this)}>确认新增</button>
            : <button onClick={this.handleUpdate.bind(this)}>确认修改</button>}
          <button onClick={this.goBack} className="color-basic">取消</button>
        </div>

      </FullPageCard>
    );
  }
}

export default PatternEditor;