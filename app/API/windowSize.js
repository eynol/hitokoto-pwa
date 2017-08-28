let obj = {
  width: document.documentElement.offsetWidth,
  _list: [],
  subscriptb: (func) => obj._list.push(func)
}
window.addEventListener('resize', function () {
  obj.width = document.documentElement.offsetWidth
  for (var i = 0, l = obj._list.length; i < l; i++) {
    obj._list[i] && obj._list[i]();
  }
})
export default obj;