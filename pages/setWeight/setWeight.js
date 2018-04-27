
const app = getApp();
let integers = [];
const decimals = ['.0','.1', '.2', '.3', '.4', '.5', '.6', '.7', '.8', '.9'];
for (let i = 0; i <100; i++) {
  integers.push(i)
}

Page({
  data: {
    integers: integers,
    decimals: decimals,
    value: [30, 1],
    weight: null,
    massIndex: null,
    date: null,
    endTime: null
  },
  onLoad: function (options) {
    let weight = options.weight;
    let month = ('000' + (new Date().getMonth() + 1)).substr(-2, 2);
    let date = `${new Date().getFullYear()}-${month}-${new Date().getDate()}`;
    this.setData({
      value: weight.split('.'),
      date: date,
      endTime: date,
      weight: weight
    })
  },
  bindChange: function (e) {
    let val = e.detail.value
    this.setData({
      weight: this.data.integers[val[0]] + this.data.decimals[val[1]]
    })
  },
  
  sure: function(){
    let Height = wx.getStorageSync('height');
    let TargetWeight = wx.getStorageSync('targetWeight')
    if (Height === '' || TargetWeight === '') {
      wx.showModal({
        title: '提示',
        content: '请先去设置身高和目标体重\n(默认为170cm和60kg)',
        confirmText: '去设置',
        success: function (res) {
          if (res.confirm) {
            wx.reLaunch({
              url: '../setting/setting'
            })
          } else if (res.cancel) {
            wx.setStorage({
              key: "height",
              data: {
                height: 170,
                index: "70"
              }
            })
            wx.setStorage({
              key: "targetWeight",
              data: {
                targetWeight: "60.0",
                index: [20,0]
              }
            })
          }
        }
      })
    }else{
      if (this.data.weight !== null) {
        
        let height = wx.getStorageSync('height').height || 170;
        let massIndex = (this.data.weight / height / height * 10000).toFixed(2);

        let recodeTime = this.data.date; //记录的时间
        let recodeData = wx.getStorageSync('recodeData') === '' ? [] : wx.getStorageSync('recodeData');
        if (recodeData.length !== 0) {
          let addOrmodify = null;
          for (let i = 0; i < recodeData.length;i++){
            if (recodeData[i][0] === recodeTime){
              addOrmodify = i
              break
            }
          }
          if (addOrmodify!==null){
            recodeData[addOrmodify] = [recodeTime, massIndex, this.data.weight]
          }else{
            recodeData.push([recodeTime, massIndex, this.data.weight])
          }
        } else {
          recodeData.push([recodeTime, massIndex, this.data.weight])
        }
        //排序
        recodeData.sort(function(a,b){
          let aa = a[0].replace(/-/g,'');
          let bb = b[0].replace(/-/g, '');
          return aa-bb
        })
        //存储数据
        wx.setStorage({
          key: "recodeData",
          data: recodeData
        })
        //将数据同步到后台
        this.uploadData(recodeData)

        wx.navigateBack({
          delta: 1
        })
      }
    }
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  uploadData(data){
    // wx.getNetworkType({
    //   success: function (res) {
    //     if (res.networkType==='wifi'){
    //       wx.request({
    //         url: 'http://111.231.113.230:3000/miniprograms/upload', 
    //         data: data,
    //         header: {
    //           'content-type': 'application/json'
    //         },
    //         success: function (res) {
    //           console.log(res.data)
    //         }
    //       })
    //     }
    //   }
    // })  
  }
})
