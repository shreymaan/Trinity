window.requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60);
    };
})();

'use strict';
/* globals mapsStyle, MeGoDeGo, requestAnimFrame */
if (typeof MeGoDeGo === 'undefined') {
  window.MeGoDeGo = window.MeGoDeGo || {};
}

MeGoDeGo.BgVideo = {
  settings: {
    $video: $('#background-video'),
    $canvas: $('#background-canvas'),
    pattern: $('#ornament').get(0),
    buffer: document.createElement('canvas'),
    patternCanvas: document.createElement('canvas'),
    canvas: {},
    ctx: {},
    video: {},
    poster: {},
    dimensions: {
      dx: 0,
      dy: 0,
      dWidth: 0,
      dHeight: 0
    }
  },

  init: function() {
    var that = this,
      s = this.settings;
    s.canvas = s.$canvas.get(0);
    s.ctx = s.canvas.getContext('2d');
    s.video = s.$video.get(0);

    s.canvas.width = s.$canvas.width();
    s.canvas.height = s.$canvas.height();

    s.patternCache = that.createPattern();

    if (Modernizr.mobile) { // Mobile

      s.poster = $('<img/>')
        .load(function() {
          that.updateDimensions(s.poster.get(0).width, s.poster.get(0).height);
          that.drawImage();
          that.drawPattern();
        })
        .attr('src', s.$video.attr('poster'));

      $(window).on('resize', function() {
        that.resizeCanvas();
        that.updateDimensions(s.poster.get(0).width, s.poster.get(0).height);
        s.patternCache = that.createPattern();

        that.drawImage();
        that.drawPattern();

      });

    }else { // Not mobile

      if(Modernizr.canvas && Modernizr.video){
        s.video.addEventListener('canplaythrough', function() {
          s.video.play();
        }, false);

        s.video.addEventListener('play', function() {
          var $this = this;

          that.updateDimensions(s.video.videoWidth, s.video.videoHeight);

          (function loop() {
            if (!$this.paused && !$this.ended) {
              that.drawVideo();
              that.drawPattern();
              requestAnimFrame(loop);

            }
          })();
        }, 0);

        $(window).on('resize', function() {
          that.resizeCanvas();
          that.updateDimensions(s.video.videoWidth, s.video.videoHeight);

          s.patternCache = that.createPattern();
        });
      }
    }

  },
  resizeCanvas: function() {
    var s = this.settings;

    s.canvas.width = s.$canvas.width();
    s.canvas.height = s.$canvas.height();
  },
  updateDimensions: function(width, height) {
    var s = this.settings;

    var hRatio = s.canvas.clientWidth / width;
    var vRatio = s.canvas.clientHeight / height;
    var ratio = Math.max(hRatio, vRatio);

    s.dimensions = {
      dx: Math.round((s.canvas.width - width * ratio) / 2),
      dy: Math.round((s.canvas.height - height * ratio) / 2),
      dWidth: width * ratio,
      dHeight: height * ratio
    };

  },
  drawVideo: function() {
    var s = this.settings;

    s.ctx.drawImage(
      s.video,
      0, 0,
      s.video.videoWidth,
      s.video.videoHeight,
      s.dimensions.dx,
      s.dimensions.dy,
      s.dimensions.dWidth,
      s.dimensions.dHeight
    );

  },
  drawImage: function() {
    var that = this,
      s = that.settings;

    s.ctx.drawImage(
      s.poster.get(0),
      0, 0,
      s.poster.get(0).width,
      s.poster.get(0).height,
      s.dimensions.dx,
      s.dimensions.dy,
      s.dimensions.dWidth,
      s.dimensions.dHeight
    );

  },
  createPattern: function() {
    var s = this.settings;

    s.buffer.width = s.canvas.width;
    s.buffer.height = s.canvas.height;

    var bufferContext = s.buffer.getContext('2d');
    bufferContext.clearRect(0, 0, s.buffer.width, s.buffer.height);

    var pCtx = s.patternCanvas.getContext('2d');

    bufferContext.fillStyle = pCtx.createPattern(s.pattern, 'repeat');
    bufferContext.fillRect(0, 0, s.buffer.width, s.buffer.height);

    var rectW = s.canvas.width;
    var rectH = s.canvas.height;

    var rx = rectW; // radius in x direction
    var ry = rectH; // radius in y direction
    var cx = rectW / 2; // gradient will be centered at (cx, cy)
    var cy = rectH / 2;

    var scaleX;
    var scaleY;
    var invScaleX;
    var invScaleY;
    var grad;

    rx = (rx === 0) ? 0.25 : rx;
    ry = (ry === 0) ? 0.25 : ry;

    // Create horizontal or vertical elliptic gradient
    if (rx >= ry) {
      scaleX = 1;
      invScaleX = 1;
      scaleY = ry / rx;
      invScaleY = rx / ry;
      grad = bufferContext.createRadialGradient(
        cx,
        cy * invScaleY,
        20,
        cx,
        cy * invScaleY,
        rx);

    } else {
      scaleY = 1;
      invScaleY = 1;
      scaleX = rx / ry;
      invScaleX = ry / rx;
      grad = bufferContext.createRadialGradient(
        cx * invScaleX,
        cy,
        20,
        cx * invScaleX,
        cy,
        ry);
    }

    bufferContext.save();
    bufferContext.globalCompositeOperation = 'destination-out'; // gradient masks elements in bufferContext

    bufferContext.fillStyle = grad;

    grad.addColorStop(0, 'rgba(0,0,0,1)');
    grad.addColorStop(0.8, 'rgba(0,0,0,0)');

    bufferContext.setTransform(scaleX, 0, 0, scaleY, 0, 0);

    bufferContext.fillRect(0, 0, rectW * invScaleX, rectH * invScaleY);

    return s.buffer;
  },
  drawPattern: function() {
    var that = this,
      s = this.settings;
    s.ctx.drawImage(s.patternCache, 0, 0, s.canvas.width, s.canvas.height);

  }
};

$(MeGoDeGo.BgVideo.init());