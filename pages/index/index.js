//index.js
//获取应用实例
const app = getApp()
let START = -45;   // 设定敞开的角度为90°，起始位置为-45° 
let degree, distanceX, distanceY;
let ctx;
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,

    leftDays: 10,
    monthDays: 20,
    scaleDegree: 0,
    currentIndex: 5,
    date:'',
    week:'',
    left: 0,
    top: 0,
    src: null,
    integers: ['1','2'],
    num:0,
    x: 0,
    y: 0
  },
  canvasIdErrorCallback: function (e) {
    console.error(e.detail.errMsg)
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onReady: function (e) {
    
  },
  onLoad: function () {
    ctx = wx.createCanvasContext('canvas')
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      console.log(app.globalData.userInfo)
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
    this.init()
  },
  onShow(){
    if (this.monthDays==undefined) return;
    this.init()
  },

  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  init: function(){
    let redLength = wx.getStorageSync('redLength') || 5;
    let circleLength = wx.getStorageSync('circleLength') || this.getCountDays();
    this.monthDays = circleLength;
    this.scaleDegree = 270 / this.monthDays;

    this.num = wx.getStorageSync('num') || 0;
    let deadline = new Date('2018/01').getTime() || (new Date('2018-01').getTime()-8*3600*1000)
    let days = Math.ceil((new Date().getTime() - deadline)/1000/60/24/60)

    this.currentIndex = (this.num + days) % this.monthDays;
    if (this.currentIndex==0){
      this.currentIndex = this.monthDays
    }
    
    let greenLength = (this.monthDays - redLength - 7) / 2
    this.canvasShow(Math.floor(greenLength), Math.floor(greenLength) + 7, this.monthDays - redLength, this.monthDays)

    this.setData({
      date: this.getDay(),
      week: this.getWeek(),
      left: this.getPosition(this.currentIndex).left,
      top: this.getPosition(this.currentIndex).top,
      leftDays: this.monthDays - this.currentIndex,
      monthDays: this.monthDays,
      currentIndex: this.currentIndex,
      x: this.getPosition(Math.ceil(greenLength) + redLength + 4).left + 12 * 2 / app.globalData.scale,
      y: this.getPosition(Math.ceil(greenLength) + redLength + 4).top + 12 * 2 / app.globalData.scale
    })
  },
  //获取当前月的天数
  getCountDays: function() {
    var curDate = new Date();
    var curMonth = curDate.getMonth();
    curDate.setMonth(curMonth + 1);
    curDate.setDate(0);
    return curDate.getDate();
  },
  //当天是周几
  getWeek: function(){
    var showWeek = new Array('周日','周一', '周二', '周三', '周四', '周五', '周六'); 
    var week = new Date().getDay();
    return showWeek[week]
  },
    //当天是几号
  getDay: function() {
    return new Date().getDate()
  },
  canvasShow: function (num0, num1, num2, num3) {
    ctx.beginPath();
    ctx.arc(180 * 2 / app.globalData.scale, 180 * 2 / app.globalData.scale, 150 * 2 / app.globalData.scale, Math.PI / 180 * START, Math.PI / 180 * (START + num0 * this.scaleDegree), false);
    ctx.setLineWidth(30 * 2 / app.globalData.scale);
    ctx.setStrokeStyle("#ccea85");
    ctx.stroke();

    ctx.beginPath();
    ctx.setLineWidth(30 * 2 / app.globalData.scale);
    ctx.setStrokeStyle("#df97ee");
    ctx.arc(180 * 2 / app.globalData.scale, 180 * 2 / app.globalData.scale, 150 * 2 / app.globalData.scale, Math.PI / 180 * (START + num0 * this.scaleDegree), Math.PI / 180 * (START + num1 * this.scaleDegree), false);
    ctx.stroke();

    ctx.beginPath();
    ctx.setLineWidth(30 * 2 / app.globalData.scale);
    ctx.setStrokeStyle("#ccea85");
    ctx.arc(180 * 2 / app.globalData.scale, 180 * 2 / app.globalData.scale, 150 * 2 / app.globalData.scale, Math.PI / 180 * (START + num1 * this.scaleDegree), Math.PI / 180 * (START + num2 * this.scaleDegree), false);
    ctx.stroke();

    ctx.beginPath();
    ctx.setLineWidth(30 * 2 / app.globalData.scale);
    ctx.setStrokeStyle("#fd9cb4");
    ctx.arc(180 * 2 / app.globalData.scale, 180 * 2 / app.globalData.scale, 150 * 2 / app.globalData.scale, Math.PI / 180 * (START + num2 * this.scaleDegree), Math.PI / 180 * (START + num3 * this.scaleDegree), false);
    ctx.stroke();

    // 边缘曲线化
    ctx.beginPath();
    ctx.setLineWidth(15 * 2 / app.globalData.scale);
    ctx.setStrokeStyle("#fd9cb4");
    ctx.arc(73 * 2 / app.globalData.scale, 75 * 2 / app.globalData.scale, 7.5 * 2 / app.globalData.scale, -Math.PI / 2, Math.PI / 2 * 3, false);
    ctx.stroke();

    ctx.beginPath();
    ctx.setLineWidth(15 * 2 / app.globalData.scale);
    ctx.setStrokeStyle("#ccea85");
    ctx.arc(287 * 2 / app.globalData.scale, 75 * 2 / app.globalData.scale, 7.5 * 2 / app.globalData.scale, -Math.PI / 2, Math.PI / 2 * 3, false);
    ctx.stroke();
    // 画刻度
    let scaleStart = START;
    for (var i = 1; i < this.monthDays; i++) {
      scaleStart += this.scaleDegree
      this.scale(scaleStart, ctx);
    }
    ctx.draw()
  },
  scale: function (start, ctx) {
    ctx.beginPath();
    ctx.setLineWidth(8 * 2 / app.globalData.scale);
    ctx.setStrokeStyle("white");
    ctx.arc(180 * 2 / app.globalData.scale, 180 * 2 / app.globalData.scale, 160 * 2 / app.globalData.scale, Math.PI / 180 * (start - 0.2), Math.PI / 180 * (start + 0.2), false);
    ctx.stroke();
  },
  //获取定位坐标
  getPosition: function(day){
    var degree = 45 + (this.monthDays - day + 0.5) * this.scaleDegree;
    var radian = Math.PI / 180 * degree
    var r = 150;
    var left = 180 + r * Math.sin(radian) - 25;
    var top = 180 - r * Math.cos(radian) - 25;
    return { left: left * 2 / app.globalData.scale, top: top * 2 / app.globalData.scale }
  },
  //根据鼠标松开时degree,确定最终位置
  // surePosition: function(degree){
  //   var allDegree = this.getAllDegree();
  //   var allPostion = this.getAllPosition();
  //   for(var i= 0;i<allDegree.length;i++){
  //     if (degree > allDegree[i]) {
  //       if (degree * 2 > allDegree[i] + allDegree[i - 1]) {
  //         this.currentIndex = i;
  //         return allPostion[i - 1]
  //       } else {
  //         this.currentIndex = i + 1;
  //         return allPostion[i]
  //       }
  //     }
  //   }
  // },
  // 获取当月内所有日期的坐标
  // getAllPosition: function() {
  //   var allDays = this.getCountDays();
  //   var allPostion = new Array();
  //   for (var i = 1; i < (allDays + 1); i++) {
  //     allPostion.push(this.getPosition(i))
  //   }
  //   return allPostion;
  // },
  // 获取当月内所有日期的所对应的角度
  // getAllDegree: function() {
  //   var allDays = this.getCountDays();
  //   var allDegree = new Array();
  //   for (var i = 1; i < (allDays + 1); i++) {
  //     allDegree.push(45 + (this.monthDays - i + 0.5) * this.scaleDegree)
  //   }
  //   return allDegree;
  // },
  //
  nextPosition: function() {
    if (this.currentIndex < this.monthDays) {
      this.currentIndex++;
      this.num++
      wx.setStorage({
        key: 'num',
        data: this.num,
      })
      var nextPosition = this.getPosition(this.currentIndex);
      this.setData({
        left: nextPosition.left,
        top: nextPosition.top,
        leftDays: this.monthDays - this.currentIndex,
        currentIndex: this.currentIndex
      })
    } else {
      return
    }
  },
  prePosition(){
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.num--
      wx.setStorage({
        key: 'num',
        data: this.num,
      })
      var nextPosition = this.getPosition(this.currentIndex);
      this.setData({
        left: nextPosition.left,
        top: nextPosition.top,
        leftDays: this.monthDays - this.currentIndex,
        currentIndex:this.currentIndex
      })
    }
  },
  // touchstart: function (e) {
  //   distanceX = e.touches[0].pageX - e.currentTarget.offsetLeft;
  //   distanceY = e.touches[0].pageY - e.currentTarget.offsetTop;
  // },
  // touchmove: function(e){
  //   var disX = e.touches[0].pageX - distanceX - (180 - 25) * 2 / app.globalData.scale;
  //   var disY = e.touches[0].pageY - distanceY - (180 - 25) * 2 / app.globalData.scale;
  //   if (disY < 0) {
  //     degree = (Math.atan(disX / -disY)) / Math.PI * 180
  //     if (disX < 0) {
  //       degree = 360 - (Math.atan(disX / disY)) / Math.PI * 180
  //     }
  //   } else {
  //     degree = 180 - (Math.atan(disX / disY)) / Math.PI * 180;
  //   }

  //   if (degree > 315) {
  //     degree = 315
  //     return
  //   } else if (degree < 45) {
  //     degree = 45
  //     return
  //   }

  //   var radian = Math.PI / 180 * degree
  //   var r = 150;
  //   var left = 180 + r * Math.sin(radian) - 25;
  //   var top = 180 - r * Math.cos(radian) - 25;
    
  //   this.setData({
  //     left: left * 2 / app.globalData.scale,
  //     top: top * 2 / app.globalData.scale
  //   })
    
  // },
  // touchend: function(e){
  //   var lastPosition = this.surePosition(degree);
  //   if (lastPosition === undefined) {
  //     return
  //   }
  //   this.setData({
  //     left: lastPosition.left,
  //     top: lastPosition.top,
  //     leftDays: this.monthDays - this.currentIndex
  //   })
  // },
  changePosition(e){
    this.num = this.num + e.detail.value - this.currentIndex;
    wx.setStorage({
      key: 'num',
      data: this.num,
    })
    this.currentIndex = e.detail.value;
    var nextPosition = this.getPosition(this.currentIndex);
    this.setData({
      left: nextPosition.left,
      top: nextPosition.top,
      leftDays: this.monthDays - this.currentIndex
    })
  }
})
