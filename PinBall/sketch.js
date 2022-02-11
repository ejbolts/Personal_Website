// Initialises all variables 
const MAIN_MENU = 1;
const LOAD = 2;
const PLAY = 3;
const END = 4;
const EASY = false;
const HARD = true;
let currentScene = MAIN_MENU;
let playButton;
let modeButton;
let MenuButton;
let difficulty = EASY;
let video;
let lives = 0;
let score = 0;
let i = 1;
let j,z,w = 1;
let slider;
let launch = 1;
let orangeObstacle = [];
let greenObstacle = [];
let greyObstacle = [];

// Loads in all game assets
function preload(){
  ballImage = loadImage('Assets/ball.png');
  video = createVideo('Assets/Loading.mp4')
  video.hide();
  heartImage = loadImage('Assets/Heart.png');
  flipperImage = loadImage('Assets/flipper.png');
  shieldImage = loadImage('Assets/shield.png');
  energyBallAnimation = loadAnimation('Assets/EnergyBall0001.png','Assets/EnergyBall0002.png')
  
  highhit = loadSound('Assets/highhit.mp3')
  lowhit = loadSound('Assets/lowhit.mp3')
  metalhit = loadSound('Assets/metalhit.mp3')
  flip = loadSound('Assets/flip.mp3')
  gameMusic = loadSound('Assets/gamemusic.mp3')
  powerUp = loadSound('Assets/powerup.mp3')

  data = loadJSON('leaderboard.json')
}

function setup() {
  createCanvas(800, 800);
  // MainMenu Ball
  ballMenu = createSprite(400,300,50,50)
  ballMenu.addImage(ballImage)

  // Creates the game ball and set intial properties
  ball = createSprite(width-20,height-40,50,50)
  ball.setCollider("circle",0,0,200)
  ball.addImage(ballImage)
  ball.scale = 0.075
  
  ball.velocity.y = 0
  ball.velocity.x = 0
  ball.visible = false
  
  // Create all black rectangles barriers
  wall = createSprite(width-50,height,20,1300)
  wall.shapeColor = color('black')
  wall.visible = false

  base = createSprite(width-20,height-5,50,20)
  base.visible = false
  base.shapeColor = color('black')
  
  rails1 = createSprite(130,548,400,20)
  rails1.rotation = 45
  rails1.visible = false
  rails1.shapeColor = color('black')

  rails2 = createSprite(600,548,400,20)
  rails2.rotation = 135
  rails2.visible = false
  rails2.shapeColor = color('black')

  rails3 = createSprite(width-10,height-780,100,30)
  rails3.rotation = 50
  rails3.visible = false
  rails3.shapeColor = color('black')

  // Create flipper Sprites
  flipper1 = createSprite(440,710,10,10)
  flipper1.addImage(flipperImage)
  flipper1.scale = 0.3
  flipper1.rotation = -40
  flipper1.visible = false

  flipper2 = createSprite(290,710,50,10)
  flipper2.addImage(flipperImage)
  flipper2.scale = 0.3
  flipper2.rotation = 230
  flipper2.visible = false

  // Creates all greenObstacle by accessing array and creating sprite for each one.
  for ( let q = 0; q < 2; q++){
    let x = q*400+175
    let y = 450
    greenObstacle[q] = createSprite(x,y,150,20)
    greenObstacle[q].draw = function() {
    strokeWeight(2)
    stroke(1)
    fill('green')
    rect(0,0,150,20) 
    } 
    if (q ==1){
      greenObstacle[q].rotation = 135}
    else{
      greenObstacle[q].rotation = 45
    }
  greenObstacle[q].visible = false
}
// Creates all orangeObstacle by accessing array and creating sprite for each one.
  for ( let q = 0; q < 3; q++){
    let x = q*300+100
    let y = 300
    orangeObstacle[q] = createSprite(x,y,50,50)
    orangeObstacle[q].draw = function() {
      strokeWeight(2)
      stroke(1)
      fill('orange')
      ellipse(0,0,50,50) 
    }
    orangeObstacle[q].visible = false 
}
// Creates all greyObstacles by accessing array and creating sprite for each one.
  for ( let q = 0; q < 4; q++){
    // used to seperate top 2 from bottom 2
    if (q % 2 == 0 ){
      let x = q*90+300
      let y = 50
      greyObstacle[q] = createSprite(x,y,50,50)
      greyObstacle[q].addImage(shieldImage)
      greyObstacle[q].scale = random(0.1,0.3)
    } else {
      let x = q*90+210
      let y = 200
      greyObstacle[q] = createSprite(x,y,50,50)
      greyObstacle[q].addImage(shieldImage)
      greyObstacle[q].scale = 0.2}
  greyObstacle[q].visible = false 
  }
  // Creates all GUI buttons and event triggers
  playButton = createButton('Play');
  modeButton = createButton('Mode: Easy');
  MenuButton = createButton('MainMenu')
  modeButton.style('background', 'green')
  playButton.mouseClicked(playButtonClicked)
  modeButton.mouseClicked(changeModeClicked)
  MenuButton.mouseClicked(mainMenuButtonClicked)
  slider = createSlider(0, 1, 0.1, 0.01)
  slider.hide()
}

