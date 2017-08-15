import SourceManager, {SOURCES} from './SourceManager';

const PREFIX = 'hikotoko';

export const VERSION = '20170811';
const VERSION_NAME = PREFIX + 'patterns_version';

export const PATTERN_UPDATE_KEYS = ['name', 'interval', 'type'];
export const PATTERNS = [
  {
    id: 100123,
    name: '默认随机',
    internval: 0,
    sources: SOURCES,
    type: 'random',
    default: true
  }, {
    id: 100124,
    name: '默认定时刷新',
    internval: 6,
    sources: SOURCES,
    type: 'random',
    default: false
  }
];
const SOURCE_UPDATE_KEYS = ['name', 'url', 'adapter'];
const PATTERNS_NAME = PREFIX + 'patterns';
//    工具函数开始 ///////////////////////////////////////////////////
function $getVersion() {
  return localStorage.getItem(VERSION_NAME);
}
function $setVersion(version) {
  localStorage.setItem(VERSION_NAME, version);
}

function $getPatterns() {
  let str = localStorage.getItem(PATTERNS_NAME);
  if (str) {
    return JSON.parse(str);
  } else {
    return str;
  }
}
function $setPatterns(patterns) {
  if (patterns == null) {
    return;
  }
  if (typeof patterns == 'object') {
    localStorage.setItem(PATTERNS_NAME, JSON.stringify(patterns));
  } else if (typeof patterns == 'string') {
    localStorage.setItem(PATTERNS_NAME, patterns);
  }
}

export default class PatternManager extends SourceManager {

  constructor() {
    super();
    //  1.获取本地版本号,_Version，如果没有,将VERSION保存到本地，返回文件中的静态变量VERSION
    this.version_pattern = $getVersion()
    if (!this.version_pattern) {
      $setVersion(VERSION);
      this.version_pattern = VERSION;
    }

    //2.获取本地存储的所有的hikotoko来源,_Sources，如果本地没有，将SOURCE保存到本地并作为结果返回
    this.patterns = $getPatterns();
    if (!this.patterns) {
      $setPatterns(PATTERNS);
      this.patterns = PATTERNS;
    }

    /**
      * 3.如果VERSION高于_Verision，执行以下步骤，否则执行第4步。
      *    3.1   从SOURCE中找出_Sources中缺少的来源，追加到_Sources中。依据的标准是URL
      *    3.2   如果有修改，保存_Sources到本地;
      */
    if (VERSION > this.version_pattern) {
      //  用map缓存已有的本地的url
      let urlMap = {};
      let needUpdatePatterns = false;
      this
        .patterns
        .forEach(function (pattern) {
          urlMap[pattern.id] = true;
        });
      PATTERNS.forEach(function (src) {
        if (!urlMap[src.id]) {
          //url不存在,添加至_sources
          this
            .patterns
            .push(src);
          needUpdatePatterns = true;
        }
      });
      if (needUpdatePatterns) {
        $setPatterns(this.patterns);
      }
    }
  }
  updateSource(id, source) {
    super.updateSource(id, source); // 让source去更新全部的sources
    //  更新所有pattern的来源
    this
      .patterns
      .forEach((pattern) => {
        pattern
          .sources
          .forEach((oldSource, index) => {
            if (oldSource.id == id) {
              SOURCE_UPDATE_KEYS.forEach((key) => {
                oldSource[key] = source[key];
              })
            }
          });
      });
    $setPatterns(this.patterns); //  保存修改到本地
  }
  deleteSource(id) {
    super.deleteSource(id);
    //  更新所有pattern的来源
    this
      .patterns
      .forEach((pattern) => {
        pattern
          .sources
          .forEach((oldSource, index) => {
            if (oldSource.id == id) {
              pattern
                .sources
                .splice(index, 1);
            }
          });
      });
    $setPatterns(this.patterns); //  保存修改到本地
  }
  newPattern(pattern) {
    this
      .patterns
      .push(pattern);
    $setPatterns(this.patterns);
  }

  updatePattern(id, newPattern) {
    console.log(id, newPattern)
    for (var i = 0, len = this.patterns.length; i < len; i++) {
      if (this.patterns[i].id == id) {
        let oldPattern = this.patterns[i];
        PATTERN_UPDATE_KEYS.forEach((key) => {
          if (oldPattern[key] != newPattern[key]) {
            oldPattern[key] = newPattern[key];
          };
        });
        // 除了更新常规键值，还要更新sources;

        oldPattern.sources.length = 0;
        newPattern
          .sources
          .forEach((source) => {
            oldPattern
              .sources
              .push(source)
          })

        //还要更新default
        if (newPattern.default) {
          this.setDefaultPattern(id);
        }
      }
    }
    $setPatterns(this.patterns);
    console.log(this.patterns)
  }
  deletePattern(id) {
    for (var i = 0, len = this.patterns.length; i < len; i++) {
      if (this.patterns[i].id == id) {
        this
          .patterns
          .splice(i, 1);
        i--;
        len--;
      }
    }
    $setPatterns(this.patterns);
  }
  setDefaultPattern(id) {
    this
      .patterns
      .forEach((pattern) => {
        if (pattern.id == id) {
          pattern.default = true;
        } else {
          pattern.default = false;
        }
      });

    $setPatterns(this.patterns);
  }
  getDefaultPattern() {
    for (let i = 0, len = this.patterns.length; i < len; i++) {
      let pattern = this.patterns[i];
      if (pattern.default) {
        return pattern;
      }
    }
    //如果没有找到
    return this.patterns[0];
  }
  getPatternById(id) {
    return this
      .patterns
      .find(pattern => (pattern.id == id))
  }
}