let obj = {
  width: document.documentElement.offsetWidth
}
window.addEventListener('resize', function () {
  obj.width = document.documentElement.offsetWidth
})
export default obj;