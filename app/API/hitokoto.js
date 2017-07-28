import 'whatwg-fetch';

const URL = 'http://api.hitokoto.cn/';

export default function getHitokoto() {
  return fetch(URL)
    .then(resp => resp.json())
    .then(json => {
      return json
    })
}
