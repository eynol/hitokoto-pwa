import Dexie from 'dexie';
import store from '../store'

var db = new Dexie("hitokoto_pwa");
db.version(1).stores({hitokoto: ',url,_id,fid,author,source,offline', collection: '_id,owner,name,offline', syncRecord: ',url', asserts: ',name'});

const KEY_SEPRATOR = '<%hitokoto%>';
class IndexedDBManager {
  constructor() {}
  putCollections(list) {
    return db.table('collection').bulkPut(list);
  }
  putCollection(collection) {
    return db.table('collection').put(collection);
  }
  removeCollection(id) {
    return db.table('collection').delete(id);
  }
  getCollections(uid) {
    if (!uid) {
      let state = store.getState();
      uid = state.user && state.user.uid;
    }
    return db.table('collection').where('owner').equals(uid).toArray()
  }
  getStates() {
    let urlsSet = new Set();
    return db.table('hitokoto').each(v => urlsSet.add(v.url)).then(() => {
      let map = new Map(),
        plist = [];

      for (let url of urlsSet.keys()) {
        plist.push(this.getHitokotoCount(url).then(count => {
          map.set(url, count);
        }))
      }

      return Dexie.Promise.all(plist).then(results => [...map.entries()])
    })
  }
  getAllURLS() {
    let urlsSet = new Set();
    return db.table('hitokoto').each(v => urlsSet.add(v.url)).then(() => [...urlsSet.keys()])
  }
  getHitokotoCount(url) {
    return db.table('hitokoto').where('url').equals(url).count()
  }
  clearOneSource(url) {
    return db.table('hitokoto').where('url').equals(url).delete()
  }
  putHitokoto(url, hitokoto) {
    if (!hitokoto.url) {
      hitokoto.url = url;
    }
    return db.table('hitokoto').put(hitokoto, url + KEY_SEPRATOR + hitokoto.id)
    /// 先查询再存入会耗费9ms(Dxiex查询)+10ms(ji计时器); 原生的系统底层 get耗费0.9ms put耗费4.83ms
  }
  updateHitokoto(url, hitokoto) {
    if (!hitokoto.url) {
      hitokoto.url = url;
    }
  }
  removeHitokoto(_id) {
    return db.table('hitokoto').where('_id').equals(_id).delete()
  }
  /**
   *
   * @param {String} url
   * @param {Object[]} hitokotos
   * @memberof IndexedDBManager
   */
  putHitokotoBulk(url, hitokotos) {
    let ids = []
    hitokotos.forEach(h => {
      if (!h.url) {
        h.url = url;
      }
      ids.push(url + KEY_SEPRATOR + h.id);
    });
    return db.table('hitokoto').bulkPut(hitokotos, ids)
  }

  getHitokoto(url, option) {
    //获取某个固定域名下的随机hitokoto
    let collection = db.table('hitokoto').where('url').equals(url);
    return collection.count().then(count => {
      if (count == 0) {
        return Dexie.Promise.reject('本地无缓存！')
      }

      let randomindex
      if (option && option.type == 'next') {
        randomindex = source.count % count;
      } else {
        randomindex = Math.floor(Math.random() * count);
      }
      // dexie 的offset其实就是cursor.advance() 的步数，必须大于0，因为0就是当前的cursor.
      if (randomindex == 0) {
        return collection.first()
      } else {
        return collection.offset(randomindex).first()
      }
    })
  }
  putSyncRecord(url, obj) {
    return db.table('syncRecord').put(obj, url);
  }
  removeSyncRecord(url) {
    return db.table('syncRecord').delete(url);
  }
  getSyncRecord(url) {
    return db.table('syncRecord').get(url);
  }
  putAssert(key, assert) {
    return db.table('asserts').put(assert, key);
  }
  getAssert(key) {
    return db.table('asserts').get(key);
  }

  getHitokotoSuggestion(k, str) {
    return db.table('hitokoto').where(k).startsWithAnyOfIgnoreCase(str).toArray().then(arr => {
      let onlyKeys = arr.map(hito => hito[k]);
      return [...new Set(onlyKeys)]
    })
  }
  DEBUG_CLEAR_ALL() {
    db.table('hitokoto').clear()
  }
  DROP_DB() {
    return Dexie.delete('hitokoto_pwa')
  }
}
export default new IndexedDBManager();