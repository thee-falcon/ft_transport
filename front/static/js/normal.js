class NormalMode extends HTMLElement {
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
		<link rel="stylesheet" href="static/css/test.css">
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
        this.paddle_height = 200;
        this.paddle_width = 15;
        this.left_paddleX = 20;
        this.right_paddleX = this.canvas.width - (20 + this.paddle_width);
        this.left_paddleY = this.canvas.height / 2;
        this.right_paddleY = this.canvas.height / 2;

        // Initialize ball properties
        // this.streak = 0;
        this.ballx = (this.canvas.width / 2);
        this.bally = (this.canvas.height / 2);
        this.ballspeedX = 5;
        this.ballspeedY = 5;
        this.ballspeed = 8;
        this.radius = 10;

        // Initialize control flags
        this.isRightUp = false;
        this.isRightDown = false;
        this.isLeftW = false;
        this.isLeftS = false;

        // Initialize scores - using the shared Scores class
        this.scores = new Scores();

        // Set up event listeners
        this.setupEventListeners();

        // Start game loop
        this.gameLoop();
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.code === "ArrowUp") this.isRightUp = true;
            if (e.code === "ArrowDown") this.isRightDown = true;
            if (e.code === "KeyW") this.isLeftW = true;
            if (e.code === "KeyS") this.isLeftS = true;
        });

        document.addEventListener('keyup', (e) => {
            if (e.code === "ArrowUp") this.isRightUp = false;
            if (e.code === "ArrowDown") this.isRightDown = false;
            if (e.code === "KeyW") this.isLeftW = false;
            if (e.code === "KeyS") this.isLeftS = false;
        });
    }

    check_colision(posy) {
        const paddleTop = posy - this.paddle_height / 2;
        const paddleBottom = posy + this.paddle_height / 2;
        if (this.bally >= paddleTop && this.bally <= paddleBottom) {
            return true;
        }
        return false;
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
    }
    
    draw() {
        this.cont.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.cont.fillStyle = '#E5F690FF';
        this.drawball();
        this.drawRoundedRect(this.cont, this.left_paddleX, this.left_paddleY - this.paddle_height / 2, this.paddle_width, this.paddle_height, 8);
        this.drawRoundedRect(this.cont, this.right_paddleX, this.right_paddleY - this.paddle_height / 2, this.paddle_width, this.paddle_height, 8);
        this.draw_board();
    }
    
    draw_board() {
        this.ctx.clearRect(0, 0, this.board.width, this.board.height);
        this.ctx.font = "Bold 40px 'Bai Jamjuree'";
    
        const text = "Match score";
        const left_scorestring = this.scores.l_score.toString();
        const right_scorestring = this.scores.r_score.toString();
    
        const textWidth = this.ctx.measureText(text).width;
    
        const x = (this.board.width - textWidth) / 2;
        const y = this.board.height - 90;
    
        this.ctx.fillText(text, x, y);
        this.ctx.fillText(right_scorestring, (this.board.width) / 4, y);
        this.ctx.fillText(left_scorestring, (this.board.width - (this.board.width) / 4), y);
        this.ctx.fillText("VS", (this.board.width - this.ctx.measureText("VS").width) / 2, 150);
        this.ctx.fillText(this.ballspeed, (this.board.width) / 2, y+50);
        this.ctx.fillText(this.paddle_height, ((this.board.width) / 2)-150, y+50);
    }
    
    drawball() {
        this.cont.beginPath();
        this.cont.arc(this.ballx, this.bally, this.radius, 0, Math.PI * 2);
        this.cont.fill();
        this.cont.closePath();
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
    
    reset_ball() {
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
                this.paddle_height = 200;
                // this.streak = 0;
    
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
        });
    
        document.addEventListener('keyup', (e) => {
            if (e.code === "ArrowUp") this.isRightUp = false;
            if (e.code === "ArrowDown") this.isRightDown = false;
            if (e.code === "KeyW") this.isLeftW = false;
            if (e.code === "KeyS") this.isLeftS = false;
        });
    
        this.ballx += this.ballspeedX;
        this.bally += this.ballspeedY;
    
        
        if (this.ballx + this.radius >= this.canvas.width) {
            this.scores.increment_rscore();
            this.round_winner = this.RIGHT;
            this.reset_ball();
            return;
        }
        if (this.ballx + this.radius < 0) {
            this.scores.increment_lscore();
            this.round_winner = this.LEFT;
            this.reset_ball();
            return;
        }
    
        if (this.bally + 1.5 * this.radius >= this.canvas.height) {
            this.bally = this.canvas.height - 1.5 * this.radius; // Reposition outside the boundary
            this.ballspeedY *= -1;
        } else if (this.bally - 1.5 * this.radius <= 0) {
            this.bally = 1.5 * this.radius; // Reposition outside the boundary
            this.ballspeedY *= -1;
        }
    
        if (this.ballx + this.radius >= this.right_paddleX && this.ballx - this.radius <= this.right_paddleX + this.paddle_width) {
            if (this.check_colision(this.right_paddleY)) {
                this.ballx = this.right_paddleX - this.radius - this.paddle_width;
                const relativeIntersectY = this.right_paddleY - this.bally;
                const normalizedIntersectY = relativeIntersectY / (this.paddle_height / 2);
    
                const bounceAngle = normalizedIntersectY * 0.75;
                this.ballspeedX = -this.ballspeed * Math.cos(bounceAngle);
                this.ballspeedY = -this.ballspeed * Math.sin(bounceAngle);
                this.streak++;
    
                if (this.ballspeed <= 15) {
                    this.ballspeed *= 1.1;
                } else {
                    this.paddle_height -= 10;
                }
            }
        }
    
        if (this.ballx + this.radius >= this.left_paddleX && this.ballx - this.radius <= this.left_paddleX + this.paddle_width) {
            if (this.check_colision(this.left_paddleY)) {
                this.ballx = this.left_paddleX + this.paddle_width + this.radius;
                const relativeIntersectY = this.left_paddleY - this.bally;
                const normalizedIntersectY = relativeIntersectY / (this.paddle_height / 2);
                const bounceAngle = normalizedIntersectY * 0.75;
                this.ballspeedX = this.ballspeed * Math.cos(bounceAngle);
                this.ballspeedY = -this.ballspeed * Math.sin(bounceAngle);
                this.streak++;
    
                if (this.ballspeed <= 15) {
                    this.ballspeed *= 1.1;
                } else {
                    this.paddle_height -= 10;
                }
            }
        }
    }
    

    gameLoop() {
        this.updatePaddles();
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Register the normal mode component
customElements.define('normal-mode', NormalMode);