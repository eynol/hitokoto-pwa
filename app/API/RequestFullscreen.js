export function launchIntoFullscreen(element) {
  element = element || document.documentElement;
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
}
export function isFullscreenEnabled() {
  return document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled || document.msFullscreenEnabled
}

export function getFullScreenELement() {
  return document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
}
export function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
}

export default {
  launchIntoFullscreen : launchIntoFullscreen,
  fullscreenEnabled : isFullscreenEnabled(),
  isFullscreenEnabled : isFullscreenEnabled,
  getFullScreenELement : getFullScreenELement,
  exitFullscreen : exitFullscreen,
  toggleFullScreen : function () {
    if (this.fullscreenEnabled) {
      let fullscreenElement = this.getFullScreenELement()
      if (fullscreenElement) {
        this.exitFullscreen();
      } else {
        this.launchIntoFullscreen();
      }
    }
  }
}
