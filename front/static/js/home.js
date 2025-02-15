class home extends HTMLElement {
    async connectedCallback() {
       const username =getCookie('username');
        // const profilename = getCookie('username');
        const profilePicture = getCookie("profile_picture")  ;
        
            console.log("profilePicture  " , profilePicture );
            this.innerHTML = `
 
                <div class="card-container">
        
                <div class="col1">
                    <div class="card1">
                        <!-- <img src="../image/Screen_Shot_2025-01-12_at_12.47.51_AM-removebg-preview.png" alt="Game Image"> -->
                        <div class="card-content">
                        <a href="#" class="card-button">Start Game</a>
                        </div>
                    </div>
                    <div class="card4">
                        <!-- <img src="../image/Screen Shot 2024-10-02 at 3.53.12 AM.png" alt="Training Image"> -->
                        <div class="card-content">
                            <a href="#" class="card-button">Start Training</a>
                        </div>
                    </div>
                </div>
        
                <div class="col2">
                    <div class="card2">
                        <!-- <img src="../image/Screen Shot 2024-10-02 at 3.44.26 AM.png" alt="Tournament Image"> -->
                        <div class="card-content">
                            <a href="#" class="card-button">Join Tournament</a>
                        </div>
                    </div>
                    <div class="card5">
                        <!-- <img src="../image/Screen Shot 2024-10-02 at 3.57.08 AM.png" alt="Leaderboard Image"> -->
                        <div class="card-content">
                            <a href="#" class="card-button">Show DashBoard</a>
                        </div>
                    </div>
                </div>
        
                <div class="col3">
                    <div class="card3">
                        <div id="ko">
                            <div id="lim">
        
                            </div>
                        </div>
                        <div class="card-content">
                            <a href="#" class="card-button">View Profile</a>
                        </div>
                        <div class="card-content">
                        <a href="#" class="card-button" id="logout" >Logout </a>
                    </div>
                    </div>
                    <div class="card6">
                        <!-- <img src="../image/Screen Shot 2024-10-02 at 4.18.58 AM.png" alt="Club Image"> -->
                        <div class="card-content">
                            <a href="#" class="card-button">Join Chat club</a>
                        </div>


                    </div>

 
                </div>
                </div>
 
        `;
   

        document.getElementById("logout").addEventListener('click', async function(event) {
            event.preventDefault();
        
            try {
                const response = await fetch("http://localhost:8000/logout/", {
                    method: "POST",
                    credentials: "include", // Ensure cookies are sent
                });
        
                const responseData = await response.json(); // Try to read the JSON response
                console.log("Logout response:", responseData); // Debugging log
        
                if (response.ok) {
                    localStorage.clear();   
                    document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                    document.cookie = "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                    document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                    document.cookie = "profile_picture=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                    window.location.hash = "#signin"; 
                } else {
                    console.error("Logout failed:", responseData);
                    alert(responseData.detail || "Logout failed");
                }
            } catch (error) {
                console.error("Error:", error);
            }
        });
        
    } 
}

customElements.define('home-component', home);