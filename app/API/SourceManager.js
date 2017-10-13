const PREFIX = 'hikotoko';

export const VERSION = '2017081401 count1';
const VERSION_NAME = PREFIX + 'sources_version';

export const SOURCES = [
  {
    id: 1001,
    name: 'hitokoto.cn',
    url: 'http://api.hitokoto.cn/',
    adapter: `function(resp){
      let source = resp.from;
      delete resp.from;
      resp.source = source;
      return resp;
    }`,
    online: true,
    local: true,
    count: 0
  }, {
    id: 1002,
    name: 'hitoapi.cc',
    url: 'https://hitoapi.cc/s/',
    adapter: `function(resp){
        var id = String(resp.id).slice(0,9);
        return { 
          type:resp.catname,
          creator:resp.author,
          created_at:resp.date,
          id:id,
          hitokoto:resp.text,
          source:resp.source
        }
      }`,
    online: true,
    local: true,
    count: 0
  }, {
    id: 1005,
    name: 'hitoapi.cc',
    url: 'https://hitoapi.cc/sp/',
    adapter: `function(resp){
      return {
       type:resp.catname,
       creator:
       resp.author,
       created_at:resp.date,
       id:resp.id,
       hitokoto:resp.text,
       source:resp.source}
    }`,
    online: true,
    local: true,
    count: 0
  }, {
    id: 1006,
    name: 'https://api.satori.moe/hitokoto.php',
    url: 'https://api.satori.moe/hitokoto.php',
    adapter: `function (resp){ 
     var id = String(resp.id).slice(0,6);
    return {
      hitokoto:resp.hitokoto,
      type: resp.cat,
      id: id,
      source: resp.source,
      creator:"",
      created_at:resp.addtime
      }
    }`,
    online: true,
    local: true,
    count: 0
  }
];
const SOURCES_NAME = PREFIX + 'sources';
//    工具函数开始 ///////////////////////////////////////////////////
function $getVersion() {
  return localStorage.getItem(VERSION_NAME);
}
function $setVersion(version) {
  localStorage.setItem(VERSION_NAME, version);
}

function $getSources() {
  let str = localStorage.getItem(SOURCES_NAME);
  if (str) {
    return JSON.parse(str);
  } else {
    return str;
  }
}
function $setSources(sources) {
  if (sources == null) {
    return;
  }
  if (typeof sources == 'object') {
    localStorage.setItem(SOURCES_NAME, JSON.stringify(sources));
  } else if (typeof sources == 'string') {
    localStorage.setItem(SOURCES_NAME, sources);
  }
}

export default class SourceManager {

  constructor() {
    //  1.获取本地版本号,_Version，如果没有,将VERSION保存到本地，返回文件中的静态变量VERSION
    this.version_source = $getVersion()
    if (!this.version_source) {
      $setVersion(VERSION);
      this.version_source = VERSION;
    }

    //2.获取本地存储的所有的hikotoko来源,_Sources，如果本地没有，将SOURCE保存到本地并作为结果返回
    this.sources = $getSources();
    if (!this.sources) {
      $setSources(SOURCES);
      this.sources = SOURCES;
    }

    /**
     * 3.如果VERSION高于_Verision，执行以下步骤，否则执行第4步。
     *    3.1   从SOURCE中找出_Sources中缺少的来源，追加到_Sources中。依据的标准是URL
     *    3.2   如果有修改，保存_Sources到本地;
     */
    if (this.version_source.indexOf('count1') === -1) {
      //  来源不包含计数器，所有来源初始化为0
      this.sources.forEach(function (item) {
        item.count = 0;
      });
      $setSources(this.sources);
    }

    if (VERSION > this.version_source) {
      //  用map缓存已有的本地的url
      let urlMap = {};
      let needUpdateSource = false;
      this.sources.forEach(function (item) {
        urlMap[item.url] = true;
      });
      SOURCES.forEach((src) => {
        if (!urlMap[src.url]) {
          //  url不存在,添加至_sources
          this.sources.push(src);
          needUpdateSource = true;
        }
      });
      if (needUpdateSource) {
        $setSources(this.sources);
      }
      $setVersion(VERSION);
    }

  }

  newSource(source) {
    this.sources.push(source);
    $setSources(this.sources);
  }
  /**
   *
   *
   * @param {String} username |uid
   * @param {String} collection
   * @param {boolean} isCros
   * @memberof SourceManager
   */
  removeSourceWithUsernameAndCol(username, collection, isCros) {
    let url = this.getUrlOfUserCol(username, collection, isCros);
    let target = this.sources.find(item => item.url == url);
    this.deleteSource(target.id);
  }
  /**
   *
   *
   * @param {String} username
   * @param {String} collection
   * @param {boolean} isCros
   * @param {String} uid
   * @param {String} cid
   * @returns
   * @memberof SourceManager
   */
  newSourceWithUsernameAndCol(username, collection, isCros, uid, cid) {
    let url,
      source,
      name = '' + username + collection;
    if (isCros) {
      url = this.getUrlOfUserCol(username, collection, true);
    } else {
      //not cross-origin
      url = this.getUrlOfUserCol(uid, cid, false);
    }

    source = {
      id: Date.now(),
      url: url,
      name: name,
      adapter: 0,
      online: true,
      local: true
    };
    this.sources.push(source);
    $setSources(this.sources);
    return source;
  }

  getUrlOfUserCol(user, collection, isCros) {
    return location.protocol + '//' + location.host + (isCros
      ? '/cors/'
      : '/api/sources/') + user + '/' + collection
  }
  isSourceExsit(url) {
    if (!url) {
      return false
    }
    let reg = new RegExp('^' + url);
    let index = this.sources.findIndex((source => {
      if (reg.test(source.url)) {
        return true;
      } else {
        return false;
      }
    }));
    if (~ index) {
      return true;
    }

  }
  updateSource(id, source) {
    for (var i = 0, len = this.sources.length; i < len; i++) {
      if (this.sources[i].id == id) {
        this.sources[i] = source;
      }
    }
    $setSources(this.sources);
  }
  deleteSource(id) {
    for (var i = 0, len = this.sources.length; i < len; i++) {
      if (this.sources[i].id == id) {
        this.sources.splice(i, 1);
        i--;
        len--;
      }
    }
    $setSources(this.sources);
  }
}