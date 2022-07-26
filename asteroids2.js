let canvas;
let ctx;
let canvasHeight = 700;
let canvasWidth = 1000;
let ship;
let asteroids = [];
let bullets = [];
let keys = [];
let score = 0;
let lives = 3;
let highScore;
let localStorageName = "HighScore";
 
//Loading Setup Canvas
document.addEventListener('DOMContentLoaded', SetupCanvas);
 // The creation of Canvas: in the upper left quadrant, 
 // its width and height and background color; 
 // using the fillRect function.
function SetupCanvas(){
    canvas = document.getElementById("asteroids-canvas");
    ctx = canvas.getContext("2d");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ship = new Ship();
 
    //Crate moro than  one ship
    for(let i = 0; i < 8; i++){         
        asteroids.push(new Asteroid());
    }
//  handling the events like: keydown and keyup
    document.body.addEventListener("keydown", HandleKeyDown);
    document.body.addEventListener("keyup", HandleKeyUp);

    // high scores: retrives-locally stored
    if (localStorage.getItem(localStorageName) == null) {
        highScore = 0;
    } else {
        highScore = localStorage.getItem(localStorageName);
    }
 
    Render();
}

// At the end of the game: deactivate the event handling, 
// then it is possible to move the event handling functions.
function HandleKeyDown(e){
    keys[e.keyCode] = true;
}
function HandleKeyUp(e){
    keys[e.keyCode] = false;
    if (e.keyCode === 32){
        bullets.push(new Bullet(ship.angle));
    }
}
// Create class Ship
class Ship {
    constructor() {
        this.visible = true;
        this.x = canvasWidth / 2;
        this.y = canvasHeight / 2;
        this.movingForward = false;
        this.speed = 0.1;
        this.velX = 0;
        this.velY = 0;
        this.rotateSpeed = 0.001;
        this.radius = 15;
        this.angle = 0;
        this.strokeColor = 'white';
     
        this.noseX = canvasWidth / 2 + 15;
        this.noseY = canvasHeight / 2;
    }
    Rotate(dir) {
        this.angle += this.rotateSpeed * dir;
    }
    Update() {
        //current direction ship
        let radians = this.angle / Math.PI * 180;
 
      
        // When moving forward: you can calculate
        // changing values of x & y
        // Finding the new point X, use this
        // formula: 
        //oldX + cos(radians) * distance
        //oldY + sin(radians) * distance
        if (this.movingForward) {
            this.velX += Math.cos(radians) * this.speed;
            this.velY += Math.sin(radians) * this.speed;
        }
        
        //When the ship moves out of the frame of reference on Canvas: 
        // the ship is put on the opposite side.

        if (this.x < this.radius) {
            this.x = canvas.width;
        }
        if (this.x > canvas.width) {
            this.x = this.radius;
        }
        if (this.y < this.radius) {
            this.y = canvas.height;
        }
        if (this.y > canvas.height) {
            this.y = this.radius;
        }
        // Slow ship speed: not holding key
        this.velX *= 0.99;
        this.velY *= 0.99;

   
        //    Taking into account the friction: 
        //    the values of x and y are changed.
        this.x -= this.velX;
        this.y -= this.velY;
    }
    Draw() {
        ctx.strokeStyle = this.strokeColor;
        ctx.beginPath();
        // Angle between vertices:  of the ship
        let vertAngle = ((Math.PI * 2) / 3);
 
        let radians = this.angle / Math.PI * 180;
        // fire bullet: origin in the ship (nose)
        this.noseX = this.x - this.radius * Math.cos(radians);
        this.noseY = this.y - this.radius * Math.sin(radians);
   
        // allows to connect with a line the points 
        // (in the 360 degrees of the angles of the ship) 
        // in the iteration. Taking into account the 
        //conversion of degrees to radians on the x and y axis.
        for (let i = 0; i < 3; i++) {
            ctx.lineTo(this.x - this.radius * Math.cos(vertAngle * i + radians), this.y - this.radius * Math.sin(vertAngle * i + radians));
        }
        ctx.closePath();
        ctx.stroke();
    }
}
 
class Bullet{
    constructor(angle) {
        this.visible = true;
        this.x = ship.noseX;
        this.y = ship.noseY;
        this.angle = angle;
        this.height = 4;
        this.width = 4;
        this.speed = 4;
        this.velX = 0;
        this.velY = 0;
    }
    Update(){
        let radians = this.angle / Math.PI * 180;
        this.x -= Math.cos(radians) * this.speed;
        this.y -= Math.sin(radians) * this.speed;
    }
   // The creation of the bullets with the function fillRect
    Draw(){
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x,this.y,this.width,this.height);
    }
}

class Asteroid{  
    constructor(x,y,radius,level,collisionRadius) {
        this.visible = true;
        //  Obtaining an integer in the random calculation 
        // of the point of origin of a new asteroid.
        this.x = x || Math.floor(Math.random() * canvasWidth);
        this.y = y || Math.floor(Math.random() * canvasHeight);
        this.speed = 0.8;
        this.radius = radius || 50;
        this.angle = Math.floor(Math.random() * 359);
        this.strokeColor = 'white';
        this.collisionRadius = collisionRadius || 46;
        // decide: asteroid can be broken, smaller pieces
        this.level = level || 1;  
    }
    Update(){
        let radians = this.angle / Math.PI * 180;
        this.x += Math.cos(radians) * this.speed;
        this.y += Math.sin(radians) * this.speed;
        if (this.x < this.radius) {
            this.x = canvas.width;
        }
        if (this.x > canvas.width) {
            this.x = this.radius;
        }
        if (this.y < this.radius) {
            this.y = canvas.height;
        }
        if (this.y > canvas.height) {
            this.y = this.radius;
        }
    }
    Draw(){
        ctx.beginPath();
        let vertAngle = ((Math.PI * 3) /8);
        var radians = this.angle / Math.PI * 180;
        //
        for(let i = 0; i < 6; i++){
            ctx.lineTo(this.x - this.radius * Math.cos(vertAngle * i + radians), this.y - this.radius * Math.sin(vertAngle * i + radians));
        }
        ctx.closePath();
        ctx.stroke();
    }
}
 
