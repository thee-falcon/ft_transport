// training.js - Keep everything except the Scores class
class Multiplayer extends HTMLElement {
    constructor() {
        super();
        this.canvas = null;
        this.board = null;
        this.custo = null;
        this.ctx = null;
        this.custoctx = null;
        this.cont = null;
        this.custoDiv = null;
    }

    async connectedCallback() {
        this.innerHTML = `
            <div class="board" id="boardd">
                <canvas id="boardcanva"></canvas>
                <div class="game-area" id="game">
                    <canvas id="gamecanvas"></canvas>
                </div>
                <div class="customization" id="custo">
                    <canvas id="custos"></canvas>
                </div>
            </div>
        `;

        // Initialize after DOM elements are created
        this.initializeGame();
    }

    initializeGame() {
        // Get DOM elements
        this.canvas = document.getElementById('gamecanvas');
        this.board = document.getElementById('boardcanva');
        this.custo = document.getElementById('custos');
        this.ctx = this.board.getContext('2d');
        this.custoctx = this.custo.getContext('2d');
        this.cont = this.canvas.getContext('2d');
        this.custoDiv = document.querySelector('.customization');
        
        // Hide customization div
        this.custoDiv.style.display = 'none';

        // Set up canvas dimensions
        this.canvas.height = 480;
        this.canvas.width = 1072;
        this.board.height = 900;
        this.board.width = 1400;

        // Initialize game variables
        this.resetDelay = 1000;
        this.lastResetTime = 0;
        this.isResetting = false;
        this.LEFT = -1;
        this.RIGHT = 1;
        this.round_winner = Math.random() < 0.5 ? (Math.random() * -1) : (Math.random() * 1);
        
        // Initialize paddle properties
        this.paddle_height = 100;
        this.paddle_width = 15;
        this.left_paddleX = 20;
        this.right_paddleX = this.canvas.width - (20 + this.paddle_width);
        this.left_paddleY = this.canvas.height / 2;
        this.right_paddleY = this.canvas.height / 2;
        this.right_2paddleX = this.canvas.width - this.canvas.width / 4;
        this.left_2paddleX = this.canvas.width / 4;
        this.right_2paddleY = this.canvas.height / 2;
        this.left_2paddleY = this.canvas.height / 2;
        // Initialize ball properties
        this.streak = 0;
        this.ballx = (this.canvas.width / 2);
        this.bally = (this.canvas.height / 2);
        this.ballspeedX = 5;
        this.ballspeedY = 5;
        this.ballspeed = 8;
        this.radius = 10;
        this.side = 0;
        // Initialize control flags
        this.isRightUp = false;
        this.isRightDown = false;
        this.isLeftW = false;
        this.isLeftS = false;
        this.isRight8 = false;
        this.isRight5 = false;
        this.isLeftY = false;
        this.isLeftH = false;

        // Initialize scores - using the shared Scores class
        this.scores = new Scores();

        // Set up event listeners
        this.setupEventListeners();

        // Start game loop
        this.draw_board();
        this.gameLoop();
    }
    draw() {
        this.cont.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawball(this.side);
        // drawStar(cont,ballx,bally,5,13,5)
        this.drawplayers();
        // draw_board();
    
    
    }
    drawball(side)
{   
    if(side == this.RIGHT)
    {
        this.cont.fillStyle = '#006AFF'
        
    }
    else if(side === this.LEFT)
    {
        this.cont.fillStyle = '#FF0000'
    }
    else
    {
        this.cont.fillStyle = '#E5F690FF'
    }
    this.cont.beginPath();
    this.cont.arc(this.ballx, this.bally, this.radius, 0, Math.PI * 2);

    this.cont.fill();
    this.cont.closePath();
}

updatePaddles() {
    const paddleSpeed = 10;

    if (this.isRightUp) {
        this.right_paddleY = Math.max((this.paddle_height / 2)+5, this.right_paddleY - paddleSpeed);
    }
    if (this.isRightDown) {
        this.right_paddleY = Math.min((this.canvas.height - this.paddle_height / 2)-5, this.right_paddleY + paddleSpeed);
    }
    if (this.isLeftW) {
        this.left_paddleY = Math.max((this.paddle_height / 2)+5, this.left_paddleY - paddleSpeed);
    }
    if (this.isLeftS) {
        this.left_paddleY = Math.min((this.canvas.height - this.paddle_height / 2)-5, this.left_paddleY + paddleSpeed);
    }
    if (this.isLeftY) {
        this.left_2paddleY = Math.max((this.canvas.height/4)+(this.paddle_height / 2), this.left_2paddleY - paddleSpeed);
    }
    if (this.isLeftH) {
        this.left_2paddleY = Math.min((3*this.canvas.height/4 - this.paddle_height / 2), this.left_2paddleY + paddleSpeed);
    }
    if (this.isRight8) {
        this.right_2paddleY = Math.max((this.canvas.height/4)+(this.paddle_height / 2), this.right_2paddleY - paddleSpeed);
    }
    if (this.isRight5) {
        this.right_2paddleY = Math.min((3*this.canvas.height/4 - this.paddle_height / 2), this.right_2paddleY + paddleSpeed);
    }
}
check_colision(posy) {
    const paddleTop = posy - this.paddle_height / 2;
    const paddleBottom = posy + this.paddle_height / 2;
    if (this.bally >= paddleTop && this.bally <= paddleBottom) {
        return true;
    }
    return false;
}
drawRoundedRect(ctx, x, y, width, height, borderRadius) {
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
drawLplayer()
{
    this.drawRoundedRect(this.cont, this.left_paddleX, this.left_paddleY - this.paddle_height / 2, this.paddle_width, this.paddle_height, 8);
 
    this.drawRoundedRect(this.cont, this.left_2paddleX, this.left_2paddleY - this.paddle_height / 2, this.paddle_width, this.paddle_height, 8);

}
drawRplayer()
{
    this.drawRoundedRect(this.cont, this.right_2paddleX, this.right_2paddleY - this.paddle_height / 2, this.paddle_width, this.paddle_height, 8);
 
    this.drawRoundedRect(this.cont, this.right_paddleX, this.right_paddleY - this.paddle_height / 2, this.paddle_width, this.paddle_height, 8);
    
}
drawplayers()
{
    this.cont.fillStyle = '#FF0000';

    this.drawLplayer();
    this.cont.fillStyle = '#006AFF';

    this.drawRplayer();
}
reset_ball() {
    // draw_on_div()
    this.side = 0;
    // this.custo.style.display =
    this.lastResetTime = performance.now(); // Save the current time
    this.isResetting = true; // Set the resetting state
    this.ballx = (this.canvas.width / 2);
    this.bally = (this.canvas.height / 2);

}
update() {

    if (this.isResetting) {
        if (performance.now() - this.lastResetTime >= this.resetDelay) {
            // Perform the reset logic
            this.ballx = this.canvas.width / 2;
            this.bally = this.canvas.height / 2;
            this.ballspeed = 8;
            this.left_paddleY = this.canvas.height / 2;
            this.right_paddleY = this.canvas.height / 2;
            this.left_2paddleY = this.canvas.height / 2;
            this.right_2paddleY = this.canvas.height / 2;
            this.paddle_height = 100;
            this.streak = 0;

            let randomAngleDegrees = Math.random() < 0.5 ? Math.random() * 30 - 30 : Math.random() * 30;
            let randomAngleRadians = randomAngleDegrees * (Math.PI / 180);
            const direction = this.round_winner;

            this.ballspeedX = direction * this.ballspeed * Math.cos(randomAngleRadians);
            this.ballspeedY = this.ballspeed * Math.sin(randomAngleRadians);
            this.isResetting = false; // Reset the state
            this.custoDiv.style.display = 'none';

        }
        return;
    }

    document.addEventListener('keydown', (e) => {
        if (e.code === "ArrowUp") this.isRightUp = true;
        if (e.code === "ArrowDown") this.isRightDown = true;
        if (e.code === "KeyW") this.isLeftW = true;
        if (e.code === "KeyS") this.isLeftS = true;
        if (e.code === "KeyY") this.isLeftY = true;
        if (e.code === "KeyH") this.isLeftH = true;
        if (e.code === "Numpad8") this.isRight8 = true;
        if (e.code === "Numpad5") this.isRight5 = true;
    });

    document.addEventListener('keyup', (e) => {
        if (e.code === "ArrowUp") this.isRightUp = false;
        if (e.code === "ArrowDown") this.isRightDown = false;
        if (e.code === "KeyW") this.isLeftW = false;
        if (e.code === "KeyS") this.isLeftS = false;
        if (e.code === "KeyY") this.isLeftY = false;
        if (e.code === "KeyH") this.isLeftH = false;
        if (e.code === "Numpad8") this.isRight8 = false;
        if (e.code === "Numpad5") this.isRight5 = false;
    });
    this.ballx += this.ballspeedX;
    this.bally += this.ballspeedY;


    if (this.ballx + this.radius >= this.canvas.width) {
        this.scores.increment_rscore();
        this.round_winner = this.RIGHT
        this.reset_ball();
        this.draw_score();
        return;
    }
    if (this.ballx + this.radius < 0) {
        this.scores.increment_lscore();
        this.round_winner = this.LEFT
        this.reset_ball();
        this.draw_score();
        return;
    }

    if (this.bally + 1.5 * this.radius >= this.canvas.height) {
        this.bally = this.canvas.height - 1.5 * this.radius; 
        this.ballspeedY *= -1;
    } else if (this.bally - 1.5 * this.radius <= 0) {
        this.bally = 1.5 * this.radius; 
        this.ballspeedY *= -1;
    }
    if( this.ballx - this.radius > this.left_2paddleX && this.ballx + this.radius < this.right_2paddleX )
    {
        return;
    }
    // if(ballx){
    if (this.ballx + this.radius >= this.right_paddleX && this.ballx - this.radius <= this.right_paddleX + this.paddle_width) {
        if (this.check_colision(this.right_paddleY)) {
            this.ballx = this.right_paddleX - this.radius - this.paddle_width;
            const relativeIntersectY = (this.right_paddleY) - this.bally;
            const normalizedIntersectY = relativeIntersectY / (this.paddle_height / 2);


            const bounceAngle = normalizedIntersectY * 0.75;
            this.ballspeedX = -this.ballspeed * Math.cos(bounceAngle);
            this.ballspeedY = -this.ballspeed * Math.sin(bounceAngle);
            this.streak++;

            if (this.ballspeed <= 15) {

                this.ballspeed *= 1.1
            }
            else {
                this.paddle_height -= 10
            }
            this.side = this.RIGHT;
        }

    }
    else if (this.ballx + this.radius >= this.left_paddleX &&this.ballx - this.radius <= this.left_paddleX + this.paddle_width) {
        if (this.check_colision(this.left_paddleY)) {
            this.ballx = this.left_paddleX + this.paddle_width + this.radius;
            const relativeIntersectY = (this.left_paddleY) - this.bally;
            const normalizedIntersectY = relativeIntersectY / (this.paddle_height / 2);
            const bounceAngle = normalizedIntersectY * 0.75;
            this.ballspeedX = this.ballspeed * Math.cos(bounceAngle);
            this.ballspeedY = -this.ballspeed * Math.sin(bounceAngle);
            this.streak++;
            if (this.ballspeed <= 15) {

                this.ballspeed *= 1.1
            }
            else {
                this.paddle_height -= 10;
            }
            this.side = this.LEFT;

        } 
    }
    else if (this.ballx + this.radius >= this.right_2paddleX && this.ballx - this.radius <= this.right_2paddleX + this.paddle_width) {
        if (this.check_colision(this.right_2paddleY) && this.side == this.RIGHT) {
            this.ballx = this.right_2paddleX - this.radius - this.paddle_width;
            this.ballspeed *= 1.5
            this.ballspeedY *= 1.5;
            this.ballspeedX *= 1.5;
            // ballx += ballspeedX;
            // bally += ballspeedY;
            return;
        }
        else if (this.check_colision(this.right_2paddleY)) {
            this.ballx = this.right_2paddleX - this.radius - this.paddle_width;
            const relativeIntersectY = (this.right_2paddleY) - this.bally;
            const normalizedIntersectY = relativeIntersectY / (this.paddle_height / 2);


            const bounceAngle = normalizedIntersectY * 0.75; 
            this.ballspeedX = -this.ballspeed * Math.cos(bounceAngle);
            this.ballspeedY = -this.ballspeed * Math.sin(bounceAngle);
            this.streak++;

            if (this.ballspeed <= 15) {

                this.ballspeed *= 1.1
            }
            else {
                this.paddle_height -= 10
            }
            this.side = this.RIGHT;
        }

    }
    else if (this.ballx + this.radius >= this.left_2paddleX && this.ballx - this.radius <= this.left_2paddleX + this.paddle_width) {
        if (this.check_colision(this.left_2paddleY) && this.side == this.LEFT) {
            this.ballx = this.left_2paddleX + this.paddle_width + this.radius;
            this.ballspeed *= 1.5
            this.ballspeedY *= 1.5;
            this.ballspeedX *= 1.5;
            // ballx += ballspeedX;
            // bally += ballspeedY;
            return;

        }

        else if (this.check_colision(this.left_2paddleY)) {
            this.ballx = this.left_2paddleX + this.paddle_width + this.radius;
            const relativeIntersectY = (this.left_2paddleY) - this.bally;
            const normalizedIntersectY = relativeIntersectY / (this.paddle_height / 2);
            const bounceAngle = normalizedIntersectY * 0.75;
            this.ballspeedX = this.ballspeed * Math.cos(bounceAngle);
            this.ballspeedY = -this.ballspeed * Math.sin(bounceAngle);
            this.streak++;
            if (this.ballspeed <= 15) {

                this.ballspeed *= 1.1
            }
            else {
                this.paddle_height -= 10;
            }
            this.side = this.LEFT;

        }
    }

}
setupEventListeners() {
    document.addEventListener('keydown', (e) => {
        if (e.code === "ArrowUp") this.isRightUp = true;
        if (e.code === "ArrowDown") this.isRightDown = true;
        if (e.code === "KeyW") this.isLeftW = true;
        if (e.code === "KeyS") this.isLeftS = true;
        if (e.code === "KeyY") this.isLeftY = true;
        if (e.code === "KeyH") this.isLeftH = true;
        if (e.code === "Numpad8") this.isRight8 = true;
        if (e.code === "Numpad5") this.isRight5 = true;
    });

    document.addEventListener('keyup', (e) => {
        if (e.code === "ArrowUp") this.isRightUp = false;
        if (e.code === "ArrowDown") this.isRightDown = false;
        if (e.code === "KeyW") this.isLeftW = false;
        if (e.code === "KeyS") this.isLeftS = false;
        if (e.code === "KeyY") this.isLeftY = false;
        if (e.code === "KeyH") this.isLeftH = false;
        if (e.code === "Numpad8") this.isRight8 = false;
        if (e.code === "Numpad5") this.isRight5 = false;
    });
}
gameLoop() {
    this.updatePaddles();
    this.update();
    this.draw();
    requestAnimationFrame(() => this.gameLoop());
}
draw_board(teams) {
    this.ctx.clearRect(0, 0, this.board.width, this.board.height);
    this.ctx.font = "Bold 40px 'Bai Jamjuree'";
    const text = "Match score";
    const textWidth = this.ctx.measureText(text).width;
    const x = (this.board.width - textWidth) / 2;
    const y = this.board.height - 90;
    // { src: "../imgs/red1.jpg", x: board.width/10+ctx.measureText("Red Team").width+50, y: board.height/8 },
    // { src: "../imgs/red3.jpg", x: board.width/10+ctx.measureText("Red Team").width+imageSize+50, y: board.height/8 },
    const imageSize = 90;
    const images = [
        { src: "../media/red1.jpg", x: this.board.width/8+this.ctx.measureText("Red Team").width+imageSize, y: this.board.height/9 },
        { src: "../media/red3.jpg", x: this.board.width/8+this.ctx.measureText("Red Team").width+2*imageSize, y: this.board.height/9 },
        { src: "../media/blue1.jpg", x: (this.board.width - this.board.width/3)-imageSize, y: this.board.height/9 },
        { src: "../media/blue2.jpg", x: (this.board.width - this.board.width/3)-2*imageSize, y: this.board.height/9 } // hh
    ];

    const self = this; // Save reference to 'this' for use in callback
    images.forEach(imgData => {
        const img = new Image();
        img.src = imgData.src;
        img.onload = function() {
            // Use self.ctx instead of getting context from board
            self.ctx.save();
            self.ctx.beginPath();
            self.ctx.arc(imgData.x + imageSize/2, imgData.y + imageSize/2, imageSize/2, 0, Math.PI * 2);
            self.ctx.clip();
            self.ctx.drawImage(img, imgData.x, imgData.y, imageSize, imageSize);
            self.ctx.restore();
        };
    });

    this.ctx.fillText(text, x, y);
    this.ctx.fillText("constructor", (this.board.width) / 8,this.board.height/6+30);
    this.ctx.fillText("decconstructor", (this.board.width - this.board.width/3), this.board.height/6+30);
    this.ctx.fillText("0", (this.board.width) / 4, y);
    this.ctx.fillText("0", (this.board.width - (this.board.width) / 4), y);
    this.ctx.fillText("VS", (this.board.width - this.ctx.measureText("VS").width) / 2, this.board.height/6);
    this.ctx.fillStyle = "#FF0000";
    this.ctx.fillText("Red Team", this.board.width/8, this.board.height/6);
    this.ctx.fillStyle = "#0000FF";
    this.ctx.fillText("Blue Team", this.board.width - this.board.width/3, this.board.height/6);
    this.ctx.fillStyle = "#000000";
}
draw_score()
{
    // const x = (board.width - textWidth) / 2;
    const y = this.board.height - 90;
    // ctx.clearRect(0 , 0, board.width, board.height);
    // ctx.clearRect(y,(board.width) / 4,1000,1000)
    // ctx.fillText()
    
    this.ctx.clearRect(this.board.width/4,y-40, 100,100)
    // ctx.fillText("HNA", board.width - board.width/4, y-40);
    this.ctx.clearRect(this.board.width - this.board.width/4,y-40, 100,100)

    // ctx.fillText("HNA", board.width/4, y-40);
    // ctx.fillText("HNA", (board.width - ctx.measureText("HNA").width) / 2, 150);

    const left_scorestring = this.scores.l_score.toString();
    const right_scorestring = this.scores.r_score.toString();
    // ctx.fillText(streak, (board.width) / 2, 100);
    this.ctx.fillText(right_scorestring, (this.board.width) / 4, y);
    this.ctx.fillText(left_scorestring, (this.board.width - (this.board.width) / 4), y);
    // ctx.fillText(ballspeed, (board.width) / 2, y+50);

}
}

// Register the training component
customElements.define('multiplayer-mode', Multiplayer);