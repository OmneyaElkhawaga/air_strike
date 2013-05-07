var canvasBg = document.getElementById('canvasBg');
var ctxBg = canvasBg.getContext('2d');
var canvasJet = document.getElementById('canvasJet');
var ctxJet = canvasJet.getContext('2d');
var canvasEnemy = document.getElementById('canvasEnemy');
var ctxEnemy = canvasEnemy.getContext('2d');
var canvasHUD = document.getElementById('canvasHUD');
var ctxHUD = canvasHUD.getContext('2d');
ctxHUD.fillStyle = "hsla(0, 90%, 50%, 0.5)";
ctxHUD.font = "bold 40px Arial";

var mute_const=1;
var score=0;

var vsrcX=0;

var pauseint =4;

var jet1 = new Jet();
var total_enemies=12;
var gameWidth = canvasBg.width;
var gameHeight = canvasBg.height;
var isPlaying = false;
var requestAnimFrame =  window.requestAnimationFrame ||
                        window.webkitRequestAnimationFrame ||
                        window.mozRequestAnimationFrame ||
                        window.msRequestAnimationFrame ||
                        window.oRequestAnimationFrame;
var enemies = [];
 ////////////////buttons

 var mute_button = document.getElementById('clearCanvasBtn');
mute_button.addEventListener('click',mute,false);

 

function mute() {
    mute_const++;
    if (mute_const%2==0)
   document.getElementById('background_audio').muted = true;
    else document.getElementById('background_audio').muted = false;
}

var pause_button = document.getElementById('clearCanvasBtn2');
pause_button.addEventListener('click',pause_game,false);

 


function pause_game() {
   alert("Game paused, press ok to resume.");

}

var main_menu_button = document.getElementById('clearCanvasBtn3');
main_menu_button.addEventListener('click',open_MM,false);

 

function open_MM() {     window.open ('main_menu.html','_self',false);

}
















var game_over = new Image();
game_over.src = 'images/game_over.png';
game_over.addEventListener('load',init,false);
 
////////////////////////////fighter image 
var fighter_img = new Image();
fighter_img.src = 'images/fighter.png';
fighter_img.addEventListener('load',init,false);

////////////////////////////enemy image 
 var enemy_img = new Image();
 enemy_img.src = 'images/enemyh.png';
 enemy_img.addEventListener('load',init,false);

//////////////////////////background image
var background = new Image();
background.src = 'images/bg.jpg';
background.addEventListener('load',init,false);

var imgBullet = new Image();
imgBullet.src = 'images/bulleth.png';
imgBullet.addEventListener('load',init,false);

var explosion_img = new Image();
explosion_img.src = 'images/explosion.png';
explosion_img.addEventListener('load',init,false);

// main functions
var vsrcY=3745-gameHeight;
function init() {
    
    spawnEnemy(total_enemies);
    
    startLoop();
    updateHUD();
    
    document.addEventListener('keydown', checkKeyDown, false);
    document.addEventListener('keyup', checkKeyUp, false);
}
function updateHUD() {
    ctxHUD.clearRect(0, 0, gameWidth, gameHeight);
    ctxHUD.fillText("Score: " +  jet1.score +" Health" +jet1.hits_counter+"%", 0, 400);
}
function spawnEnemy(number) {
    for (var i = 0; i < number; i++) {
        enemies[i] = new Enemy();
        
    }
}

function drawAllEnemies() {
    clearCtxEnemy();
    for (var i = 0; i < enemies.length; i++) {
        enemies[i].draw();
        enemies[i].open_enemy_fire();
    }
}

function loop() {
    if ( isPlaying) {
        drawBg();
        jet1.draw();
        drawAllEnemies();
        requestAnimFrame(loop);
        updateHUD();
        checkcollision();
       check_dead();
    }
}

function startLoop() {
    isPlaying = true;
    loop();
}

function stopLoop() {
    isPlaying = false;
}

function drawBg() {
  
     vsrcY=vsrcY-1;
    if(vsrcY<0)vsrcY=3745-gameHeight;
     
    ctxBg.drawImage(background, vsrcX, vsrcY, background.width, 1000, 0, 0, background.width, 1000);

    // ctxBg.drawImage(, 0,0);
}

function clearCtxBg() {
    ctxBg.clearRect(0, 0, gameWidth, gameHeight);
}

function check_dead(){

if (jet1.hits_counter<1)

    {isPlaying=false;

ctxHUD.clearRect(0, 0, gameWidth, gameHeight);
   ctxJet.drawImage(game_over,-300, 100);
 var person=prompt("Please enter your name", "Name");
if (person!=null && person!="")
  {
  alert(person+'your score is '+jet1.score);
  }
 
}}







