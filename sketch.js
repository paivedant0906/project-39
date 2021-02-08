var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound
var bi;
var ai;
function preload(){
  trex_running = loadAnimation("trex_1.png","trex_2.png","trex_1.png");
  trex_collided = loadAnimation("trex_1.png");
  ai=loadImage("Flat_Design_Single_05_2016_construction_13-512.png")
  groundImage = loadImage("d82b534f837e049.png");
  bi=loadImage("pexels-francesco-ungaro-281260.jpg")
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle11.png");
  obstacle2 = loadImage("obstacle.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("22.png");
  obstacle5 = loadImage("obstacle44.png");
  obstacle6 = loadImage("obstacle6.png");
  
  restartImg = loadImage("th (1).jpg")
  gameOverImg = loadImage("gameover.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(displayWidth-50,displayHeight-100);

 
  
  trex = createSprite(displayWidth-1300,displayHeight-216,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.setCollider('circle',0,0,350)

  trex.scale = 0.12;
  
  ground = createSprite(displayWidth/2,displayHeight-20,displayWidth+10000000000000,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  trex.depth=ground.depth;
trex.depth=trex.depth=1;
  gameOver = createSprite(camera.x+800,displayHeight/2-300);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(camera.x+800,displayHeight/2-20);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 2
  restart.scale = 0.5
  
  invisibleGround = createSprite(displayWidth/2,displayHeight-216,displayWidth+10000000,20);
  invisibleGround.visible = false;
  
  ground.scale=2.5 
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  
  
  
  score = 0;
  
}

function draw() {
  
  background(bi);
  
  text("Score: "+ score, camera.x+200,displayHeight/2-100);
  console.log(getFrameRate());
  

  if(gameState === PLAY){
trex.changeAnimation("running", trex_running);
    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -(4 + 3* score/100)
  
    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2
    }
    
    
    if(keyDown("space")&& trex.y >= displayHeight/2-50) {
        trex.velocityY = -12;
        jumpSound.play();
    }
    
    
    trex.velocityY = trex.velocityY + 1
  
    
    spawnClouds();
  
    
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     if(mousePressedOver(restart)) {
      reset();
    }


     
    
      trex.changeAnimation("collided", trex_collided);
    
     
     
      ground.velocityX = 0;
      trex.velocityY = 0
      
     
      
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);    
   }
  
 
 
  trex.collide(invisibleGround);
  
  
  drawSprites();
}

function reset(){
  gameState=PLAY;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
   trex.changeAnimation("running", trex_running);
  score=0;
  
}





function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(camera.x+displayWidth/2,displayHeight-256,10,40);
   obstacle.velocityX = -(6 + score/100);
   
  
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(ai);
              obstacle.scale=0.2;
              break;
      case 2: obstacle.addImage(obstacle2);
      obstacle.scale = 0.2;
              break;
      case 3: obstacle.addImage(obstacle3);
      obstacle.scale = 0.25;
      obstacle.y=displayHeight-286
      obstacle.setCollider('rectangle',0,150,550,420)
              break;
      case 4: obstacle.addImage(obstacle4);
      obstacle.y=displayHeight-256
      obstacle.scale = 0.4;
              break;
      case 5: obstacle.addImage(obstacle5);
      obstacle.y=displayHeight-286
      obstacle.scale = 0.25;
      obstacle.setCollider('rectangle',0,150,550,420)
              break;
      case 6: obstacle.addImage(obstacle1);
      obstacle.y=displayHeight-256
      obstacle.scale = 0.4;
              break;
      default: break;
    }
   

    obstacle.lifetime = 300;
   
   
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
 
  if (frameCount % 120 === 0) {
    var cloud = createSprite(camera.x+displayWidth/2,displayHeight/2-100,40,10);
    cloud.y = Math.round(random(displayHeight/2-200,displayHeight/2-250));
    cloud.addImage(cloudImage);
    cloud.scale = 0.8;
    cloud.velocityX = -3;
    
     
    cloud.lifetime = displayWidth;
    
    
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    
    cloudsGroup.add(cloud);
  }
}

