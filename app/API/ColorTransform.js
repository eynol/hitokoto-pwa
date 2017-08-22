/****
 * 原本打算使用颜色计算出背景色的深浅度，然后使用白色的菜单背景。
 * 感觉有点复杂了，不能根据好来定义，所以还是用老办法，放到页面设置菜单里面让用户去选择。
 *
 *
Y = 0.257R + 0.504G + 0.098B + 16
U = 0.148R - 0.291G + 0.439B + 128
V = 0.439R - 0.368G - 0.071B + 128
B = 1.164(Y - 16) + 2.018(U - 128)
G = 1.164(Y - 16) - 0.813(V - 128) - 0.391(U - 128)
R = 1.164(Y - 16) + 1.596(V - 128)

from Keith Jack's excellent book "Video Demystified" (ISBN 1-878707-09-4).
作者：金釗立
链接：https://www.zhihu.com/question/20656646/answer/15779858
来源：知乎
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
 *
 */

export function rgb2YUV([R, G, B]) {
  let H = 0.257 * R + 0.504 * G + 0.098 * B + 16,
    U = 0.148 * R - 0.291 * G + 0.439 * B + 128,
    V = 0.439 * R - 0.368 * G - 0.071 * B + 128;
  return [H, U, V]
}

let _perseInt = Number.parseInt || (global
  ? global.parseInt
  : window.parseInt);
/**
 *
 *
 * @export
 * @param {String} str
 * @return {Array<Number>}
 */
export function str2rgb(str) {

  var rgb = [],
    result;
  str = str.replace('#', '');
  if (str.length == 3) {
    rgb = /^(\w)(\w)(\w)$/
      .exec(str)
      .slice(1, 4);
    return rgb.map((hexS) => {
      return _perseInt(hexS + hexS, 16);
    })
    //     rgb.push(parseInt(result[1]+result[1],16))
  } else if (str.length == 6) {
    rgb = /^(\w){2}(\w){2}(\w){2}$/
      .exec(str)
      .slice(1, 4);
    return rgb.map((hexS) => {
      return _perseInt(hexS, 16);
    })
  } else {
    return [255, 255, 255];
  }
}
/**
 *
 *
 * @export
 * @param {Array}
 * @return {String}
 */
export function rgb2str([r, g, b]) {
  return '#' + (r << 16 | g << 8 | b).toString(16);
}