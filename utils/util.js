const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const getDateList = day => {
  var dates = [];
  if (!day || day == undefined) {
    day = 1;
  }
  for (var i = 0; i < 10; i++) {
    var d = new Date();
    var targetDate = new Date(d.getFullYear(), d.getMonth() - i, day);
    dates.push(formatMyTime(targetDate));
  }
  return dates;
}

const formatMyTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [year, month, day].map(formatNumber).join('');
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  getDateList: getDateList,
  formatTime: formatTime,
  formatMyTime: formatMyTime
}
