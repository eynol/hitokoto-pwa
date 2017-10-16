import indexedDBManager from '../API/IndexedDBManager'
import Task from '../API/Task';
import {timeoutPromise} from '../API/httpManager'

const SOURCE_HAN_FONT = 'source han'
const SOURCE_HAN_FONT_PK = 'sourcehan'

function $getFontEnabled() {
  let item = localStorage.getItem(SOURCE_HAN_FONT);
  if (item) {
    return item;
  } else {
    $setFontEnabled();
    return 'no'
  }
}

function $setFontEnabled(enabled = 'no') {
  localStorage.setItem(SOURCE_HAN_FONT, enabled);
}

var downloadTasker = null;
function getTasker() {
  return downloadTasker;
}
/**
 *  下载字体
 *
 * @returns Promise
 */
function donwLoadFont() {
  return new Promise((resolve, reject) => {
    if (!downloadTasker) {
      downloadTasker = new Task();
    }
    downloadTasker.update('思源宋体下载中！\n如果过了几秒钟未显示下载进度，可能是服务器未返回Content-Length字段或者浏览器不支持。\n上面这句话看不懂没关系，只要这个任务栏' +
        '没有报错，就等下去，大概要下载几十秒。');
    downloadTasker.abort = () => {
      xhr.abort();
      downloadTasker.failed('任务被取消！');
    }

    var xhr = new XMLHttpRequest();
    // xhr.open('get', 'http://cdn.heitaov.cn/thumb.jpg', true)
    xhr.open('get', 'http://olmnjy4hp.bkt.clouddn.com/SourceHanSerifSC-Bold.otf', true)
    xhr.onload = function () {

      downloadTasker.success('思源宋体下载完成！');
      downloadTasker = null; //这个全局变量不会交给垃圾自动回收，所以需要手动取消索引

      resolve(xhr.response);
    }
    xhr.onprogress = function (e) {
      if (e.lengthComputable) {
        var loaded = (e.loaded / 1024 / 1024).toFixed(2)
        var total = (e.total / 1024 / 1024).toFixed(2);

        downloadTasker.update('思源宋体已下载 ' + loaded + 'MB/' + total + 'MB');
      }
    }
    xhr.onerror = function () {

      downloadTasker.failed('思源宋体下载失败！');
      downloadTasker = null; //这个全局变量不会交给垃圾自动回收，所以需要手动取消索引

      reject('下载失败！');
    }
    xhr.responseType = 'blob';
    xhr.send();
  })
} // getFont()

function saveFont(data) {
  return indexedDBManager.putAssert(SOURCE_HAN_FONT_PK, data).then(() => {
    //全局状态
    storedState = true;

    return data
  })
}
/**
 *
 *
 * @param {Blob} octet
 * @returns  Promise
 */
function injectFont(octet) {
  return timeoutPromise(10 * 1000, new Promise((resolve, reject) => {
    /*
  svg   as "image/svg+xml"                  (W3C: August 2011)
  ttf   as "application/x-font-ttf"         (IANA: March 2013)
        or "application/x-font-truetype"
  otf   as "application/x-font-opentype"    (IANA: March 2013)
  woff  as "application/font-woff"          (IANA: January 2013)
  woff2 as "application/font-woff2"         (W3C W./E.Draft: May 2014/March 2016)
  eot   as "application/vnd.ms-fontobject"  (IANA: December 2005)
  sfnt  as "application/font-sfnt"          (IANA: March 2013)
*/

    let newB = new Blob([octet], {type: 'application/x-font-opentype;'})
    let url = URL.createObjectURL(newB);

    /*
  let link = document.createElement('link');
  link.rel = "preload";
  link.setAttribute('as', 'font');

  link.href = url;

  link.onload = () => {
    console.log('link load');
    //laod style here
  }
  document.head.appendChild(link);
*/

    let style = document.createElement('style');
    style.id = SOURCE_HAN_FONT_PK;
    style.onload = () => {
      resolve('ok');
      URL.revokeObjectURL(octet);
    }
    style.innerHTML = `@font-face {font-family: "Source Han Serif SC";
    src: url('${url}') format('opentype');
    font-style: normal;
    font-weight: normal;/* 应该为bold */
    font-display: swap;
  }`;
    document.head.appendChild(style);
  }))

}

var storedState = false;
indexedDBManager.getAssert(SOURCE_HAN_FONT_PK).then(fontFile => {
  if (fontFile) {
    storedState = true;
  } else {
    storedState = false;
  }
})

function isStored() {
  return storedState;
}

function enableFont() {
  $setFontEnabled('yes');

  return indexedDBManager.getAssert(SOURCE_HAN_FONT_PK).then(octet => {
    if (!octet) {
      return donwLoadFont().then(saveFont);
    } else {
      return octet;
    }
  }).then(injectFont)
}

function disableFont() {
  $setFontEnabled('no');

  let style = document.getElementById(SOURCE_HAN_FONT_PK);
  if (style) {
    document.head.removeChild(style);
  }
}
export default {
  getFontEabled : $getFontEnabled,
  isStored : isStored,
  getTask : getTasker,
  enableFont : enableFont,
  disableFont : disableFont
}

//在这里初始化
if ($getFontEnabled() == 'yes') {
  indexedDBManager.getAssert(SOURCE_HAN_FONT_PK).then(fontFile => {
    if (fontFile) {
      injectFont(fontFile);
    } else {
      new Task().failed('思源宋体文件失效，已改为禁用。');
      $setFontEnabled('no');
    }
  })
}
