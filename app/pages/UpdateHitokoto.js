import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {matchPath} from 'react-router'
import {Link, withRouter} from 'react-router-dom';
import QueueAnim from 'rc-queue-anim';

import _asign from 'lodash/assign';

import FullPageCard from '../component/FullPageCard'
import style from './NewHitokoto.css';
import Textarea from 'react-textarea-autosize';
let {hitokotoTextarea, hitokotoSouceInput, hitokotoSouceTypeBlock, operations} = style;

class UpdateHitokoto extends Component {
  constructor(props) {
    super(props);
    this.goBack = this.goBack.bind(this);
    this.handlePreviewClick = this.handlePreviewClick.bind(this);
    this.update = this.update.bind(this);
  }
  componentWillMount() {
    let pathname = this.props.location.pathname;

    let match = matchPath(pathname, {path: '/home/:name/update'})

    if (match) {
      let {params: {
          name
        }} = match;

      if (!this.props.hitokoto) {
        setTimeout(() => {
          this.props.history.replace(pathname.replace(/\/update$/, ''));
        }, 0)
      }
    }
  }
  goBack() {
    this.props.history.goBack();
  }
  handlePreviewClick() {
    let hitokoto = this.getHitokoto();
    if (hitokoto) {
      hitokoto = _asign(JSON.parse(JSON.stringify(this.props.hitokoto)), hitokoto)
      this.props.preview(hitokoto);
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
      return alert('hitokoto内容不能为空！')
    }
    if (source.length == 0) {
      return alert('hitokoto来源不能为空！')
    }
    return {hitokoto, author, source, category}
  }
  update() {
    let hitokoto = this.getHitokoto();
    if (hitokoto) {
      hitokoto = _asign(JSON.parse(JSON.stringify(this.props.hitokoto)), hitokoto)
      this.props.update(hitokoto).then(result => {
        console.log(result);
      });
    }
  }
  render() {
    let {location: {
        pathname
      }, hitokoto} = this.props;

    console.log(hitokoto)
    let child = '';
    let reg = /^\/home\/[^\/]*\/update$/;
    return (
      <QueueAnim type={['right', 'left']} ease={['easeOutQuart', 'easeInOutQuart']}>{reg.test(pathname)
          ? <FullPageCard
              key="23"
              style={{
              backgroundColor: '#fff'
            }}
              cardname='修改Hitokoto'>
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
                  defaultValue={hitokoto.source}
                  ref='source'
                  placeholder="...在这里写来源出处"
                  className={hitokotoSouceInput}/>
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
                <button onClick={this.update}>确认修改</button>
                <button onClick={this.goBack}>取消</button>
              </div>
            </FullPageCard>
          : null}</QueueAnim>
    )
  }
}
UpdateHitokoto.propTypes = {
  preview: PropTypes.func.isRequired,
  update: PropTypes.func.isRequired
}

export default withRouter(UpdateHitokoto);