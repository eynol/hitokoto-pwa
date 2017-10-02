import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {matchPath} from 'react-router'
import {Link, withRouter} from 'react-router-dom';
import QueueAnim from 'rc-queue-anim';
import FullPageCard from '../component/FullPageCard'
import style from './NewHitokoto.css';
import Textarea from 'react-textarea-autosize';
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
  componentWillMount() {
    let pathname = this.props.location.pathname;

    let match = matchPath(pathname, {path: '/home/:name/new'})

    if (match) {
      let {params: {
          name
        }} = match;

    }
  }
  goBack() {
    console.log(this.props.history);
    this.props.history.go(-1);
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
    return {hitokoto: content, from: source, category: type}
  }
  publish() {
    let hitokoto = this.getHitokoto();
    if (hitokoto) {
      this.props.publish(hitokoto).then(result => {
        console.log(result);
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
                  ref='source'
                  placeholder="...在这里写来源出处"
                  className={hitokotoSouceInput}
                  defaultValue={hitokoto.from}/>
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