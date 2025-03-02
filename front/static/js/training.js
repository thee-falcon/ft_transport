// training.js - Keep everything except the Scores class
class TrainingHTML extends HTMLElement {
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

        // Initialize ball properties
        this.streak = 0;
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
            switch (e.code) {
                case "KeyW": this.isLeftW = true; break;
                case "KeyS": this.isLeftS = true; break;
            }
        });
    
        document.addEventListener('keyup', (e) => {
            switch (e.code) {
                case "KeyW": this.isLeftW = false; break;
                case "KeyS": this.isLeftS = false; break;
            }
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
            this.right_paddleY = Math.max((this.paddle_height / 2)+9, this.right_paddleY - paddleSpeed);
        }
        if (this.isRightDown) {
            this.right_paddleY = Math.min((this.canvas.height - this.paddle_height / 2)-9, this.right_paddleY + paddleSpeed);
        }
        if (this.isLeftW) {
            this.left_paddleY = Math.max((this.paddle_height / 2)+9, this.left_paddleY - paddleSpeed);
        }
        if (this.isLeftS) {
            this.left_paddleY = Math.min((this.canvas.height - this.paddle_height / 2)-9, this.left_paddleY + paddleSpeed);
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
    
        const text = getCookie('username');
        const left_scorestring = this.scores.l_score.toString();
        const right_scorestring = this.scores.r_score.toString();
    
        const textWidth = this.ctx.measureText(text).width;
    
        const x = (this.board.width - textWidth) / 2;
        const y = this.board.height - 90;
    
        this.ctx.fillText(text, x, y);
        this.ctx.fillText(right_scorestring, (this.board.width) / 4, y);
        this.ctx.fillText(left_scorestring, (this.board.width - (this.board.width) / 4), y);
        this.ctx.fillText(getCookie('username'), (this.board.width - this.ctx.measureText(getCookie('username')).width) / 2, 150);
        this.ctx.fillText(this.streak, (this.board.width) / 2, 100);
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
        ctx.moveTo(x + borderRadius, y);
        ctx.lineTo(x + width - borderRadius, y);
        ctx.arcTo(x + width, y, x + width, y + borderRadius, borderRadius);
        ctx.lineTo(x + width, y + height - borderRadius);
        ctx.arcTo(x + width, y + height, x + width - borderRadius, y + height, borderRadius);
        ctx.lineTo(x + borderRadius, y + height);
        ctx.arcTo(x, y + height, x, y + height - borderRadius, borderRadius);
        ctx.lineTo(x, y + borderRadius);
        ctx.arcTo(x, y, x + borderRadius, y, borderRadius);
        ctx.closePath();
        ctx.fill();
    }
    
    reset_ball() {
        this.lastResetTime = performance.now();
        this.isResetting = true;
        this.ballx = (this.canvas.width / 2);
        this.bally = (this.canvas.height / 2);
    }
    
    update() {
        if (this.isResetting) {
            if (performance.now() - this.lastResetTime >= this.resetDelay) {
                this.ballx = this.canvas.width / 2;
                this.bally = this.canvas.height / 2;
                this.ballspeed = 8;
                this.left_paddleY = this.canvas.height / 2;
                this.right_paddleY = this.canvas.height / 2;
                this.paddle_height = 100;
                this.streak = 0;
    
                let randomAngleDegrees = Math.random() < 0.5 ? Math.random() * 30 - 30 : Math.random() * 30;
                let randomAngleRadians = randomAngleDegrees * (Math.PI / 180);
                const direction = this.round_winner;
    
                this.ballspeedX = direction * this.ballspeed * Math.cos(randomAngleRadians);
                this.ballspeedY = this.ballspeed * Math.sin(randomAngleRadians);
                this.isResetting = false;
                this.custoDiv.style.display = 'none';
            }
            return;
        }
    
        this.ballx += this.ballspeedX;
        this.bally += this.ballspeedY;
        
        // AI behavior
        if(this.bally >= this.canvas.height / 2) {
            this.isRightDown = true;
            this.isRightUp = false;
        }
        if(this.bally <= this.right_paddleY) {
            this.isRightUp = true;
            this.isRightDown = false;
        }
        
        // Ball out of bounds - scoring
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
    
        // Ball collision with top and bottom walls
        if (this.bally + 1.5 * this.radius >= this.canvas.height) {
            this.bally = this.canvas.height - 1.5 * this.radius;
            this.ballspeedY *= -1;
        } else if (this.bally - 1.5 * this.radius <= 0) {
            this.bally = 1.5 * this.radius;
            this.ballspeedY *= -1;
        }
        
        // Ball collision with right paddle
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
                    this.ballspeed *= 1.1;
                } 
                else {
                    this.paddle_height -= 10;
                }
            }
        }
        
        // Ball collision with left paddle
        if (this.ballx + this.radius >= this.left_paddleX && this.ballx - this.radius <= this.left_paddleX + this.paddle_width) {
            if (this.check_colision(this.left_paddleY)) {
                this.ballx = this.left_paddleX + this.paddle_width + this.radius;
                const relativeIntersectY = (this.left_paddleY) - this.bally;
                const normalizedIntersectY = relativeIntersectY / (this.paddle_height / 2);
                const bounceAngle = normalizedIntersectY * 0.75;
                this.ballspeedX = this.ballspeed * Math.cos(bounceAngle);
                this.ballspeedY = -this.ballspeed * Math.sin(bounceAngle);
                this.streak++;
                if (this.ballspeed <= 15) {
                    this.ballspeed *= 1.1;
                }
                else {
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

// Register the training component
customElements.define('training-component', TrainingHTML);