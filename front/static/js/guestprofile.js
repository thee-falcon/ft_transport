class  guestprofile extends HTMLElement {
    async connectedCallback() {
        const storedUserData = JSON.parse(localStorage.getItem('guestData'));
        const username = storedUserData.username;
        const first_name = storedUserData.first_name;
        const lastname =storedUserData.last_name;
        const profilePicture = storedUserData.profile_picture || "media/Screen Shot 2024-10-02 at 2.05.14 AM.png";
        const matches_won = storedUserData.matches_won;
        const matches_lost = storedUserData.matches_lost;
         console.log("Profile Picture:", profilePicture);
        const email = storedUserData.email;
 
        const tournaments_won = storedUserData.tournaments_won;
        const tournaments_lost = storedUserData.tournaments_lost;
        const matchSuccessRate = (matches_won + matches_lost) > 0 
        ? ((matches_won / (matches_won + matches_lost)) * 100).toFixed(2) 
        : 0;

    const tournamentSuccessRate = (tournaments_won + tournaments_lost) > 0 
        ? ((tournaments_won / (tournaments_won + tournaments_lost)) * 100).toFixed(2) 
        : 0;
         this.innerHTML = `
         <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Profile</title>
        
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
                                        <div id="player-won" class="omar-info-won">
                                            games won: ${matches_won}
                                        </div>
                                        <div id="player-lose" class="omar-info-lose">
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
                                    <div id="player-description" class="omar-info-description">
                                        The Conqueror of PING-PONG Realm
                                    </div>
                                </div>
                            </div>
                
                            <div class="omar-div3-right">
                                <div class="omar-current-strike">
                                    <div id="player-strike-value" class="omar-strike-value">${matches_won}</div>
                                </div>
                                <div class="omar-contacts-div3">
                                    contacts
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
                                        <span>TIME</span>
                                        <span>LAST 5 MATCHES</span>
                                        <span>Result</span>
                                    </div>
                                    <div id="match-history-container">
                                        <!-- Match history will be injected here -->
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </body>
         
         `;

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
            container.innerHTML = "<p>No match history available.</p>";
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
    
            matchDiv.innerHTML = `
                <span id="player-match-time-${index+1}" class="omar-match-time">${time}</span>
                <span id="player-fight-${index+1}" class="omar-match-players">${match.sent_by} VS ${match.send_to}</span>
                <span id="player-game-status-${index+1}" class="omar-match-result ${match.result.toLowerCase()}">${displayResult}</span>
            `;
            container.appendChild(matchDiv);
        });
         requestAnimationFrame(() => {
            this.createCharts(matches_won, matches_lost, tournaments_won, tournaments_lost);
        });
    }

    createCharts(matchesWon, matchesLost, tournamentsWon, tournamentsLost) {
        const matchesCanvas = this.querySelector('#matchesChart');
        const tournamentsCanvas = this.querySelector('#tournamentsChart');

        if (!matchesCanvas || !tournamentsCanvas) {
            console.error("Canvas elements not found!");
            return;
        }

        // Chart 1: Matches Won & Lost
        new Chart(matchesCanvas.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['Matches Won', 'Matches Lost'],
                datasets: [{
                    label: 'Matches',
                    data: [matchesWon, matchesLost],
                    backgroundColor: ['#4CAF50', '#F44336'],
                    borderColor: ['#388E3C', '#D32F2F'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: false,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Match Statistics'
                    }
                }
            }
        });
 
    }
}
        
customElements.define("guestprofile-component", guestprofile);