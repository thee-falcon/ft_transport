class dashboard extends HTMLElement {
    async connectedCallback() {
        const username = getCookie('username');
        const first_name = getCookie('first_name');
        const lastname = getCookie('last_name');
        const profilePicture = getCookie('profile_picture');
        console.log("picture", profilePicture);
        const email = getCookie('email');
        const matches_won = getCookie('matches_won') || 0;
        const matches_lost = getCookie('matches_lost') || 0;
        const tournaments_won = getCookie('tournaments_won') || 0;
        const tournaments_lost = getCookie('tournaments_lost') || 0;
        const matchSuccessRate = (matches_won + matches_lost) > 0 
        ? ((matches_won / (matches_won + matches_lost)) * 100).toFixed(2) 
        : 0;

    const tournamentSuccessRate = (tournaments_won + tournaments_lost) > 0 
        ? ((tournaments_won / (tournaments_won + tournaments_lost)) * 100).toFixed(2) 
        : 0;
        this.innerHTML = /*html*/`
    <div id="lo">
        <div class="dash-dashboard-container">
            <div></div>
            <div class="dash-col2">
                <div class="dash-card2">
                    <div class="dash-card2-col1">
                        <div class="dash-card2-buttons">     
                            <a href="#" class="dash-Start">Start Game</a>
                            <a href="#" class="dash-Start">Start Gym</a>
                            <a href="#" class="dash-Start">Start Tournament</a>
                        </div>
                    </div>
                    <div class="dash-card2-image">
                        <img src="/media/raquets.png" alt="">
                    </div>
                </div>
                <div class="dash-card3">
                    <div class="dash-card3-part1">
                        <h3>Won<br>Matches :</h3>
                        <h1>${matches_won}</h1>
                    </div>
                    <div class="dash-card3-part2">
                        <h3>Lost<br>Matches :</h3>
                        <h1>${matches_lost}</h1>
                    </div>
                    <div class="dash-card3-part3">
                        <h3>Success<br>Rate (%)</h3>
                        <h1>${matchSuccessRate}</h1>
                    </div>
                    <div class="dash-card3-part4">
                        <h3>Tournaments<br>Won :</h3>
                        <h1>${tournaments_won}</h1>
                    </div>
                    <div class="dash-card3-part5">
                        <h3>Tournaments<br>Lost :</h3>
                        <h1>${tournaments_lost}</h1>
                    </div>
                    <div class="dash-card3-part6">
                        <h3>Tournaments Success<br>Rate (%):</h3>
                        <h1>${tournamentSuccessRate}</h1>
                    </div>
                </div>
                <div class="dash-card4">
                    <div class="dash-statistics-graphs">
                    <canvas id="matchesChart"></canvas>
                    <canvas id="tournamentsChart"></canvas>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
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

        // Chart 2: Tournaments Won & Lost
        new Chart(tournamentsCanvas.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['Tournaments Won', 'Tournaments Lost'],
                datasets: [{
                    label: 'Tournaments',
                    data: [tournamentsWon, tournamentsLost],
                    backgroundColor: ['#FFC107', '#2196F3'],
                    borderColor: ['#FFA000', '#1976D2'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Tournament Statistics'
                    }
                }
            }
        });
    }
}

customElements.define('dashboard-component', dashboard);
