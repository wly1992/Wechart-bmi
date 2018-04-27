
let integers = []
const decimals = ['.0','.1', '.2', '.3', '.4', '.5', '.6', '.7', '.8', '.9']
for (let i = 40; i < 80; i++) {
  integers.push(i)
}
let height = []
for (let i = 100; i < 230; i++) {
  height.push(i)
}

Page({
  data: {
    array: height,
    multiArray: [integers, decimals],
    index: 70,
    multiIndex: [20, 0],
    redLength: wx.getStorageSync('redLength') || 5,
    circleLength: wx.getStorageSync('circleLength') || 30
  },
  onLoad: function (options) {
    var targetWeight = wx.getStorageSync('targetWeight');
    if (targetWeight!==''){
      this.setData({
        multiIndex: targetWeight.index
      })
    }
    var height = wx.getStorageSync('height')
    if (height !== '') {
      this.setData({
        index: height.index
      })
    }
  },
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
    wx.setStorage({
      key: "height",
      data: {
        height: height[e.detail.value],
        index: e.detail.value
      } 
    })
  },
  bindMultiPickerChange: function (e) {
    this.setData({
      multiIndex: e.detail.value
    })
    wx.setStorage({
      key: "targetWeight",
      data: {
        targetWeight: integers[e.detail.value[0]] + decimals[e.detail.value[1]],
        index: e.detail.value
      }
    })
  },
  circleLengthChange(e){
    // console.log(e.detail.value)
    wx.setStorage({
      key: "circleLength",
      data: e.detail.value
    })
    wx.setStorage({
      key: "num",
      data: 0
    })
  },
  redLengthChange(e) {
    // console.log(e.detail.value)
    wx.setStorage({
      key: "redLength",
      data: e.detail.value
    })
    wx.setStorage({
      key: "num",
      data: 0
    })
  },
  toManageData(){
    wx.navigateTo({
      url: '../manageData/manageData'
    })
  },
  switchChange: function (e) {
    console.log(e.detail.value)
  },
})