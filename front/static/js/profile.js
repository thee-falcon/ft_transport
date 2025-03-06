class Profile extends HTMLElement {
    async connectedCallback() {
        const storedUserData = JSON.parse(localStorage.getItem('userData'));
        const username = storedUserData.username;
        const first_name = storedUserData.first_name;
        const lastname = storedUserData.last_name;
        const profilePicture = storedUserData.profile_picture || "media/Screen Shot 2024-10-02 at 2.05.14 AM.png";
        const matches_won = storedUserData.matches_won;
        const matches_lost = storedUserData.matches_lost;
        const email = storedUserData.email;
         console.log("Profile Picture:", profilePicture);

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
   <div id="profile-container"  class="omar-main-profile">
       <div id="profile-wrapper" class="omar-main-parent">
           <div class="omar-div1"></div>
           <div class="omar-div2">
               <div class="omar-parent-right">
                   <div class="omar-div1-right">
                       <div class="omar-div1-div1-right">
                           <div class="omar-imgConatiner">
                               <img id="player-profile-picture" 
                               src=${profilePicture}>
                           </div>
                           <div >
                                <input type="file" id="profilePictureInput" accept="image/*">
                                <button id="change" class="omar-gameStatus">Edit</button>
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
                               <p>${username}</p>
                           </div>
                           <div id="player-description" class="omar-info-description">
                           The Conqueror of PING-PONG Realm
                           </div>
                       </div>
                   </div>
     
                   <div class="omar-div3-right">
                       <div class="omar-current-strike">

                         <div id="player-strike-value"  class="omar-strike-value"> ${matches_won}</div>
                          
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
                           <div class="omar-match">
                               <span id="player-match-time-one" class="omar-match-time">20:11</span>
                               <span id="player-fight-one" class="omar-match-players">thefalcon VS Deadpool69</span>
                               <span id="player-game-status-one" class="omar-match-result win">WIN</span>
                           </div>
                           <div class="omar-match">
                               <span id="player-match-time-two" class="omar-match-time">20:11</span>
                               <span id="player-fight-two" class="omar-match-players">thefalcon VS Doctor Strange</span>
                               <span id="player-game-status-two" class="omar-match-result lose">LOSE</span>
                           </div>
                            <div class="omar-match">
                               <span id="player-match-time-three" class="omar-match-time">20:11</span>
                               <span id="player-fight-three" class="omar-match-players">THOR VS thefalcon</span>
                               <span id="player-game-status-three" class="omar-match-result lose">LOSE</span>
                           </div>
                           <div class="omar-match">
                               <span id="player-match-time-four" class="omar-match-time">20:11</span>
                               <span id="player-fight-four" class="omar-match-players">Wanda VS thefalcon</span>
                               <span id="player-game-status-four" class="omar-match-result win">WIN</span>
                           </div>
                           <div class="omar-match">
                               <span id="player-match-time-five" class="omar-match-time">20:11</span>
                               <span id="player-fight-five" class="omar-match-players">thefalcon VS Iron MAN</span>
                               <span id="player-game-status-five" class="omar-match-result win">WIN</span>
                           </div>
                       </div>
                   </div>
                   <div class="omar-div5-right">
                       <button id="player-start-game" class="omar-gameStatus">start game</button>
                       <button id="player-start-gym" class="omar-gameStatus">start gym</button>
                       <button id="player-join-tournament" class="omar-gameStatus">join tournament</button>
                   </div>
               </div>
           </div>
       </div>
   </div>
</body>
        
        `;
        document.getElementById("change").addEventListener("click", function (event) {
            const fileInput = document.getElementById("profilePictureInput");
            if (fileInput.files.length === 0) {
                alert("Please select a file");
                return;
            }

            // Use the global function to upload the file
            uploadProfilePicture(fileInput.files[0]);
        });
    }
}

// Define the function outside of the event listener
async function uploadProfilePicture(file) {
    const token = getCookie("access_token");
    const formData = new FormData();
    formData.append("profile_picture", file); // Assuming the server expects 'profile_picture'

    try {
        const response = await fetch("http://localhost:8000/pictureedit/", {
            method: "PATCH",
            body: formData,
            headers: {
                "Authorization": `Bearer ${token}` // Send the user's token
            }
        });

        if (response.ok) {
            const data = await response.json();
            alert("Profile picture updated successfully!");
            document.getElementById("profilePreview").src = data.profile_picture_url; // Update preview
            document.getElementById("player-profile-picture").src = data.profile_picture_url; // Update the profile image
        } else {
            const errorData = await response.json();
            alert("Error: " + JSON.stringify(errorData));
        }
    } catch (error) {
        console.error("Upload failed:", error);
    }
}

// Utility function to get the cookie (if required)
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

customElements.define('profile-component', Profile);
