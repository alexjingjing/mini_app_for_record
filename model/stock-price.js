const AV = require('../utils/av-live-query-weapp-min');

class StockPrice extends AV.Object {
  get date() {
    return this.get('date');
  }
  set date(value) {
    this.set('date', value);
  }

  get price() {
    return this.get('price');
  }
  set price(value) {
    this.set('price', value);
  }

  get code() {
    return this.get('code');
  }
  set code(value) {
    this.set('code', value);
  }
}

AV.Object.register(StockPrice, 'StockPrice');
module.exports = StockPrice;