// end of main functions



















// jet functions

function Jet() {
     
    this.speed = 2;
    this.drawX = 256;
    this.drawY = 742;
    this.width =166;
    this.height =215;
    this.isUpKey = false;
    this.isRightKey = false;
    this.isDownKey = false;
    this.isLeftKey = false;
    this.isSpacebar=false;
    this.isShooting=false;
    this.noseX = this.drawX + 30;
    this.noseY = this.drawY + 100;
    this.bullets = [];
    this.currentBullet = 0;
    this.hits_counter=100;
    this.score = 0;

for (var i = 0; i < 25; i++) {
        this.bullets[this.bullets.length] = new Bullet();
    }
    
 }

Jet.prototype.draw = function() {
    clearCtxJet();
    this.checkDirection();
    this.noseX = this.drawX + 30;
    this.noseY = this.drawY + 100;
    this.checkShooting();
    this.drawAllBullets();
 ctxJet.drawImage(fighter_img, this.drawX, this.drawY);
 };





Jet.prototype.checkShooting = function() {
    if (this.isSpacebar && !this.isShooting) {
        this.isShooting = true;
        this.bullets[this.currentBullet].set_coords(this.noseX, this.noseY);
        this.currentBullet++;
        if (this.currentBullet >= this.bullets.length) this.currentBullet = 0;
    } else if (!this.isSpacebar) {
        this.isShooting = false;
    }
};


// bullet functions

function Bullet() {
    
    this.drawX = 0;
    this.drawY = -20;
    
    
    this.explosion=new explosion();
     
}

Bullet.prototype.draw = function() {
    this.drawY -= 3;
    ctxJet.drawImage(imgBullet, this.drawX, this.drawY );
    this.checkHitEnemy();
    
    if (this.drawY > gameHeight) this.drawY = -20;
};
Bullet.prototype.enemydraw = function() {
    this.drawY += 5;
    ctxJet.drawImage(imgBullet, this.drawX, this.drawY );
     
     this.checkHitJet(jet1);
    // if (this.explosion.hasHit) this.explosion.draw();
    if (this.drawY > gameHeight) this.drawY = -20;
};

Bullet.prototype.set_coords = function(startX, startY) {
    this.drawX = startX;
    this.drawY = startY;
};
Bullet.prototype.checkHitEnemy = function() {
    for (var i = 0; i < enemies.length; i++) {
        if (this.drawX >= enemies[i].drawX &&
            this.drawX <= enemies[i].drawX + enemies[i].width &&
            this.drawY >= enemies[i].drawY &&
            this.drawY <= enemies[i].drawY + enemies[i].height) {
                this.explosion.drawX = enemies[i].drawX ;
                this.explosion.drawY = enemies[i].drawY;
                this.explosion.hasHit = true;
                  
                this.recycle();
                enemies[i].recycleEnemy();
                jet1.updateScore(1);
        }
    }
};
Bullet.prototype.checkHitJet = function(jet) {
    
        if (this.drawX >= jet.drawX &&
            this.drawX <= jet.drawX + jet1.width &&
            this.drawY >= jet.drawY &&
            this.drawY <= jet.drawY + jet.height) {
                // this.explosion.drawX = enemies[i].drawX ;
                // this.explosion.drawY = enemies[i].drawY;
                // this.explosion.hasHit = true;
                 
                 jet.hits_counter=jet.hits_counter-8;
                 this.explosion.drawX =jet.drawX ;
                this.explosion.drawY = jet.drawY;
                this.explosion.hasHit = true;


                 jet.hits_counter++;
                this.recycle();
                 // this.drawY = -20;
                // this.recycle();
                // enemies[i].recycleEnemy();
        }
    
};

Bullet.prototype.recycle = function() {
    this.drawY = -20;
};

// end of bullet functions


////////////////////////enemy bullets




 function checkcollision(){

 

for (var i = 0; i < enemies.length; i++) {
         
        enemies[i].checkcollide(jet1);
    }



}






































Jet.prototype.checkDirection = function() {
    if (this.isUpKey&& this.drawY>8) {
        this.drawY -= this.speed;
    }
    if (this.isRightKey &&this.drawX<628 ) {
        this.drawX += this.speed;
    }
    if (this.isDownKey&& this.drawY<790) {
        this.drawY += this.speed;
    }
    if (this.isLeftKey && this.drawX>4 ) {
        this.drawX -= this.speed;
    }
};

 Jet.prototype.drawAllBullets = function() {
    for (var i = 0; i < this.bullets.length; i++) {
        if (this.bullets[i].drawY >= 0) this.bullets[i].draw();
                if (this.bullets[i].explosion.hasHit) this.bullets[i].explosion.draw();

    }

};


