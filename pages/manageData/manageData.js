// pages/manageData/manageData.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recodeData:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let recodeData = wx.getStorageSync('recodeData');
    this.setData({
      recodeData: recodeData
    })
  },
  del(e){
    let index = e.currentTarget.dataset.index;
    let recodeData = this.data.recodeData;
    let _this = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除本条数据？',
      success: function (res) {
        if (res.confirm) {
          recodeData.splice(index, 1);
          wx.setStorage({
            key: "recodeData",
            data: recodeData
          })
          _this.setData({
            recodeData: recodeData
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
})