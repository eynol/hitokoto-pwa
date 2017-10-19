const BROADCASTS_NAME = "hitokotoBroadcasts"
function $readHistory() {
  let string = localStorage.getItem(BROADCASTS_NAME);
  if (string) {
    let arr = JSON.parse(string),
      now = new Date().toISOString();

    let list = arr.reduce((list, date) => {

      if (date > now) {
        list.push(date);
      }
      return list;
    }, []);

    return list;
  } else {
    return [];
  }
}
function $writeHistory(list) {
  localStorage.setItem(BROADCASTS_NAME, JSON.stringify(list));
}

let HISTORY = $readHistory();

export default {
  hasDisplayed : (date) => ~ HISTORY.indexOf(date)
    ? true
    : false,
  add : (date) => {
    HISTORY.push(date);
    $writeHistory(HISTORY);
  }
}