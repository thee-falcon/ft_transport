class Multiplayer extends HTMLElement {
    constructor() {
        super();
        // Setup game constants
        this.PADDLE_SPEED = 10;
        this.INITIAL_BALL_SPEED = 8;
        this.MAX_BALL_SPEED = 15;
        this.PADDLE_WIDTH = 15;
        this.INITIAL_PADDLE_HEIGHT = 100;
        this.RADIUS = 10;
        this.LEFT = -1;
        this.RIGHT = 1;
        this.RESET_DELAY = 1000; // 3000 mzyana
        
        this.countdownActive = false;
        this.countdownValue = 3;
        this.countdownSound = new Audio('../media/beep.mp3'); // Add sound files
        this.goSound = new Audio('../media/go.mp3');

        // this.gamestandby = this.gamestandby.bind(this);
        this.startgame = this.startgame.bind(this);
        // console.log(getCookie('username'));
        // Initialize null properties that will be set later
        this.canvas = null;
        this.board = null;
        this.custo = null;
        this.ctx = null;
        this.custoctx = null;
        this.cont = null;
        this.custoDiv = null;
        this.finish = null;
                this.images = []; // Property to hold images
        this.imageSize = 300; // Define image size
        this.loadImages(); // Load images during initialization
        
        // Game state
        this.gameState = {
            isResetting: false,
            finished:false,
            lastResetTime: 0,
            round_winner: Math.random() < 0.5 ? -1 : 1,
            streak: 0,
            side: 0
        };
        
        // Ball state
        this.ball = {
            x: 0,
            y: 0,
            speedX: 5,
            speedY: 5,
            speed: this.INITIAL_BALL_SPEED
        };
        
        // Paddle positions
        this.paddles = {
            left: { x: 0, y: 0 },
            right: { x: 0, y: 0 },
            left2: { x: 0, y: 0 },
            right2: { x: 0, y: 0 },
            height: this.INITIAL_PADDLE_HEIGHT
        };
        
        // Input states
        this.input = {
            isRightUp: false,
            isRightDown: false,
            isLeftW: false,
            isLeftS: false,
            isRight8: false,
            isRight5: false,
            isLeftY: false,
            isLeftH: false
        };
        
        // Bind methods to maintain 'this' context
        this.handleStartButtonClick = this.handleStartButtonClick.bind(this);

        this.gameLoop = this.gameLoop.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
    }

    async connectedCallback() {
        this.innerHTML = `
        
        <link rel="stylesheet" href="static/css/test.css">
            <div class="board" id="boardd">
            <canvas id="boardcanva"></canvas>
            <div class="all" id="namess">
            <div class="left">
                <div class="info">
                    <div class="user1">
                        <label class="name1">
                            team 1
                        </label>
                        <input type="text" class="input_player1">
                    </div>
                    <div class="user1">
                        <label class="name1">
                            team 2
                        </label>
                        <input type="text" class="input_player2">
                    </div>
                </div>
            </div>
            <div class="right">
                <button class="start_bt">
                    START
                </button>
            </div>
        </div>
                <div class="game-area" id="game">
                    <canvas id="gamecanvas"></canvas>
                </div>
                <div class="customization" id="custo">
                <button class="finish-button"id="finish">Finish Match</button>
                    <canvas id="custocanvas"></canvas>
                </div>
            </div>
        `;

        this.initializeGame();
        this.setupStartButton();

    }
        loadImages() {
        const imageSources = [
			"../media/red1.jpg",
            "../media/red3.jpg",
            "../media/blue1.jpg",
            "../media/blue2.jpg"
        ];

        this.images = imageSources.map(src => {
            const img = new Image();
            img.src = src;
            return img; // Return the image object
        });
    }

    initializeGame() {
        // Get DOM elements
        this.canvas = document.getElementById('gamecanvas');
        this.board = document.getElementById('boardcanva');
        this.custoDiv = document.getElementById('custo');
        this.custo = document.getElementById('custocanvas');
        this.ctx = this.board.getContext('2d');
        this.custoctx = this.custo.getContext('2d');
        this.cont = this.canvas.getContext('2d');
        this.finish = document.getElementById("finish");
        this.finishinng = document.getElementById("finishing");
        this.aceptiti = document.getElementById("acceptit");
        this.names =  document.getElementById("namess");
        this.custoDiv.style.display = 'none'

//         const canvasWidth = this.custo.width; // Get the width of the canvas
// const canvasHeight = this.custo.height; // Get the height of the canvas

// console.log(`Width: ${canvasWidth}, Height: ${canvasHeight}`);
        // this.custoDiv = document.querySelector('.customization');
        
        // Hide customization div
        // this.custoDiv.style.display = 'none';

        // Set up canvas dimensions
        this.canvas.height = 480;
        this.canvas.width = 1072;
        this.board.height = 900;
        this.board.width = 1400;
        this.custo.height = 480;
        this.custo.width = 1072;

        // Initialize paddle positions
        this.paddles.left.x = 20;
        this.paddles.right.x = this.canvas.width - (20 + this.PADDLE_WIDTH);
        this.paddles.left.y = this.canvas.height / 2;
        this.paddles.right.y = this.canvas.height / 2;
        this.paddles.right2.x = this.canvas.width - this.canvas.width / 4;
        this.paddles.left2.x = this.canvas.width / 4;
        this.paddles.right2.y = this.canvas.height / 2;
        this.paddles.left2.y = this.canvas.height / 2;
        
        // Initialize ball position
        this.resetBallPosition();
        
        // Initialize scores
        this.scores = new Scores();

        // Set up event listeners
        this.setupEventListeners();

        // Start game loop
        this.drawBoard();
        // requestAnimationFrame(this.gameLoop);
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('keyup', this.handleKeyUp);
    }

    setupStartButton() {
        const startButton = this.querySelector('.start_bt');
        if (startButton) {
            startButton.addEventListener('click', this.handleStartButtonClick);
        }
    }



    updateInputFields() {
        const player1Input = this.querySelector('.input_player1');
        const player2Input = this.querySelector('.input_player2');

        if (this.is_tournament) {
            const nextMatchPlayers = JSON.parse(localStorage.getItem("nextMatch"));

            player1Input.value = this.nextMatchPlayer[0];
            player2Input.value = this.nextMatchPlayer[1];
            player1Input.readOnly = true;
            player2Input.readOnly = true;
            player1Input.style.backgroundColor = '#e0e0e0';
            player2Input.style.backgroundColor = '#e0e0e0';
            player1Input.style.color = '#808080';
            player2Input.style.color = '#808080';
        } else {
            player1Input.readOnly = false;
            player2Input.readOnly = false;
            player1Input.style.backgroundColor = '';
            player2Input.style.backgroundColor = '';
            player1Input.style.color = '';
            player2Input.style.color = '';
        }
    }

    handleStartButtonClick() {
        const player1Input = this.querySelector('.input_player1');
        const player2Input = this.querySelector('.input_player2');

        

        if (player1Input && player2Input) {
            this.me = player1Input.value;
            this.op = player2Input.value;

            if (!this.me || !this.op) {
                alert("Please enter names for both players.");
                return;
            }

            console.log("Player 1:", this.me);
            console.log("Player 2:", this.op);
            this.names.style.display = 'none';
            
            this.drawBoard();
            this.startgame();
        }
    }
    
    handleKeyDown(e) {
        switch(e.code) {
            case "ArrowUp": this.input.isRightUp = true; break;
            case "ArrowDown": this.input.isRightDown = true; break;
            case "KeyW": this.input.isLeftW = true; break;
            case "KeyS": this.input.isLeftS = true; break;
            case "KeyY": this.input.isLeftY = true; break;
            case "KeyH": this.input.isLeftH = true; break;
            case "Numpad8": this.input.isRight8 = true; break;
            case "Numpad5": this.input.isRight5 = true; break;
        }
    }
    
    handleKeyUp(e) {
        switch(e.code) {
            case "ArrowUp": this.input.isRightUp = false; break;
            case "ArrowDown": this.input.isRightDown = false; break;
            case "KeyW": this.input.isLeftW = false; break;
            case "KeyS": this.input.isLeftS = false; break;
            case "KeyY": this.input.isLeftY = false; break;
            case "KeyH": this.input.isLeftH = false; break;
            case "Numpad8": this.input.isRight8 = false; break;
            case "Numpad5": this.input.isRight5 = false; break;
        }
    }

    gameLoop() {
        this.updatePaddles();
        if(this.updateBall())
        {
            this.drawEndgame();

            return;
        }
        
        this.drawGame();
        requestAnimationFrame(this.gameLoop);
    }

    
    drawGame() {
        this.cont.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawBall();
        this.drawPlayers();
    }
    
    drawBall() {
        this.cont.beginPath();
        
        // Set ball color based on side
        if (this.gameState.side === this.RIGHT) {
            this.cont.fillStyle = '#006AFF';
        } else if (this.gameState.side === this.LEFT) {
            this.cont.fillStyle = '#FF0000';
        } else {
            this.cont.fillStyle = '#E5F690';
        }
        
        this.cont.arc(this.ball.x, this.ball.y, this.RADIUS, 0, Math.PI * 2);
        this.cont.fill();
        this.cont.closePath();
    }

    updatePaddles() {
        // Left main paddle
        if (this.input.isLeftW) {
            this.paddles.left.y = Math.max((this.paddles.height / 2) + 9, 
                this.paddles.left.y - this.PADDLE_SPEED);
        }
        if (this.input.isLeftS) {
            this.paddles.left.y = Math.min((this.canvas.height - this.paddles.height / 2) - 9, 
                this.paddles.left.y + this.PADDLE_SPEED);
        }
        
        // Right main paddle
        if (this.input.isRightUp) {
            this.paddles.right.y = Math.max((this.paddles.height / 2) + 9, 
                this.paddles.right.y - this.PADDLE_SPEED);
        }
        if (this.input.isRightDown) {
            this.paddles.right.y = Math.min((this.canvas.height - this.paddles.height / 2) - 9, 
                this.paddles.right.y + this.PADDLE_SPEED);
        }
        
        // Left secondary paddle
        if (this.input.isLeftY) {
            this.paddles.left2.y = Math.max((this.canvas.height / 4) + (this.paddles.height / 2), 
                this.paddles.left2.y - this.PADDLE_SPEED);
        }
        if (this.input.isLeftH) {
            this.paddles.left2.y = Math.min((3 * this.canvas.height / 4 - this.paddles.height / 2), 
                this.paddles.left2.y + this.PADDLE_SPEED);
        }
        
        // Right secondary paddle
        if (this.input.isRight8) {
            this.paddles.right2.y = Math.max((this.canvas.height / 4) + (this.paddles.height / 2), 
                this.paddles.right2.y - this.PADDLE_SPEED);
        }
        if (this.input.isRight5) {
            this.paddles.right2.y = Math.min((3 * this.canvas.height / 4 - this.paddles.height / 2), 
                this.paddles.right2.y + this.PADDLE_SPEED);
        }
    }

    startCountdown() {
        this.countdownActive = true;
        this.countdownValue = 3;
        this.playCountdownSound();
        if (this.countdownActive) {
            this.cont.fillStyle = '#e4c1b9';
            this.cont.font = 'bold 150px Bai Jamjuree';
            this.cont.textAlign = 'center';
            this.cont.textBaseline = 'middle';
            this.cont.fillText(this.countdownValue.toString(),
                this.canvas.width / 2,
                this.canvas.height / 2);
        }
        const countdownInterval = setInterval(() => {
            this.countdownValue--;

            if (this.countdownValue > 0) {
                this.cont.clearRect(0, 0, this.canvas.width, this.canvas.height);

                this.cont.fillText(this.countdownValue.toString(),
                    this.canvas.width / 2,
                    this.canvas.height / 2);
                this.playCountdownSound();
            } else {
                this.playGoSound();
                this.countdownActive = false;
                clearInterval(countdownInterval);
                this.gameLoop(); // Start actual game loop
            }
        }, 1000);
    }
    playCountdownSound() {
        if (this.countdownSound) {
            this.countdownSound.currentTime = 0;
            this.countdownSound.play();
        }
    }

    playGoSound() {
        if (this.goSound) {
            this.goSound.currentTime = 0;
            this.goSound.play();
        }
    }


    startgame() {
        this.startCountdown();


        // this.gameLoop();
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
    
    drawPlayers() {
        // Draw left paddles (red)
        this.cont.fillStyle = '#FF0000';
        this.drawRoundedRect(
            this.cont, 
            this.paddles.left.x, 
            this.paddles.left.y - this.paddles.height / 2, 
            this.PADDLE_WIDTH, 
            this.paddles.height, 
            8
        );
        this.drawRoundedRect(
            this.cont, 
            this.paddles.left2.x, 
            this.paddles.left2.y - this.paddles.height / 2, 
            this.PADDLE_WIDTH, 
            this.paddles.height, 
            8
        );
        
        // Draw right paddles (blue)
        this.cont.fillStyle = '#006AFF';
        this.drawRoundedRect(
            this.cont, 
            this.paddles.right.x, 
            this.paddles.right.y - this.paddles.height / 2, 
            this.PADDLE_WIDTH, 
            this.paddles.height, 
            8
        );
        this.drawRoundedRect(
            this.cont, 
            this.paddles.right2.x, 
            this.paddles.right2.y - this.paddles.height / 2, 
            this.PADDLE_WIDTH, 
            this.paddles.height, 
            8
        );
    }
    
    resetBallPosition() {
        this.ball.x = this.canvas.width / 2;
        this.ball.y = this.canvas.height / 2;
    }
    
    resetBall() {
        this.gameState.side = 0;
        this.gameState.lastResetTime = performance.now();
        this.gameState.isResetting = true;
        this.resetBallPosition();
    }
    endgame()
    {
        this.gameState.finished = true;
    }
    
    updateBall() {
        // Handle reset state
        if (this.gameState.isResetting) {
            if (performance.now() - this.gameState.lastResetTime >= this.RESET_DELAY) {
                this.resetBallPosition();
                this.ball.speed = this.INITIAL_BALL_SPEED;
                this.paddles.left.y = this.canvas.height / 2;
                this.paddles.right.y = this.canvas.height / 2;
                this.paddles.left2.y = this.canvas.height / 2;
                this.paddles.right2.y = this.canvas.height / 2;
                this.paddles.height = this.INITIAL_PADDLE_HEIGHT;
                this.gameState.streak = 0;

                // Set random angle for ball
                let randomAngleDegrees = Math.random() < 0.5 ? Math.random() * 30 - 30 : Math.random() * 30;
                let randomAngleRadians = randomAngleDegrees * (Math.PI / 180);
                
                // Set direction based on round winner
                this.ball.speedX = this.gameState.round_winner * this.ball.speed * Math.cos(randomAngleRadians);
                this.ball.speedY = this.ball.speed * Math.sin(randomAngleRadians);
                
                this.gameState.isResetting = false;
                // this.custoDiv.style = 'none';
            }
            return;
        }
        else if(this.gameState.finished)
        {
            return (1);
        }

        // Update ball position
        this.ball.x += this.ball.speedX;
        this.ball.y += this.ball.speedY;

        // Check for scoring (ball goes off screen)
        if (this.ball.x + this.RADIUS >= this.canvas.width) {
            this.scores.increment_rscore();
            // this.scores.increment_rscore();
            // this.scores.increment_rscore();
            // this.scores.increment_rscore();
            // this.scores.increment_rscore();
        // this.gameState.finished = 1; // hada ghir debug

        if (this.scores.r_score >= 3){
                this.endgame();

            }
            this.gameState.round_winner = this.RIGHT;
            this.resetBall();
            this.drawScore();
            
            return;
        }
        if (this.ball.x - this.RADIUS <= 0) {
            this.scores.increment_lscore();
            // this.scores.increment_lscore();
            // this.scores.increment_lscore();
            // this.scores.increment_lscore();
            // this.scores.increment_lscore();
            if (this.scores.l_score >= 3){
                this.endgame();
            }
            this.gameState.round_winner = this.LEFT;
            this.resetBall();
            this.drawScore();
            return;
        }

        // Ball hitting top or bottom of screen
        if (this.ball.y + 1.5 * this.RADIUS >= this.canvas.height) {
            this.ball.y = this.canvas.height - 1.5 * this.RADIUS;
            this.ball.speedY *= -1;
        } else if (this.ball.y - 1.5 * this.RADIUS <= 0) {
            this.ball.y = 1.5 * this.RADIUS;
            this.ball.speedY *= -1;
        }
        
        // Skip collision detection if ball is in the middle area
        if (this.ball.x - this.RADIUS > this.paddles.left2.x && 
            this.ball.x + this.RADIUS < this.paddles.right2.x) {
            return;
        }
        
        this.handlePaddleCollisions();
    }
    
    handlePaddleCollisions() {
        // Check for collision with main right paddle
        if (this.ball.x + this.RADIUS >= this.paddles.right.x && 
            this.ball.x - this.RADIUS <= this.paddles.right.x + this.PADDLE_WIDTH) {
            if (this.checkCollision(this.paddles.right.y)) {
                this.ball.x = this.paddles.right.x - this.RADIUS - this.PADDLE_WIDTH;
                this.handleBounce(this.paddles.right.y, this.RIGHT);
            }
        }
        // Check for collision with main left paddle
        else if (this.ball.x - this.RADIUS <= this.paddles.left.x + this.PADDLE_WIDTH && 
                 this.ball.x + this.RADIUS >= this.paddles.left.x) {
            if (this.checkCollision(this.paddles.left.y)) {
                this.ball.x = this.paddles.left.x + this.PADDLE_WIDTH + this.RADIUS;
                this.handleBounce(this.paddles.left.y, this.LEFT);
            }
        }
        // Check for collision with secondary right paddle
        else if (this.ball.x + this.RADIUS >= this.paddles.right2.x && 
                 this.ball.x - this.RADIUS <= this.paddles.right2.x + this.PADDLE_WIDTH) {
            if (this.checkCollision(this.paddles.right2.y)) {
                // Special boost if already hit by right side
                if (this.gameState.side === this.RIGHT) {
                    this.ball.x = this.paddles.right2.x - this.RADIUS - this.PADDLE_WIDTH;
                    this.ball.speed *= 1.5;
                    this.ball.speedY *= 1.5;
                    this.ball.speedX *= 1.5;
                    return;
                } else {
                    this.ball.x = this.paddles.right2.x - this.RADIUS - this.PADDLE_WIDTH;
                    this.handleBounce(this.paddles.right2.y, this.RIGHT);
                }
            }
        }
        // Check for collision with secondary left paddle
        else if (this.ball.x - this.RADIUS <= this.paddles.left2.x + this.PADDLE_WIDTH && 
                 this.ball.x + this.RADIUS >= this.paddles.left2.x) {
            if (this.checkCollision(this.paddles.left2.y)) {
                // Special boost if already hit by left side
                if (this.gameState.side === this.LEFT) {
                    this.ball.x = this.paddles.left2.x + this.PADDLE_WIDTH + this.RADIUS;
                    this.ball.speed *= 1.5;
                    this.ball.speedY *= 1.5;
                    this.ball.speedX *= 1.5;
                    return;
                } else {
                    this.ball.x = this.paddles.left2.x + this.PADDLE_WIDTH + this.RADIUS;
                    this.handleBounce(this.paddles.left2.y, this.LEFT);
                }
            }
        }
    }
    
    handleBounce(paddleY, side) {
        // Calculate bounce angle based on where the ball hit the paddle
        const relativeIntersectY = paddleY - this.ball.y;
        const normalizedIntersectY = relativeIntersectY / (this.paddles.height / 2);
        const bounceAngle = normalizedIntersectY * 0.75;
        
        // Set ball velocity based on side
        if (side === this.LEFT) {
            this.ball.speedX = this.ball.speed * Math.cos(bounceAngle);
            this.ball.speedY = -this.ball.speed * Math.sin(bounceAngle);
        } else {
            this.ball.speedX = -this.ball.speed * Math.cos(bounceAngle);
            this.ball.speedY = -this.ball.speed * Math.sin(bounceAngle);
        }
        
        // Increase difficulty
        this.gameState.streak++;
        if (this.ball.speed <= this.MAX_BALL_SPEED) {
            this.ball.speed *= 1.1;
        } else {
            this.paddles.height -= 10;
        }
        
        // Set side for color tracking
        this.gameState.side = side;
    }
    
    checkCollision(paddleY) {
        const paddleTop = paddleY - this.paddles.height / 2;
        const paddleBottom = paddleY + this.paddles.height / 2;
        return this.ball.y >= paddleTop && this.ball.y <= paddleBottom;
    }
    drawInitialBoard() { //draw the board without the names
        this.ctx.clearRect(0, 0, this.board.width, this.board.height);
        this.ctx.font = "Bold 40px 'Bai Jamjuree'";

        // Draw title text
        const text = "Match score";
        const textWidth = this.ctx.measureText(text).width;
        const x = (this.board.width - textWidth) / 2;
        const y = this.board.height - 90;

        // Set up player images
        const imageSize = 90;
        const images = [
            { src: "../media/red1.jpg", x: this.board.width / 8 + this.ctx.measureText("Red Team").width + imageSize, y: this.board.height / 9 },
            { src: "../media/red3.jpg", x: this.board.width / 8 + this.ctx.measureText("Red Team").width + 2 * imageSize, y: this.board.height / 9 },
            { src: "../media/blue1.jpg", x: (this.board.width - this.board.width / 3) - imageSize, y: this.board.height / 9 },
            { src: "../media/blue2.jpg", x: (this.board.width - this.board.width / 3) - 2 * imageSize, y: this.board.height / 9 }
        ];

        // Load and draw circular images
        images.forEach(imgData => {
            const img = new Image();
            img.src = imgData.src;
            img.onload = () => {
                this.ctx.save();
                this.ctx.beginPath();
                this.ctx.arc(imgData.x + imageSize / 2, imgData.y + imageSize / 2, imageSize / 2, 0, Math.PI * 2);
                this.ctx.clip();
                this.ctx.drawImage(img, imgData.x, imgData.y, imageSize, imageSize);
                this.ctx.restore();
            };
        });

        // Draw scoreboard text
        this.ctx.fillText(text, x, y);
        this.ctx.fillText("Team 1", (this.board.width) / 8, this.board.height / 6 + 30); // Place holder names
        this.ctx.fillText("Team 2", (this.board.width - this.board.width / 3), this.board.height / 6 + 30); // Place holder names
        this.ctx.fillText("0", (this.board.width) / 4, y);
        this.ctx.fillText("0", (this.board.width - (this.board.width) / 4), y);
        this.ctx.fillText("VS", (this.board.width - this.ctx.measureText("VS").width) / 2, this.board.height / 6);

        // Draw team names with colors
        this.ctx.fillStyle = "#FF0000";
        this.ctx.fillText("Red Team", this.board.width / 8, this.board.height / 6);
        this.ctx.fillStyle = "#0000FF";
        this.ctx.fillText("Blue Team", this.board.width - this.board.width / 3, this.board.height / 6);
        this.ctx.fillStyle = "#000000";
    }
    
    drawBoard() {
        this.ctx.clearRect(0, 0, this.board.width, this.board.height);
        this.ctx.font = "Bold 40px 'Bai Jamjuree'";
        
        // Draw title text
        const text = "Match score";
        const textWidth = this.ctx.measureText(text).width;
        const x = (this.board.width - textWidth) / 2;
        const y = this.board.height - 90;
        
        // Set up player images
        const imageSize = 90;
        const images = [
            { src: "../media/red1.jpg", x: this.board.width/8+this.ctx.measureText("Red Team").width+imageSize, y: this.board.height/9 },
            { src: "../media/red3.jpg", x: this.board.width/8+this.ctx.measureText("Red Team").width+2*imageSize, y: this.board.height/9 },
            { src: "../media/blue1.jpg", x: (this.board.width - this.board.width/3)-imageSize, y: this.board.height/9 },
            { src: "../media/blue2.jpg", x: (this.board.width - this.board.width/3)-2*imageSize, y: this.board.height/9 }
        ];

        // Load and draw circular images
        images.forEach(imgData => {
            const img = new Image();
            img.src = imgData.src;
            img.onload = () => {
                this.ctx.save();
                this.ctx.beginPath();
                this.ctx.arc(imgData.x + imageSize/2, imgData.y + imageSize/2, imageSize/2, 0, Math.PI * 2);
                this.ctx.clip();
                this.ctx.drawImage(img, imgData.x, imgData.y, imageSize, imageSize);
                this.ctx.restore();
            };
        });

        // Draw scoreboard text
        this.ctx.fillText(text, x, y);
        this.ctx.fillText(this.me, (this.board.width) / 8, this.board.height/6+30); // hadi li khasha tbdl
        this.ctx.fillText(this.op, (this.board.width - this.board.width/3), this.board.height/6+30);
        this.ctx.fillText("0", (this.board.width) / 4, y);
        this.ctx.fillText("0", (this.board.width - (this.board.width) / 4), y);
        this.ctx.fillText("VS", (this.board.width - this.ctx.measureText("VS").width) / 2, this.board.height/6);
        
        // Draw team names with colors
        this.ctx.fillStyle = "#FF0000";
        this.ctx.fillText("Red Team", this.board.width/8, this.board.height/6);
        this.ctx.fillStyle = "#0000FF";
        this.ctx.fillText("Blue Team", this.board.width - this.board.width/3, this.board.height/6);
        this.ctx.fillStyle = "#000000";
    }
    
    drawScore() {
        const y = this.board.height - 90;
        
        // Clear previous scores
        this.ctx.clearRect(this.board.width/4, y-40, 100, 100);
        this.ctx.clearRect(this.board.width - this.board.width/4, y-40, 100, 100);

        // Draw updated scores
        const left_scorestring = this.scores.l_score.toString();
        const right_scorestring = this.scores.r_score.toString();
        this.ctx.fillText(right_scorestring, (this.board.width) / 4, y);
        this.ctx.fillText(left_scorestring, (this.board.width - (this.board.width) / 4), y);
    }
    async sendscoreandfinish()
    {
        // const response = await fetch("http://localhost:8000/set_user_stats/", {
        //     method: "POST",
        //     headers: {

        //     },
        //     credentials: "include"
        // });
        window.location.hash = "home"
        // console.log("miiiiw");
    }
    drawEndgame() {
        this.ctx.clearRect(0, 0, this.board.width, this.board.height);
        this.custoDiv.style.display = 'flex';
        this.custoctx.clearRect(0, 0, this.custo.width, this.custo.height);
    
        // Determine winning team and set images accordingly
        let imagesToDraw;
        const right_score = this.scores.r_score;
        const left_score = this.scores.l_score;

        if (this.scores.l_score > this.scores.r_score) {
            console.log("rb7o zr9in");
            imagesToDraw = [
                { img: this.images[2], x: (this.custo.width / 4) - (this.imageSize / 2), y: this.custo.height / 4 }, // Center in left half
                { img: this.images[3], x: (3 * this.custo.width / 4) - (this.imageSize / 2), y: this.custo.height / 4 } // Center in right half
            ];
             this.ctx.fillStyle = "#0000FF";
             this.ctx.fillText("👑👑 Blue Team won! 👑👑", (this.board.width - this.ctx.measureText("👑👑 Blue Team won! 👑👑").width) / 2, this.board.height/6);
            //  this.ctx.fillText(`${this.scores.lscore}-${this.scores.rscore}`, (this.board.width - this.ctx.measureText(`${this.scores.lscore}-${this.scores.rscore}`).width) / 2, this.board.height/6);
            this.ctx.fillText(`${left_score}-${right_score}`, (this.board.width - this.ctx.measureText(`${left_score}-${right_score}`).width) / 2, this.board.height/5+20);
            
             this.ctx.fillStyle = "#000000";
        
            } else {

            console.log("rb7o 7mrin");
            imagesToDraw = [
                { img: this.images[0], x: (this.custo.width / 4) - (this.imageSize / 2), y: this.custo.height / 4 }, // Center in left half
                { img: this.images[1], x: (3 * this.custo.width / 4) - (this.imageSize / 2), y: this.custo.height / 4 } // Center in right half
            ];
            this.ctx.fillStyle = "#FF0000";
            this.ctx.fillText("👑👑 Red Team won! 👑👑", (this.board.width - this.ctx.measureText("👑👑 Red Team won! 👑👑").width) / 2, this.board.height/6);
            this.ctx.fillText(`${left_score}-${right_score}`, (this.board.width - this.ctx.measureText(`${left_score}-${right_score}`).width) / 2, this.board.height/5+20);
            
            this.ctx.fillStyle = "#000000";

        }
        imagesToDraw.forEach(imgData => {
            this.custoctx.save();
            this.custoctx.beginPath();
            this.custoctx.arc(imgData.x + this.imageSize / 2, imgData.y + this.imageSize / 2, this.imageSize / 2, 0, Math.PI * 2);
            this.custoctx.clip();
            this.custoctx.drawImage(imgData.img, imgData.x, imgData.y, this.imageSize, this.imageSize);
            this.custoctx.restore();
            
        });
        
        this.finish.addEventListener("click",this.sendscoreandfinish)
        console.log(this.custo.width);
        console.log(this.custo.height);
    }
}

// Register the component
customElements.define('multiplayer-mode', Multiplayer);

