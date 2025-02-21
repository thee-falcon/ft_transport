function draw_board(teams) {
    ctx.clearRect(0, 0, board.width, board.height);
    ctx.font = "Bold 40px 'Bai Jamjuree'";
    const text = "Match score";
    const textWidth = ctx.measureText(text).width;
    const x = (board.width - textWidth) / 2;
    const y = board.height - 90;
    // { src: "../imgs/red1.jpg", x: board.width/10+ctx.measureText("Red Team").width+50, y: board.height/8 },
    // { src: "../imgs/red3.jpg", x: board.width/10+ctx.measureText("Red Team").width+imageSize+50, y: board.height/8 },
    const imageSize = 90;
    const images = [
        { src: "../imgs/red1.jpg", x: board.width/8+ctx.measureText("Red Team").width+imageSize, y: board.height/9 },
        { src: "../imgs/red3.jpg", x: board.width/8+ctx.measureText("Red Team").width+2*imageSize, y: board.height/9 },
        { src: "../imgs/blue1.jpg", x: (board.width - board.width/3)-imageSize, y: board.height/9 },
        { src: "../imgs/blue2.jpg", x: (board.width - board.width/3)-2*imageSize, y: board.height/9 }
    ];

    images.forEach(imgData => {
        const img = new Image();
        img.src = imgData.src;
        img.onload = function() {
            ctx.save();
            ctx.beginPath();
            ctx.arc(imgData.x + imageSize/2, imgData.y + imageSize/2, imageSize/2, 0, Math.PI * 2);
            ctx.clip();
            
            ctx.drawImage(img, imgData.x, imgData.y, imageSize, imageSize);
            ctx.restore();
        };
    });

    ctx.fillText(text, x, y);
    ctx.fillText("constructor", (board.width) / 8, board.height/6+30);
    ctx.fillText("decconstructor", (board.width - board.width/3), board.height/6+30);
    ctx.fillText("0", (board.width) / 4, y);
    ctx.fillText("0", (board.width - (board.width) / 4), y);
    ctx.fillText("VS", (board.width - ctx.measureText("VS").width) / 2, board.height/6);
    ctx.fillStyle = "#FF0000";
    ctx.fillText("Red Team", board.width/8, board.height/6);
    ctx.fillStyle = "#0000FF";
    ctx.fillText("Blue Team", board.width - board.width/3, board.height/6);
    ctx.fillStyle = "#000000";
}
function draw_score()
{
    // const x = (board.width - textWidth) / 2;
    const y = board.height - 90;
    // ctx.clearRect(0 , 0, board.width, board.height);
    // ctx.clearRect(y,(board.width) / 4,1000,1000)
    // ctx.fillText()
    
    ctx.clearRect(board.width/4,y-40, 100,100)
    // ctx.fillText("HNA", board.width - board.width/4, y-40);
    ctx.clearRect(board.width - board.width/4,y-40, 100,100)

    // ctx.fillText("HNA", board.width/4, y-40);
    // ctx.fillText("HNA", (board.width - ctx.measureText("HNA").width) / 2, 150);

    const left_scorestring = scrs.l_score.toString();
    const right_scorestring = scrs.r_score.toString();
    // ctx.fillText(streak, (board.width) / 2, 100);
    ctx.fillText(right_scorestring, (board.width) / 4, y);
    ctx.fillText(left_scorestring, (board.width - (board.width) / 4), y);
    // ctx.fillText(ballspeed, (board.width) / 2, y+50);

}