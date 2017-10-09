import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {matchPath} from 'react-router'
import QueueAnim from 'rc-queue-anim';
import Textarea from 'react-textarea-autosize';

import FullPageCard from '../component/FullPageCard'

import showNotification from '../API/showNotification';
import httpManager from '../API/httpManager'

import style from './HitokotoEditor.css';
let {hitokotoTextarea, hitokotoSouceInput, hitokotoSouceTypeBlock, operations} = style;

const doRender = /^\/home\/([^\/]+)\/(new|update)$/;
const isNew = /\/new$/;

class HitokotoEditor extends Component {
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
    this.update = this.update.bind(this);
  }

  goBack() {
    this.props.history.goBack();
  }
  handlePreviewClick() {
    let hitokoto = this.getHitokoto();
    if (hitokoto) {

      this.props.preview(hitokoto, 'preview');
      this.props.history.push(this.props.location.pathname + '/preview')
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
      let matchs = doRender.exec(this.props.location.pathname);
      let collectionName = matchs[1];

      return httpManager.API_newHitokoto(collectionName, hitokoto).then(result => {
        if (result.err) {
          showNotification(result.err, 'error');
        } else {
          showNotification('发布成功！', 'success');
          this.props.history.push('/home/' + collectionName);
          this.props.refreshHitokotoList()
        }
        return result
      });
    }
  }
  update() {
    let hitokoto = this.getHitokoto();

    if (hitokoto) {
      let matchs = doRender.exec(this.props.location.pathname);
      let collectionName = matchs[1];

      hitokoto._id = this.props.within._id;

      return httpManager.API_updateHitokoto(collectionName, hitokoto).then(result => {
        if (result.err) {
          showNotification(result.err, 'error');
        } else {
          showNotification('修改成功', 'success');

          this.props.history.push('/home/' + collectionName);
          this.props.refreshHitokotoList()
        }
        return result
      });
    }
  }
  render() {
    let {location: {
        pathname
      }} = this.props;

    let hitokoto = this.props.within || {
      category: '其他'
    };

    let child = '';

    if (!doRender.test(pathname)) {
      return null;
    }
    let thisIsNew = isNew.test(pathname);

    return (
      <FullPageCard
        style={{
        backgroundColor: '#fff'
      }}
        cardname={thisIsNew
        ? "新增Hitokoto"
        : "修改hitokoto"}>
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
              <option value="书摘">书摘</option>
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
          <button onClick={this.handlePreviewClick}>预览</button>
          {thisIsNew
            ? <button onClick={this.publish}>确认新增</button>
            : <button onClick={this.update}>确认修改</button>}
          <button onClick={this.goBack}>取消</button>
        </div>
      </FullPageCard>

    )
  }
}

HitokotoEditor.propTypes = {
  preview: PropTypes.func.isRequired,
  refreshHitokotoList: PropTypes.func.isRequired
}

export default HitokotoEditor;