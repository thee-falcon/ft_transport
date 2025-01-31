// import * as paddles from './paddles.js';



const canvas = document.getElementById('gamecanvas');
const board = document.getElementById('boardcanva');
const ctx = board.getContext('2d');
const custo = document.getElementById('custos');
const custoctx = custo.getContext('2d');
const custoDiv = document.querySelector('.customization');
custoDiv.style.display = 'none';

let resetDelay = 1000; // Delay in milliseconds
let lastResetTime = 0; // Track the last reset time
let isResetting = false;

const LEFT = -1;
const RIGHT = 1;
let round_winner = Math.random() < 0.5 ? (Math.random() * -1) : (Math.random() * 1);
const cont = canvas.getContext('2d');

canvas.height = 480; 
canvas.width = 1072; 
board.height = 900;
board.width = 1400;
let paddle_height = 200;
let paddle_width = 15;
const left_paddleX = 20;
const right_paddleX = canvas.width - (20 + paddle_width);
let left_paddleY = canvas.height / 2;
let right_paddleY = canvas.height / 2;
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

let streak =0;
let ballx = (canvas.width / 2);
let bally = (canvas.height / 2);
let ballspeedX = 5;
let ballspeedY = 5;
let ballspeed = 8;
let radius = 10;
let isRightUp = false;
let isRightDown = false;
let isLeftW = false;
let isLeftS = false;

function reset_ball() {
    // draw_on_div()
    custo.style.display = 
    lastResetTime = performance.now(); // Save the current time
    isResetting = true; // Set the resetting state
    ballx = (canvas.width / 2);
    bally = (canvas.height / 2);

}
function draw_on_div()
{
custoDiv.style.display = 'flex';

    ctx.clearRect(0, 0, custo.width, custo.height);


}
// function reset_ball() {
//     ballx = canvas.width / 2;
//     bally = canvas.height / 2;
//     ballspeed = 8;
//     left_paddleY = canvas.height / 2;
//     right_paddleY = canvas.height / 2;
//     paddle_height = 200;
//     streak = 0;
//     let randomAngleDegrees = Math.random() < 0.5 ? Math.random() * 30 - 30 : Math.random() * 30;
//     let randomAngleRadians = randomAngleDegrees * (Math.PI / 180);

//     const direction = round_winner * -1;

//     ballspeedX = direction * ballspeed * Math.cos(randomAngleRadians);
//     ballspeedY = ballspeed * Math.sin(randomAngleRadians);
// }
function draw_board() {
    ctx.clearRect(0, 0, board.width, board.height);
    ctx.font = "Bold 40px 'Bai Jamjuree'";

    const text = "Match score";
    const left_scorestring = scrs.l_score.toString();
    const right_scorestring = scrs.r_score.toString()

    const textWidth = ctx.measureText(text).width;

    const x = (board.width - textWidth) / 2;
    const y = board.height - 90;

    ctx.fillText(text, x, y);
    ctx.fillText(right_scorestring, (board.width) / 4, y);
    ctx.fillText(left_scorestring, (board.width - (board.width) / 4), y);
    ctx.fillText("VS", (board.width - ctx.measureText("VS").width) / 2, 150);
    ctx.fillText(streak, (board.width) / 2, 100);
    ctx.fillText(ballspeed, (board.width) / 2, y+50);
    ctx.fillText(paddle_height, ((board.width) / 2)-150, y+50);

    // add the new id and img! 

}
function drawStar(context, cx, cy, spikes, outerRadius, innerRadius) {
    let rot = (Math.PI / 2) * 3;
    const step = Math.PI / spikes; 

    context.beginPath();
    context.moveTo(cx, cy - outerRadius);

    for (let i = 0; i < spikes; i++) {
        context.lineTo(cx + Math.cos(rot) * outerRadius, cy + Math.sin(rot) * outerRadius);
        rot += step;

        context.lineTo(cx + Math.cos(rot) * innerRadius, cy + Math.sin(rot) * innerRadius);
        rot += step;
    }

    context.lineTo(cx, cy - outerRadius);
    context.closePath();
    context.fillStyle = '#E5F690FF';
    context.fill();
}
function drawball()
{
    cont.beginPath();
    cont.arc(ballx, bally, radius, 0, Math.PI * 2);

    cont.fill();
    cont.closePath();
}

