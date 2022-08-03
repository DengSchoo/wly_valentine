;(function (window) {
  window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame || window.msRequestAnimationFrame

  const FRAME_RATE = 60
  const PARTICLE_NUM = 2000
  const RADIUS = Math.PI * 2
  const CANVASWIDTH = 900
  const CANVASHEIGHT = 150
  const CANVASID = 'canvas'
  var dateBegin = new Date('2022-06-12 19:02:00');
  var dateEnd = new Date();

  var dateDiff = dateEnd.getTime() - dateBegin.getTime();//时间差的毫秒数
    var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000));//计算出相差天数
    var leave1=dateDiff%(24*3600*1000)    //计算天数后剩余的毫秒数
    var hours=Math.floor(leave1/(3600*1000))//计算出小时数
    //计算相差分钟数
    var leave2=leave1%(3600*1000)    //计算小时数后剩余的毫秒数
    var minutes=Math.floor(leave2/(60*1000))//计算相差分钟数
    

    //计算相差秒数
    var leave3=leave2%(60*1000)      //计算分钟数后剩余的毫秒数
    var seconds=Math.round(leave3/1000)

    // 计算毫秒秒数
    var mill_seconds = leave3 % 1000;
    

  let texts = ['我一直在想，', '我该如何表达','自己的爱意。','让我重拾少有的','浪漫感和仪式感',
  '我们已经在一起:', dayDiff + ' days', hours + ' hours', minutes + ' mins', seconds + ' s', mill_seconds + ' ms','刚在一起就要异地', '是什么人间疾苦', '1th 情人节快乐', 'I HEAR LOVE', 'I BELIEVE IN LOVE',   'I MISS U ❤__wsh']

  let canvas,
    ctx,
    particles = [],
    quiver = true,
    text = texts[0],
    textIndex = 0,
    textSize = 80

  function draw () {
    ctx.clearRect(0, 0, CANVASWIDTH, CANVASHEIGHT)
    ctx.fillStyle = 'rgb(255, 255, 255)'
    ctx.textBaseline = 'middle'
    ctx.fontWeight = 'bold'
    
    //ctx.font = textSize + 'px \'SimHei\', \'Avenir\', \'Helvetica Neue\', \'Arial\', \'sans-serif\''
    //ctx.font = textSize + 'px \'Times New Roman\', \'Avenir\', \'Helvetica Neue\', \'Arial\', \'sans-serif\''
    ctx.font = textSize + 'px \'微软雅黑\', \'Avenir\', \'Helvetica Neue\', \'Arial\', \'sans-serif\''

    ctx.fillText(text, (CANVASWIDTH - ctx.measureText(text).width) * 0.5, CANVASHEIGHT * 0.5)

    let imgData = ctx.getImageData(0, 0, CANVASWIDTH, CANVASHEIGHT)

    ctx.clearRect(0, 0, CANVASWIDTH, CANVASHEIGHT)

    for (let i = 0, l = particles.length; i < l; i++) {
      let p = particles[i]
      p.inText = false
    }
    particleText(imgData)
    toggleSound()

    window.requestAnimationFrame(draw)
  }

  function toggleSound() {
    // var music = document.getElementById("vd");//获取ID  
    //     console.log(music);
    //     console.log(music.paused);
    // if (music.paused) { //判读是否播放  
    //     music.paused=false;
    //     music.play(); //没有就播放 
    //   }
    
    document.addEventListener('click', function() {
      var music = document.getElementById('music')
      if (music.paused) {
        music.play()
      }
    })
       
}

