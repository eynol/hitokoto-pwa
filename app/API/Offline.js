;
let ONLIE_STORE = [];
let OFFLINE_SOTRE = [];
let offlineWatcher = {
  online: !!navigator.onLine,
  whenOnline(func) {
    return ONLIE_STORE.push(func),
    this;
  },
  whenOffline(func) {
    return OFFLINE_SOTRE.push(func),
    this;
  }
};
(function bindEvent() {
  window
    .addEventListener('online', function () {
      offlineWatcher.online = true;
      setTimeout(function () {
        ONLIE_STORE.forEach((func) => {
          func()
        })
      }, 0)
    });
  window.addEventListener('offline', function () {
    offlineWatcher.online = false;
    setTimeout(function () {
      OFFLINE_SOTRE.forEach((func) => {
        func()
      })
    }, 0)
  });

})();

export default offlineWatcher