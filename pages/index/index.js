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
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  login: function () {
    // AV.User.loginWithWeapp().then(user => {
    //   console.log(user.toJSON());
    // }).catch(console.error);
    return AV.Promise.resolve(AV.User.current()).then(user =>
      user ? (user.isAuthenticated().then(authed => authed ? user : null)) : null
    ).then(user => user ? user : AV.User.loginWithWeapp()).catch(error => console.error(error.message));
  },
  addUserStockList: function () {
    let user = AV.User.current();
    const query = new AV.Query(UserStock)
      .equalTo('user', AV.Object.createWithoutData('User', user.id))
      .descending('createdAt');
    query.find().then(result => {
      if (result.length == 0) {
        // 没有相关数据
        // 可以添加
        var acl = new AV.ACL();
        acl.setPublicReadAccess(false);
        acl.setPublicWriteAccess(false);
        acl.setReadAccess(AV.User.current(), true);
        acl.setWriteAccess(AV.User.current(), true);
        new UserStock({
          stockList: ['GOOG', 'BABA'],
          user: AV.User.current()
        }).setACL(acl).save().then((result) => {
          console.log(result);
        }).catch(error => console.error(error.message));
      }
    })
    return AV.Promise.resolve(query.find().then(result => console.log(result)));
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
    this.login().then(this.addUserStockList()).catch(error => console.error(error.message));
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
