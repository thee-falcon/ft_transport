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
                        <h3>Club<br>Rank :</h3>
                        <h1>69</h1>
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
                        <h3>Success<br>Rate (%):</h3>
                        <h1>86</h1>
                    </div>
                </div>
                <div class="dash-card4">
                    <div class="dash-statistics-graphs">
                        <canvas id="statsChart"></canvas>
                    </div>
                </div>
            </div>
        </div>
    </div>`;

        // Ensure chart is created after the DOM updates
        requestAnimationFrame(() => {
            this.createChart(matches_won, matches_lost, tournaments_won, tournaments_lost);
        });
    }

    createChart(matchesWon, matchesLost, tournamentsWon, tournamentsLost) {
        const canvas = this.querySelector('#statsChart');
        if (!canvas) {
            console.error("Canvas not found!");
            return;
        }

        const ctx = canvas.getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Matches Won', 'Matches Lost', 'Tournaments Won', 'Tournaments Lost'],
                datasets: [{
                    label: 'Statistics',
                    data: [matchesWon, matchesLost, tournamentsWon, tournamentsLost],
                    backgroundColor: ['#4CAF50', '#F44336', '#FFC107', '#2196F3'],
                    borderColor: ['#388E3C', '#D32F2F', '#FFA000', '#1976D2'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

customElements.define('dashboard-component', dashboard);
