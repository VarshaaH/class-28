const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;

var engine, world, backgroundImg;
var canvas, angle, tower, ground, cannon;
var balls = [];
var boats = [];

var boatAnimation =[]
var boatSpriteData,boatSpriteSheet 
var brokenBoatAnimation =[]
var brokenBoatSpriteData, brokenBoatSpriteSheet
var WaterSplashAnimation =[]
var WaterSplashSpriteData, WaterSplashSpriteSheet

var isGameOver = false
var isLaughing = false

var score = 0;

function preload() {
  backgroundImg = loadImage("./assets/background.gif");
  towerImage = loadImage("./assets/tower.png");
  boatSpriteData = loadJSON('./assets/boat/boat.json')
  boatSpriteSheet = loadImage('./assets/boat/boat.png')
  brokenBoatSpriteData = loadJSON('./assets/boat/broken_boat.json')
  brokenBoatSpriteSheet = loadImage('assets/boat/broken_boat.png')
  WaterSplashSpriteData = loadJSON('assets/water_splash/water_splash.json')
  WaterSplashSpriteSheet = loadImage('assets/water_splash/water_splash.png')
  backgroundMusic =loadSound("./assets/background_music.mp3"); 
  waterSound = loadSound("./assets/cannon_water.mp3"); 
  pirateLaughSound = loadSound("./assets/pirate_laugh.mp3");
  cannonExplosion = loadSound("./assets/cannon_explosion.mp3");
}

function setup() {
  canvas = createCanvas(1200, 600);
  engine = Engine.create();
  world = engine.world;
  angleMode(DEGREES)
  angle = 15


  ground = Bodies.rectangle(0, height - 1, width * 2, 1, { isStatic: true });
  World.add(world, ground);

  tower = Bodies.rectangle(160, 350, 160, 310, { isStatic: true });
  World.add(world, tower);

  cannon = new Cannon(180, 110, 130, 100, angle);

  var boatframes = boatSpriteData.frames
  
  for (var i=0;i<boatframes.length;i++){
    var pos = boatframes[i].position
    var img = boatSpriteSheet.get(pos.x,pos.y,pos.w,pos.h)
    boatAnimation.push(img)
  }

  var brokenBoatframes = brokenBoatSpriteData.frames
  
  for (var i=0;i<brokenBoatframes.length;i++){
    var pos = brokenBoatframes[i].position
    var img = brokenBoatSpriteSheet.get(pos.x,pos.y,pos.w,pos.h)
    brokenBoatAnimation.push(img)
  }

 var WaterSplashFrames = WaterSplashSpriteData.frames
  
  for (var i=0;i<WaterSplashFrames.length;i++){
    var pos = WaterSplashFrames[i].position
  var img = WaterSplashSpriteSheet.get(pos.x,pos.y,pos.w,pos.h)
  WaterSplashAnimation.push(img)
  }


}

function draw() {
  background(189);
  image(backgroundImg, 0, 0, width, height);

  Engine.update(engine);
if(!backgroundMusic.isPlaying()){
  backgroundMusic.play()
  backgroundMusic.setVolume(0.1)
}
  push();
  translate(ground.position.x, ground.position.y);
  fill("brown");
  rectMode(CENTER);
  rect(0, 0, width * 2, 1);
  pop();

  push();
  translate(tower.position.x, tower.position.y);
  rotate(tower.angle);
  imageMode(CENTER);
  image(towerImage, 0, 0, 160, 310);
  pop();

  showBoats();

  for (var i = 0; i < balls.length; i++) {
    showCannonBalls(balls[i], i);
    collisionWithBoat(i);
  }

  cannon.display();
  fill("#6d4c41");
   textSize(40); 
   text(`Score:${score}`, width - 200, 50); 
   textAlign(CENTER, CENTER);


}

function collisionWithBoat(index) {
  for (var i = 0; i < boats.length; i++) {
    if (balls[index] !== undefined && boats[i] !== undefined) {
      var collision = Matter.SAT.collides(balls[index].body, boats[i].body);

      if (collision.collided) {
        score = score+5
        boats[i].remove(i);
      

        Matter.World.remove(world, balls[index].body);
        delete balls[index];
      }
    }
  }
}

function keyPressed() {
  if (keyCode === DOWN_ARROW) {
    var cannonBall = new CannonBall(cannon.x, cannon.y);
    cannonBall.trajectory = [];
    Matter.Body.setAngle(cannonBall.body, cannon.angle);
    balls.push(cannonBall);
  }
}

function showCannonBalls(ball, index) {
  if (ball) {
    ball.display();
    ball.animate();
    if (ball.body.position.x >= width || ball.body.position.y >= height - 50) {
      waterSound.play()
      ball.remove(index);
    }
  }
}

function showBoats() {
  if (boats.length > 0) {
    if (
      boats.length<4 && 
     
      boats[boats.length - 1].body.position.x < width - 300
    ) {
      var positions = [-40, -60, -70, -20];
      var position = random(positions);
      var boat = new Boat(width, height - 100, 170, 170, position, boatAnimation);

      boats.push(boat);
    }

    for (var i = 0; i < boats.length; i++) {
      
        Matter.Body.setVelocity(boats[i].body, {
          x: -0.9,
          y: 0
        });

        boats[i].display();
        boats[i].animate();

var collision = Matter.SAT.collides(this.tower,boats[i].body)
if (collision.collided && !boats[i].isBroken){
  if(!isLaughing && !pirateLaughSound.isPlaying()){
    pirateLaughSound.play()
    isLaughing = true
  }

  isGameOver = true;
  gameOver()
}
      } 

    
  } else {
    var boat = new Boat(width, height - 60, 170, 170, -60, boatAnimation);
    boats.push(boat);
  }
}

function keyReleased() {
  if (keyCode === DOWN_ARROW && !isGameOver) {
    cannonExplosion.play()
    balls[balls.length - 1].shoot();
  }
}


function gameOver() {
  swal(
    {
      title: `Game Over!!!`,
      text: "Thanks for playing!!",
      imageUrl:
        "https://raw.githubusercontent.com/whitehatjr/PiratesInvasion/main/assets/boat.png",
      imageSize: "150x150",
      confirmButtonText: "Play Again"
    },
    function(isConfirm) {
      if (isConfirm) {
        location.reload();
      }
    }
  );
}

  


