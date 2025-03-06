class tournament extends HTMLElement {
    async connectedCallback() {
        this.innerHTML = 
`
	<link rel="stylesheet" href="static/css/Tournament.css">
	<section class="Tournament" id="TOURNAMENT">	
		<div class="TOURNAMENT_list">Tournament<br>Tree
			<div class="Champion">
				<div class="ChampionTouranament">
					<div class="verticalLine"></div>
					<div class="Championfinal">
						<img src="/imgs/Screen Shot 2024-10-02 at 4.18.58 AM.png" alt="Midnight">
					</div>
					<div class="verticalLine"></div>
				</div>
				<!-- <div class="vs1"></div> -->
				<div class="line">
					<div class="FinalMatch">
						<div class="Championfinal">
							<img src="/imgs/Screen Shot 2024-10-02 at 4.18.58 AM.png" alt="Midnight">
						</div>
						<div class="Championfinal">
							<img src="/imgs/Screen Shot 2024-10-02 at 4.35.56 AM.png" alt="Midnight">
						</div>
					</div>
				</div>

				<div class="Player">
					<div class="Players">
						<div class="Championfinal">
							<img src="/imgs/Screen Shot 2024-10-02 at 4.18.58 AM.png" alt="Midnight">
						</div>
						<div class="vs"></div>
						<div class="Championfinal">
							<img src="/imgs/Screen Shot 2024-10-02 at 4.35.39 AM.png" alt="Midnight">
						</div>
					</div>
					<div class="Players">
						<div class="Championfinal">
							<img src="/imgs/Screen Shot 2024-10-02 at 4.35.56 AM.png" alt="Midnight">
						</div>
						<div class="vs"></div>
						<div class="Championfinal">
							<img src="/imgs/Screen Shot 2024-10-02 at 4.36.27 AM.png" alt="Midnight">
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
							<img src="/imgs/Screen Shot 2024-10-02 at 2.04.41 AM.png" alt="Midnight Sons Image">
							<div class="tournament-matches">
								Midnight Sons<br>
								<span class="level">LvL 15</span>
							</div>
						</div>
						<div class="vs-text">5 - 3</div>
						<div class="tournament-content">
							<img src="/imgs/Screen Shot 2024-10-02 at 2.04.41 AM.png" alt="Midnight Sons Image">
							<div class="tournament-matches">
								Midnight Sons<br>
								<span class="level">LvL 15</span>
							</div>
						</div>
					</div>
					<div class="vsMatch">
						<div class="tournament-content">
							<img src="/imgs/Screen Shot 2024-10-02 at 2.04.41 AM.png" alt="Midnight Sons Image">
							<div class="tournament-matches">
								Midnight Sons<br>
								<span class="level">LvL 15</span>
							</div>
						</div>
						<div class="vs-text">5 - 2</div>
						<div class="tournament-content">
							<img src="/imgs/Screen Shot 2024-10-02 at 2.04.41 AM.png" alt="Midnight Sons Image">
							<div class="tournament-matches">
								Midnight Sons<br>
								<span class="level">LvL 15</span>
							</div>
						</div>
					</div>
				</div>
				<div class="TournamentFinal">Tournament Final Matche Result :</div>
					<div class="tableMatches">
						<div class="vsMatch">
							<div class="tournament-content">
								<img src="/imgs/Screen Shot 2024-10-02 at 2.04.41 AM.png" alt="Midnight Sons Image">
								<div class="tournament-matches">
									Midnight Sons<br>
									<span class="level">LvL 15</span>
								</div>
							</div>
							<div class="vs-text">1 - 5</div>
							<div class="tournament-content">
								<img src="/imgs/Screen Shot 2024-10-02 at 2.04.41 AM.png" alt="Midnight Sons Image">
								<div class="tournament-matches">
									Midnight Sons<br>
									<span class="level">LvL 15</span>
								</div>
							</div>
						</div>
					
					</div>
				<div class="TournamentPrizes">Tournament Prizes :</div>
					<div class="prizes">
						<div class="TournamentChampion">Tournament Champion : 1500 pts</div>
						<div class="PongClub">Pong Club Reward : 500 pts</div>
						<div class="TournamentParticipation">Tournament Participation : 300 pts</div>
					</div>
			</div>
		</div>
		</div>
	</section>

	<script src="./Tournament.js"></script>
	`;
    }
}
customElements.define("tournament-component", tournament);
