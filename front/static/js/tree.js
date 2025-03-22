class Tournamentree extends HTMLElement {
    constructor() {
        super();
        this.username = null;
        this.players = null;
        this.oneWinner = null;
        this.twoWinner = null;
        this.nextMatch = null;
        this.firstMatchesPlayed = false; // Flag to track if first matches are done

        this.collect_data();
    }

    async connectedCallback() {
        this.render();
        this.print_data();
        this.setupEventListeners();
    }

    render() {
        let buttonText = this.firstMatchesPlayed ? "Start Final Match" : "Start Second Match"; // Change button text

        this.innerHTML = `
            <link rel="stylesheet" href="static/css/tree.css">
            <section class="Tournament" id="TOURNAMENT">
                <div class="TOURNAMENT_list">Tournament<br>Tree
                    <div class="Champion">
                        <div class="ChampionTouranament">
                            <div class="verticalLine"></div>
                            <div class="Championfinal">
                                <img src="static/image/Screen Shot 2024-10-02 at 4.18.58 AM.png" alt="Midnight">
                            </div>
                            <div class="verticalLine"></div>
                        </div>
                        <div class="line">
                            <div class="FinalMatch">
                                <div class="Championfinal">
                                    <img src="static/image/Screen Shot 2024-10-02 at 4.18.58 AM.png" alt="Midnight">
                                </div>
                                <div class="Championfinal">
                                    <img src="static/image/Screen Shot 2024-10-02 at 4.35.56 AM.png" alt="Midnight">
                                </div>
                            </div>
                        </div>
                        <div class="Player">
                            <div class="Players">
                                <div class="Championfinal">
                                    <img src="static/image/Screen Shot 2024-10-02 at 4.18.58 AM.png" alt="Midnight">
                                </div>
                                <div class="vs"></div>
                                <div class="Championfinal">
                                    <img src="static/image/Screen Shot 2024-10-02 at 4.35.39 AM.png" alt="Midnight">
                                </div>
                            </div>
                            <div class="Players">
                                <div class="Championfinal">
                                    <img src="static/image/Screen Shot 2024-10-02 at 4.35.56 AM.png" alt="Midnight">
                                </div>
                                <div class="vs"></div>
                                <div class="Championfinal">
                                    <img src="static/image/Screen Shot 2024-10-02 at 4.36.27 AM.png" alt="Midnight">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="TOURNAMENT_details">Tournament<br>Details
                    <div class="Matches">
                        <div class="TournamentFirst">Tournament First Matches Result :</div>
                        <div class="tableMatches">
                            <div class="vsMatch">
                                <div class="tournament-content">
                                    <img src="static/image/Screen Shot 2024-10-02 at 2.04.41 AM.png" alt="Midnight Sons Image">
                                    <div class="tournament-matches">
                                        ${this.oneWinner}<br>
                                        <span class="level">LvL 15</span>
                                    </div>
                                    <div>win</div>
                                </div>
                            </div>
                            ${this.twoWinner ? `
                                <div class="vsMatch">
                                    <div class="tournament-content">
                                        <img src="static/image/Screen Shot 2024-10-02 at 2.04.41 AM.png" alt="Midnight Sons Image">
                                        <div class="tournament-matches">
                                            ${this.twoWinner}<br>
                                            <span class="level">LvL 15</span>
                                        </div>
                                        <div>win</div>
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                        <div class="TournamentFinal">Tournament Final Matche Result :</div>
                        <div class="tableMatches">
                            <div class="vsMatch">
                                <div class="tournament-content">
                                    <img src="static/image/Screen Shot 2024-10-02 at 2.04.41 AM.png" alt="Midnight Sons Image">
                                    <div class="tournament-matches">
                                        ${this.oneWinner}<br>
                                        <span class="level">LvL 15</span>
                                    </div>
                                </div>
                                <div class="vs-text">VS</div>
                                <div class="tournament-content">
                                    <img src="static/image/Screen Shot 2024-10-02 at 2.04.41 AM.png" alt="Midnight Sons Image">
                                    <div class="tournament-matches">
                                        ${this.twoWinner || "TBD"}<br>
                                        <span class="level">LvL 15</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <button id="finalround">${buttonText}</button>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    setupEventListeners() {
        const finalRoundButton = this.querySelector('#finalround');
        if (finalRoundButton) {
            finalRoundButton.addEventListener('click', () => {
                if (!this.firstMatchesPlayed) {
                    this.simulateSecondMatch();
                } else {
                    this.simulateFinalMatch();
                }
            });
        }
    }

    collect_data() {
        this.storedUserData = JSON.parse(localStorage.getItem('userData'));
        this.username = this.storedUserData.username;
        this.oneWinner = JSON.parse(localStorage.getItem("onewinner"));
        this.twoWinner = JSON.parse(localStorage.getItem("twowinner"));
        this.players = JSON.parse(localStorage.getItem("Tour_usernames"));

        this.firstMatchesPlayed = !!this.twoWinner; // Check if second winner is present to determine if first matches are done.
    }

    print_data() {
        console.log("username", this.username);
        console.log("----------------");
        console.log("oneWinner", this.oneWinner);
        console.log("----------------");
        console.log("twoWinner", this.twoWinner);
        console.log("----------------");
        console.log("players", this.players);
        console.log("----------------");
        console.log("firstMatchesPlayed", this.firstMatchesPlayed);
    }

    simulateSecondMatch() {
        const player3 = this.players.player3;
        const player4 = this.players.player4;
        localStorage.setItem("nextMatch", JSON.stringify([player3, player4]));
        window.location.hash = "offline";
    }

    simulateFinalMatch() {
        localStorage.setItem("nextMatch", JSON.stringify([this.oneWinner, this.twoWinner]));
        window.location.hash = "offline";
    }
}

customElements.define("tournamentree-component", Tournamentree);