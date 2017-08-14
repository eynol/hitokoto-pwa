import 'whatwg-fetch';
import PatternManager,{SOURCE_UPDATE_KEYS} from './PatternManager'
import HTTPManager from './HTTPManager'
import {PERSE_ADAPTER_SAFE, AdapterValidate, PERSE_ADAPTER} from './AdapterValidate'

const HITOKOTO_KEYS = ['id','hitokoto','creator','type','from','created_at']

class HitokotoDriver {
  constructor() {
    this.patterManager = new PatternManager();
    this.httpManager = new HTTPManager();
    this.state = {}; //  状态 用于保存模式的进度信息
    this.adaptersMap = null; //  adapters map
    this.timer = 0; //  用于保存setInterval的时钟;
    this.timerDisabled = false; //用于页面失去焦点后停用计时器;

    this.drive(this.patterManager.getDefaultPattern()); //  默认模式
    this.processing = false; // 是否请求中的flag标志

    this.responseHandler = Function.prototype; // 获取到hitokoto后注入返回的hitokoto
    this.next = Function.prototype; // 执行后获取下一条hitokoto;
    this.UIResolver = Function.prototype; // 外部注入的展示不同状态下的处理函数；
  }

  getRandomSource() {
    return this.sources[Math.floor(Math.random() * this.sources.length)]
  }
  drive(pattern) {
    this.pattern = pattern;
    this.sources = pattern.sources;

    this.registAdapter(this.sources);

  }
  registAdapter(sources) {
    this.adaptersMap = {};
    sources.forEach((source) => {
      this.adaptersMap[source.url] = PERSE_ADAPTER_SAFE(source.adapter)
    });
    return this;
  }

  registUIProcessingHandler(handler) {
    this.UIResolver = handler;
    return this;
  }
  registHitokotoHandler(handler) {
    this.responseHandler = handler;
    return this;
  }
  getAdapter(url) {
    return this.adaptersMap[url] || ADAPTER_ORGIN;
  }
  testSourceAdapter(url, adapterString) {
    let adapter;
    try {
      console.log(adapterString)
      adapter = PERSE_ADAPTER(adapterString);
      console.log(adapter)
    } catch (e) {
      console.error(e);
      return Promise.reject(e);
    }
    return this
      .httpManager
      .request(url)
      .then(adapter)
      .then((hitokoto) => {
        console.log('[test.adapter.result]',hitokoto);
        if(!hitokoto){
          return Promise.reject(hitokoto);
        }else{
          let missed = [];
          HITOKOTO_KEYS.forEach((key)=>{
            if(!hitokoto[key]){
              missed.push(key);
            }
          });
          if(missed.length>0){
            return Promise.reject('返回的对象中缺少成员：'+JSON.stringify(missed));
          }else{
            return Promise.resolve(hitokoto);
          }
        }
      })
  }
  start() {
    let {interval, type} = this.pattern;
    if (interval && interval >= 5) {
      clearInterval(this.timer);

      this.timer = setInterval(() => {
        if (!this.timerDisabled) {
          this.next();
        }
      }, interval);
    }
    //挂载 next
    this.next = (id) => {
      let source = this.getRandomSource();
      let url = source.url;
      if (source.online) {
        //  如果启用在线
        this
          .getHitokotoFromWEB(url, type, id)
          .then(this.responseHandler);
      } else {
        //  启用离线资源
        this
          .getHitokotoFromIDB(url, type, id)
          .then(this.responseHandler);
      }

    }
    return this;
  }
  pause() {
    this.timerDisabled = true;
    return this;
  }
  resume() {
    this.timerDisabled = false;
    return this;
  }
  getHitokotoFromIDB(url, patternType, id) {
    return this
      .httpManager
      .request(url)
      .then(this.getAdapter(url))
  }
  getHitokotoFromWEB(url, patternType, id) {
    return this
      .httpManager
      .request(url)
      .then(this.getAdapter(url))
      .catch((e) => {
        console.error(e);
        //  出错了，可能是短线了，回退使用indexedDB的内容
        return Promise.resolve(this.getHitokotoFromIDB(url, patternType, id))
      })
  }
  getHitokoto() {
    let url = this.getRandomURL();
    let adpter = this.getAdapter(url);
    this
      .httpManager
      .request(url)
      .then(adpter)
      .then(this.responseHandler);
  }
  updateSource(id, source) {
    this.patterManager.updateSource(id,source);
    this.pattern.sources.forEach((oldSource)=>{
      if(oldSource.id==id){
        SOURCE_UPDATE_KEYS.forEach((k)=>{
          oldSource[k]=source[k];
        })
      }
    });
    this.drive(this.pattern);
    this.start();
  }
}

export default new HitokotoDriver();