import * as paddles from './paddles.js';

const canvas = document.getElementById('gamecanvas');
const cont = canvas.getContext('2d');
// let 

canvas.height = 480;
canvas.width = 1072;
// let R_paddle
let paddle_height = 150;
let paddle_width = 15;

let ballx = canvas.width/2;
let bally = canvas.height/2;



function draw()
{
    cont.clearRect(0,0, canvas.width, canvas.height );
    cont.fillStyle = '#E5F690'
    cont.beginPath();
    cont.arc(ballx, bally,10,Math.PI*2,0);
    cont.fill()
    cont.fillStyle = '#C9D87E'

    cont.arc(ballx-20, bally,9,Math.PI*2,0);
    cont.fill()
    cont.fillStyle = '#E5F690BF'

    cont.arc(ballx-40, bally,8,Math.PI*2,0);
    cont.fill()
    cont.fillStyle = '##E5F69073'

    cont.arc(ballx-60, bally,7,Math.PI*2,0);
    cont.fill()
    cont.closePath();
    cont.fillStyle = '#E5F690'

    paddles.drawRoundedRect(cont,20,canvas.height/2 - paddle_height/2, paddle_width,paddle_height,8)
    paddles.drawRoundedRect(cont,canvas.width-(20+15),canvas.height/2 - paddle_height/2, paddle_width,paddle_height,8)
    
    // cont.fillRect(20,canvas.height/2 - paddle_height/2 ,paddle_width,paddle_height)
}

function update() 
{
 ballx +=1;
 bally +=0;

}

function g_loop()
{
    update();
    draw();
    requestAnimationFrame(g_loop);
}

g_loop()