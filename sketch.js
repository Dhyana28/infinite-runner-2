var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var bg,block

var score=0;

var gameOver, restart;

localStorage["HighestScore"] = 0;

function preload(){
  trex_running =   loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("Cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  bg = loadImage("volcano.png");
}

function setup() {
  canvas = createCanvas(displayWidth, displayHeight);
  
  block = createSprite(cursor.x,displayHeight/2+190,1500,450) 
  block.shapeColor = color(0,255,0);
  
  trex = createSprite(200,340,20,50);
  
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  
  ground = createSprite(200,350,1000,20);
  ground.addImage("ground", groundImage);
  //ground.scale = 4
  ground.x = ground.width /2;
 
  gameOver = createSprite(cursor.x, cursor.y + 25);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(cursor.x, cursor.y - 25);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;
 
  gameOver.visible = false;
  restart.visible = false;
  
  
  invisibleGround = createSprite(200,360,1000,10);
  invisibleGround.visible = false;
  
 
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;

  cursor = createSprite(displayWidth/2, displayHeight,10,10)
  cursor.visible = false;


  
}

function draw() {
  //trex.debug = true;
  background(0,200,255);
  console.log(trex.velocityY)
  fill(0)
  text("Score: "+ score, cursor.x ,50);
  
  camera.position.x = cursor.x
  camera.position.y = displayHeight/2

  block.x = cursor.x

  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    cursor.velocityX = (6 + 3*score/100);
    invisibleGround.x = cursor.x
    ground.velocityX = -(6 + 3*score/100);
    trex.velocityX = (6 + 3*score/100);
  
    if(keyDown("space") && trex.y >= 318) {
      trex.velocityY = -12;
    }
  
    trex.velocityY = trex.velocityY + 0.8
  
    if (ground.x < cursor.x - 600){
      ground.x = cursor.x + 650 
    }
  
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.y = cursor.y - 625
    gameOver.x = cursor.x
    restart.y = cursor.y - 575
    restart.x = cursor.x
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    cursor.velocityX = 0;
    //invisibleGround.velocityX = 0;
    ground.velocityX = 0;
    trex.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  
  drawSprites();

}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(cursor.x + 500,displayHeight/2 - 400,40,10);
    cloud.y = Math.round(random(displayHeight/2 - 600,displayHeight/2 - 150));
    cloud.addImage(cloudImage);
    cloud.scale = 0.15;
    //cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 400;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(cursor.x + 700,displayHeight/2-50,10,40);
    //obstacle.debug = true;
    //obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 400;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;

  trex.collide(invisibleGround);
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  console.log(localStorage["HighestScore"]);
  
  score = 0;
  
}