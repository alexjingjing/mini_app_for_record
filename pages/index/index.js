//index.js
//获取应用实例
const AV = require('../../utils/av-live-query-weapp-min');
const UserStock = require('../../model/user-stock')
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
      { name: 'APPL', value: '苹果' },
      { name: '00700', value: '腾讯' },
      { name: 'BABA', value: '阿里巴巴' },
      { name: 'TSLA', value: '特斯拉' },
    ],
    stockList: [],
    stockResultList: [],
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
          stockList: result[0].stockList
        })
        
      }
    });
  },
  addUserStockList: function () {
    console.log(this.data.stockList.length);
    console.log(this.data.chosenList);
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
      var acl = new AV.ACL();
      acl.setPublicReadAccess(false);
      acl.setPublicWriteAccess(false);
      acl.setReadAccess(AV.User.current(), true);
      acl.setWriteAccess(AV.User.current(), true);
      new UserStock({
        stockList: this.data.chosenList,
        user: AV.User.current()
      }).setACL(acl).save().then((result) => {
        console.log(result);
        wx.showToast({
          title: '添加成功！',
        })
        this.setData({
          stockList: this.data.chosenList,
          chosenList: []
        })
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
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    this.setData({
      chosenList: e.detail.value
    })
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
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
