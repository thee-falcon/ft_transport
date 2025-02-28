

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
    cont.fillStyle = '#FF0000';

    drawLplayer();
    cont.fillStyle = '#006AFF';

    drawRplayer();
}