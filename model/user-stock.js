const AV = require('../utils/av-live-query-weapp-min');

class UserStock extends AV.Object {
  get user() {
    return this.get('user');
  }
  set user(value) {
    this.set('user', value);
  }

  get day() {
    return this.get('day');
  }
  set day(value) {
    this.set('day', value);
  }

  get stockList() {
    return this.get('stockList');
  }
  set stockList(value) {
    this.set('stockList', value);
  }
}

AV.Object.register(UserStock, 'UserStock');
module.exports = UserStock;