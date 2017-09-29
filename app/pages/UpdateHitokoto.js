import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {matchPath} from 'react-router'
import {Link, withRouter} from 'react-router-dom';
import QueueAnim from 'rc-queue-anim';

import _asign from 'lodash/assign';

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
    console.log(this.props.history);
    this.props.history.go(-1);
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
        }
      } = this.refs,
      content = this.textarea.value;
    if (content.length == 0) {
      return alert('hitokoto内容不能为空！')
    }
    if (source.length == 0) {
      return alert('hitokoto来源不能为空！')
    }
    return {hitokoto: content, from: source, category}
  }
  update() {
    let hitokoto = this.getHitokoto();
    if (hitokoto) {
      hitokoto = _asign(JSON.parse(JSON.stringnify(this.props.hitokoto)), hitokoto)
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
    let reg = /^\/home\/[^\/]*\/update$/im;
    return (
      <QueueAnim type={['right', 'left']} ease={['easeOutQuart', 'easeInOutQuart']}>{reg.test(pathname)
          ? <FullPageCard
              key="23"
              style={{
              backgroundColor: '#fff'
            }}>
              <div className={manageBox}>
                <h1 className={clearfix}>修改Hitokoto
                  <a href='javascript:void' onClick={this.goBack} className={closeButton}>
                    <i className={icon + ' ' + close}></i>
                  </a>
                  <a href='javascript:void' onClick={this.goBack} className={backButton}>
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
                      placeholder="请在此输入hitokoto"
                      defaultValue={hitokoto.hitokoto}/>
                  </div>
                  <div>
                    <input
                      type="text"
                      defaultValue={hitokoto.from}
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
                </div>
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