import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {matchPath} from 'react-router'
import {Link, withRouter} from 'react-router-dom';
import QueueAnim from 'rc-queue-anim';
import Textarea from 'react-textarea-autosize';

import FullPageCard from '../component/FullPageCard'
import showNotification from '../API/showNotification';

import style from './NewHitokoto.css';
let {hitokotoTextarea, hitokotoSouceInput, hitokotoSouceTypeBlock, operations} = style;

class NewHitokoto extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hitokoto: {
        category: '其他'
      }
    }

    this.goBack = this.goBack.bind(this);
    this.handlePreviewClick = this.handlePreviewClick.bind(this);
    this.publish = this.publish.bind(this);
  }

  goBack() {
    this.props.history.goBack();
  }
  handlePreviewClick() {
    let hitokoto = this.getHitokoto();
    if (hitokoto) {
      this.props.preview(hitokoto);
      this.setState({hitokoto})
    }
  }
  getHitokoto() {
    let {
        source: {
          value: source
        },
        type: {
          value: category
        },
        author: {
          value: author
        }
      } = this.refs,
      hitokoto = this.textarea.value;

    if (hitokoto.length == 0) {
      showNotification('hitokoto内容不能为空！', 'error');
      return;
    }
    if (source.length == 0) {
      showNotification('hitokoto来源不能为空！', 'error')
      return;
    }
    return {hitokoto, author, source, category}
  }
  publish() {
    let hitokoto = this.getHitokoto();
    if (hitokoto) {
      this.props.publish(hitokoto).then(result => {
        this.setState({hitokoto: ({})})
      });
    }
  }
  render() {
    let {location: {
        pathname
      }} = this.props;

    let hitokoto = this.state.hitokoto;
    let child = '';
    let reg = /^\/home\/[^\/]*\/new$/;
    return (
      <QueueAnim type={['right', 'left']} ease={['easeOutQuart', 'easeInOutQuart']}>{reg.test(pathname)
          ? <FullPageCard
              key="23"
              style={{
              backgroundColor: '#fff'
            }}
              cardname="添加Hitokoto">
              <div>
                <Textarea
                  minRows={3}
                  inputRef={textarea => this.textarea = textarea}
                  className={hitokotoTextarea}
                  placeholder="请在此输入hitokoto"
                  defaultValue={hitokoto.hitokoto}/>
              </div>
              <div>
                <input
                  type="text"
                  ref='author'
                  placeholder="...在这里写原作者(可选)"
                  className={hitokotoSouceInput}
                  defaultValue={hitokoto.author}/>
                <input
                  type="text"
                  ref='source'
                  placeholder="...在这里写来源出处(必填)"
                  className={hitokotoSouceInput}
                  defaultValue={hitokoto.source}/>
              </div>
              <div className={hitokotoSouceTypeBlock}>
                <p>先选择来源类别：
                  <select defaultValue={hitokoto.category} ref='type'>
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
                <button onClick={this.handlePreviewClick}>预览</button>&nbsp;
                <button onClick={this.publish}>发布</button>
                <button onClick={this.goBack}>取消</button>
              </div>
            </FullPageCard>
          : null}</QueueAnim>
    )
  }
}
NewHitokoto.propTypes = {
  preview: PropTypes.func.isRequired,
  publish: PropTypes.func.isRequired
}

export default withRouter(NewHitokoto);