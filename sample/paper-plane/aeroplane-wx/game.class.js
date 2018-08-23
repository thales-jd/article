/****************************************************************************
 *	@Copyright(c)	2018,京东拍拍二手
 *	@desc	飞机飞翔
 *	@date	2018-7-7
 *	@author	Thales
 *	@E-mail	jiangtai@jd.com
 *	@file	game.class.js
 *	@modify	null
 ******************************************************************************/
/**
 *	版本
 */
const VER = "1.0.0";
/**
 *	事件
 */
const Event = {
  GAME_START: "gameStart",
  GAME_OVER: "gameOver"
}

let lastTime = 0;
const requestAnimationFrame = (callback, element) => {
  // 保证如果重复执行callback的话，callback的执行起始时间相隔16ms
  const currTime = new Date().getTime();
  const timeToCall = Math.max(0, 16 - (currTime - lastTime));
  const id = setTimeout(function () {
    callback(currTime + timeToCall);
  }, timeToCall);
  lastTime = currTime + timeToCall;
  return id;
};
/**
 *	主体
 */
var main = function (context) {
  var _this = this; //自身
  var _context = null; //画布
  var _plane = {
    url: "",
    width: 0,
    height: 0
  }; //飞机
  var __plane = null;
  var _isdebug = false; //是否出现调试引导线

  const WIDTH = 240;
  const HEIGHT = 240;

  /**
   *	初始化
   */
  _this.init = function (context) {
    _context = context;
    animate();
  };
  /**
   *	启动
   */
  _this.launch = function (arr) {
    move(arr);
  };
  /**
   * 打开调试
   * @param {Boolean} bool 
   */
  _this.debug = function (bool) {
    _isdebug = bool;
  };
  /**
   * 设置飞机地址
   * @param {Object} obj 
   */
  _this.setPlane = function (obj) {
    _plane = obj;
    __plane = new Image();
    __plane.src = _plane.url;
    __plane.onload = function(){
      //_context.drawImage(__plane, 0, 0, _plane.width, _plane.height); //aeroplane.png

    }
  };
  /**
   * 运动
   * @param {Array} arr 贝塞尔曲线数组 
   */
  function move(arr) {
    _this.dispatchEvent({
      type: Event.GAME_START
    });
    let xt = 0,
      yt = 0;
    var tween = new TWEEN.Tween({
        t: 0
      }) // Create a new tween that modifies 'coords'.
      .to({
        t: 1
      }, 2000) //时间
      .easing(TWEEN.Easing.Quadratic.In)
      .onComplete(function (e) {
        _this.dispatchEvent({
          type: Event.GAME_OVER
        });
      })
      .onUpdate(function (e) {
        if (_isdebug) {
          //_context.save();
          _context.moveTo(arr[0].x, arr[0].y);
          for (let t = 0; t < 1; t += 0.01) {
            let p = getBezierPoint(t, arr);
            _context.lineTo(p.x, p.y);
          }
          _context.stroke();
          //_context.restore();
        }
        _context.save();
        
        let p = getBezierPoint(e.t, arr);
        _context.translate(p.x, p.y);
        let r = Math.atan2(p.y - yt, p.x - xt);
        _context.rotate(r);
        _context.scale(p.z, p.z);
        xt = p.x;
        yt = p.y;
        
        //let url = _plane.url;
        _context.drawImage(__plane, 0, 0, _plane.width, _plane.height); //aeroplane.png
        _context.restore();
        //_context.draw();
      });
    tween.start();
  };
  /**
   * 获取贝塞尔曲线坐标
   * @param {Number} t 
   * @param {Array} p 
   */
  function getBezierPoint(t, p) {
    var x = 0,
      y = 0,
      z = 0;
    if (p.length == 4) {
      x = cuBezier(t, p[0].x, p[1].x, p[2].x, p[3].x);
      y = cuBezier(t, p[0].y, p[1].y, p[2].y, p[3].y);
      z = cuBezier(t, p[0].z, p[1].z, p[2].z, p[3].z);
    } else if (p.length == 3) {
      x = sqBezier(t, p[0].x, p[1].x, p[2].x);
      y = sqBezier(t, p[0].y, p[1].y, p[2].y);
      z = sqBezier(t, p[0].z, p[1].z, p[2].z);
    }
    return {
      x: x,
      y: y,
      z: z
    };
  };
  /**
   * 三次贝塞尔曲线
   * @param factor
   */
  function cuBezier(t, p0, p1, p2, p3) {
    let b = Math.pow((1 - t), 3) * p0 + Math.pow((1 - t), 2) * t * p1 * 3 + Math.pow(t, 2) * (1 - t) * p2 * 3 + Math.pow(t, 3) * p3;
    return b;
  };
  /**
   * 二次贝塞尔曲线
   * @param factor
   */
  function sqBezier(t, p0, p1, p2) {
    let b = Math.pow((1 - t), 2) * p0 + (1 - t) * t * p1 * 2 + Math.pow(t, 2) * p2;
    return b;
  };
  /**
   * 动画
   * @param {Number} time 
   */
  function animate(time) {
    requestAnimationFrame(animate);
    TWEEN.update(new Date().getTime());

  };
  _this.init(context);
};
Object.assign(main.prototype, THREE.EventDispatcher.prototype);
main.prototype.constructor = main;

window.Game = {
  VER,Event,main
}

