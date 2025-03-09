class  guestprofile extends HTMLElement {
    async connectedCallback() {
        const storedUserData = JSON.parse(localStorage.getItem('userData'));
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
        <style>
        * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    .dash-card44{
        position: relative;
        display: flex;
        flex-direction: column;
        row-gap: 5px;
        border-color: 3px solid #E5F690;
        height: 60%;
        border-radius: 20px;
    }
    .dash-statistics-graphss {
        position: relative;
        display: flex;
        flex-direction: column; /* Keeps charts stacked */
        align-items: center;
        justify-content: space-around; /* Adds spacing between charts */
        background-color: #EFF3DD;
        height: 200%;
        border-radius: 20px;
        padding: 15px;
    }
    
    .dash-statistics-graphss canvas {
        width: 90%; /* Ensures charts don’t overflow */
        height: 45%; /* Splits the available space */
        max-height: 200px; /* Prevents excessive stretching */
    }
    body {
        background-color: #1B3E46;
        display: flex;
        justify-content: center;
        align-items: center; 
        min-height: 100vh;
        padding: 1rem;
    } 
    
    .omar-main-parentt {
        display: grid;
        grid-template-columns: repeat(9, 1fr);
        grid-template-rows: repeat(10, 1fr);
        gap: 8px;
        height: 100%;
        width: 100%;
        padding: clamp(1rem, 5vw, 9rem);
    }
        
    .omar-div1 {
        grid-column: span 3 / span 3;
        grid-row: span 10 / span 10;
        background-image: url("/media/Screen Shot 2024-10-02 at 2.10.41 AM.png");
        background-size: cover;
        background-position: center;
        border-radius: 32px;
    }
    
    .omar-div2 {
        grid-column: span 6 / span 6;
        grid-row: span 10 / span 10;
        grid-column-start: 4;
    }
    
    .omar-parent-right {
        display: grid;
        grid-template-columns: repeat(10, 1fr);
        grid-template-rows: repeat(12, 1fr);
        gap: clamp(10px, 2vw, 20px);
        height: 100%;
        width: 100%;
        border: 3px solid #E5F690;
        background-color:#EFF3DD;
        padding: clamp(1rem, 3vw, 3rem);
        border-radius: 32px;
    }
    
    .omar-div1-rightt {
        grid-column: span 7 / span 7;
        grid-row: span 5 / span 5;
        border: 3px solid #E5F690;
        border-radius: 32px;
        background-color: #1B3E46;
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        grid-template-rows: repeat(4, 1fr);
        gap: 10px;
        padding: 1rem;
    }
    
    .omar-div1-div1-rightt{
        grid-column: span 2 / span 2;
        grid-row: span 4 / span 4;
        overflow: hidden;
        border-radius: 32px;
        padding: 10px;
        position: relative;
        display: flex;
        flex-direction: column;
        height: 100%;
    }
    
    .omar-div1-div1-rightt .omar-imgConatiner{
        height: 150px;
        overflow: hidden;
        border-radius: 32px;
        margin-bottom: 20px;
    }
    
    .omar-div1-div1-rightt img {
        width: 100%;
        max-width: 150px;
        height: 150px;
        object-fit: cover;
        border-radius: 32px;
        border: 3px solid #E5F690;
    }
    
    .omar-div1-div1-rightt .omar-info {
        font-family: "Bai Jamjuree", serif;
        text-transform: capitalize;
        color: #E5F690;
        font-weight: bold;
        font-size: clamp(1rem, 1.5vw, 1.2rem);
        margin-top: auto;
    }
    
    .omar-info-won, .omar-info-lose {
        margin-bottom: 8px;
    }
    
    .omar-div2-div1-right{
        grid-column: span 3 / span 3;
        grid-row: span 4 / span 4;
        grid-column-start: 3;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: start;
        font-family: "Bai Jamjuree", serif;
        text-transform: capitalize;
        color: #E5F690;
        font-weight: bold;
        font-size: clamp(1.2rem, 2vw, 1.5rem);
    }
    
    .omar-div2-right {
        grid-column: span 3 / span 3;
        grid-column-start: 8;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    
    .omar-div3-right {
        grid-column: span 3 / span 3;
        grid-row: span 4 / span 4;
        grid-column-start: 8;
        grid-row-start: 2;
        border: 3px solid #E5F690;
        border-radius: 32px;
        background-color: #1B3E46;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        padding: 20px;
    }
    
    .omar-current-strike {
        color: #E5F690;
        font-size: clamp(1.2rem, 2vw, 1.5rem);
        font-family: "Bai Jamjuree", serif;
        text-transform: capitalize;
        font-weight: 400;
        text-align: center;
    }
    
    .omar-strike-value {
        font-size: clamp(2rem, 3vw, 2.5rem);
        font-weight: bold;
        margin-top: 10px;
    }
    
    .omar-contacts-div3 {
        color: #E5F690;
        font-size: clamp(1.2rem, 2vw, 1.5rem);
        font-weight: bold;
        font-family: "Bai Jamjuree", serif;
        text-transform: capitalize;
        font-weight: 400;
        text-align: center;
    }
    
    .omar-social-icons {
        display: flex;
        gap: 20px;
        margin-top: 10px;
    }
    
    .omar-social-icons i {
        font-size: clamp(1.5rem, 2vw, 1.8rem);
        cursor: pointer;
    }
    
    .omar-div4-right {
        grid-column: span 10 / span 10;
        grid-row: span 6 / span 6;
        grid-row-start: 6;
        border: 3px solid #E5F690;
        border-radius: 32px;
        background-color: #1B3E46;
        padding: clamp(10px, 2vw, 20px);
    }
    
    .omar-match-history {
        color: #E5F690;
        font-family: "Bai Jamjuree", serif;
    }
    
    .omar-match-header {
        display: grid;
        grid-template-columns: 1fr 3fr 1fr;
        padding: 10px;
        font-weight: bold;
        border-bottom: 2px solid #E5F690;
        margin-bottom: 10px;
        font-size: clamp(0.9rem, 1.5vw, 1rem);
    }
    
    .omar-match {
        display: grid;
        grid-template-columns: 1fr 3fr 1fr;
        padding: 10px;
        align-items: center;
        border-bottom: 1px solid rgba(229, 246, 144, 0.3);
    }
    
    .omar-match-time {
        font-size: clamp(0.8rem, 1.5vw, 1rem);
    }
    
    .omar-match-players {
        font-size: clamp(0.8rem, 1.5vw, 1rem);
    }
    
    .omar-match-result {
        font-weight: bold;
        text-align: right;
    }
    
    .omar-win {
        color: #4CAF50;
    }
    
    .omar-lose {
        color: #f44336;
    }
    
    .omar-div5-right {
        grid-column: span 10 / span 10;
        grid-row-start: 12;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        flex-wrap: wrap;
        gap: 10px;
    }
    
    .omar-div5-right button {
        text-transform: capitalize;
        font-family: "Bai Jamjuree", serif;
        font-weight: 400;
        padding: clamp(8px, 1.5vw, 10px) clamp(15px, 2vw, 20px);
        border-radius: 32px;
        background-color: #1B3E46;
        color: #E5F690;
        font-size: clamp(1rem, 1.5vw, 1.2rem);
        cursor: pointer;
        border: none;
        white-space: nowrap;
    }
    
    .omar-div2-right button {
        text-transform: capitalize;
        font-family: "Bai Jamjuree", serif;
        font-weight: 400;
        padding: clamp(8px, 1.5vw, 10px);
        border-radius: 32px;
        background-color: #1B3E46;
        color: #E5F690;
        font-size: clamp(1rem, 1.5vw, 1.2rem);
        cursor: pointer;
        border: none;
        padding-inline: clamp(3rem, 5vw, 7rem);
        white-space: nowrap;
    }
    
    .omar-gameStatus:hover, .omar-gameEdit:hover {
        background-color: #E5F690;
        color: #1B3E46;
        transition: all 0.3s ease;
    }
    
    /* Media Queries */
    @media screen and (max-width: 1200px) {
        .omar-main-parentt {
            padding: 2rem;
        }
        
        .omar-div2-div1-right {
            font-size: 1.2rem;
        }
    }
    
    @media screen and (max-width: 992px) {
        .omar-main-parentt {
            grid-template-columns: 1fr;
            grid-template-rows: auto;
        }
        
        .omar-div1 {
            grid-column: 1 / -1;
            height: 300px;
        }
        
        .omar-div2 {
            grid-column: 1 / -1;
        }
        
        .omar-parent-right {
            grid-template-columns: repeat(6, 1fr);
        }
        
        .omar-div1-rightt {
            grid-column: span 6;
        }
        
        .omar-div2-right {
            grid-column: span 6;
            grid-row: auto;
            margin: 1rem 0;
        }
        
        .omar-div3-right {
            grid-column: span 6;
            grid-row: auto;
        }
        
        .omar-div4-right {
            grid-column: span 6;
        }
        
        .omar-div5-right {
            grid-column: span 6;
        }
    }
    
    @media screen and (max-width: 1200px) {
        .omar-main-parentt {
            gap: 8px;
            padding: 2rem;
        }
        
        .omar-parent-right {
            padding: 1.5rem;
        }
    }
    
    @media screen and (max-width: 992px) {
        .omar-main-parentt {
            grid-template-columns: 1fr;
            grid-template-rows: auto;
            gap: 2rem;
        }
        
        .omar-div1 {
            grid-column: 1 / -1;
            height: 300px;
            grid-row: unset;
        }
        
        .omar-div2 {
            grid-column: 1 / -1;
            grid-row: unset;
        }
        
        .omar-parent-right {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            height: auto;
        }
        
        .omar-div1-rightt {
            flex: none;
            height: auto;
        }
        
        .omar-div2-right {
            flex: none;
        }
        
        .omar-div3-right {
            flex: none;
        }
        
        .omar-div4-right {
            flex: none;
        }
        
        .omar-div5-right {
            flex: none;
            display: flex;
            gap: 1rem;
        }
    }
    
    @media screen and (max-width: 768px) {
        .omar-div1-rightt {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            padding: 1.5rem;
        }
        
        .omar-div1-div1-rightt {
            width: 100%;
            max-width: 200px;
        }
        
        .omar-div2-div1-right {
            width: 100%;
            text-align: center;
            margin-top: 1rem;
        }
        
        .omar-div3-right {
            display: flex;
            flex-direction: column;
            gap: 2rem;
        }
        
        .omar-match-header, 
        .omar-match {
            font-size: 0.9rem;
        }
    }
    
    @media screen and (max-width: 480px) {
        .omar-main-parentt {
            padding: 1rem;
        }
        
        .omar-parent-right {
            padding: 1rem;
        }
        
        .omar-div5-right {
            flex-direction: column;
        }
        
        .omar-gameStatus {
            width: 100%;
        }
        
        .omar-match-header, 
        .omar-match {
            font-size: 0.8rem;
        }
    }
    </style>
           

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