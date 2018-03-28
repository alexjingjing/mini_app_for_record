//index.js
//获取应用实例
const AV = require('../../utils/av-live-query-weapp-min');
const util = require('../../utils/util.js');
const UserStock = require('../../model/user-stock');
const StockPrice = require('../../model/stock-price');
const app = getApp()

Page({
  data: {
    stock: {},
    stockResultList: [],
    recentDay: ''
  },
  showNetworkError: function () {
    wx.showModal({
      title: '网络请求错误',
      content: '请稍后重试',
      showCancel: false,
    })
  },
  onReady: function () {
    console.log('page ready');
    this.getUserStockList();
  },
  getUserStockList: function () {
    var dateList = util.getDateList(this.data.stock.day);
    const stockQuery = new AV.Query(StockPrice)
      .equalTo('code', this.data.stock.code)
      .containedIn('date', dateList)
      .ascending('date');
    stockQuery.find().then(result => {
      this.formStockResultList(result);
    })
  },
  formStockResultList: function (resultList) {
    var values = [];
    var xAxis = [];
    var prices = [];
    var percents = [];
    for (var i = 0; i < resultList.length; i++) {
      var value = {};
      value.date = resultList[i].date;
      value.price = resultList[i].price;
      xAxis.push(resultList[i].date);
      prices.push(resultList[i].price);
      var percent = parseFloat((((resultList[i].price - resultList[0].price) / resultList[0].price) * 100).toFixed(2));
      percents.push(percent);
      value.percent = percent;
      values.push(value);
    }
    this.setData({
      stockDisplayList: values
    })
  },
  onLoad: function (options) {
    console.log(options);
    var d = new Date();
    var recentDay = util.formatMyTime(new Date(d.getFullYear(), d.getMonth(), options.day));
    this.setData({
      stock: options,
      recentDay: recentDay
    })
  }
})
