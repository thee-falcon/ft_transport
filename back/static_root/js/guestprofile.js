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
         <link rel="stylesheet" href="static/css/guest.css">

         <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Profile</title>
         
           

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Bai+Jamjuree:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;1,200;1,300;1,400;1,500;1,600;1,700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <div id="profile-container"  class="omar-main-profile">
        <div id="profile-wrapper" class="omar-main-parentt">
            <div class="omar-div1"></div>
            <div class="omar-div2">
                <div class="omar-parent-right">
                    <div class="omar-div1-rightt">
                        <div class="omar-div1-div1-rightt">
                            <div class="omar-imgConatiner">
                                <img id="player-profile-picture" 
                                src=${profilePicture}>
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
                            <div id="player-fullname"  class="omar-info-fullname">
                            ${first_name} ${lastname}
                            </div>
                            <div id="player-nickname"class="omar-info-nickname">
                                <p>    ${username}    </p>
                            </div>
                            <div id="player-info" class="omar-info-level">
                                
                            </div>
                            <div id="player-description" class="omar-info-description">
                            The Conqueror of PING-PONG Realm
                            </div>
                            </div>
                            </div>
                            <div class="dash-card44">
                            <div class="dash-statistics-graphss">
                            <canvas id="matchesChart"></canvas>
                            <canvas id="tournamentsChart"></canvas>
                            </div>
            </div>


                   
            </div>
        </div>
    </div>
</body>
         
         `;
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
                responsive: true,
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