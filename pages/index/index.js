//index.js
//获取应用实例
const AV = require('../../utils/av-live-query-weapp-min');
const util = require('../../utils/util.js');
const UserStock = require('../../model/user-stock');
const StockPrice = require('../../model/stock-price');
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    items: [
      { name: 'GOOG', value: '谷歌' },
      { name: 'AMZN', value: '亚马逊' },
      { name: 'FB', value: 'FaceBook' },
      { name: 'AAPL', value: '苹果' },
      { name: '00700', value: '腾讯' },
      { name: 'BABA', value: '阿里巴巴' },
      { name: 'TSLA', value: '特斯拉' },
    ],
    day: '',
    stockList: [],
    stockResultList: [],
    stockDisplayList: [],
    chosenList: [],
    listData: [
      { "code": "01", "text": "text1", "type": "type1" },
      { "code": "02", "text": "text2", "type": "type2" },
      { "code": "03", "text": "text3", "type": "type3" },
      { "code": "04", "text": "text4", "type": "type4" },
      { "code": "05", "text": "text5", "type": "type5" },
      { "code": "06", "text": "text6", "type": "type6" },
      { "code": "07", "text": "text7", "type": "type7" }
    ]
  },
  login: function () {
    // AV.User.loginWithWeapp().then(user => {
    //   console.log(user.toJSON());
    // }).catch(console.error);
    return AV.Promise.resolve(AV.User.current()).then(user =>
      user ? (user.isAuthenticated().then(authed => authed ? user : null)) : null
    ).then(user => user ? user : AV.User.loginWithWeapp()).catch(error => console.error(error.message));
  },
  getUserStockList: function (user) {
    const query = new AV.Query(UserStock)
      .equalTo('user', AV.Object.createWithoutData('User', user.id))
      .descending('createdAt');
    query.find().then(result => {
      if (result.length > 0) {
        this.setData({
          stockList: result[0].stockList,
          day: result[0].day
        });
        this.getStockResultList(result[0].stockList, this.getDateList(result[0].day));
      }
    });
  },
  getStockResultList: function (stockList, dateList) {
    // 根据stockList获取stockPrice
    for (var i = 0; i < stockList.length; i++) {
      const stockQuery = new AV.Query(StockPrice)
        .equalTo('code', stockList[i])
        .containedIn('date', dateList)
        .ascending('date');
      stockQuery.find().then(result => {
        this.formStockResultList(stockQuery._where.code, result);
      })
    };
  },
  formStockResultList: function(code, resultList) {
    var o = {};
    var values = [];
    o.code = code;
    var xAxis = [];
    var prices = [];
    var percents = [];
    for (var i = 0; i < resultList.length; i++) {
      o.name = resultList[i].name;
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
    o.xAxis = xAxis;
    o.prices = prices;
    o.percents = percents;
    o.values = values;
    this.data.stockResultList.push(o);
    this.checkStockResultList();
  },
  checkStockResultList: function() {
    if (this.data.stockResultList.length == this.data.stockList.length) {
      var finalResult = [];
      for (var i = 0; i < this.data.stockResultList.length; i ++) {
        var o = {};
        o.code = this.data.stockResultList[i].code;
        o.name = this.data.stockResultList[i].name;
        if (this.data.stockResultList[i].prices && this.data.stockResultList[i].prices.length > 0) {
          o.recentPrice = this.data.stockResultList[i].prices[0];
          o.recentPercent = this.data.stockResultList[i].percents[0];
        }
        if (this.data.stockResultList[i].prices && this.data.stockResultList[i].prices.length > 1) {
          o.lastPercent = this.data.stockResultList[i].percents[1];
        } else {
          o.lastPercent = '暂无';
        }
        finalResult.push(o);
      }
      var sortedList = finalResult.sort(function (a, b) { 
        if (a['code'] > b['code']) {
          return 1; // 如果是降序排序，返回-1。
        } else if (a['code'] === b['code']) {
          return 0;
        } else {
          return -1; // 如果是降序排序，返回1。
        }
        })
      this.setData({
        stockDisplayList: finalResult
      })
    }
  },
  getDateList: function(day) {
    var dates = [];
    if (!day || day == undefined) {
      day = 1;
    }
    for (var i = 0; i < 10; i++) {
      var d = new Date();
      var targetDate = new Date(d.getFullYear(), d.getMonth() - i, day);
      dates.push(util.formatMyTime(targetDate));
    }
    return dates;
  },
  addUserStockList: function () {
    if (this.data.chosenList.length == 0) {
      wx.showToast({
        title: '请选择公司',
        icon: 'none'
      });
      return;
    }
    if (this.data.stockList.length == 0) {
      // 没有相关数据
      // 可以添加
      var date = new Date();
      var acl = new AV.ACL();
      acl.setPublicReadAccess(false);
      acl.setPublicWriteAccess(false);
      acl.setReadAccess(AV.User.current(), true);
      acl.setWriteAccess(AV.User.current(), true);
      new UserStock({
        stockList: this.data.chosenList,
        user: AV.User.current(),
        day: date.getDate()
      }).setACL(acl).save().then((result) => {
        console.log(result);
        wx.showToast({
          title: '添加成功！',
        })
        this.setData({
          stockList: this.data.chosenList,
          chosenList: []
        });
        this.getUserStockList(AV.User.current());
      }).catch(error => this.showNetworkError());
    }
  },
  showNetworkError: function () {
    wx.showModal({
      title: '网络请求错误',
      content: '请稍后重试',
      showCancel: false,
    })
  },
  checkboxChange: function (e) {
    this.setData({
      chosenList: e.detail.value
    })
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../about/about'
    })
  },
  jumpToDetail: function (e) {
    var index = e.currentTarget.dataset.index;
    var stock = this.data.stockDisplayList[index];
    wx.navigateTo({
      url: '../detail/detail?code=' + stock.code + '&name=' + stock.name + '&recentPrice=' + stock.recentPrice + '&recentPercent=' + stock.recentPercent + '&lastPercent=' + stock.lastPercent,
    })
  },
  checkUserStock: function () {

  },
  onReady: function () {
    console.log('page ready');
    this.login().then(user => this.getUserStockList(user)).catch(error => console.error(error.message));
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
