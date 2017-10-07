import React, {Component} from 'react';
import FullPageCard from './FullPageCard'
import QueueAnim from 'rc-queue-anim';
import Textarea from 'react-textarea-autosize';
import showNotification from '../API/showNotification';

import style from './SourceDisplay.css';

let showDemo = () => {

  showNotification(`Adapter是一个JavaScript函数，接收一个json格式的参数，返回一个hitokoto，用于将其他网站返回的json数据转换成本地需要的hitokoto格式。使用new Function("resp",函数体代码)，构造adapter函数，所以只写函数体的代码。API请求的结果将作为参数resp传入函数，你可以直接在函数体里使用resp变量。
      函数体需要返回一个JSON对象，包含的键名有id、hitokoto、source、creator、type、created_at。
      示例：
      function (resp){
        return {
          id: resp.uuid,  //  不建议使用随机值
          hitokoto: resp.hitokoto,
          source: resp.source || '无来源',
          creator: resp.owner,
          type: resp.info.type,
          created_at: resp.info.when
        }}`, 'info', true);

}
export default class SourceDisplay extends Component {

  handleUpdate() {
    let name = this.refs.sourceName.value;
    let url = this.refs.sourceUrl.value;
    let adapter = this.sourceAdapter.value.trim();

    adapter = adapter
      ? adapter
      : 0;

    let {hook, sid, source} = this.props;

    hook.update({
      id: source.id,
      name: name,
      url: url,
      adapter: adapter,
      online: source.online,
      local: source.local
    })

  }

  handleNewSource() {
    let {hook, sid, source} = this.props;
    let name = this.refs.sourceName.value;
    let url = this.refs.sourceUrl.value;
    let adapter = this.sourceAdapter.value.trim();

    if (adapter.length == 0) {
      adapter == 0;
    }
    hook.newSource({
      id: Date.now(),
      name: name,
      url: url,
      adapter: adapter,
      online: true,
      local: true
    }, (err) => {

      if (err && err.message) {
        alert(err.message);
      }
    })
  }

  render() {
    let props = this.props;
    let source = props.source;
    let areaheight;
    if (source && typeof source.adapter == 'string') {
      areaheight = source.adapter.split('\n').length
    }
    if (areaheight < 10) {
      areaheight = 10;
    }
    let oprations;
    if (source) {
      oprations = (
        <div>
          <button onClick={this.handleUpdate.bind(this)}>确认修改</button>
          <button className={style.basicButton} onClick={props.hook.hide}>取消</button>
        </div>
      )
    } else {
      oprations = (
        <div>
          <button onClick={this.handleNewSource.bind(this)}>确认添加</button>
          <button className={style.basicButton} onClick={props.hook.hide}>取消</button>
        </div>
      )
    }

    source = source || {};
    return (
      <FullPageCard cardname={props.title} close={props.hook.hide}>
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
        <br/> {oprations}
      </FullPageCard>
    );
  }
}
