import 'whatwg-fetch';
import SourceManager from './SourceManager'
import PatternManager from './PatternManager'
import HTTPManager from './HTTPManager'

class HitokotoDriver {
  constructor() {
    console.log('233')
    this.sourceManager = new SourceManager();
    this.patterManager = new PatternManager();
    this.httpManager = new HTTPManager();
    this.state = {}; //  状态 用于保存模式的进度信息
    this.timmer = 0;//  用于保存setInterval的时钟;
    this.setTimmer = Function.prototype;// 用于resume的时候重新设置计时器。
    this.pattern = this
      .patterManager
      .getDefaultPattern(); //  默认模式
    this.sources = this.pattern.sources;
    this.processing = false; // 是否请求中的flag标志

    this.responseHandler = Function.prototype; // 获取到hitokoto后注入返回的hitokoto
    this.next = Function.prototype; // 执行后获取下一条hitokoto;
    this.UIResolver = Function.prototype; // 外部注入的展示不同状态下的处理函数；
  }

  getRandomURL() {
    return this.sources[Math.floor(Math.random() * this.sources.length)].url
  }
  drive(pattern) {
    this.pattern = pattern;
    this.sources = pattern.sources;
  }
  registUIProcessingHandler(handler) {
    this.UIResolver = handler;
  }
  registHitokotoHandler(handler) {
    this.responseHandler = handler;
  }

  start() {}
  pause() {}
  resume() {}
  getHitokoto(){
    this.httpManager.request(this.getRandomURL()).then(this.responseHandler);
  }
}


export default new HitokotoDriver();