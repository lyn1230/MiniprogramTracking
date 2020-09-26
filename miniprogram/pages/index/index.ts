//获取应用实例app
const app = getApp<IAppOption>()
let cameraConfig = {
  flag: true,                           //是否获取下一个实时帧 
  frame: {                              //实时帧数据
    data: new Uint8Array(288*352),
    width: 0,
    height: 0
  },                            
};
let webglConfig = {
  camera: null,
  render: null,
  sence: null
};
Page({
  data: {
    frameSize: "small"
  },
  onLoad() {
    this.frameSizeInit();    //自动适配实时帧的宽高
  },
  onReady() {
    let that = this;
    this.webglInit();                  //webgl初始化
    let listener = wx.createCameraContext().onCameraFrame((res) => {
      if(cameraConfig.flag === false) 
        return;
      cameraConfig.flag = false;                             //立即停止下一帧的获取，等待当前帧处理后，再处理下一帧
      cameraConfig.frame.data = new Uint8Array(res.data);    //更新实时帧的图像数据
      that.handleFrame();
    })
    // listener.start();
  },
  //事件处理函数
  handleFrame() {
  },
  webglInit() {

  },
  frameSizeInit() {
    if(this.data.frameSize === "small"){
      cameraConfig.frame.width = 288;
      cameraConfig.frame.height = 352;
    } else if(this.data.frameSize === "medium"){
      cameraConfig.frame.width = 480;
      cameraConfig.frame.height = 640;
    } else if(this.data.frameSize === "large"){
      cameraConfig.frame.width = 720;
      cameraConfig.frame.height = 1280;
    }
  },
})
