import * as paddles from './paddles.js';

const canvas = document.getElementById('gamecanvas');
const cont = canvas.getContext('2d');

canvas.height = 480;
canvas.width = 1072;

let paddle_height = 75;
let paddle_width = 15;
const left_paddleX = 20;
const right_paddleX = canvas.width - (20 + paddle_width);
let left_paddleY = canvas.height / 2 ;
// let right_paddleY = canvas.height / 2 ;
let right_paddleY = canvas.height / 2 ;

// let LpaddleY = 
// const L
let ballx = (canvas.width / 2);
let bally = (canvas.height / 2)+90;
let afterImages = [];
let ballspeedX = 3; // Horizontal speed of the ball
let ballspeedY = 4; // Vertical speed of the ball
let ballspeed = 4;
let radius = 10;
const maxTrailLength = 20; // Maximum length of the trail
// console.log(right_paddleY)
function reset_ball()
{
    ballx = canvas.width / 2;
    bally = canvas.height / 2;
    // Math.random(01)  
 
}

function draw() {
    cont.clearRect(0, 0, canvas.width, canvas.height);

    // for (let i = 0; i < afterImages.length; i+=5) {
    //     const { x, y, radius, alpha } = afterImages[i];
    //     cont.fillStyle = `rgba(229, 246, 144, ${alpha})`;
    //     cont.beginPath();
    //     cont.arc(x, y, radius, 0, Math.PI * 2);
    //     cont.fill();
    //     cont.closePath();
    // }

    cont.fillStyle = '#E5F690FF';
    cont.beginPath();
    cont.arc(ballx, bally, radius, 0, Math.PI * 2);
    cont.fill();
    cont.closePath();

    // Draw paddles
    paddles.drawRoundedRect(cont, left_paddleX, left_paddleY - paddle_height/2, paddle_width, paddle_height, 8);
    paddles.drawRoundedRect(cont, right_paddleX, right_paddleY - paddle_height/2 , paddle_width, paddle_height, 8); // drawing 
}

function check_colision(posy) {
    const paddleTop = posy - paddle_height/2;
    const paddleBottom = posy + paddle_height/2;
    if (bally >= paddleTop && bally <= paddleBottom) {
        return true;
    }
    return false;
}
// docume
function update() {
    ballx += ballspeedX;
    bally += ballspeedY;
    // console.log(right_paddleY)

 
    if(ballx >= canvas.width || ballx < 0 )
    {
        reset_ball();
    }
    if(bally + radius >= canvas.height || bally < 0 ) // deppanage
    {
        ballspeedY *= -1 
    }
    if (ballx + radius >= right_paddleX && ballx - radius <= right_paddleX + paddle_width) {
        if (check_colision(right_paddleY)) {
            // Add some angle to the ball based on where it hits the paddle
            const relativeIntersectY = (right_paddleY) - bally;
            const normalizedIntersectY = relativeIntersectY / (paddle_height/2);
            const bounceAngle = normalizedIntersectY * 0.75; // Max 75° bounce angle
            
            // Calculate new velocities
            ballspeedX = -ballspeed * Math.cos(bounceAngle);
            ballspeedY = -ballspeed * Math.sin(bounceAngle);
        }
        
    }
    if (ballx + radius >= left_paddleX && ballx - radius <= left_paddleX + paddle_width) {
        if (check_colision(left_paddleY)) {
            // Add some angle to the ball based on where it hits the paddle
            const relativeIntersectY = (left_paddleY) - bally;
            const normalizedIntersectY = relativeIntersectY / (paddle_height/2);
            const bounceAngle = normalizedIntersectY * 0.75; // Max 75° bounce angle
            
            // Calculate new velocities
            ballspeedX = ballspeed * Math.cos(bounceAngle);
            ballspeedY = -ballspeed * Math.sin(bounceAngle);
        }
    }

    // if (ballx >= right_paddleX )
    // {
    //     if (check_colision(right_paddleY))
    //     {
    //         ballspeedX *= -1;
    //         ballspeedY *= -1;

    //     }
    // }
    // if(ballx >= right_paddleX )
    // {
    //     if(check_colision(right_paddleX )){
    //     var paddleCenter = left_paddleY + (paddle_height/2);
    //     var d = paddleCenter - bally;
    //     ballspeedY += d * -0.1; // here's the trick
    //     ballspeedX *= -1;
    //     }
    // }
    // right_paddleY = bally 
    // left_paddleY = bally 

}

function updatePaddles()
{
    document.addEventListener('keydown', (e) => 
    {
        const paddleSpeed = 0.01;

        if(e.code === "ArrowUp") {
            right_paddleY = Math.max(paddle_height/2, right_paddleY - paddleSpeed);
        }
        else if(e.code === "ArrowDown") {
            right_paddleY = Math.min(canvas.height - paddle_height/2, right_paddleY + paddleSpeed);
        }
        else if(e.code === "KeyW") {
            left_paddleY = Math.max(paddle_height/2, left_paddleY - paddleSpeed);
        }
        else if(e.code === "KeyS") {
            left_paddleY = Math.min(canvas.height - paddle_height/2, left_paddleY + paddleSpeed);
        }
    })
}

function g_loop() {
    updatePaddles();
    update();
    draw();
    requestAnimationFrame(g_loop);
}

g_loop();
