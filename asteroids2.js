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
