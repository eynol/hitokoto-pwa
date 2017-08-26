import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import QueueAnim from 'rc-queue-anim';
import FullPageCard from '../component/FullPageCard'
import style from './NewHitokoto.css';
import Textarea from 'react-textarea-autosize';
let {
  manageBox,
  clearfix,
  'close-button': closeButton,
  icon,
  close,
  back,
  backButton,
  ellipsis,
  hitokotoTextarea,
  hitokotoSouceInput,
  hitokotoSouceTypeBlock,
  operations
} = style;

class NewHitokoto extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.location.pathname == nextProps.path || this.props.location.pathname == nextProps.path;
  }
  goBack() {
    console.log(this.props.history);
    this
      .props
      .history
      .go(-1);
  }
  handlePreviewClick() {
    let hitokoto = this.getHitokoto();
    if (hitokoto) {
      this
        .props
        .preview(hitokoto);
    }
  }
  getHitokoto() {
    let {
        source: {
          value: source
        },
        type: {
          value: type
        }
      } = this.refs,
      content = this.textarea.value;
    if (content.length == 0) {
      return alert('hitokoto内容不能为空！')
    }
    if (source.length == 0) {
      return alert('hitokoto来源不能为空！')
    }
    return {hitokoto: content, from: source, type}
  }
  publish() {
    let hitokoto = this.getHitokoto();
    if (hitokoto) {
      this
        .props
        .publish(hitokoto);
    }
  }
  render() {
    let {location, path} = this.props;
    let child = '';

    return (
      <QueueAnim type={['left', 'right']} ease={['easeOutQuart', 'easeInOutQuart']}>{location.pathname == path || location.pathname == '/home/hitokoto/preview'
          ? <FullPageCard
              key="23"
              style={{
              backgroundColor: '#fff'
            }}>
              <div className={manageBox}>
                <h1 className={clearfix}>添加Hitokoto
                  <a
                    href='javascript:void'
                    onClick={this
                    .goBack
                    .bind(this)}
                    className={closeButton}>
                    <i className={icon + ' ' + close}></i>
                  </a>
                  <a
                    href='javascript:void'
                    onClick={this
                    .goBack
                    .bind(this)}
                    className={backButton}>
                    <i className={icon + ' ' + back}></i>
                  </a>
                </h1>
                <br/>
                <div>
                  <div>
                    <Textarea
                      minRows={3}
                      inputRef={textarea => this.textarea = textarea}
                      className={hitokotoTextarea}
                      placeholder="请在此输入hitokoto"/>
                  </div>
                  <div>
                    <input
                      type="text"
                      ref='source'
                      placeholder="...在这里写来源出处"
                      className={hitokotoSouceInput}/>
                  </div>
                  <div className={hitokotoSouceTypeBlock}>
                    <p>先选择来源类别：
                      <select defaultValue='其他' ref='type'>
                        <option value="动漫">动漫</option>
                        <option value="小说">小说</option>
                        <option value="散文随笔">散文随笔</option>
                        <option value="诗词">诗词</option>
                        <option value="漫画">漫画</option>
                        <option value="游戏">游戏</option>
                        <option value="电影">电影</option>
                        <option value="歌词">歌词</option>
                        <option value="电视剧">电视剧</option>
                        <option value="来自网络">来自网络</option>
                        <option value="原创">原创</option>
                        <option value="其他">其他</option>
                      </select>
                    </p>
                  </div>

                  <div className={operations}>
                    <button
                      onClick={this
                      .handlePreviewClick
                      .bind(this)}>预览</button>&nbsp;
                    <button
                      onClick={this
                      .publish
                      .bind(this)}>发布</button>
                  </div>
                </div>
              </div>
            </FullPageCard>
          : null}</QueueAnim>
    )
  }
}

export default withRouter(NewHitokoto);