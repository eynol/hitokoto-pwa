import Dexie from 'dexie';

var db = new Dexie("hitokoto_pwa");
db.version(1).stores({hitokoto: ',url,id,hitokoto,type'});

const KEY_SEPRATOR = '<%hitokoto%>';
class IndexedDBManager {
  putHitokoto(url, hitokoto) {
    if (!hitokoto.url) {
      hitokoto.url = url;
    }
    return db.table('hitokoto').put(hitokoto, url + KEY_SEPRATOR + hitokoto.id)
    /// 先查询再存入会耗费9ms(Dxiex查询)+10ms(ji计时器); 原生的系统底层 get耗费0.9ms put耗费4.83ms
  }
  getHitokotoRandom(url) {
    //获取某个固定域名下的随机hitokoto
    let collection = db.table('hitokoto').where('url').equals(url);
    return collection.count().then(count => {
      if (count == 0) {
        return Dexie.Promise.reject('本地无缓存！')
      }

      let randomindex = Math.floor(Math.random() * count);
      // dexie 的offset其实就是cursor.advance() 的步数，必须大于0，因为0就是当前的cursor.
      if (randomindex == 0) {
        return collection.first()
      } else {
        return collection.offset(randomindex).first()
      }
    })
  }
  DEBUG_CLEAR_ALL() {
    db.table('hitokoto').clear()
  }
}
export default new IndexedDBManager();