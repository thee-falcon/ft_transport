// Components
const HomeComponent = () => {
	return `
	<h1>Welcome to the Home Page</h1>
	<p>This is the home page of our vanilla JavaScript website.</p>
	`;
};
const TournamentComponent = () => {
	return `
	<section class="Tournament" id="TOURNAMENT">
			
			<div class="TOURNAMENT_list">Tournament<br>List
				<div class="table">
					<div class="table-row">
						<table>
							<thead class="col1">
								<tr>
									<th scope="col" class="col-tournaments">Tournaments<br>Competitors</th>
									<th scope="col" class="col-matches">Matches<br>Won</th>
									<th scope="col" class="col-tournaments-won">Tournaments<br>Won</th>
									<th scope="col" class="col-success-rate">Success Rate</th>
									<th scope="col" class="col-points-earned">Points<br>Earned</th>
								</tr>
								</tr>
							</thead>
							<tbody>
								<tr>
									<th scope="row" class="col-tournaments">
										<div class="row-content">
											<img src="/imgs/Screen Shot 2024-10-02 at 2.04.41 AM.png" alt="Midnight Sons Image">
											<div class="text-content">
												Midnight Sons<br>
												<span class="level">LvL 15</span>
											</div>
										</div>
									</th>
									<td class="col-matches">Today,<br>12:59 pm</td>
									<td class="col-tournaments-won">Today,<br>12:59 pm</td>
									<td class="col-success-rate">Today,<br>12:59 pm</td>
									<td class="col-points-earned">Today,<br>12:59 pm</td>
								</tr>
								<tr>
									<th scope="row" class="col-tournaments">
										<div class="row-content">
											<img src="/imgs/Screen Shot 2024-10-02 at 2.04.41 AM.png" alt="Midnight Sons Image">
											<div class="text-content">
												Midnight Sons<br>
												<span class="level">LvL 15</span>
											</div>
										</div>
									</th>
									<td class="col-matches">Today,<br>12:59 pm</td>
									<td class="col-tournaments-won">Today,<br>12:59 pm</td>
									<td class="col-success-rate">Today,<br>12:59 pm</td>
									<td class="col-points-earned">Today,<br>12:59 pm</td>
								</tr>
								<tr>
									<th scope="row" class="col-tournaments">
										<div class="row-content">
											<img src="/imgs/Screen Shot 2024-10-02 at 2.04.41 AM.png" alt="Midnight Sons Image">
											<div class="text-content">
												Midnight Sons<br>
												<span class="level">LvL 15</span>
											</div>
										</div>
									</th>
									<td class="col-matches">Today,<br>12:59 pm</td>
									<td class="col-tournaments-won">Today,<br>12:59 pm</td>
									<td class="col-success-rate">Today,<br>12:59 pm</td>
									<td class="col-points-earned">Today,<br>12:59 pm</td>
								</tr>
								<tr>
									<th scope="row" class="col-tournaments">
										<div class="row-content">
											<img src="/imgs/Screen Shot 2024-10-02 at 2.04.41 AM.png" alt="Midnight Sons Image">
											<div class="text-content">
												Midnight Sons<br>
												<span class="level">LvL 15</span>
											</div>
										</div>
									</th>
									<td class="col-matches">Today,<br>12:59 pm</td>
									<td class="col-tournaments-won">Today,<br>12:59 pm</td>
									<td class="col-success-rate">Today,<br>12:59 pm</td>
									<td class="col-points-earned">Today,<br>12:59 pm</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>

				<!-- <div class="Tournament_details"> -->
					
					
			<div class="TOURNAMENT_details">Tournament<br>Details
				<div class="Matches">
					<div class="TournamentFirst">Tournament First Matches :</div>
						<div class="tableMatches">

							<div class="vsMatch">
								<div class="tournament-content">
									<img src="/imgs/Screen Shot 2024-10-02 at 2.04.41 AM.png" alt="Midnight Sons Image">
									<div class="tournament-matches">
										Midnight Sons<br>
										<span class="level">LvL 15</span>
									</div>
								</div>
								<div class="vs-text">vs</div>
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
								<div class="vs-text">vs</div>
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
		</section>
	`;
};
  
  

  
// App Rendering
const render = (com) => {
document.getElementById('app').innerHTML = com();
};
  
// Navigation
document.getElementById('index-link').addEventListener('click', () => render(HomeComponent));
document.getElementById('tournaments').addEventListener('click', () => render(TournamentComponent));
document.getElementById('TournamentTree-link').addEventListener('click', () => render(HomeComponent));

  
  // Initial render
  render(HomeComponent);
  