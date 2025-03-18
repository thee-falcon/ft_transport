class tournament extends HTMLElement {
    // constructor()
    // {
    //     this.last_matchwinner = null;
    // }
    async connectedCallback() {
        
        const storedUserData = JSON.parse(localStorage.getItem('userData'));
        const username = storedUserData.username;

        console.log("username == ", username);
        this.innerHTML = 
`
<link rel="stylesheet" href="static/css/tourne.css">
</head>
<body> 
    <div class="biggie">
        <div class="containerr_above_all">
            <div class="containerr_above_all_1">
                <div class="Texts">
                    <h1>Tournament list</h1>
                    <h2>Tournament Competitors</h2>
                </div>
                <div class="Inputs">
                    <input class="containerr_above_all_1_input" type="text" id="mvp" value="${username}" readonly>
                    <input class="containerr_above_all_1_input" type="text" id="player2" placeholder="player2">
                    <input class="containerr_above_all_1_input" type="text" id="player3" placeholder="player3">
                    <input class="containerr_above_all_1_input" type="text" id="player4" placeholder="player4">
                </div>
                <div class="buttons">
                   <a class="card-button" id="start_tournament">Start Tournament<a/>
                </div>
            </div>
            <div class="container_above_all_2">
                <img src="media/girl.png" alt="">
            </div>
        </div>
    </div>
</body>
</html>
`;
document.getElementById("start_tournament").addEventListener("click", function () {
        

    let Tour_usernames = {}; // Object to store usernames by ID

    document.querySelectorAll('.Inputs input').forEach(input => {
        Tour_usernames[input.id] = input.value.trim(); // Store input value
    });
    localStorage.setItem("Tour_usernames", JSON.stringify(Tour_usernames));
    console.log("Usernames stored in localStorage:", Tour_usernames);

    const players = JSON.parse(localStorage.getItem("Tour_usernames"));

    // Check if we have four players
    if (players && Object.keys(players).length === 4) {
        let playerList = Object.values(players);
        let mvp = players.mvp; // Get the MVP (simo)
        let mvpWins = false; // Flag to track MVP status
        
        console.log("Tournament Matches:");
        // localStorage.setItem("tournament_players", JSON.stringify(selectedUserData));
        // Simulate First Round
        this.last_matchwinner = JSON.parse(localStorage.getItem('Winner'));
        // console.log(playerList[0],"------------")
        // console.log(playerList[1],"------------")
        // console.log(playerList[2],"------------")
        // console.log(playerList[3],"------------")
        

        let semiFinal1Winner = simulateMatch(playerList[0], playerList[1]);
        // let semiFinal2Winner = simulateMatch(playerList[2], playerList[3]);
    }
    
    // Function to simulate a match
    function simulateMatch(player1, player2) {
        // Randomly select a winner
        localStorage.setItem("nextMatch", JSON.stringify([player1, player2]));
        window.location.hash = "offline";
        // localStorage.getItem("Winner", JSON.stringify([player1, player2]));
        return JSON.parse(localStorage.getItem("Winner"));

        // return Math.random() < 0.5 ? player1 : player2;

    }

});}}

customElements.define("tournament-component", tournament);
