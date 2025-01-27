import * as paddles from './paddles.js';



const canvas = document.getElementById('gamecanvas');
const board = document.getElementById('boardcanva');
const ctx = board.getContext('2d');

const LEFT = -1;
const RIGHT = 1;
let round_winner = Math.random() < 0.5 ? (Math.random() * -1) : (Math.random() * 1);
const cont = canvas.getContext('2d');

canvas.height = 480;
canvas.width = 1072;
board.height = 900
board.width = 1400
let paddle_height = 200;
let paddle_width = 15;
const left_paddleX = 20;
const right_paddleX = canvas.width - (20 + paddle_width);
let left_paddleY = canvas.height / 2;
let right_paddleY = canvas.height / 2;

// let LpaddleY = 
// const L
// export function update_score()
// {
    
// }
class scores {
    constructor() {
        this.left_score = 0;
        this.right_score = 0;
    }
    get l_score() {
        return this.left_score;
    };
    get r_score() {
        return this.right_score;
    };
    increment_lscore() {
        this.left_score += 1;
    };
    increment_rscore() {
        this.right_score += 1;
    };



}
const scrs = new scores();

// export default scores;


let ballx = (canvas.width / 2);
let bally = (canvas.height / 2) + 90;
// let afterImages = [];
let ballspeedX = 5; // Horizontal speed of the ball
let ballspeedY = 5; // Vertical speed of the ball
let ballspeed = 8;
let radius = 10;
let isRightUp = false;
let isRightDown = false;
let isLeftW = false;
let isLeftS = false;
// console.log(right_paddleY)


function reset_ball() {
    ballx = canvas.width / 2;
    bally = canvas.height / 2;
    ballspeed = 8;
    left_paddleY = canvas.height / 2;
    right_paddleY = canvas.height / 2;
    paddle_height = 200;
    let randomAngleDegrees = Math.random() < 0.5 ? Math.random() * 30 - 30 : Math.random() * 30; 
    let randomAngleRadians = randomAngleDegrees * (Math.PI / 180);

    const direction = round_winner * -1; 

    ballspeedX = direction * ballspeed * Math.cos(randomAngleRadians);
    ballspeedY = ballspeed * Math.sin(randomAngleRadians);
}
function draw_board()
{
    ctx.clearRect(0, 0, board.width, board.height);
    ctx.font = "Bold 40px 'Bai Jamjuree'";
    
    const text = "Match score";
    const left_scorestring = scrs.l_score.toString();
    const right_scorestring = scrs.r_score.toString();

    const textWidth = ctx.measureText(text).width; // Measure the width of the text
    
    // Center the text horizontally
    const x = (board.width - textWidth) / 2; // Calculate the x position
    const y = board.height - 90; // y position from the bottom

    ctx.fillText(text, x, y); // Draw the text
    ctx.fillText(left_scorestring, (board.width)/4, y); // Draw the text
    ctx.fillText(right_scorestring, (board.width-(board.width)/4), y); // Draw the text
    ctx.fillText("VS", (board.width - ctx.measureText("VS").width)/2, 150); // Draw the text

    // add the new is and img! 

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
    draw_board();

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
    // if(scrs.l_score == 0 && scrs.r_score == 0){ 
    //     reset_ball();
        ballx += ballspeedX;
        bally += ballspeedY;
    // }
    // console.log(right_paddleY)


    if (ballx+radius >= canvas.width) {
        // export score
        // scrs.l_score++;
        scrs.increment_rscore();
        round_winner = RIGHT
        // console.log(scrs.l_score);
        reset_ball();
        return;
    }
    if ( ballx+radius < 0) {
        // export score
        // scrs.l_score++;
        scrs.increment_lscore();
        round_winner = LEFT
        // console.log(scrs.l_score);
        reset_ball();
        return;
    }
    // right_paddleY = bally;

    if (bally + 1.5*radius >= canvas.height || bally - 1.5*radius <= 0) // deppanage
    {
        // bally += radius; 
        ballspeedY *= -1
        // if (Math.abs(ballspeedY) < 1) {
        //     ballspeedY = Math.sign(ballspeedY) * 1; // Ensure a minimum speed
        // }
        // if(ballspeedY < 0.1 )
        // {
        //     // Math.sign(ballspeedY)
        //     ballspeedY = Math.sign(ballspeedY)*0.1
        // }
    }
    if (ballx + radius >= right_paddleX && ballx - radius <= right_paddleX + paddle_width) {
        if (check_colision(right_paddleY)) {
            ballx = right_paddleX -radius - paddle_width;
            const relativeIntersectY = (right_paddleY) - bally;
            const normalizedIntersectY = relativeIntersectY / (paddle_height / 2);


            const bounceAngle = normalizedIntersectY * 0.75; // Max 75° bounce angle
            
            // ballx = right_paddleX + radius;
            ballspeedX = -ballspeed * Math.cos(bounceAngle);
            ballspeedY = -ballspeed * Math.sin(bounceAngle);
            // ballspeed *=1.2

            if(ballspeed <= 15 ){

                ballspeed *=1.1
            }
            else
            {
                paddle_height -= 10
            }
        }

    }
    if (ballx + radius >= left_paddleX && ballx - radius <= left_paddleX + paddle_width) {
        if (check_colision(left_paddleY)) {
            ballx = left_paddleX + paddle_width + radius;
            const relativeIntersectY = (left_paddleY) - bally;
            const normalizedIntersectY = relativeIntersectY / (paddle_height / 2);
            const bounceAngle = normalizedIntersectY * 0.75; // Max 75° bounce angle
            
            // ballx = left_paddleX + radius;
            ballspeedX = ballspeed * Math.cos(bounceAngle);
            ballspeedY = -ballspeed * Math.sin(bounceAngle);
            // ballspeed *=1.2
            if(ballspeed <= 15 ){

                ballspeed *=1.1
            }
            else
            {
                paddle_height -= 10;
            }
        }
    }

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
