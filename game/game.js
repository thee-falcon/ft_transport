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
let paddle_height = 100;
let paddle_width = 15;
const left_paddleX = 20;
const right_paddleX = canvas.width - (20 + paddle_width);
let left_paddleY = canvas.height / 2;
let right_paddleY = canvas.height / 2;
const right_2paddleX = canvas.width - canvas.width/4;
const left_2paddleX = canvas.width/4;
let right_2paddleY = canvas.height / 2;
let left_2paddleY = canvas.height / 2;
let side = 0;
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
let isRight8 = false;
let isRight5 = false;
let isLeftY = false;
let isLeftH = false;

function reset_ball() {
    // draw_on_div()
    side = 0;
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
function drawball(style,side)
{   
    if(side == RIGHT)
    {
        cont.fillStyle = '#FF00FFFF'
        
    }
    else if(side === LEFT)
    {
        cont.fillStyle = '#FF0000FF'
    }
    else
    {
        cont.fillStyle = '#E5F690FF'
    }
    cont.beginPath();
    cont.arc(ballx, bally, radius, 0, Math.PI * 2);

    cont.fill();
    cont.closePath();
}
function drawLplayer()
{
    drawRoundedRect(cont, left_paddleX, left_paddleY - paddle_height / 2, paddle_width, paddle_height, 8);
 
    drawRoundedRect(cont, left_2paddleX, left_2paddleY - paddle_height / 2, paddle_width, paddle_height, 8);

}
function drawRplayer()
{
    drawRoundedRect(cont, right_2paddleX, right_2paddleY - paddle_height / 2, paddle_width, paddle_height, 8);
 
    drawRoundedRect(cont, right_paddleX, right_paddleY - paddle_height / 2, paddle_width, paddle_height, 8);
    
}
function drawplayers()
{
    cont.fillStyle = '#E5F690FF';

    drawLplayer();
    cont.fillStyle = '#E5AA90FF';

    drawRplayer();
}
function draw() {
    cont.clearRect(0, 0, canvas.width, canvas.height);
    drawball('#E5F690FF',side);
    // drawStar(cont,ballx,bally,5,13,5)
    drawplayers();
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
            left_2paddleY = canvas.height / 2;
            right_2paddleY = canvas.height / 2;
            paddle_height = 100;
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
        if (e.code === "KeyY") isLeftY = true;
        if (e.code === "KeyH") isLeftH = true;
        if (e.code === "Numpad8") isRight8 = true;
        if (e.code === "Numpad5") isRight5 = true;
    });

    document.addEventListener('keyup', (e) => {
        if (e.code === "ArrowUp") isRightUp = false;
        if (e.code === "ArrowDown") isRightDown = false;
        if (e.code === "KeyW") isLeftW = false;
        if (e.code === "KeyS") isLeftS = false;
        if (e.code === "KeyY") isLeftY = false;
        if (e.code === "KeyH") isLeftH = false;
        if (e.code === "Numpad8") isRight8 = false;
        if (e.code === "Numpad5") isRight5 = false;
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

    if (bally + 1.5 * radius >= canvas.height) {
        bally = canvas.height - 1.5 * radius; // Reposition outside the boundary
        ballspeedY *= -1;
    } else if (bally - 1.5 * radius <= 0) {
        bally = 1.5 * radius; // Reposition outside the boundary
        ballspeedY *= -1;
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
            side = RIGHT;
        }

    }
    if (ballx + radius >= left_paddleX && ballx - radius <= left_paddleX + paddle_width ) {
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
            side = LEFT;

        }
    }
    if (ballx + radius >= right_2paddleX && ballx - radius <= right_2paddleX + paddle_width) {
        if (check_colision(right_2paddleY) && side == RIGHT)
        {
            ballx = right_2paddleX - radius - paddle_width;
            ballspeed *= 1.5
        }
        else if (check_colision(right_2paddleY)) {
            ballx = right_2paddleX - radius - paddle_width;
            const relativeIntersectY = (right_2paddleY) - bally;
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
            side = RIGHT;
        }

    }
    if (ballx + radius >= left_2paddleX && ballx - radius <= left_2paddleX + paddle_width ) {
        if (check_colision(left_2paddleY) && side == LEFT)
        {
            ballx = left_2paddleX + paddle_width + radius;
            ballspeed *= 1.5
        }
        
        else if (check_colision(left_2paddleY)) {
            ballx = left_2paddleX + paddle_width + radius;
            const relativeIntersectY = (left_2paddleY) - bally;
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
            side = LEFT;

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
    if (isLeftY) {
        left_2paddleY = Math.max((canvas.height/4)+(paddle_height / 2), left_2paddleY - paddleSpeed);
    }
    if (isLeftH) {
        left_2paddleY = Math.min((3*canvas.height/4 - paddle_height / 2), left_2paddleY + paddleSpeed);
    }
    if (isRight8) {
        right_2paddleY = Math.max((canvas.height/4)+(paddle_height / 2), right_2paddleY - paddleSpeed);
    }
    if (isRight5) {
        right_2paddleY = Math.min((3*canvas.height/4 - paddle_height / 2), right_2paddleY + paddleSpeed);
    }
}

function g_loop() {
    updatePaddles();
    update();
    draw();
    requestAnimationFrame(g_loop);
}

g_loop();
