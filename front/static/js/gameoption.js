class Gameoption extends HTMLElement {
    
    async connectedCallback() {
        await Fetchinvites();
        // const allinvites = JSON.parse(localStorage.getItem('the-invites'));
        const storedUserData = JSON.parse(localStorage.getItem('userData'));
        const username = storedUserData.username;
        this.innerHTML = `
        <link rel="stylesheet" href="static/css/gameoption.css">

        <body>
    
        <div class="container">
            <div class="glass" style="--r:-15;">
                <div class="Game_Modes_img">
                    <img src="./media/ping-pong.png" alt="">
                </div>
                <button class="button" id="normal-mode">Ping Pong</button>
                <button class="button blocked_button" id="special-ping-pong" disabled>no invites</button>
            </div>
            <div class="glass" style="--r:5;">
                <div class="Game_Modes_img">
                    <img src="./media/people.png" alt="">
                </div>
                <button class="button" id="multiplayer-mode">Multiplayer</button>
            </div>
            <div class="glass" style="--r:25;">
                <div class="Game_Modes_img">
                    <img src="./media/processor.png" alt="">
                </div>
                <button class="button" id="ai-mode">Ai Mode</button>
            </div>
        </div>
        
    </body>
 


`;
let invitebutton = document.getElementById("special-ping-pong");
        // console.log("Response:", allinvites);
        let sender = hasInviteForMe(username);
        console.log(sender);
        if(sender != null)
        {
            invitebutton.disabled = false; // Enable the button
            invitebutton.classList.remove("blocked_button"); // Remove the blocked styles
            invitebutton.textContent = "accept invite"; // Change button text
        }
        invitebutton.addEventListener('click', async function (event) {
            event.preventDefault();
                    const responsed = await fetch("http://localhost:8000/accept_invite/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getCookie("access_token")}`, 
                "X-CSRFToken": getCookie("csrftoken")
            },
            credentials: "include",
            body: JSON.stringify({ sender_username: sender })

        });
        

        

        });
        

        function hasInviteForMe(myUsername) {
            try {
              const invitesData = JSON.parse(localStorage.getItem('the-invites'));
              
              if (!invitesData || !invitesData.invites || !Array.isArray(invitesData.invites)) {
                return null;
              }
              
              const invite = invitesData.invites.find(invite => 
                invite.receiver === myUsername && invite.is_receiver === true
              );
            
              if (invite) {
                localStorage.setItem('opponentUsername', invite.sender); // Store opponent's username
                return invite.sender;
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error checking invites:", error);
            return null;
        }
          }

        let gotonormal = document.getElementById("normal-mode");
        gotonormal.addEventListener('click', function (event) {
            event.preventDefault();

            window.location.hash = "offline";

        });
        let gotomultiplayer = document.getElementById("multiplayer-mode");
        gotomultiplayer.addEventListener('click', function (event) {
            event.preventDefault();

            window.location.hash = "multiplayer";

        });
        let gotoaimode = document.getElementById("ai-mode");
        gotoaimode.addEventListener('click', function (event) {
            event.preventDefault();

            window.location.hash = "ai";

        });
    }
}

customElements.define('gameoption-component', Gameoption);