// Switches between currentscene
function draw() {
  if (currentScene == MAIN_MENU){
    drawScene1();
    if (i == 1 ){
      gameMusic.loop()
      i = 2 
    }
  }
  else if (currentScene == LOAD){
    drawScene2();
  }
  else if (currentScene == PLAY){
    drawScene3();
    
  }else if (currentScene == END){
    drawScene4();
  }
}

function drawScene1(){
  background('lightgrey')
  ballMenu.visible = true
  // Basic scene styling 
  playButton.show()
  modeButton.show()
  MenuButton.hide()
  ballMenu.scale = 0.6
  playButton.style('font-size','30px')
  playButton.size(200,100);
  playButton.position(400-playButton.size().width/2,500);
  modeButton.style('font-size','30px')
  modeButton.size(200,100);
  modeButton.position(400-modeButton.size().width/2,650);
  ballMenu.rotation += 3;
  drawSprites();
  textAlign(CENTER);
  fill('black')
  textSize(50)
  text('PINBALL', width/2,100)
  // creates new energyball sprite for when player wants to play again without exist since its gets removed upon pickup. 
  energyBall= createSprite(width/2,125,50,50)
  energyBall.addAnimation('animate', energyBallAnimation);
  powerUp.setVolume(0.3)
  energyBall.setCollider("circle",0,0,0)
  energyBall.scale = 0.1
  energyBall.visible = false
  slider.show()
  gameMusic.setVolume(slider.value())
  textSize(20)
  text('Game Volume',72,70)
  slider.position(10,75)
}

function drawScene2(){
  slider.hide()
  video.play()
  image(video,0,0,0,0)
  // Different lives depending of difficulty choosen
  if ( difficulty  == HARD){
    lives = 3;
  } else if ( difficulty  == EASY){
    lives = 5;
  }
  score = 0;
  // sets 3 second timer
  // Uses MP4 video
  setTimeout(drawScene3, 3000);
  ballMenu.visible = false
  // enables most sprites in loading screen
  spriteVisableTrue()
}

function drawScene3(){
  currentScene = PLAY
  video.hide();
  collision()
  // ends game
  if (lives == 0){
    currentScene = END
  }
  ball.addSpeed(1,90)
  flippers()
  keyPressed()
  // Basic scene styling 
  background('lightgrey')
  textSize(20)
  fill('purple')
  text('Spacebar to launch', width-210,30)
  text('Arrow keys <- -> to flip', width-210,60)
  slider.show()
  fill('black')
  textSize(30)
  text(lives,10,35)
  // Uses Heart Image for displaying players lives
  image(heartImage, 35, 10, 30,30)
  gameMusic.setVolume(slider.value())
  textSize(20)
  text('Game Volume',10,70)
  slider.position(10,75)
  text('Score:  ' + score,10,120)
  
  energyBall.rotation = frameCount*3
  drawSprites();
}

