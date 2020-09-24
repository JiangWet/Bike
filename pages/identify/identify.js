var myUtils = require('../../utils/myUtils.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },


  formSubmit: function(e){
    //获取全局变量的数据
    var globalData=getApp().globalData;
    //获取手机号
    var phoneNum = myUtils.get("phoneNum");
 //   var idNum = myUtils.get("idNum");
    //获取输入的姓名
    var name = e.detail.value.name;
    //获取输入的身份证号
    var idNum = e.detail.value.idNum;
    wx.request({
      url: 'http://localhost:8080/user/identify',
     // header:{'content-type':'application/x-www-form-urlencoded'},
      method: 'POST',
      data: {
        phoneNum: phoneNum,
        name: name,
        status: 3,
        idNum: idNum,
        
      },
      success: function(res){
        wx.hideLoading();
        //将用户信息保存到手机存储卡
        getApp().globalData.name=name
        globalData.status = 3
        wx.setStorageSync("name",name)
        wx.setStorageSync('status', 3)
        //完成所有流程，跳转到首页
        wx.navigateTo({
          url: '../index/index',
        })
      }
    })
  }
})