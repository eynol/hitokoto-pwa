import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import QueueAnim from 'rc-queue-anim';
import FullPageCard from '../component/FullPageCard'
import style from './UI.css';
import style2 from './About.css';

let {
  manageBox,
  clearfix,
  'close-button': closeButton,
  icon,
  close,
  sourcesList,
  back,
  backButton,
  ellipsis,
  article
} = style;

let {thanksList} = style2;
class About extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.location.pathname == nextProps.path || this.props.location.pathname == nextProps.path;
  }
  render() {
    let {path, location} = this.props;
    return (
      <QueueAnim type={['right', 'left']} ease={['easeOutQuart', 'easeInOutQuart']}>{location.pathname == path
          ? <FullPageCard key={path}>
              <header className={manageBox}>
                <h1 className={clearfix}>关于hitokoto
                  <Link to='/' className={closeButton}>
                    <i className={icon + ' ' + close}></i>
                  </Link>
                  <Link to='/' className={backButton}>
                    <i className={icon + ' ' + back}></i>
                  </Link>
                </h1>
                <br/>
                <div className={article}>
                  <section>
                    <blockquote>
                      <p>
                        简单来说，一言（ヒトコト）指的是就是一句话，可以是动漫中的台词，可以是小说中的语句，也可以是网络上的各种小段子。<br/>或是感动，或是开心，又或是单纯的回忆，来到这里，留下你所喜欢的那一句句话，与大家分享，这就是一言存在的目的。<br/>*:本段文本源自<a href="http://hitokoto.us" target="_blank">hitokoto.us.</a>
                      </p>
                    </blockquote>
                    <br/>
                    <p>我觉得，生活中总有那么一句话能够触碰到你的内心，无论是动漫或者是小说中的句子。比如说，《诗经》,《松浦弥太郎的100个基本》。</p>
                    <p>我们的生活里不必要有太多的鸡汤，但是有些美好的东西值得分享。</p>
                  </section>
                  <section>
                    <h2>这个网站是干嘛的？</h2>
                    <p>一开始我只是想做一个和hitokoto类似的接口，但是因为看了《松浦弥太郎的100个基本》，就想做个东西记录和查看自己的一些「基本」，因为句子比较简单，所以和hitokoto有些类似，便做到了一起。</p>
                  </section>
                  <section>
                    <h2>我可以写什么东西？</h2>
                    <p>所有你想到的，看到的，听到的有用的或者感动的句子，都可以，除了鸡汤，还有很多句子对于你自己是很有意义的。</p>
                    <p>家训：「用了的东西要放回原位。」</p>
                    <p>遇到困难的时候：「不要叹气。」</p>
                    <p>对自己的严格要求：「不跷二郎腿。」</p>
                    <p>人生100个目标：「学会游泳。」</p>
                    <p>我编不出来了。。。</p>
                  </section>
                  <section>
                    <h2>本站公开API(草稿)</h2>
                    <p>URL地址:
                      <span>http://heitaov.cn/api/hitokoto</span>
                    </p>
                  </section>
                  <section className={thanksList}>
                    <header>
                      <h3>致谢列表</h3>
                      <span>公开的hitokoto来源网站</span>
                    </header>
                    <ul>
                      <li>
                        <a href="http://hitokoto.cn" target="_blank">hitokoto.cn</a>
                      </li>
                    </ul>
                  </section>
                </div>

              </header>
            </FullPageCard>
          : null}
      </QueueAnim>
    )
  }
}
export default withRouter(About)