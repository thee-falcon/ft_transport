function check_colision(posy) {
    const paddleTop = posy - paddle_height / 2;
    const paddleBottom = posy + paddle_height / 2;
    if (bally >= paddleTop && bally <= paddleBottom) {
        return true;
    }
    return false;
}

