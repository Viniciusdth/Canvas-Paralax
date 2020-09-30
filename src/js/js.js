(function() {
  var lastTime = 0;
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
    window.cancelRequestAnimationFrame = window[vendors[x]+
    'CancelRequestAnimationFrame'];
  }
  
  if (!window.requestAnimationFrame)
  window.requestAnimationFrame = function(callback, element) {
    var currTime = new Date().getTime();
    var timeToCall = Math.max(0, 16 - (currTime - lastTime));
    var id = window.setTimeout(function() { callback(currTime + timeToCall); },
    timeToCall);
    lastTime = currTime + timeToCall;
    return id;
  };
  
  if (!window.cancelAnimationFrame)
  window.cancelAnimationFrame = function(id) {
    clearTimeout(id);
  };
}())

var layers = [],
objects = [],

world = document.getElementById( 'world' ),
sky = document.getElementById( 'sky' ),
land = document.getElementById( 'land' ),
viewport = document.getElementById( 'viewport' ),

d = 0,
p = 400,
worldXAngle = 0,
worldYAngle = 0,
skyYAngle = 0,
skyXAngle = 0,
landYAngle = 0;
landXAngle = 0,

viewport.style.webkitPerspective = p;
viewport.style.MozPerspective = p;
viewport.style.oPerspective = p;

generate();

function createCloud() {
  let div = document.createElement('div');
  div.className = 'cloudBase';
  sizeX = sky.offsetWidth;
  sizeY = sky.offsetHeight;
  let x = (sizeX * 0.9) - ( Math.random() * sizeX );
  let y = (sizeY * 0.1) - ( Math.random() * sizeY );
  let z = (sizeY * 0.2) - ( Math.random() * sizeX );
  let t = 'translateX( ' + x + 'px ) translateY( ' + y + 'px ) translateZ( ' + z + 'px )';
  div.style.webkitTransform = t;
  div.style.MozTransform = t;
  div.style.oTransform = t;
  sky.appendChild(div);
  
  for( let j = 0; j < 5 + Math.round( Math.random() * 10 ); j++ ) {
    let cloud = document.createElement( 'img' );
    cloud.style.opacity = 0;
    let r = Math.random();
    let src = 'src/images/cloud.png';
    ( function( img ) { img.addEventListener( 'load', function() {
      img.style.opacity = .8;
    } ) } )( cloud );
    cloud.setAttribute( 'src', src );
    cloud.className = 'cloudLayer';
    sizeX = cloud.offsetWidth;
    sizeY = cloud.offsetHeight;
    let x = (sizeX * 0.5) - ( Math.random() * sizeX );
    let y = (sizeY * 0.5) - ( Math.random() * sizeY );
    let z = (sizeY * 0.5) - ( Math.random() * sizeY );
    let a = Math.random() * 360;
    let s = .15 + Math.random();
    x *= .2; y *= .2;
    cloud.data = {
      x: x,
      y: y,
      z: z,
      a: a,
      s: s,
      speed: .1 * Math.random()
    };
    let t = 'translateX( ' + x + 'px ) translateY( ' + y + 'px ) translateZ( ' + z + 'px ) rotateZ( ' + a + 'deg ) scale( ' + s + ' )';
    cloud.style.webkitTransform = t;
    cloud.style.MozTransform = t;
    cloud.style.oTransform = t;
    
    div.appendChild( cloud );
    layers.push( cloud );
  }
  return div;
}

window.addEventListener( 'mousemove', onMouseMove );

function onMouseMove ( e ) {
  let x = e.clientX;
  let y = e.clientY;
  worldYAngle = -( .5 - ( x / window.innerWidth ) ) * 45;
  worldXAngle = ( .5 - ( y / window.innerHeight ) ) * 45;
  
  skyYAngle = -( .5 - ( x / window.innerWidth ) ) * 10;
  skyXAngle = ( .5 - ( y / window.innerHeight ) ) * 25;
  
  landXAngle = -( .5 - ( x / window.innerWidth ) ) * 5;
  landYAngle = ( .5 - ( y / window.innerHeight ) ) * 2;
  updateView();
  
}

