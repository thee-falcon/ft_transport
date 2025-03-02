let tournamentListClass = "Tournament<br>List";


const HomeComponent = () => {
	return `
	<h1>Welcome to the Home Page</h1>
	<p>This is the home page of our vanilla JavaScript website.</p>
	`;
};




const HomeChat = () => {
	return `
	  <link rel="stylesheet" href="../static/css/chat.css" />
	  <input type="hidden" id="logged-in-user"/>
	  <h1 id="user-name">User Name</h1>
	  
	<div class="app-container">
		<!-- friend list -->
		<div class="friend-list"></div>
		
		<!-- Users List -->
		<div class="friends">

				<input class="user_search" type="text" id="id-friends" placeholder="Search" />


			<div class="header-users-list">
				<div class="users-list"></div>
			</div>

		</div>
		
		<!-- Chat Area -->
		<div class="chat-container">
		  	<div class="chat-header">
		  		<div class="user-chat">
					<span id="chat-header-username"></span>
				</div>
				<div class="dropdown">
					<button class="dropdown-button">
						<img src="../../static/imgs/dots.png" alt="dots" class="dropdown-icon">
					</button>
					<div class="dropdown-content">
						<a href="#" id="block-user">block</a>
						<a href="#">invitation game</a>
					</div>
				</div>
			</div>

			<div class="content-messages"></div>
				<div class="chat-messages"></div>
					<form id="send-message-form">
						<div class="chat-input">
							<input type="text" id="input-message" placeholder="Type your message here" />
							<button id="chat-message-submit" type="submit">Send</button>
						</div>
					</form>
				</div>
			</div>
		</div>

	  </div>
	  
	`;
  };


const TournamentTree_Component = () => {
	return `
	
	<link rel="stylesheet" href="TournamentTree.css">
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
};

const TournamentComponent = () => {
	return `
	<link rel="stylesheet" href="tournament.css">
	
	<div class="Tournament" id="TOURNAMENT" >	
		<div class="TOURNAMENT_list">${tournamentListClass}
			<div class="tables">
				<div class="table-row">
					<table>
						<thead class="col1">
							<tr>
								<th scope="col" class="col-tournaments">Tournaments<br>Competitors</th>
								<th scope="col" class="col-matches">Matches<br>Won</th>
								<th scope="col" class="col-tournaments-won">Tournaments<br>Won</th>
								<th scope="col" class="col-success-rate">Success<br>Rate</th>
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
					<div class="TournamentPrizes">Tournament Prizes :
						<div class="prizes">
							<div class="TournamentChampion">Tournament Champion : 1500 pts</div>
							<div class="PongClub">Pong Club Reward : 500 pts</div>
							<div class="TournamentParticipation">Tournament Participation : 300 pts</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	`;
};
  
  

  

// const render = (com) => {
// 	document.getElementById('app').innerHTML = com();
// };

// // Navigation
// document.getElementById('home').addEventListener('click', () => render(HomeComponent));
// document.getElementById('chat').addEventListener('click', () => render(HomeChat));
// document.getElementById('tournaments').addEventListener('click', () =>  render(TournamentComponent));
// document.getElementById('TournamentTree').addEventListener('click', () => render(TournamentTree_Component));


// render(HomeComponent);
  

const render = (component) => {
	document.getElementById('app').innerHTML = component();
	
	// Optionally, if there's a chat toggle element with id "chat"
	const chatElement = document.getElementById('chat');
	if (chatElement) {
		
	  chatElement.addEventListener('click', () => render(HomeChat));
	}
};
	
  // Call render with HomeChat (instead of the undefined HomeComponent)
render(HomeChat);
  
