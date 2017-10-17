export const addZero = (n) => n < 10
  ? '0' + n
  : n;

/**
 *
 *
 * @param {Date} d
 * @returns
 */
function Chinese(d) {
  if (Object.prototype.toString.call(d) !== '[object Date]') {
    let origin = d;
    d = new Date(d);
    let temp = d.getDate();
    if (temp !== temp) {
      if (d === undefined) {
        return '某个时刻'
      } else if (typeof origin === 'string') {
        return origin; //原样返回时间，可能第三方已经处理了时间了
      }
      return '(时间参数不合法)'
    }
  };

  let fullYear = d.getFullYear(),
    month = d.getMonth(),
    date = d.getDate(),
    hours = d.getHours(),
    minutes = d.getMinutes(),
    seconds = d.getSeconds(),
    now = new Date(),
    _fullYear = now.getFullYear(),
    _month = now.getMonth(),
    _date = now.getDate(),
    _hours = now.getHours(),
    _minutes = now.getMinutes(),
    _seconds = now.getSeconds();

  //刚刚 ，15秒前，3分钟前 ，3小时前 ，昨天 3:22, 前天 14:30，3天前，
  if (_fullYear === fullYear) {
    if (_month === month) {
      if (_date === date) {
        if (_hours === hours) {
          if (_minutes === minutes) {
            if (_seconds === seconds) {
              return '刚刚'
            } else {
              return `${_seconds - seconds}秒前`
            }
          } else {
            return `${_minutes - minutes}分钟前`
          }
        } else {
          return `今天 ${addZero(hours)}:${addZero(minutes)}`
        }
      } else if ((_date - date) == 1) {
        return `昨天 ${addZero(hours)}:${addZero(minutes)}`
      } else if ((_date - date) == 2) {
        return `前天 ${addZero(hours)}:${addZero(minutes)}`
      } else {
        return `${month + 1}月${date}日 ${addZero(hours)}:${addZero(minutes)}`
      }
    } else {
      return `${month + 1}月${date}日 ${addZero(hours)}:${addZero(minutes)}`
    }
  } else {
    return `${fullYear}年${month + 1}月${date}日 ${addZero(hours)}:${addZero(minutes)}`
  }
}
export default Chinese;