


// export function updatePaddles() {
//     const paddleSpeed = 10;

//     if (isRightUp) {
//         right_paddleY = Math.max(paddle_height / 2, right_paddleY - paddleSpeed);
//     }
//     if (isRightDown) {
//         right_paddleY = Math.min(canvas.height - paddle_height / 2, right_paddleY + paddleSpeed);
//     }
//     if (isLeftW) {
//         left_paddleY = Math.max(paddle_height / 2, left_paddleY - paddleSpeed);
//     }
//     if (isLeftS) {
//         left_paddleY = Math.min(canvas.height - paddle_height / 2, left_paddleY + paddleSpeed);
//     }
// }

function drawRoundedRect(ctx, x, y, width, height, borderRadius) {
    ctx.beginPath();
    ctx.moveTo(x + borderRadius, y); // Start at the top-left corner
    ctx.lineTo(x + width - borderRadius, y); // Draw top edge
    ctx.arcTo(x + width, y, x + width, y + borderRadius, borderRadius); // Top-right corner
    ctx.lineTo(x + width, y + height - borderRadius); // Draw right edge
    ctx.arcTo(x + width, y + height, x + width - borderRadius, y + height, borderRadius); // Bottom-right corner
    ctx.lineTo(x + borderRadius, y + height); // Draw bottom edge
    ctx.arcTo(x, y + height, x, y + height - borderRadius, borderRadius); // Bottom-left corner
    ctx.lineTo(x, y + borderRadius); // Draw left edge
    ctx.arcTo(x, y, x + borderRadius, y, borderRadius); // Top-left corner
    ctx.closePath();
    ctx.fill(); // Fill the rounded rectangle
}