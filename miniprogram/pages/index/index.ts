import * as THREE from "../../utils/three.min.js";
// //获取应用实例app
// const app = getApp<IAppOption>()
let cameraConfig = {
  flag: true,                           //是否获取下一个实时帧 
  frame: {                              //实时帧数据
    data: new Uint8Array(288*352),
    width: 0,
    height: 0
  },                            
};
let camera: any, renderer: any, scene: any;   //three.js相关的三大要素
Page({
  data: {
    frameSize: "small"
  },
  onLoad() {
    this.frameSizeInit();    //自动适配实时帧的宽高
  },
  onReady() {
    let that = this;
    let frameCount = 0;
    this.webglInit();                  //webgl初始化
    let listener = wx.createCameraContext().onCameraFrame((res) => {
      if(cameraConfig.flag === false) 
        return;
      cameraConfig.flag = false;                             //立即停止下一帧的获取，等待当前帧处理后，再处理下一帧
      cameraConfig.frame.data = new Uint8Array(res.data);    //更新实时帧的图像数据
      that.handleFrame();
      console.log(frameCount++);
    })
    listener.start();
  },
  //事件处理函数
  handleFrame() {
    let geometry = new THREE.PlaneGeometry(cameraConfig.frame.width, cameraConfig.frame.height); //矩形平面
    let texture = new THREE.DataTexture(cameraConfig.frame.data, cameraConfig.frame.width, cameraConfig.frame.height, THREE.RGBAFormat);

      //texture.needsUpdate = true; //纹理更新，作用存疑，似乎是正作用
      let tex_material = new THREE.MeshPhongMaterial({
        map: texture,         // 设置纹理贴图
        side: THREE.DoubleSide
      });
      geometry.translate(cameraConfig.frame.width/2, cameraConfig.frame.height/2, 0);
      geometry.rotateX(Math.PI)
      let mesh = new THREE.Mesh(geometry, tex_material);
      scene.add(mesh)
      renderer.render(scene, camera);
      cameraConfig.flag = true;
  },
  webglInit() {
    wx.createSelectorQuery().select('#canvasId')
    .node()
    .exec((res) => {
      let webcanvas = res[0].node;
      let k = cameraConfig.frame.width / cameraConfig.frame.height;
      let s = cameraConfig.frame.height/2;
      camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 155);
      var x = cameraConfig.frame.width/2;
      var y = -1 * cameraConfig.frame.height/2;
        //使camera正对中心
        camera.position.set(x, y, 150);
        camera.lookAt(x, y, 0);

        renderer = new THREE.WebGLRenderer({
          canvas: webcanvas,
          // antialias: true,//反锯齿
          // alpha: true//透明
        });
        
    scene = new THREE.Scene();

    //简易增白磨皮
    const light = new THREE.DirectionalLight('#ffffff',3)
    light.position.set(cameraConfig.frame.width/2, -1 * cameraConfig.frame.height/2, 20)//光方向
    scene.add(light);
  });
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
  }
})