function draw() {
    cont.clearRect(0, 0, canvas.width, canvas.height);
    cont.fillStyle = '#E5F690FF';
    // drawball()
    drawStar(cont,ballx,bally,5,13,5)
    drawRoundedRect(cont, left_paddleX, left_paddleY - paddle_height / 2, paddle_width, paddle_height, 8);
    drawRoundedRect(cont, right_paddleX, right_paddleY - paddle_height / 2, paddle_width, paddle_height, 8);
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
function update() {

    if (isResetting) {
        if (performance.now() - lastResetTime >= resetDelay) {
            // Perform the reset logic
            ballx = canvas.width / 2;
            bally = canvas.height / 2;
            ballspeed = 8;
            left_paddleY = canvas.height / 2;
            right_paddleY = canvas.height / 2;
            paddle_height = 200;
            streak = 0;

            let randomAngleDegrees = Math.random() < 0.5 ? Math.random() * 30 - 30 : Math.random() * 30;
            let randomAngleRadians = randomAngleDegrees * (Math.PI / 180);
            const direction = round_winner;

            ballspeedX = direction * ballspeed * Math.cos(randomAngleRadians);
            ballspeedY = ballspeed * Math.sin(randomAngleRadians);
            isResetting = false; // Reset the state
            custoDiv.style.display = 'none';

        }
        return;
    }

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


    if (ballx + radius >= canvas.width) {
        scrs.increment_rscore();
        round_winner = RIGHT
        reset_ball();
        return;
    }
    if (ballx + radius < 0) {
        scrs.increment_lscore();
        round_winner = LEFT
        reset_ball();
        return;
    }

    if (bally + 1.5 * radius >= canvas.height || bally - 1.5 * radius <= 0) {
        ballspeedY *= -1
    }
    if (ballx + radius >= right_paddleX && ballx - radius <= right_paddleX + paddle_width) {
        if (check_colision(right_paddleY)) {
            ballx = right_paddleX - radius - paddle_width;
            const relativeIntersectY = (right_paddleY) - bally;
            const normalizedIntersectY = relativeIntersectY / (paddle_height / 2);


            const bounceAngle = normalizedIntersectY * 0.75;
            ballspeedX = -ballspeed * Math.cos(bounceAngle);
            ballspeedY = -ballspeed * Math.sin(bounceAngle);
            streak++;

            if (ballspeed <= 15) {

                ballspeed *= 1.1
            } 
            else {
                paddle_height -= 10
            }
        }

    }
    if (ballx + radius >= left_paddleX && ballx - radius <= left_paddleX + paddle_width) {
        if (check_colision(left_paddleY)) {
            ballx = left_paddleX + paddle_width + radius;
            const relativeIntersectY = (left_paddleY) - bally;
            const normalizedIntersectY = relativeIntersectY / (paddle_height / 2);
            const bounceAngle = normalizedIntersectY * 0.75;
            ballspeedX = ballspeed * Math.cos(bounceAngle);
            ballspeedY = -ballspeed * Math.sin(bounceAngle);
            streak++;
            if (ballspeed <= 15) {

                ballspeed *= 1.1
            }
            else {
                paddle_height -= 10;
            }
        }
    }

}

function updatePaddles() {
    const paddleSpeed = 10;

    if (isRightUp) {
        right_paddleY = Math.max((paddle_height / 2)+5, right_paddleY - paddleSpeed);
    }
    if (isRightDown) {
        right_paddleY = Math.min((canvas.height - paddle_height / 2)-5, right_paddleY + paddleSpeed);
    }
    if (isLeftW) {
        left_paddleY = Math.max((paddle_height / 2)+5, left_paddleY - paddleSpeed);
    }
    if (isLeftS) {
        left_paddleY = Math.min((canvas.height - paddle_height / 2)-5, left_paddleY + paddleSpeed);
    }
}

function g_loop() {
    updatePaddles();
    update();
    draw();
    requestAnimationFrame(g_loop);
}

g_loop();
