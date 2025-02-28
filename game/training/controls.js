let isRightUp = false;
let isRightDown = false;
let isLeftW = false;
let isLeftS = false;
let isRight8 = false;
let isRight5 = false;
let isLeftY = false;
let isLeftH = false;

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