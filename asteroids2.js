let canvas;
let ctx;
let canvasWidth = 1000;
let canvasHeight = 700;
let keys = [];
let ship;
let bullets = [];
let asteroids = [];
let score = 0;
let lives = 3;
 

let highScore;
let localStorageName = "HighScore";
 
document.addEventListener('DOMContentLoaded', SetupCanvas);
 
function SetupCanvas(){
    canvas = document.getElementById("asteroids-canvas");
    ctx = canvas.getContext("2d");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ship = new Ship();
 
    for(let i = 0; i < 8; i++){         //for one o more ships
        asteroids.push(new Asteroid());
    }

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

//game  over:event handling
function HandleKeyDown(e){
    keys[e.keyCode] = true;
}
function HandleKeyUp(e){
    keys[e.keyCode] = false;
    if (e.keyCode === 32){
        bullets.push(new Bullet(ship.angle));
    }
}
 
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
        // Get current direction ship is facing
        let radians = this.angle / Math.PI * 180;
 
      
        if (this.movingForward) {
            this.velX += Math.cos(radians) * this.speed;
            this.velY += Math.sin(radians) * this.speed;
        }
        
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

   
        // air friction    
        this.x -= this.velX;
        this.y -= this.velY;
    }
    Draw() {
        ctx.strokeStyle = this.strokeColor;
        ctx.beginPath();
        //vertices of the ship:  Angle in between 
        let vertAngle = ((Math.PI * 2) / 3);
 
        let radians = this.angle / Math.PI * 180;
        // fire bullet: origin
        this.noseX = this.x - this.radius * Math.cos(radians);
        this.noseY = this.y - this.radius * Math.sin(radians);
 
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
    Draw(){
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x,this.y,this.width,this.height);
    }
}
