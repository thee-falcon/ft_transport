class OfflineMode extends HTMLElement {
    constructor() {
        super();
        this.canvas = null;
        this.board = null;
        this.custo = null;
        this.ctx = null;
        this.custoctx = null;
        this.cont = null;
        this.custoDiv = null;
        this.custoDiv = null;
        this.finish = null;
        this.finishinng = null;
        this.aceptiti = null;

        this.numberofplayer = 1;
        this.countdownActive = false;
        this.countdownValue = 3;
        this.countdownSound = new Audio('../media/beep.mp3'); // Add sound files
        this.goSound = new Audio('../media/go.mp3');

        this.gamestandby = this.gamestandby.bind(this);
        this.startgame = this.startgame.bind(this);
        this.op = null;
        this.me = null;
        this.win = null;
        this.lose = null;
        this.lastwinner = null;
        this.is_tournament = null;
        this.nextMatchPlayer = null;
        this.is_secondmatch = false;
        this.is_finale = false;

        this.handleStartButtonClick = this.handleStartButtonClick.bind(this);
        // this.hh = this.hh.bind(this);
    }
   async type_definer()
    {
        this.nextMatchPlayer = JSON.parse(localStorage.getItem("nextMatch"));

        if(this.nextMatchPlayer != null)
        {
            this.is_tournament = "true";
        }
        console.log(this.nextMatchPlayer);
        const last_winner = JSON.parse(localStorage.getItem("onewinner"));
        const last_2winner = JSON.parse(localStorage.getItem("twowinner"));
        console.log("last winner is " , last_winner)
        if(last_winner != null )
        {
            this.is_secondmatch = true;
        }
        if(last_2winner != null )
        {
            this.is_finale = true;
        }


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
                        Player 1
                    </label>
                    <input type="text" class="input_player1">
                </div>
                <div class="user1">
                    <label class="name1">
                        Player 2
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
        this.type_definer();
        this.updateInputFields();
    }

    initializeGame() {


        this.storedUserData = JSON.parse(localStorage.getItem('userData'));
        // this.me = this.storedUserData.username;
        // this.op = await this.hasInviteForMe(this.me)
        // this.op = localStorage.getItem('opponentUsername');
        // console.log(this.op);


        this.images = []; // Property to hold images
        this.imageSize = 300; // Define image size
        this.loadImages(); // Load images during initialization


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
        // Hide customization div

        // Set up canvas dimensions
        this.finished = false;

        this.canvas.height = 480;
        this.canvas.width = 1072;
        this.board.height = 900;
        this.board.width = 1400;
        this.custo.height = 480;
        this.custo.width = 1072;

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

        // this.startgame();
        // this.gameLoop();
        // this.finishinng.addEventListener("click",this.gamestandby);
        // this.aceptiti.addEventListener("click",this.hh);


        this.gamestandby()
        // Start game loop
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

            this.startgame();
        }
    }


    async gamestandby()
    {
    //    khawi
    // await this.type_definer();
        // console.log(this.nextMatchPlayer);
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
        // this.drawBoard();


        // this.gameLoop();
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
            this.right_paddleY = Math.max((this.paddle_height / 2) + 5, this.right_paddleY - paddleSpeed);
        }
        if (this.isRightDown) {
            this.right_paddleY = Math.min((this.canvas.height - this.paddle_height / 2) - 5, this.right_paddleY + paddleSpeed);
        }
        if (this.isLeftW) {
            this.left_paddleY = Math.max((this.paddle_height / 2) + 5, this.left_paddleY - paddleSpeed);
        }
        if (this.isLeftS) {
            this.left_paddleY = Math.min((this.canvas.height - this.paddle_height / 2) - 5, this.left_paddleY + paddleSpeed);
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

        // Draw title text
        const text = "Match score";
        const textWidth = this.ctx.measureText(text).width;
        const x = (this.board.width - textWidth) / 2;
        const y = this.board.height - 90;

        const left_scorestring = this.scores.l_score.toString();
        const right_scorestring = this.scores.r_score.toString();
        // Set up player images
        // const imageSize = 90;
        // const images = [
        //     { src: "../media/badge1.png", x: this.board.width/8+this.ctx.measureText("Red Team").width+imageSize, y: this.board.height/9 },
        //     { src: "../media/badge2.png", x: this.board.width/8+this.ctx.measureText("Red Team").width+2*imageSize, y: this.board.height/9 },
        //     { src: "../media/blue1.jpg", x: (this.board.width - this.board.width/3)-imageSize, y: this.board.height/9 },
        //     { src: "../media/blue2.jpg", x: (this.board.width - this.board.width/3)-2*imageSize, y: this.board.height/9 }
        // ];

        // Load and draw circular images
        // images.forEach(imgData => {
        //     const img = new Image();
        //     img.src = imgData.src;
        //     img.onload = () => {
        //         this.ctx.save();
        //         this.ctx.beginPath();
        //         this.ctx.arc(imgData.x + imageSize/2, imgData.y + imageSize/2, imageSize/2, 0, Math.PI * 2);
        //         this.ctx.clip();
        //         this.ctx.drawImage(img, imgData.x, imgData.y, imageSize, imageSize);
        //         this.ctx.restore();
        //     };
        // });

        // Draw scoreboard text
        // const op = this.hasInviteForMe(this.storedUserData.username);
        // console.log(this.hasInviteForMe(this.storedUserData.username));

        this.ctx.fillText(text, x, y);
        this.ctx.fillText(this.me, (this.board.width) / 8, this.board.height / 6 + 30);
        this.ctx.fillText(this.op, (this.board.width - this.board.width / 3), this.board.height / 6 + 30);
        this.ctx.fillText(right_scorestring, (this.board.width) / 4, y);
        this.ctx.fillText(left_scorestring, (this.board.width - (this.board.width) / 4), y);
        this.ctx.fillText("VS", (this.board.width - this.ctx.measureText("VS").width) / 2, this.board.height / 6);

        // Draw team names with colors
        this.ctx.fillStyle = "#FF0000";
        this.ctx.fillText("Red Team", this.board.width / 8, this.board.height / 6);
        this.ctx.fillStyle = "#0000FF";
        this.ctx.fillText("Blue Team", this.board.width - this.board.width / 3, this.board.height / 6);
        this.ctx.fillStyle = "#000000";
    }
    async hasInviteForMe(myUsername) { // null
        try {
            const invitesData = await JSON.parse(localStorage.getItem('the-invites'));

            if (!invitesData || !invitesData.invites || !Array.isArray(invitesData.invites)) {
                return null;
            }

            // Find an invite where the receiver is you (myUsername) and you are the receiver
            const invite = invitesData.invites.find(invite =>
                invite.receiver === myUsername && invite.is_receiver === true
            );

            // Return the sender's name if found, otherwise null
            return invite ? invite.sender : null;
        } catch (error) {
            console.error("Error checking invites:", error);
            return null;
        }
    }
    drawScore() {
        const y = this.board.height - 90;
        
        // Clear previous scores
        this.ctx.clearRect(this.board.width/4, y-40, 100, 100);
        this.ctx.clearRect(this.board.width - this.board.width/4, y-40, 100, 100);

        // Draw updated scores
        // const left_scorestring = this.scores.l_score.toString();
        // const right_scorestring = this.scores.r_score.toString();
        // this.ctx.fillText(right_scorestring, (this.board.width) / 4, y);
        // this.ctx.fillText(left_scorestring, (this.board.width - (this.board.width) / 4), y);
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

    loadImages() { // khani liks 
        const imageSources = [
            "../media/badge1.png",
            "../media/badge2.png",
        ];

        this.images = imageSources.map(src => {
            const img = new Image();
            img.src = src;
            return img; // Return the image object
        });
    }

    allImagesLoaded() {
        return this.imageLoadedCount === this.imageSources.length;
    }

    endgame() {
        this.finished = true;
    }

    update() {

        if (this.countdownActive) {
            return; // Don't update ball position during countdown
        }
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
        else if (this.finished) {
            return (1);
        }
        // document.addEventListener('keydown', (e) => {
        //     if (e.code === "ArrowUp") this.isRightUp = true;
        //     if (e.code === "ArrowDown") this.isRightDown = true;
        //     if (e.code === "KeyW") this.isLeftW = true;
        //     if (e.code === "KeyS") this.isLeftS = true;
        // });

        // document.addEventListener('keyup', (e) => {
        //     if (e.code === "ArrowUp") this.isRightUp = false;
        //     if (e.code === "ArrowDown") this.isRightDown = false;
        //     if (e.code === "KeyW") this.isLeftW = false;
        //     if (e.code === "KeyS") this.isLeftS = false;
        // });

        this.ballx += this.ballspeedX;
        this.bally += this.ballspeedY;


        if (this.ballx + this.radius >= this.canvas.width) {
            this.scores.increment_rscore();

            if (this.scores.r_score >= 3) {
                this.endgame();

            }
            this.round_winner = this.RIGHT;
            this.reset_ball();
            this.drawScore();
            return;
        }
        if (this.ballx + this.radius < 0) {
            this.scores.increment_lscore();

            if (this.scores.l_score >= 3 ) {
                this.endgame();
            }
            this.round_winner = this.LEFT;
            this.reset_ball();
            this.drawScore();
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
    // async sendscoreandfinish()
    // {
    //     const response = await fetch("http://localhost:8000/set_user_stats/", {
    //         method: "POST",
    //         headers: {
    //             this.storedUserData.username :
    //         },
    //         credentials: "include"
    //     });
    //     window.location.hash = "home"
    // }
    async sendscoreandfinish(result) {
        // const csrfToken = getCookie("csrftoken");
        // // console.log(this.storedUserData.username)
        // // console.log(getCookie("access_token"))

        // // console.log("-----------")
        // // console.log(csrfToken);
        // const username = this.storedUserData.username;
        // const loser_is = this.lose;
        // const winner_is = this.win;

        // const response = await fetch("http://localhost:8000/update_game_result/", {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //         "Authorization": `Bearer ${getCookie("access_token")}`,
        //         "X-CSRFToken": csrfToken
        //     },
        //     credentials: "include",
        //     body: JSON.stringify({
        //         winner: winner_is,
        //         loser: loser_is
        //     })
        // });

        // // const response = await fetch("http://localhost:8000/update_game_result/", {
        // //     method: "POST",
        // //     headers: {
        // //         "Content-Type": "application/json",
        // //         "Authorization": `Bearer ${accessToken}`, 
        // //         "X-CSRFToken": csrfToken
        // //     },
        // //     credentials: "include",
        // //     body: JSON.stringify({ 
        // //         winner: winner_is, 
        // //         loser: loser_is 
        // //     }) 
        // // });

        // if (response.ok) {
        //     // Handle success (optional)
        //     console.log("Score updated successfully");
        // } else {
        //     // Handle error (optional)
        //     console.error("Failed to update score", response.statusText);
        // }

        // const responsed = await fetch("http://localhost:8000/clean_invites/", {
        //     method: "POST",  // Changed from GET to POST
        //     headers: {
        //         "Content-Type": "application/json",
        //         "Authorization": `Bearer ${getCookie("access_token")}`,
        //         "X-CSRFToken": getCookie("csrftoken")
        //     },
        //     credentials: "include",
        //     body: JSON.stringify({ username })  // This now works correctly with POST
        // });
        if(this.is_finale == true)
        {
        localStorage.removeItem('nextMatch');
        localStorage.removeItem('onewinner');
        localStorage.removeItem('twowinner');
        localStorage.removeItem('Tour_usernames');

        let result = null; 

            if(this.win == this.storedUserData.username)
            {
                result = "win";
                // alert("rb7ti tournament")
            }
            else
            {
                result = "lose";
            }
            const responsed = await fetch("http://localhost:8000/update_tournament/", {
            method: "POST",  // Changed from GET to POST
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getCookie("access_token")}`,
                "X-CSRFToken": getCookie("csrftoken")
            },
            credentials: "include",
            body: JSON.stringify({ result })  // This now works correctly with POST
        });


            window.location.hash = "home";

        }

        // localStorage.removeItem('opponentUsername')
        else if (this.is_tournament != null){
            if (this.is_secondmatch == false){

                localStorage.setItem("onewinner", JSON.stringify(this.win));
            }
            else 
            {
                localStorage.setItem("twowinner", JSON.stringify(this.win));

            }
        localStorage.removeItem('nextMatch');
        window.location.hash = "tree"; // Redirect after the request
        }
        // else if(this.is_secondmatch)
        // {
        // window.location.hash = "tree"; // Redirect after the request

        // }
        else 
        {
            window.location.hash = "home"; // Redirect after the request

        }
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

            this.lose = this.me; // l3ks
            this.win = this.op; // l3ks
            imagesToDraw = [
                { img: this.images[1], x: (this.custo.width / 2) - (this.imageSize / 2), y: this.custo.height / 5 }, // Center in left half
                // { img: this.images[3], x: (3 * this.custo.width / 4) - (this.imageSize / 2), y: this.custo.height / 4 } // Center in right half
            ];
            this.ctx.fillStyle = "#0000FF";
            this.ctx.fillText("👑👑 Blue Team won! 👑👑", (this.board.width - this.ctx.measureText("👑👑 Blue Team won! 👑👑").width) / 2, this.board.height / 6);
            //  this.ctx.fillText(`${this.scores.lscore}-${this.scores.rscore}`, (this.board.width - this.ctx.measureText(`${this.scores.lscore}-${this.scores.rscore}`).width) / 2, this.board.height/6);
            this.ctx.fillText(`${left_score}-${right_score}`, (this.board.width - this.ctx.measureText(`${left_score}-${right_score}`).width) / 2, this.board.height / 5 + 20);

            this.ctx.fillStyle = "#000000";

        } else {
            this.lose = this.op; // l3ks
            this.win = this.me; // l3ks
            console.log("rb7o 7mrin");
            imagesToDraw = [
                { img: this.images[0], x: (this.custo.width / 2) - (this.imageSize / 2), y: this.custo.height / 5 }, // Center in left half
                // { img: this.images[1], x: (3 * this.custo.width / 4) - (this.imageSize / 2), y: this.custo.height / 4 } // Center in right half
            ];
            this.ctx.fillStyle = "#FF0000";
            this.ctx.fillText("👑👑 Red Team won! 👑👑", (this.board.width - this.ctx.measureText("👑👑 Red Team won! 👑👑").width) / 2, this.board.height / 6);
            this.ctx.fillText(`${left_score}-${right_score}`, (this.board.width - this.ctx.measureText(`${left_score}-${right_score}`).width) / 2, this.board.height / 5 + 20);

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

        // this.finish.addEventListener("click",this.sendscoreandfinish)
        this.finish.addEventListener("click", () => this.sendscoreandfinish("lose")); // or "lose"
        console.log(this.custo.width);
        console.log(this.custo.height);
    }

    gameLoop() {
        this.updatePaddles();
        if (this.update()) {
            this.drawEndgame();

            return;
        }
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Register the normal mode component
customElements.define('offline-mode', OfflineMode);


// async function sendInvite(receiverUsername) {
//     try {
//         const response = await fetch("http://localhost:8000/send_invite/", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": `Bearer ${getCookie("access_token")}`,
//                 "X-CSRFToken": csrfToken
//             },
//             credentials: "include",
//             body: JSON.stringify({ receiver_username: receiverUsername })
//         });

//         if (response.ok) {
//             // Proceed to game screen
//             window.location.hash = "normal";
//             return true;
//         } else {
//             const errorData = await response.json();
//             alert(errorData.error || "Failed to send invitation");
//             return false;
//         }
//     } catch (error) {
//         console.error("Invite sending failed", error);
//         alert("Failed to send invitation. Please try again.");
//         return false;
//     }
// }

// async function checkInvitationStatus() {
//     try {
//         const response = await fetch("http://localhost:8000/check_invitation_status/", {
//             method: "GET",
//             headers: {
//                 "Authorization": `Bearer ${getCookie("access_token")}`,
//                 "X-CSRFToken": csrfToken
//             },
//             credentials: "include"
//         });

//         const invitationStatus = await response.json();
//         return invitationStatus;
//     } catch (error) {
//         console.error("Error checking invitation status:", error);
//         return { bothAccepted: false, status: 'ERROR' };
//     }
// }

// async function acceptInvite(senderUsername) {
//     try {
//         const response = await fetch("http://localhost:8000/accept_invite/", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": `Bearer ${getCookie("access_token")}`,
//                 "X-CSRFToken": csrfToken
//             },
//             credentials: "include",
//             body: JSON.stringify({ sender_username: senderUsername })
//         });

//         if (response.ok) {
//             return true;
//         } else {
//             const errorData = await response.json();
//             alert(errorData.error || "Failed to accept invitation");
//             return false;
//         }
//     } catch (error) {
//         console.error("Invite acceptance failed", error);
//         alert("Failed to accept invitation. Please try again.");
//         return false;
//     }
// }
//---------------------------------------------------------------------------------------------------