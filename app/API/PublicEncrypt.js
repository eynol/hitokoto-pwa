import SHA1 from 'crypto-js/sha1';
let SALT = 'AreYouPervert？??????!kbgxFVFjoyITVDwJigTGYyBpTuCYa1Ubk/Bpnp7ZOWtE1NF3S2v6wIJAM4X' +
    'NXbOwHOMAfDv/AkEA1W01RTgniEZFTvAFq3qwRgsR1ODq2JK0LefT2wuRyQPuhCzsKq0yhCS5fzwd146' +
    'vU+uGfQE6lpUCaV0FAKDT1wJAUJM4sRBb1b28DcwI7M8i7YHE2+PS;BkwJE2+TZaY5DxbwfpB2IZ0Gyh' +
    'I1ZCmzmzywK/GSxPS7GPW1IeVeXT1sCQJBAJ+G45x7nsDzlXatXe+Q4xVXzNpLy/5Zmaf+cpJ2EWApOi' +
    '09zsEPeIThVm3OJ5gppM+baokhVAOeGZFb4BNaIz0CQQCmq+tVF0esSprc5+4rW7BsKfIEosV9YShDhZ' +
    'ZiUdlBC6f5FglpnkvC37017tcHtUVYoWGUN9Gq+sgzJp42+rYy傻逼;';
/**
 *
 * @param {String} obvious
 */
export default function (obvious$string) {
  return SHA1('' + obvious$string + SALT, SALT).toString()
}