function drawScene4(){
  background('lightgrey')
  spriteVisableFalse()
  MenuButton.show()
  gameMusic.setVolume(slider.value())
  // Basic scene styling 
  textSize(20)
  text('Game Volume',10,70)
  slider.position(10,75)
  textSize(50)
  fill('red')
  textAlign(CENTER)
  text('Game Over',width/2,75)
  textSize(30)
  fill('black')
  text('leaderboard',width/2,150)
  textSize(25)
  noFill()
  rect(200, 175, 400, 500)
  fill('black')
  stroke(1)
  text('Name:',260,250)
  text('Difficulty:',410,250)
  text('Score:',545,250)
  noStroke()
  // loops through JSON array and picks out relevant data
  for ( let j = 0; j< data.leaderboard.length; j++){
    text(data.leaderboard[j].name,275,(j+1)*100+225)
    text(data.leaderboard[j].difficulty,425,(j+1)*100+225)
    text(data.leaderboard[j].score,560,(j+1)*100+225)
  }
  text('Your Score:  '+ score,width/2,625)
  // shows menu button
  MenuButton.style('font-size','30px')
  MenuButton.size(200,100);
  MenuButton.position(400-MenuButton.size().width/2,690);
}
// Sends user to loading screen, hides other GUI components. 
function playButtonClicked(){
  metalhit.setVolume(1)
  metalhit.play()
  // lowered volume for ingame
  metalhit.setVolume(0.1)
  currentScene = LOAD;
  playButton.hide()
  modeButton.hide()
  MenuButton.hide()
}
// Returns user to MainMenu screen upon click
function mainMenuButtonClicked(){
  metalhit.setVolume(1)
  metalhit.play()
  currentScene = MAIN_MENU;
}
// Changes the difficulty setting upon click, styles/positions button
function changeModeClicked(){
  if (difficulty == EASY){
    lowhit.setVolume(0.5)
    lowhit.play()
    modeButton.html("Mode: Hard")
    modeButton.style('background', 'red')
    modeButton.style('font-size','30px')
    modeButton.size(200,100);
    difficulty = HARD
  }
  else if (difficulty  == HARD){
    highhit.setVolume(0.3)
    highhit.play()
    modeButton.html("Mode: Easy")
    modeButton.style('background', 'green')
    modeButton.style('font-size','30px')
    modeButton.size(200,100);
    difficulty  = EASY
  }
  
}
// Handles user's interaction with arrow keys and spacebar
function keyPressed(){
  if( launch == 1){
    if (key == ' ' && keyIsPressed){
      ball.addSpeed(random(60,65),270)
      launch++
    }
    
  }else{
    ball.rotation = frameCount*4
  }
  if (keyCode == LEFT_ARROW && keyIsPressed){
    if (j == 1 ){
      flip.play()
      j = 2 
    }
    
    flipper2.rotation = 150
    flipper2.position.y = 665
    flipper2.position.x = 300

  }
  if (keyCode == RIGHT_ARROW  && keyIsPressed){
    if (z == 1 ){
      flip.play()
      z = 2 
    }
    flipper1.rotation = 35
    flipper1.position.y = 665
    flipper1.position.x = 440
  }
  
}
// Used for 1 time sound play
function keyReleased(){
  j = 1
  z = 1
}
// Detects all collision and triggers corresponding event
// checks for collision draw every frame
function collision(){
  if (ball.collide(base)){
    ball.velocity.y *= -1
  }
  if (ball.bounceOff(rails1)){
    ball.velocity.y *= -0.5
    metalhit.play()
  }
  if (ball.bounceOff(rails2)){
    ball.velocity.y *= -0.5
    metalhit.play()
  }
  if (ball.bounceOff(rails3)){
    ball.velocity.y *= -1
    metalhit.setVolume(0.1)
    metalhit.play()
  }
  if (ball.bounceOff(wall)){
    ball.velocity.y *= -1
    metalhit.setVolume(0.1)
    metalhit.play()
  }
  if (ball.position.x > width){
    ball.velocity.x *= -0.5
  }
  if (ball.position.x <= 0){
    ball.velocity.x *= -1.5
  }
  if (ball.position.y <= 20){
    ball.velocity.y *= -1.5
  }
  if (ball.bounceOff(flipper1)){
    ball.velocity.x *= -2
    ball.velocity.y *= -2
  }
  if (ball.bounceOff(flipper2)){
    ball.velocity.x *= -2
    ball.velocity.y *= -2
  }
  if (ball.position.y >= height){
    lives -= 1
    launch=1
    ball.rotation = 0
    ball.velocity.y = 0
    ball.velocity.x = 0
    ball.position.x = width-21
    ball.position.y = height-20
  }
  for ( let q =0; q < 2; q++){
    if (ball.collide(greenObstacle[q])){
      lowhit.setVolume(0.2)
      lowhit.play()
      ball.velocity.y *= -1
      if ( difficulty == EASY){
        score++
      } else if ( difficulty == HARD){
        score += 2
      }
    }
  }

  for ( let q =0; q < 3; q++){
    orangeObstacle[q].setCollider("circle",0,0,25)
  if (ball.collide(orangeObstacle[q])){
    highhit.setVolume(0.1)
    highhit.play()
    ball.velocity.y *= -1
    ball.velocity.x *= -1
    if ( difficulty == EASY){
      score += 5
    } else if ( difficulty == HARD){
      score += 10
    }
  }
  
}
  for ( let q =0; q < 4; q++){
    greyObstacle[q].setCollider("circle",0,0,120)
  if (ball.collide(greyObstacle[q])){
    metalhit.setVolume(0.1)
    metalhit.play()
    ball.velocity.y *= -1
    ball.velocity.x *= -1
  }
  
}
  if (ball.overlap(energyBall)){
    if (w == 1 ){
      powerUp.play()
      w = 2 
    }
    if ( difficulty  == EASY){
      score += 10
      lives += 5
    } else if ( difficulty == HARD){
      score += 20
      lives += 1
    }
    energyBall.remove()
  }
}
// Positions flippers to original spot
function flippers(){
  flipper1.setCollider("rectangle",0,0,350,30)
  flipper1.position.y = 710
  flipper1.position.x = 440
  flipper1.rotation = -40
  flipper2.setCollider("rectangle",0,0,350,30)
  flipper2.position.y = 710
  flipper2.position.x = 290
  flipper2.rotation = 230
}
// Groups most sprites that don't need to be dispalyed
function spriteVisableFalse(){
  ball.visible = false
  for (let q = 0; q<4; q++){ greyObstacle[q].visible = false}
  for (let q = 0; q<3; q++){ orangeObstacle[q].visible = false}
  for (let q = 0; q<2; q++){ greenObstacle[q].visible = false}
  energyBall.visible = false
  base.visible = false
  wall.visible = false
  rails1.visible = false
  rails2.visible = false
  rails3.visible = false
  flipper1.visible = false
  flipper2.visible = false
  ballMenu.visible = false
}
// Groups most sprites that need to be dispalyed
function spriteVisableTrue(){
  ball.visible = true
  for (let q = 0; q<4; q++){ greyObstacle[q].visible = true}
  for (let q = 0; q<3; q++){ orangeObstacle[q].visible = true}
  for (let q = 0; q<2; q++){ greenObstacle[q].visible = true}
  energyBall.visible = true
  base.visible = true
  wall.visible = true
  rails1.visible = true
  rails2.visible = true
  rails3.visible = true
  flipper1.visible = true
  flipper2.visible = true
}

// Note All assets/digital artworks belong to their original creators
// Game Music: https://www.storyblocks.com/audio/stock/retro-arcade-rgswr9ezpkd95f2bb.html
// Sound effects:
// https://www.pond5.com/sound-effects/item/36239729-modern-retro-shiny-game-coin-4
// https://www.pond5.com/sound-effects/item/51112422-mellow-dramatic-positive-touch-3
// https://www.pond5.com/sound-effects/item/51112418-mellow-dramatic-positive-touch
// https://www.pond5.com/sound-effects/item/123504352-sfx-retro-8-bit-video-game-power-sound-01
// https://www.pond5.com/sound-effects/item/56903434-light-switch-01
// Artwork:
// https://www.deviantart.com/venjix5/art/Dark-Energy-Ball-sprite-2-779262622
// https://www.deviantart.com/venjix5/art/Dark-Energy-Ball-sprite-2-alt-779262723
// https://opengameart.org/content/shield-sprite
// https://www.pngitem.com/middle/hwwmJmo_clip-royalty-free-library-transparent-sphere-shiny-2d/
// http://www.clipartpanda.com/categories/love-clipart
// Video:
// https://www.videezy.com/after-effects-templates/39851-loading-bar-on-a-black-background

