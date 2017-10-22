import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {matchPath} from 'react-router'
import QueueAnim from 'rc-queue-anim';
import Textarea from 'react-textarea-autosize';

import FullPageCard from '../component/FullPageCard'

import {getURL} from '../API/SourceManager'
import indexedDBManager from '../API/IndexedDBManager'
import showNotification from '../API/showNotification';
import {default as httpManager, timeoutPromise} from '../API/httpManager'

import style from './HitokotoEditor.css';
let {
  hitokotoTextarea,
  hitokotoSouceInput,
  hitokotoSouceTypeBlock,
  operations,
  suggeBox,
  inputSuggestion
} = style;

class HitokotoEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hitokoto: {
        category: '其他',
        authorChoices: [],
        sourceChoices: []
      }
    }

    this.goBack = this.goBack.bind(this);
    this.handlePreviewClick = this.handlePreviewClick.bind(this);
    this.publish = this.publish.bind(this);
    this.update = this.update.bind(this);

    this.authorSuggestion = this.getSuggestion.bind(this, 'author');
    this.clickAuthorSugg = this.clickSuggestion.bind(this, 'author');
    this.authorBlur = this.blurSuggestion.bind(this, 'author');

    this.sourceSuggestion = this.getSuggestion.bind(this, 'source');
    this.clickSourceSugg = this.clickSuggestion.bind(this, 'source');
    this.sourceBlur = this.blurSuggestion.bind(this, 'source');

  }

  goBack() {
    this.props.history.goBack();
  }
  getSuggestion(key, evt) {
    let value = evt.target.value;
    if (value && value.trim()) {
      timeoutPromise(300, indexedDBManager.getHitokotoSuggestion(key, value)).then(res => {
        this.setState(state => {
          state[key + 'Choices'] = res.slice(0, 5);
          return state;
        })
      })
    }
  }
  clickSuggestion(key, evt) {
    let value = evt.target.textContent;
    this.refs[key].value = value;
  }
  blurSuggestion(key) {
    setTimeout(() => {
      this.setState(state => {
        state[key + 'Choices'] = [];
        return state;
      });

    }, 200);
  }
  handlePreviewClick() {
    let hitokoto = this.getHitokoto();
    if (hitokoto) {

      this.props.handlePreview(hitokoto, 'preview');
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
        },
        state: {
          checked: state
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
    return {hitokoto, author, source, category, state}
  }
  publish() {
    let hitokoto = this.getHitokoto();
    if (hitokoto) {

      let collectionName = this.props.rinfo[1];

      return httpManager.API_newHitokoto(collectionName, hitokoto).then(result => {
        let hito = result.hitokoto;
        indexedDBManager.putHitokoto(getURL(hito.creator_id, hito.fid, false), hito);
        showNotification(result.message, 'success');
        this.props.history.goBack();
        this.props.refreshHitokotoList();

        return result
      });
    }
  }
  update() {
    let hitokoto = this.getHitokoto();

    if (hitokoto) {

      let collectionName = this.props.rinfo[1];

      hitokoto._id = this.props.within._id;

      return httpManager.API_updateHitokoto(collectionName, hitokoto).then(result => {

        // let hito = result.hitokoto;
        /*
        result.hitokoto is undefined
        indexedDBManager.putHitokoto(getURL(hito.creator_id, hito.fid, false), hito);
        */
        showNotification(result.message, 'success');

        this.props.history.goBack();
        this.props.refreshHitokotoList()

        return result
      });
    }
  }
  render() {
    let {location: {
        pathname
      }, rinfo} = this.props;
    let thisIsNew = rinfo[2] == 'new';

    let hitokoto = this.props.within;

    if (thisIsNew) {
      if (this.props.preview) {
        hitokoto = this.props.preview;
      } else {
        hitokoto = {
          category: '其他',
          state: 'public'
        };
      }
    } else if (!thisIsNew && !hitokoto) {
      return (
        <FullPageCard
          style={{
          backgroundColor: '#fff'
        }}
          cardname={"未知错误"}>
          <h1>数据已被清空</h1>
          <p>
            请不要在编辑的时候刷新页面<button onClick={() => this.props.history.push('/')}>返回首页</button>
          </p>
        </FullPageCard>
      )
    }

    let {authorChoices, sourceChoices} = this.state;

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
        <div className={suggeBox}>
          {authorChoices && authorChoices.length
            ? (
              <div className={inputSuggestion}>
                {authorChoices.map(choice => (
                  <span key={choice} onClick={this.clickAuthorSugg}>{choice}</span>
                ))}
              </div>
            )
            : null}
          <input
            type="text"
            ref='author'
            placeholder="...在这里写原作者(可选)"
            onChange={this.authorSuggestion}
            onFocus={this.authorSuggestion}
            onBlur={this.authorBlur}
            className={hitokotoSouceInput}
            defaultValue={hitokoto.author}/></div>
        <div className={suggeBox}>
          {sourceChoices && sourceChoices.length
            ? (
              <div className={inputSuggestion}>
                {sourceChoices.map(choice => (
                  <span key={choice} onClick={this.clickSourceSugg}>{choice}</span>
                ))}
              </div>
            )
            : null}
          <input
            type="text"
            ref='source'
            placeholder="...在这里写来源出处(必填)"
            onChange={this.sourceSuggestion}
            onFocus={this.sourceSuggestion}
            onBlur={this.sourceBlur}
            className={hitokotoSouceInput}
            defaultValue={hitokoto.source}/>
        </div>
        <div className={hitokotoSouceTypeBlock}>
          <p>类别：
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
          <hr/>
          <p>
            <span className="form">
              私密<a
                href="javascript:"
                title="点击查看提示"
                onClick={() => showNotification('公开的句子将会出现在「探索」中，私密的句子只有自己可以看到，审核中的句子只有审核通过后才会在「探索中」。如果修改已经公开了的句子，那么这个句子将会再次被审核。' +
          '\n审核机制是为了防止恶意内容，不防君子防小人。',
      'info', true)}>
                <i className="iconfont icon-question"></i>
              </a>：
              <input
                type="checkbox"
                ref="state"
                hidden
                id="id-public"
                defaultChecked={hitokoto.state == 'private' || hitokoto.state == 'rejected'}/>
              <label htmlFor="id-public"></label>(公开的句子将会被审核，审核通过后才会出现在「探索」中。)
            </span>
            {hitokoto.state == 'reviewing'
              ? (
                <span className="color-red">正在审核中</span>
              )
              : null}
            {hitokoto.state == 'rejected'
              ? (
                <span className="color-red">已驳回，建议修改。</span>
              )
              : null}
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
  rinfo: PropTypes.array.isRequired,
  handlePreview: PropTypes.func.isRequired,
  refreshHitokotoList: PropTypes.func.isRequired
}

export default HitokotoEditor;