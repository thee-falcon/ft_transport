class tournamentree extends HTMLElement {
	constructor()
	{
		super();
		this.username = null;
		this.players = null;
		this.oneWinner = null;
		this.twoWinner = null;
		this.nextMatch = null;



	}
    async connectedCallback() {
        this.innerHTML = 
`
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
				<!-- <div class="vs1"></div> -->
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

			<!-- <div class="Tournament_details"> -->
				
				
		<div class="TOURNAMENT_details">Tournament<br>Details
			<div class="Matches">
				<div class="TournamentFirst">Tournament First Matches Result :</div>
				<div class="tableMatches">
 
					<div class="vsMatch">
						<div class="tournament-content">
							<img src="static/image/Screen Shot 2024-10-02 at 2.04.41 AM.png" alt="Midnight Sons Image">
							<div class="tournament-matches">
								Midnight Sons<br>
								<span class="level">LvL 15</span>
							</div>
							<div>
									win
								</div>
		
						</div>
				</div>
				<div class="TournamentFinal">Tournament Final Matche Result :</div>
					<div class="tableMatches">
						<div class="vsMatch">
							<div class="tournament-content">
								<img src="static/image/Screen Shot 2024-10-02 at 2.04.41 AM.png" alt="Midnight Sons Image">
								<div class="tournament-matches">
									Midnight Sons<br>
									<span class="level">LvL 15</span>
								</div>
						
							</div>
							<div class="vs-text">VS</div>
							<div class="tournament-content">
								<img src="static/image/Screen Shot 2024-10-02 at 2.04.41 AM.png" alt="Midnight Sons Image">
								<div class="tournament-matches">
									Midnight Sons<br>
									<span class="level">LvL 15</span>
								</div>
							</div>
						</div>
					
					</div>
			<div>
				<button id="finalround">start game</button>
				</div>
		</div>
		</div>
	</section>


	`;

	collect_data()
	{
		this.storedUserData = JSON.parse(localStorage.getItem('userData'));
        this.username = this.storedUserData.username;
		this.oneWinner = JSON.parse(localStorage.getItem("onewinner"));
		this.twoWinner = JSON.parse(localStorage.getItem("twowinner"));
		this.nextMatchPlayer = JSON.parse(localStorage.getItem("nextMatch"));
		this.nextMatchPlayer = JSON.parse(localStorage.getItem("nextMatch"));
	}
    }
}
customElements.define("tournamentree-component", tournamentree);

// document.getElementById("finalround").addEventListener("click", (event) => {
// 	event.preventDefault();
// 	console.log("final round");
// 	fetchUserStats("tournament");
// });

						