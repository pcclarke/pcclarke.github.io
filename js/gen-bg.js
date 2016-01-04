function draw() {
  var ctx = document.getElementById('gen-bg').getContext('2d');
  var w = document.getElementById('gen-bg').width;
  var h = document.getElementById('gen-bg').height;

  var colours = new Array(100);
  for (var i = 0; i < 100; i++) {
    colours[i] = new Array(100);
  }
  var bgH, bgS, bgB;

  bgH = Math.floor(Math.random() * 359);
  bgS = Math.floor(Math.random() * 20 + 80);
  bgB = 20;
  for (var i = 0; i < 100; i++) {
    for (var j = 0; j < 100; j++) {
      colours[i][j] = 'hsl(' + bgH + ',' + bgS + '%,' + (bgB + ((j/2) - 20)) + '%)';
    }
  }

  var gravity = 2;

  var growBgH = ((Math.random() * 50) - 25 + bgH);
  if (growBgH >= 360) {
    growBgH -= 360;
  } else if (spreadBgH < 0) {
    growBgH += 360;
  }
  var growBgS = ((Math.random() * 20) + 80);
  var growColour = 'hsl(' + growBgH + ',' + growBgS + '%,' + (bgB + 10) + ')';
 
  for (var i = 0; i < 8; i++) {
    var rootX = Math.floor(Math.random() * 99);
    var rootY = Math.floor(Math.random() * 19);

    colours[rootX][rootY] = growColour;
   
    for (var j = 0; j < Math.random() * 5; j++) {
      var spreadX = rootX;
      var spreadY = rootY;
       
      var n = 0;
      while(spreadX != 0 && spreadX != 99 && spreadY != 0 && spreadY != 99 && n < 400) {
        var direction = gravity;
         
        if (Math.random() < .75) {
          direction = Math.round(Math.random() * 4);
        }
         
        if (direction == 0) {
          spreadY--;
        } else if (direction == 1) {
          spreadX++;
        } else if (direction == 2) {
          spreadY++;
        } else if (direction == 3) {
          spreadX--;
        }
         
        var spreadBgH = ((Math.random() * 50) - 25 + bgH);
        if (spreadBgH >= 360) {
          spreadBgH -= 360;
        } else if (spreadBgH < 0) {
          spreadBgH += 360;
        }
        var spreadBgS = ((Math.random() * 20) + 80);
        var spreadColour = 'hsl(' + spreadBgH + '%,' + spreadBgS + '%,' + (bgB + 10) + ')';
        colours[spreadX][spreadY] = spreadColour;
         
        n++;
      }
    }
  }

  for(var i = 0; i < 100; i++) {
    for (var j = 0; j < 100; j++) {
      ctx.fillStyle = colours[i][j];
      ctx.fillRect((i * w/100), (j * h/100), w/100, h/100);
      ctx.fillStyle = 'hsla(' + bgH + ',' + bgS + '%,' + (bgB + Math.random() * 10) + '%,' + ((Math.random() * 0.2) + 0.4) + ')';
      ctx.fillRect(((i * w/100) + (Math.random() * w/100)), (j * h/100), w/100, h/100);
    }
  }
}

draw();