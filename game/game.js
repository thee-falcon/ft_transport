import * as paddles from './paddles.js';



const canvas = document.getElementById('gamecanvas');
const cont = canvas.getContext('2d');

canvas.height = 480;
canvas.width = 1072;
let paddle_height = 75;
let paddle_width = 15;
const left_paddleX = 20;
const right_paddleX = canvas.width - (20 + paddle_width);
let left_paddleY = canvas.height / 2;
let right_paddleY = canvas.height / 2;

// let LpaddleY = 
// const L
export function update_score()
{
    
}
class scores {
    constructor() {
        this.left_score = 0;
        this.right_score = 99;
    }
    get l_score() {
        return this.left_score;
    };
    get r_score() {
        return this.left_score;
    };
    increment_lscore() {
        this.l_score += 1;
    };
    increment_rscore() {
        this.r_score += 1;
    };



}
export default scores;
let ballx = (canvas.width / 2);
let bally = (canvas.height / 2) + 90;
let afterImages = [];
let ballspeedX = 3; // Horizontal speed of the ball
let ballspeedY = 4; // Vertical speed of the ball
let ballspeed = 4;
let radius = 10;
let isRightUp = false;
let isRightDown = false;
let isLeftW = false;
let isLeftS = false;
// console.log(right_paddleY)
function reset_ball() {
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
    // cont.arc(canvas.width/2,canvas.height/2,  radius*5, 0, Math.PI * 2);

    cont.fill();
    cont.closePath();
    // cont.fillStyle = '#E5F690FF';
    // cont.beginPath();
    // cont.arc(canvas.width/2,canvas.height/2,  radius*5, 0, Math.PI * 2);
    // cont.fill()
    // cont.closePath();


    // Draw paddles
    paddles.drawRoundedRect(cont, left_paddleX, left_paddleY - paddle_height / 2, paddle_width, paddle_height, 8);
    paddles.drawRoundedRect(cont, right_paddleX, right_paddleY - paddle_height / 2, paddle_width, paddle_height, 8); // drawing 
}

function check_colision(posy) {
    const paddleTop = posy - paddle_height / 2;
    const paddleBottom = posy + paddle_height / 2;
    if (bally >= paddleTop && bally <= paddleBottom) {
        return true;
    }
    return false;
}
// docume
function update() {


    document.addEventListener('keydown', (e) => {
        if (e.code === "ArrowUp") isRightUp = true;
        if (e.code === "ArrowDown") isRightDown = true;
        if (e.code === "KeyW") isLeftW = true;
        if (e.code === "KeyS") isLeftS = true;
    });

    document.addEventListener('keyup', (e) => {
        if (e.code === "ArrowUp") isRightUp = false;
        if (e.code === "ArrowDown") isRightDown = false;
        if (e.code === "KeyW") isLeftW = false;
        if (e.code === "KeyS") isLeftS = false;
    });

    ballx += ballspeedX;
    bally += ballspeedY;
    // console.log(right_paddleY)


    if (ballx >= canvas.width || ballx < 0) {
        // export score
        // scores.left_score ++;
        // scores.left_score ++;
        scores.increment_lscore();
        reset_ball();
    }
    if (bally + radius >= canvas.height || bally - radius < 0) // deppanage
    {
        ballspeedY *= -1
    }
    if (ballx + radius >= right_paddleX && ballx - radius <= right_paddleX + paddle_width) {
        if (check_colision(right_paddleY)) {
            // Add some angle to the ball based on where it hits the paddle
            const relativeIntersectY = (right_paddleY) - bally;
            const normalizedIntersectY = relativeIntersectY / (paddle_height / 2);


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
            const normalizedIntersectY = relativeIntersectY / (paddle_height / 2);
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

function updatePaddles() {
    const paddleSpeed = 10;

    if (isRightUp) {
        right_paddleY = Math.max(paddle_height / 2, right_paddleY - paddleSpeed);
    }
    if (isRightDown) {
        right_paddleY = Math.min(canvas.height - paddle_height / 2, right_paddleY + paddleSpeed);
    }
    if (isLeftW) {
        left_paddleY = Math.max(paddle_height / 2, left_paddleY - paddleSpeed);
    }
    if (isLeftS) {
        left_paddleY = Math.min(canvas.height - paddle_height / 2, left_paddleY + paddleSpeed);
    } 
}

function g_loop() {
    updatePaddles();
    update();
    draw();
    requestAnimationFrame(g_loop);
}

g_loop();