//setInterval("toggleSound()",1000);

  function particleText (imgData) {
    // 点坐标获取
    var pxls = []
    for (var w = CANVASWIDTH; w > 0; w -= 3) {
      for (var h = 0; h < CANVASHEIGHT; h += 3) {
        var index = (w + h * (CANVASWIDTH)) * 4
        if (imgData.data[index] > 1) {
          pxls.push([w, h])
        }
      }
    }

    var count = pxls.length
    var j = parseInt((particles.length - pxls.length) / 2, 10)
    j = j < 0 ? 0 : j

    for (var i = 0; i < pxls.length && j < particles.length; i++, j++) {
      try {
        var p = particles[j],
          X,
          Y

        if (quiver) {
          X = (pxls[i - 1][0]) - (p.px + Math.random() * 10)
          Y = (pxls[i - 1][1]) - (p.py + Math.random() * 10)
        } else {
          X = (pxls[i - 1][0]) - p.px
          Y = (pxls[i - 1][1]) - p.py
        }
        var T = Math.sqrt(X * X + Y * Y)
        var A = Math.atan2(Y, X)
        var C = Math.cos(A)
        var S = Math.sin(A)
        p.x = p.px + C * T * p.delta
        p.y = p.py + S * T * p.delta
        p.px = p.x
        p.py = p.y
        p.inText = true
        p.fadeIn()
        p.draw(ctx)
      } catch (e) {}
    }
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i]
      if (!p.inText) {
        p.fadeOut()

        var X = p.mx - p.px
        var Y = p.my - p.py
        var T = Math.sqrt(X * X + Y * Y)
        var A = Math.atan2(Y, X)
        var C = Math.cos(A)
        var S = Math.sin(A)

        p.x = p.px + C * T * p.delta / 2
        p.y = p.py + S * T * p.delta / 2
        p.px = p.x
        p.py = p.y

        p.draw(ctx)
      }
    }
  }

  function setDimensions () {
    canvas.width = CANVASWIDTH
    canvas.height = CANVASHEIGHT
    canvas.style.position = 'absolute'
    canvas.style.left = '0%'
    canvas.style.top = '0%'
    canvas.style.bottom = '0%'
    canvas.style.right = '0%'
    canvas.style.marginTop = window.innerHeight * .15 + 'px'
  }

  function event () {
    document.addEventListener('click', function (e) {
      textIndex++
      if (textIndex >= texts.length) {
        textIndex--
        return
      }
      text = texts[textIndex]
      console.log(textIndex)
    }, false)

    document.addEventListener('touchstart', function (e) {
      textIndex++
      if (textIndex >= texts.length) {
        textIndex--
        return
      }
      text = texts[textIndex]
      console.log(textIndex)
    }, false)
  }

  function init () {
    canvas = document.getElementById(CANVASID)
    if (canvas === null || !canvas.getContext) {
      return
    }
    ctx = canvas.getContext('2d')
    setDimensions()
    event()

    for (var i = 0; i < PARTICLE_NUM; i++) {
      particles[i] = new Particle(canvas)
    }

    draw()
  }

  class Particle {
    constructor (canvas) {
      let spread = canvas.height
      let size = Math.random() * 1.2 + 0.1
      // 速度
      this.delta = 0.06
      // 现在的位置
      this.x = 0
      this.y = 0
      // 上次的位置
      this.px = Math.random() * canvas.width
      this.py = (canvas.height * 0.5) + ((Math.random() - 0.5) * spread)
      // 记录点最初的位置
      this.mx = this.px
      this.my = this.py
      // 点的大小
      this.size = size
      // this.origSize = size
      // 是否用来显示字
      this.inText = false
      // 透明度相关
      this.opacity = 0
      this.fadeInRate = 0.005
      this.fadeOutRate = 0.03
      this.opacityTresh = 0.98
      this.fadingOut = true
      this.fadingIn = true
    }
    fadeIn () {
      this.fadingIn = this.opacity > this.opacityTresh ? false : true
      if (this.fadingIn) {
        this.opacity += this.fadeInRate
      }else {
        this.opacity = 1
      }
    }
    fadeOut () {
      this.fadingOut = this.opacity < 0 ? false : true
      if (this.fadingOut) {
        this.opacity -= this.fadeOutRate
        if (this.opacity < 0) {
          this.opacity = 0
        }
      }else {
        this.opacity = 0
      }
    }
    draw (ctx) {
      ctx.fillStyle = 'rgba(226,225,142, ' + this.opacity + ')'
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.size, 0, RADIUS, true)
      ctx.closePath()
      ctx.fill()
    }
  }
  
  var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    if(!isChrome){
      $('#iframeAudio').remove()
  }
  
  // setTimeout(() => {
    init()  
  // }, 4000);
  // mp3.play()
})(window)
