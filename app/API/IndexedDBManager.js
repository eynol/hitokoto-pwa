import Dexie from 'dexie';

var db = new Dexie("hitokoto_pwa");
db
  .version(1)
  .stores({hitokoto: '++,&_id,url,hitokoto,type,id'});

db
  .table('hitokoto')
  .add()
export default class IndexedDBManager {
  putHitokoto(url, hitokoto) {}
}