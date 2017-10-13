import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import QueueAnim from 'rc-queue-anim';
import Textarea from 'react-textarea-autosize';

import hitokotoDriver from '../API/hitokotoDriver'
import showNotification from '../API/showNotification';

import {newOneSource} from "../actions";
import store from '../store';
const patterManager = hitokotoDriver.patterManager;

import FullPageCard from '../component/FullPageCard'
const isUrl = (str) => {
  var urlRegex = `^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$`; //
  var url = new RegExp(urlRegex, 'i');
  return str.length < 2083 && url.test(str);
}

let showDemo = () => {

  showNotification(`Adapter是一个JavaScript函数，接收一个json格式的参数，返回一个hitokoto，用于将其他网站返回的json数据转换成本地需要的hitokoto格式。使用new Function("resp",函数体代码)，构造adapter函数，所以只写函数体的代码。API请求的结果将作为参数resp传入函数，你可以直接在函数体里使用resp变量。
函数体需要返回一个JSON对象，包含的键名有id、hitokoto、source、creator、type、created_at。
示例：
function (resp){
\treturn {
\t\tid: resp.uuid,  //  不建议使用随机值
\t\thitokoto: resp.hitokoto,
\t\tsource: resp.source || '无来源',
\t\tcreator: resp.owner,
\t\ttype: resp.info.type,
\t\tcreated_at: resp.info.when
\t}}`, 'info', true);

}
class SourceEditor extends Component {
  constructor(props) {
    super(props);
    this.goBack = this.goBack.bind(this);
  }
  goBack() {
    this.props.history.goBack();
  }
  handleUpdate() {
    let {rinfo} = this.props,
      sid = Number(rinfo[1]);

    let name = this.refs.sourceName.value.trim();
    let url = this.refs.sourceUrl.value.trim();
    let adapter = this.sourceAdapter.value.trim();

    adapter = adapter
      ? adapter
      : 0;

    if (name.length == 0) {
      showNotification('名字不能为空！', 'error');
      return;
    }
    if (url.length == 0) {
      showNotification('url不能为空！', 'error');
      return;
    }

    if (!isUrl(url)) {
      showNotification('请填写正确的URL！包括请求的协议！', 'error');
      return;
    }

    let source = {
      id: sid,
      name: name,
      url: url,
      adapter: adapter
    };
    if (source.adapter) {
      hitokotoDriver.testSourceAdapter(source.url, source.adapter).then(() => {
        patterManager.updateSource(source.id, source);
        showNotification('修改成功！', 'success')
        this.goBack()
      }).catch((e) => {
        if (typeof e == 'string') {
          showNotification(e, 'error');
        } else if (typeof e == 'object') {
          showNotification(e.message || e.err.message, 'error');
        }
      })

    } else {
      patterManager.updateSource(source.id, source);
      showNotification('修改成功！', 'success');
      this.goBack()
    }

  }

  handleNewSource() {
    let rinfo = this.props.rinfo;

    let name = this.refs.sourceName.value.trim();
    let url = this.refs.sourceUrl.value.trim();
    let adapter = this.sourceAdapter.value.trim();

    if (name.length == 0) {
      showNotification('名字不能为空！', 'error');
      return;
    }
    if (url.length == 0) {
      showNotification('url不能为空！', 'error');
      return;
    }

    if (!isUrl(url)) {
      showNotification('请填写正确的URL！包括请求的协议！', 'error');
      return;
    }

    if (adapter.length == 0) {
      adapter == 0;
    }

    let source = {
      id: Date.now(),
      name: name,
      url: url,
      adapter: adapter,
      online: true,
      local: true
    };

    if (source.adapter) {
      hitokotoDriver.testSourceAdapter(source.url, source.adapter).then(() => {
        patterManager.newSource(source);
        store.dispatch(newOneSource(source));
        this.goBack()
      }).catch((e) => {
        if (typeof e == 'string') {
          showNotification(e, 'error');
        } else if (typeof e == 'object') {
          showNotification(e.message || e.err.message, 'error');
        }
      })

    } else {
      patterManager.newSource(source);
      store.dispatch(newOneSource(source));
      this.goBack()
    }
  }

  render() {
    let {rinfo} = this.props,
      sid = rinfo[1],
      doNewone = sid === 'new',
      areaheight,
      source;

    if (!doNewone) {
      sid = Number(sid);
      // 找到要修改的来源
      source = patterManager.sources.find(source => source.id === sid);
      console.log(source)
    }

    if (source && typeof source.adapter == 'string') {
      areaheight = source.adapter.split('\n').length
    }
    if (areaheight < 10) {
      areaheight = 10;
    }

    source = source || {};
    return (
      <FullPageCard cardname={doNewone
        ? '新增来源'
        : '修改来源'}>
        <p className="fs-tip">
          <i className="iconfont icon-tishi"></i>
          <span>手机全屏模式下可能无法编辑底部区域，请退出全屏模式再编辑。</span>
        </p>
        <div className="form">
          <div className="text-filed blocked">
            <input type="text" required ref="sourceName" defaultValue={source.name}/>
            <label data-content="来源名字">来源名字</label>
          </div>
          <div className="text-filed blocked"><input type="text" required ref="sourceUrl" defaultValue={source.url}/>
            <label data-content="URL(参数也写上)">URL</label>
          </div>
          <label htmlFor="">Adapter:</label><br/>
          <p>
            <i className="iconfont icon-tishi"></i>
            <a href='javascript:' onClick={showDemo}>查看示例</a>
            （非开发人员请跳过该设置，也不要粘贴来历不明的代码，不填写内容表示不使用Adapter。）</p>
          <Textarea
            inputRef={textarea => this.sourceAdapter = textarea}
            minRows={3}
            defaultValue={source.adapter == 0
            ? ''
            : source.adapter}
            placeholder='PS:不要在此粘贴来历不明的代码！'/>
        </div>
        <br/>
        <div>
          {doNewone
            ? <button onClick={this.handleNewSource.bind(this)}>确认新增</button>
            : <button onClick={this.handleUpdate.bind(this)}>确认修改</button>}
          <button onClick={this.goBack} className="color-basic">取消</button>
        </div>
      </FullPageCard>
    );
  }
}
export default withRouter(SourceEditor);