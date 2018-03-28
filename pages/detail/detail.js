//index.js
//获取应用实例
const AV = require('../../utils/av-live-query-weapp-min');
const util = require('../../utils/util.js');
const UserStock = require('../../model/user-stock');
const StockPrice = require('../../model/stock-price');
const app = getApp()

Page({
  data: {
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
    
  },
  onLoad: function (options) {
    console.log(options);
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
