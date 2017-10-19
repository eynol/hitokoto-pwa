import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import QueueAnim from 'rc-queue-anim';
import FullPageCard from '../component/FullPageCard'

import {thanksList, debug, article} from './About.css';

class About extends Component {

  render() {
    let {path, location} = this.props;
    return (
      <FullPageCard cardname="关于">
        <div className={article}>
          <section>
            <blockquote>
              <p>
                简单来说，一言（ヒトコト）指的是就是一句话，可以是动漫中的台词，可以是小说中的语句，也可以是网络上的各种小段子。<br/>或是感动，或是开心，又或是单纯的回忆，来到这里，留下你所喜欢的那一句句话，与大家分享，这就是一言存在的目的。<br/>*:本段文本源自<a href="http://hitokoto.us" target="_blank" rel="noopener">hitokoto.us.</a>
              </p>
            </blockquote>
            <br/>
            <p>总而言之，这个网站就是展示能够触动你内心的一句话的网站，你可以在此发布，收藏，分享你收集的句子。这些句子可以是动漫里的，可以是书上摘抄的句子，也可以是网上很有道理的话，或者是电影里的经典台词。</p>
          </section>
          <section>
            <h2>我可以写什么东西？</h2>
            <p>所有你觉得很有意义的句子都可以写，无论是书摘还是对话，或者是网易云音乐里最打动你的评论。</p>
          </section>
          <section >
            <h2>使用指南</h2>
            <p>首先要知道几个概念。来源指明了指从哪里获取句子，是从第三方网站还是本站某个句集中获取句子。模式是对来源的归纳，你可以将所有发布诗词的来源添加到自己创建的诗词模式中，或者将发布书摘的来源加入到自己创建的某个模式中。在模式中，你可以开启或者关闭某个来源。一个来源可以出现在多个模式中，在来源管理中删除来源不会影响到已经在模式中的来源。首页展示是依据模式来运行的，从模式中的来源获取句子，然后根据模式的规则运行（定时刷新、顺序循环）。</p>
            <ol>
              <li>
                <b>特殊偏好</b>
                <p>比如喜欢电影台词的，可以将所有发布电影台词的来源加入到自己创建的某个模式中，这样这个模式中获取到的就全部都是电影台词了。</p>
              </li>
              <li>
                <b>离线使用</b>
                <p>如果你希望所有的句子都从本地缓存中获取，不依赖于网络，那么可以在模式中关闭所有来源的「允许使用网络」 并
                  打开「允许使用本地缓存」。为了保证本地缓存中句子数量充足，可以在「离线缓存」页面中将来源中的所有句子全部同步到本地。</p>
              </li>
              <li>
                <b>定时刷新</b>
                <p>如果你觉得每次都要手动点击下一条很麻烦，可以在模式中设置定时刷新的秒数，设置为0表示不使用定时刷新。</p>
              </li>
              <li>
                <b>顺序播放</b>
                <p>如果你希望将某个模式下的句子按照顺序地播放，不随机，可以将模式中的「请求类型」更换为「全部循环」</p>
              </li>
            </ol>
          </section>
          <section >
            <h2>本站公开API</h2>
            <p>
              跨域获取本站句集中公开句子的接口文档&nbsp;&nbsp;
              <b>
                <Link to='/doc'>点此查看调用接口</Link>
              </b>
            </p>
          </section>
          <section className={thanksList}>
            <h2>第三方一言API致谢列表</h2>
            <span>公开的hitokoto来源网站:</span>
            <ul>
              <li>
                <a href="http://hitokoto.cn" target="_blank" rel="noopener">hitokoto.cn</a>
              </li>
              <li>
                <a href="https://moa.moe/hitoapi" target="_blank" rel="noopener">https://moa.moe/hitoapi</a>
              </li>
              <li>
                <a href="https://satori.moe/" target="_blank" rel="noopener">https://satori.moe</a>
              </li>
            </ul>
          </section>
          <section className={debug}>
            <h2>开发者工具</h2>
            <Link to='/tools'>工具箱</Link>
          </section>
        </div>
      </FullPageCard>
    )
  }
}
export default withRouter(About)
// export default About