Jet.prototype.updateScore = function(points) {
    this.score += points;
    updateHUD();
};

function clearCtxJet() {
    ctxJet.clearRect(0, 0, gameWidth, gameHeight);
}

// end of jet functions

//Bullets



function explosion() {
     
    this.drawX = 200;
    this.drawY = 200;
     this.hasHit = false;
    this.currentFrame = 0;
    this.totalFrames = 10;
    this.hasJet = false;
}

explosion.prototype.draw = function() {
    if (this.currentFrame <= this.totalFrames) {
        ctxJet.drawImage(explosion_img, this.drawX, this.drawY );

        this.currentFrame++;
    } else {
        this.hasHit = false;
        this.currentFrame = 0;
    }
};




















// enemy functions

function Enemy() {
    this.speed = 1.5;
    this.drawX = (Math.random()*(gameWidth-150));
    this.drawY =-1*Math.random()*Math.random()*700;
    this.width =enemy_img.width;
    this.height =enemy_img.height;
    this.bullets = [];
    this.currentBullet = 0;

// for (var i = 0; i < 2; i++) {
        this.bullets[0] = new Bullet();
    // }
}

Enemy.prototype.draw = function() {
    this.drawY += this.speed;
    ctxEnemy.drawImage(enemy_img,this.drawX, this.drawY);
    this.checkEscaped();
};

Enemy.prototype.checkEscaped = function() {
    if (this.drawY >= gameHeight+100) {
        this.recycleEnemy();
    }
};

Enemy.prototype.recycleEnemy = function() {
this.drawX = (Math.random()*(gameWidth-150));
    this.drawY =-1*Math.random()*Math.random()*700;
};

function clearCtxEnemy() {
    ctxEnemy.clearRect(0, 0, gameWidth, gameHeight);
}

 //bullet functions

Enemy.prototype.open_enemy_fire=function (){
  if(this.drawY<2 && this.drawY>0)  this.bullets[this.currentBullet].set_coords(this.drawX+30, this.drawY);
        // this.currentBullet++;
        // if (this.currentBullet >= this.bullets.length) this.currentBullet = 0;
  // for (var i = 0; i < 3; i++) {

        if (this.bullets[this.currentBullet].drawY >= 0) this.bullets[0].enemydraw();
 if (this.bullets[0].explosion.hasHit) this.bullets[0].explosion.draw();    // }

};


Enemy.prototype.checkcollide = function(jet) {
    
        if (this.drawX >= jet.drawX &&
            this.drawX <= jet.drawX + jet1.width/2 &&
            this.drawY >= jet.drawY &&
            this.drawY <= jet.drawY + jet.height) {
                // this.explosion.drawX = enemies[i].drawX ;
                // this.explosion.drawY = enemies[i].drawY;
                // this.explosion.hasHit = true;
                  ctxJet.drawImage(explosion_img, jet1.drawX, jet1.drawY );
                 
                  jet1.hits_counter=jet1.hits_counter-40;
 
                 // this.drawY = -20;
                // this.recycle();
                // enemies[i].recycleEnemy();
        }
    
};

// event functions

function checkKeyDown(e) {
    var keyID = e.keyCode || e.which;
    if (keyID === 38 || keyID === 87) { //up arrow or W key
        jet1.isUpKey = true;
        e.preventDefault();
    }
    if (keyID === 39 || keyID === 68) { //right arrow or D key
        jet1.isRightKey = true;
        e.preventDefault();
    }
    if (keyID === 40 || keyID === 83) { //down arrow or S key
        jet1.isDownKey = true;
        e.preventDefault();
    }
    if (keyID === 37 || keyID === 65) { //left arrow or A key
        jet1.isLeftKey = true;
        e.preventDefault();
    }
    if (keyID === 32) { //spacebar
        jet1.isSpacebar = true;
        e.preventDefault();
    }
}

function checkKeyUp(e) {
    var keyID = e.keyCode || e.which;
    if (keyID === 38 || keyID === 87) { //up arrow or W key
        jet1.isUpKey = false;
        e.preventDefault();
    }
    if (keyID === 39 || keyID === 68) { //right arrow or D key
        jet1.isRightKey = false;
        e.preventDefault();
    }
    if (keyID === 40 || keyID === 83) { //down arrow or S key
        jet1.isDownKey = false;
        e.preventDefault();
    }
    if (keyID === 37 || keyID === 65) { //left arrow or A key
        jet1.isLeftKey = false;
        e.preventDefault();
    }
    if (keyID === 32) { //spacebar
        jet1.isSpacebar = false;
        e.preventDefault();
    }
}

// end of event functions