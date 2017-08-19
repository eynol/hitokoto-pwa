import React, {Component} from 'react';
import FullPageCard from './FullPageCard'

import style from './PatternDisplay.css';
import {ellipsis} from '../pages/UI.css'
let showDemo = () => {
  setTimeout(function () {
    alert('使用new Function("resp",函数体代码)，构造adapter函数，所以只写函数体的代码。\nAPI请求的结果将作为参数resp传入函数，你可以直' +
        '接在函数体里使用resp变量。\n函数体需要返回一个JSON对象，包含的键名有id、hitokoto、from、creator、type、created_at。' +
        '\n示例：\nreturn {\n  id: resp.uuid,\n  hitokoto: resp.hitokoto,\n  from: resp.sour' +
        'ce,\n  creator: resp.owner,\n  type: resp.info.type,\n  created_at: resp.info.wh' +
        'en,\n}');
  }, 0)
}
export default class PatternDisplay extends Component {

  constructor(props) {
    super(props);
    console.log(props)
    let pattern = props.pattern;
    if (!pattern) {
      pattern = {}
    }
    //source 添加其他来源。
    let sourceIDMap = {},
      needTobeAppend = [],
      sourcesCopy = JSON.parse(JSON.stringify(pattern.sources
        ? pattern.sources
        : []));

    sourcesCopy.forEach(function (element) {
      sourceIDMap[element.id] = true;
    });

    props
      .sources
      .forEach((source) => {
        if (!sourceIDMap[source.id]) {
          let copy = JSON.parse(JSON.stringify(source))
          copy.online = false; // 对于模式中没有包含的来源，应该为未开启状态
          copy.local = false;
          needTobeAppend.push(copy)
        }
      });
    let concated = sourcesCopy.concat(needTobeAppend);

    this.state = {
      sourcesCopy: concated
    }
  }

  handleUpdate() {
    let {hook, pattern} = this.props;
    let name = this.refs.name.value;
    let defaultPattern = this.refs.default.checked;
    let interval = this.refs.interval.value;
    let type = this.refs.type.value;

    interval = Number(interval);

    let sources = this
      .state
      .sourcesCopy
      .filter((source) => (source.local || source.online));

    let valid = this.validatePattern(name, interval, sources)
    if (valid.length != 0) {
      alert(valid.join('\n'));
    } else {
      let newPattern = {
        id: pattern.id,
        name: name,
        default: defaultPattern,
        interval: interval,
        sources: sources,
        type: type
      }

      hook.update(newPattern.id, newPattern);
    }
  }

  handleNewPattern() {
    let {hook} = this.props;
    let name = this.refs.name.value;
    let defaultPattern = this.refs.default.checked;
    let interval = this.refs.interval.value;
    let type = this.refs.type.value;

    interval = Number(interval);

    let sources = this
      .state
      .sourcesCopy
      .filter((source) => (source.local || source.online));

    let valid = this.validatePattern(name, interval, sources)
    if (valid.length != 0) {
      alert(valid.join('\n'));
    } else {
      let pattern = {
        id: Date.now(),
        name: name,
        default: defaultPattern,
        interval: interval,
        sources: sources,
        type: type
      }

      hook.newPattern(pattern);
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
      ret.push('来源不能为空！')
    }
    return ret;
  }
  sourceChange(index, key, value) {
    let sourcesCopy = this.state.sourcesCopy;
    sourcesCopy[index][key] = value;
    this.setState({sourcesCopy: sourcesCopy});
  }

  render() {
    let props = this.props;
    let pattern = props.pattern;
    let sources = this.props.sources;
    let oprations;
    if (pattern) {
      oprations = (
        <div>
          <button className={style.basicButton} onClick={props.hook.hide}>取消</button>&nbsp;
          <button
            className={style.deleteButton}
            onClick={props
            .hook
            .delete
            .bind(null, pattern.id)}>删除</button>&nbsp;
          <button onClick={this
            .handleUpdate
            .bind(this)}>确认修改</button>
        </div>
      )
    } else {
      oprations = (
        <div>
          <button className={style.basicButton} onClick={props.hook.hide}>取消</button>&nbsp;
          <button onClick={this
            .handleNewPattern
            .bind(this)}>确认添加</button>
        </div>
      )
    }

    pattern = pattern || {};

    let sourcesList = this
      .state
      .sourcesCopy
      .map((src, index) => {
        return (
          <li
            key={src.id}
            className={(src.local || src.online)
            ? ''
            : style.disabled}>
            <p className={ellipsis}>{src.name}({src.url})</p>
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
      <FullPageCard>
        <div className={style.displaybox}>
          <h1>{props.title}</h1>
          <br/>
          <div className={style.form}>
            <label htmlFor="">名称：</label><input
              type="text"
              ref="name"
              defaultValue={pattern.name}
              placeholder='给模式取一个好名字吧~'/><br/>
            <label htmlFor="">默认模式：</label>
            <input
              type="checkbox"
              id={pattern.id + 'default'}
              defaultChecked={pattern.default}
              ref='default'
              hidden/>
            <label htmlFor={pattern.id + 'default'}></label>
            <p>
              <i>tips:</i>默认模式将在应用重新载入时被使用</p><br/>
            <label htmlFor="">定时刷新：</label><input
              type="number"
              ref='interval'
              defaultValue={pattern.interval
        ? pattern.interval
        : 0}
              placeholder='秒数'/>
            <p>
              <i>tips:</i>单位为秒，每隔指定秒数后自动刷新hitokoto。设置为0表示不使用定时刷新。秒数必须大于等于5秒。</p>
            <br/>

            <label htmlFor="">请求类型:</label>
            <select
              ref='type'
              defaultValue={pattern.type
              ? pattern.type
              : 'random'}>
              <option value="random">随机</option>
              <option value="next">遍历</option>
            </select>
            <br/>
            <label htmlFor="">来源:</label><br/>
            <p>
              <i>tips:</i>每个来源请求的hitokoto都会缓存一份到浏览器数据库中，在离线时或仅使用本地数据时使用。可以在个人中心缓存某个来源的全部数据到本地的浏览器数据库。</p>
            <ul>
              {sourcesList}
            </ul>
          </div>
          {oprations}
        </div>
      </FullPageCard>
    );
  }
}