function generate() {
  
  objects = [];
  if ( sky.hasChildNodes() ) {
    while ( sky.childNodes.length >= 1 ) {
      sky.removeChild( sky.firstChild );
    }
  }
  
  for( let j = 0; j < 16; j++ ) {
    objects.push( createCloud() );
  }
  
}

function updateView() {
  world.style.transform = 'translateZ( ' + d + 'px ) \
  rotateX( ' + worldXAngle + 'deg) \
  rotateY( ' + worldYAngle + 'deg)';
  sky.style.transform = 'translateZ( ' + d + 'px ) \
  rotateX( ' + skyXAngle + 'deg) \
  rotateY( ' + skyYAngle + 'deg)';
  land.style.transform = 'translateZ( ' + d + 'px ) \
  rotateX( ' + landYAngle + 'deg) \
  rotateY( ' + landXAngle + 'deg)';
}


function update (){
  
  for( let j = 0; j < layers.length; j++ ) {
    let layer = layers[ j ];
    layer.data.a += layer.data.speed;
    let t = 'translateX( ' + layer.data.x + 'px ) \
    translateY( ' + layer.data.y + 'px ) \
    translateZ( ' + layer.data.z + 'px ) \
    rotateY( ' + ( - skyYAngle ) + 'deg ) \
    rotateX( ' + ( - skyXAngle ) + 'deg ) \
    scale( ' + layer.data.s + ')';
    layer.style.webkitTransform = t;
    layer.style.MozTransform = t;
    layer.style.oTransform = t;
  }
  
  requestAnimationFrame( update );
  
}

update();

// Trees


const canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');
let curve;

function drawTree(startX, startY, len, angle, branchWidth, color1, color2) {
  ctx.beginPath();
  ctx.save();
  ctx.strokeStyle = color1;
  ctx.fillStyle = color2;
  ctx.shadowBlur = 15;
  ctx.shadowColor = "rgba(0, 0, 0, .15)";
  ctx.lineWidth = branchWidth;
  ctx.translate(startX, startY);
  ctx.rotate(angle * Math.PI/180);
  ctx.moveTo(0,0);
  ctx.lineTo(0, -len);
  ctx.stroke();
  
  if (len < 8) {
    //leafs
    ctx.beginPath();
    if (angle > 0) {
      ctx.bezierCurveTo(70, -len, 15, -len, 60, -len * 3)   
    } else {
      ctx.bezierCurveTo(50, len, 10, len, 10, -len * 4)
    };
    ctx.arc(0, -len, 50, 0, Math.PI/2);
    ctx.lineWidth = 10;
    ctx.strokeStyle = 'rgb(43,26,16)';
    ctx.stroke();
    ctx.fill();
    ctx .restore();
    return;
  }
  curve = (Math.random() * 10) + 10;
  
  drawTree(0, -len, len * .75, angle + curve, branchWidth * 0.9);
  drawTree(0, -len, len * .75, angle - curve, branchWidth * 0.85);
  
  ctx.restore();
}
// drawTree(canvas.width/2, canvas.height - 0, 200, 0, 10, 'brown', 'green');

function generateRandomTree() {
  ctx.clearRect(0,0,canvas.width, canvas.height);
  let len = Math.floor(Math.random() * 10) + 100;
  let angle = 0;
  let branchWidth = (Math.random() * 50) + 1;
  let color1 = 'rgb(18,14,13)';
  let color2 = 'rgb(43,26,16)';
  for (let i = 0; i < 6; i++) {
    let centerPointX = Math.floor(Math.random() * canvas.width * 1);
    // let centerPointX = 950;
    let centerPointY = 650;
    console.log(centerPointX);
    if (centerPointX > (canvas.width * .55)) {
      ctx.scale(.6,.7)
      ctx.translate(600,100)
      drawTree(centerPointX, centerPointY, len, angle, branchWidth, color1, color2);
    } else if (centerPointX < (canvas.width * .45)) {
      ctx.scale(.6,.7)
      ctx.translate(0,100)
      drawTree(centerPointX, centerPointY, len, angle, branchWidth, color1, color2);
    }
  }
}

generateRandomTree();