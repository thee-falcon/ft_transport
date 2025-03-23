class Profile extends HTMLElement {
    async connectedCallback() {
        // Retrieve and set user data
        const storedUserData = JSON.parse(localStorage.getItem('userData')) || {};
        const username = storedUserData.username || "Guest";
        // Save current username as a property for later use
        this.username = username;
        
        const first_name = storedUserData.first_name || "Unknown";
        const lastname = storedUserData.last_name || "User";
        const profilePicture = storedUserData.profile_picture || "media/Screen Shot 2024-10-02 at 2.05.14 AM.png";
        const matches_won = storedUserData.matches_won || 0;
        const matches_lost = storedUserData.matches_lost || 0;
        const email = storedUserData.email || "user@example.com";
        console.log("Profile Picture:", profilePicture);
        this.accessToken = getCookie("access_token");

        this.innerHTML =  `
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title data-i18n="profile.title">Profile</title>
        
            <link rel="stylesheet" href="static/css/profile.css">
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Bai+Jamjuree:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;1,200;1,300;1,400;1,500;1,600;1,700&display=swap" rel="stylesheet">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
        </head>
        <body>
            <div id="profile-container" class="omar-main-profile">
                <div id="profile-wrapper" class="omar-main-parent">
                    <div class="omar-div1"></div>
                    <div class="omar-div2">
                        <div class="omar-parent-right">
                            <div class="omar-div1-right">
                                <div class="omar-div1-div1-right">
                                    <div class="omar-imgConatiner">
                                        <img id="player-profile-picture" src="${profilePicture}">
                                    </div>

                                    <div class="omar-info">
                                        <div id="player-won" class="omar-info-won" data-i18n="profile.gamesWon">
                                            games won: ${matches_won}
                                        </div>
                                        <div id="player-lose" class="omar-info-lose" data-i18n="profile.gamesLost">
                                            games lose: ${matches_lost}
                                        </div>
                                    </div>
                                </div>
                                <div class="omar-div2-div1-right">
                                    <div id="player-fullname" class="omar-info-fullname">
                                        ${first_name} ${lastname}
                                    </div>
                                    <div id="player-nickname" class="omar-info-nickname">
                                        <p>${username}</p>
                                    </div>
                                    <div id="player-description" class="omar-info-description" data-i18n="profile.description">
                                        The Conqueror of PING-PONG Realm
                                    </div>
                                </div>
                            </div>
                
                            <div class="omar-div3-right">
                                <div class="omar-current-strike">
                                    <div id="player-strike-value" class="omar-strike-value">${matches_won}</div>
                                </div>
                                <div class="omar-contacts-div3">
                                    <span data-i18n="profile.contacts">contacts</span>
                                    <div class="omar-social-icons">
                                        <i id="player-instagram" class="omar-fab fa-instagram"></i>
                                        <i id="player-discord" class="omar-fab fa-discord"></i>
                                        <i id="player-facebook" class="omar-fab fa-facebook"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="omar-div4-right">
                                <div class="omar-match-history">
                                    <div class="omar-match-header">
                                        <span data-i18n="profile.time">TIME</span>
                                        <span data-i18n="profile.lastMatches">LAST 5 MATCHES</span>
                                        <span data-i18n="profile.result">Result</span>
                                    </div>
                                    <div id="match-history-container">
                                        <!-- Match history will be injected here -->
                                    </div>
                                </div>
                            </div>
                            <div class="omar-div5-right">
                                <button id="player-start-game" class="omar-gameStatus" data-i18n="profile.startGame">start game</button>
                                <button id="player-start-gym" class="omar-gameStatus" data-i18n="profile.startGym">start gym</button>
                                <button id="player-join-tournament" class="omar-gameStatus" data-i18n="profile.joinTournament">join tournament</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </body>
        `;

		


        // Profile picture change functionality
        const profilePictureInput = this.querySelector("#profilePictureInput");
        const changeButton = this.querySelector("#change");
        
        if (changeButton && profilePictureInput) {
            changeButton.addEventListener("click", () => {
                profilePictureInput.click();
            });
        }
        
        if (profilePictureInput) {
            profilePictureInput.addEventListener("change", (event) => {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const playerProfilePicture = this.querySelector("#player-profile-picture");
                        if (playerProfilePicture) {
                            playerProfilePicture.src = e.target.result;
                            
                            // Update localStorage with new profile picture
                            const currentUserData = JSON.parse(localStorage.getItem('userData')) || {};
                            currentUserData.profile_picture = e.target.result;
                            localStorage.setItem("userData", JSON.stringify(currentUserData));
                        }
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
		
        // Game buttons functionality
        const startGameButton = this.querySelector("#player-start-game");
        const startGymButton = this.querySelector("#player-start-gym");
        const joinTournamentButton = this.querySelector("#player-join-tournament");

        if (startGameButton) {
            startGameButton.addEventListener("click", () => {
                window.location.href = "#offline";
            });
        }

        if (startGymButton) {
            startGymButton.addEventListener("click", () => {
                window.location.href = "#training";
            });
        }

        if (joinTournamentButton) {
            joinTournamentButton.addEventListener("click", () => {
                window.location.href = "#tournament";
            });
        }

        // Fetch match history from API
        fetch("http://localhost:8000/api/game-history", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
                "Content-Type": "application/json",
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Game History:", data);
            this.updateGameHistory(data);
        })
        .catch(error => {
            console.error("Error fetching game history:", error);
        });
    }

    updateGameHistory(gameHistory) {
        console.log("Updating Game History with:", gameHistory);
        
        const container = this.querySelector('#match-history-container');
        if (!container) {
            console.error("Match history container not found");
            return;
        }
    
        container.innerHTML = ''; // Clear old matches
    
        // Slice up to 5 matches (or use the full list if fewer)
        const recentMatches = gameHistory.slice(0, 5);
        console.log("Recent Matches:", recentMatches);
    
        if (recentMatches.length === 0) {
            const noHistoryPara = document.createElement('p');
            noHistoryPara.setAttribute('data-i18n', 'profile.noMatchHistory');
            noHistoryPara.textContent = "No match history available.";
            container.appendChild(noHistoryPara);
            return;
        }
    
        recentMatches.forEach((match, index) => {
            const matchDiv = document.createElement('div');
            matchDiv.classList.add('omar-match');
    
            // Convert timestamp to local time
            const time = new Date(match.timestamp).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            });
    
            // Determine the result from the current user's perspective
            // If the current user is the receiver (send_to), reverse the result.
            let displayResult = match.result.toUpperCase();
            if (match.send_to === this.username) {
                // If the API says "win", current user actually lost, and vice versa
                displayResult = match.result.toLowerCase() === 'win' ? 'LOSE' : 'WIN';
            }
    
            // Use the LanguageUtils.createTranslatedElement for dynamically created elements
            const timeSpan = window.LanguageUtils.createTranslatedElement('span', 'profile.matchTime', {
                id: `player-match-time-${index+1}`,
                className: 'omar-match-time'
            });
            timeSpan.textContent = time;
            
            const playersSpan = document.createElement('span');
            playersSpan.id = `player-fight-${index+1}`;
            playersSpan.className = 'omar-match-players';
            playersSpan.textContent = `${match.sent_by} VS ${match.send_to}`;
            
            const resultSpan = window.LanguageUtils.createTranslatedElement('span', `profile.${displayResult.toLowerCase()}`, {
                id: `player-game-status-${index+1}`,
                className: `omar-match-result ${match.result.toLowerCase()}`
            });
            
            matchDiv.appendChild(timeSpan);
            matchDiv.appendChild(playersSpan);
            matchDiv.appendChild(resultSpan);
            
            container.appendChild(matchDiv);
        });
    }
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

customElements.define('profile-component', Profile);