function CircleCollision(p1x, p1y, r1, p2x, p2y, r2){
    let radiusSum;
    let xDiff;
    let yDiff;
 
    radiusSum = r1 + r2;
    xDiff = p1x - p2x;
    yDiff = p1y - p2y;
 
    if (radiusSum > Math.sqrt((xDiff * xDiff) + (yDiff * yDiff))) {
        return true;
    } else {
        return false;
    }
}

// drawing-life ships: on screen
function DrawLifeShips(){
    let startX = 1350;
    let startY = 10;
    let points = [[9, 9], [-9, 9]];
    ctx.strokeStyle = 'white'; 
    // live ships remaining
    for(let i = 0; i < lives; i++){
        // Start drawing ship
        ctx.beginPath();
        // Move to origin point
        ctx.moveTo(startX, startY);
        // Cycle through all other points
        for(let j = 0; j < points.length; j++){
            ctx.lineTo(startX + points[j][0], 
                startY + points[j][1]);
        }
        // Draw: from last point to first origin point
        ctx.closePath();
        // Stroke: the ship, shape white
        ctx.stroke();
        // Move next shape: 30 pixels to the left
        startX -= 30;
    }
}
 
function Render() {
    //  ship is moving forward
    ship.movingForward = (keys[87]);
 
    if (keys[68]) {
        // d key: rotate-right
        ship.Rotate(1);
    }
    if (keys[65]) {
        // a key: rotate-left
       ship.Rotate(-1);
    }
   
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
 
    // Display: score
    ctx.fillStyle = 'white';
    ctx.font = '21px Arial';
    ctx.fillText("SCORE : " + score.toString(), 20, 35);
 
    // no more lives: signal game over
    if(lives <= 0){
        
        //Game over remove event listeners: stop getting keyboard inputs
        document.body.removeEventListener("keydown", HandleKeyDown);
        document.body.removeEventListener("keyup", HandleKeyUp);
 
        ship.visible = false;
        ctx.fillStyle = 'white';
        ctx.font = '50px Arial';
        ctx.fillText("GAME OVER", canvasWidth / 2 - 150, canvasHeight / 2);
    }

//new level, increases asteroid speed
if(asteroids.length === 0){
    ship.x = canvasWidth / 2;
    ship.y = canvasHeight / 2;
    ship.velX = 0;
    ship.velY = 0;
    for(let i = 0; i < 8; i++){
        let asteroid = new Asteroid();
        asteroid.speed += .5;
        asteroids.push(asteroid);
    }
}

 // Draw:  life ships
 DrawLifeShips();
 
 // Check for: collision of ship with asteroid
 if (asteroids.length !== 0) {
     for(let k = 0; k < asteroids.length; k++){
         if(CircleCollision(ship.x, ship.y, 11, asteroids[k].x, asteroids[k].y, asteroids[k].collisionRadius)){
             ship.x = canvasWidth / 2;
             ship.y = canvasHeight / 2;
             ship.velX = 0;
             ship.velY = 0;
             lives -= 1;
         }
     }
 }

 // Check for: collision with bullet and asteroid
 if (asteroids.length !== 0 && bullets.length != 0){
loop1:
     for(let l = 0; l < asteroids.length; l++){
         for(let m = 0; m < bullets.length; m++){
             if(CircleCollision(bullets[m].x, bullets[m].y, 3, asteroids[l].x, asteroids[l].y, asteroids[l].collisionRadius)){
                 // Check if asteroid can be broken into smaller pieces
                 if(asteroids[l].level === 1){
                     asteroids.push(new Asteroid(asteroids[l].x - 5, asteroids[l].y - 5, 25, 2, 22));
                     asteroids.push(new Asteroid(asteroids[l].x + 5, asteroids[l].y + 5, 25, 2, 22));
                 } else if(asteroids[l].level === 2){
                     asteroids.push(new Asteroid(asteroids[l].x - 5, asteroids[l].y - 5, 15, 3, 12));
                     asteroids.push(new Asteroid(asteroids[l].x + 5, asteroids[l].y + 5, 15, 3, 12));
                 }
                 asteroids.splice(l,1);
                 bullets.splice(m,1);
                 score += 20;

                 // Used to break out of loops
                 break loop1;
             }
         }
     }
 }

 if(ship.visible){
     ship.Update();
     ship.Draw();
 }
 
 if (bullets.length !== 0) {
     for(let i = 0; i < bullets.length; i++){
         bullets[i].Update();
         bullets[i].Draw();
     }
 }
 if (asteroids.length !== 0) {
     for(let j = 0; j < asteroids.length; j++){
         asteroids[j].Update();
         // Pass j so we can track which asteroid points to store
         asteroids[j].Draw(j);
     }
 }

 // Updates the high score: use local storage
 highScore = Math.max(score, highScore);
 localStorage.setItem(localStorageName, highScore);
 ctx.font = '21px Arial';
 ctx.fillText("HIGH SCORE : " + highScore.toString(), 20, 70);

 requestAnimationFrame(Render);
}



