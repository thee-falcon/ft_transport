class home extends HTMLElement {
    async connectedCallback() {
       const username =getCookie('username');
         const profilename = getCookie('username');
        const profilePicture = getCookie("profile_picture")  ;
        
            console.log("profilePicture  " , profilePicture );
            this.innerHTML = `
 
               
 
<body>
<div id="ok1">
    <div class="card-container">

    <div class="col11">
        <div class="card11">
            <!-- <img src="../image/Screen_Shot_2025-01-12_at_12.47.51_AM-removebg-preview.png" alt="Game Image"> -->
            <div class="card-content">
            <a href="#" class="card-button" id="go-to-gameoption">Start Game</a>
            </div>
        </div>
        <div class="card44">
            <!-- <img src="../image/Screen Shot 2024-10-02 at 3.53.12 AM.png" alt="Training Image"> -->
            <div class="card-content">
                <a href="#" class="card-button">Start Training</a>
            </div>
        </div>
    </div>

    <div class="col22">
        <div class="card22">
            <!-- <img src="../image/Screen Shot 2024-10-02 at 3.44.26 AM.png" alt="Tournament Image"> -->
            <div class="card-content">
                <a href="#" class="card-button">Join Tournament</a>
            </div>
        </div>
        <div class="card55">
            <!-- <img src="../image/Screen Shot 2024-10-02 at 3.57.08 AM.png" alt="Leaderboard Image"> -->
            <div class="card-content">
                <a href="#" class="card-button" id="go-to-dashboard" >Show Dashboard</a>
            </div>
        </div>
    </div>

    <div class="col33">
        <div class="card33">
            <div id="koo">
                <div id="limm">
                <h2>${username}!</h2> 
                </div>
            </div>
            <div class="card-content">
                <a href="#" class="card-button" id="go-to-profile">Profile</a>
            </div>
            <div class="card-content">
            <a href="#" class="card-button" id="logout" >Logout</a>
        </div>
        </div>
        <div class="card66">
            <!-- <img src="../image/Screen Shot 2024-10-02 at 4.18.58 AM.png" alt="Club Image"> -->
            <div class="card-content">
                <a href="#" class="card-button">Join Club</a>
            </div>
        </div>
    </div>
    </div>
</div>
</body>
`;
   
let gotogameoption = document.getElementById("go-to-gameoption");
gotogameoption.addEventListener('click', function(event) {
    event.preventDefault();  
    window.location.hash = "gameoption";   
});

        document.getElementById("logout").addEventListener('click', async function(event) {
            event.preventDefault();
            const csrftoken = getCookie('csrftoken');  // Fetch CSRF token
            try {
                const response = await fetch("http://localhost:8000/logout/", {
                    method: "POST",
                    'X-CSRFToken': csrftoken,  // Include CSRF token in headers
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
                    window.location.hash = "signin"; 
                } else {
                    console.error("Logout failed:", responseData);
                    alert(responseData.detail || "Logout failed");
                }
            } catch (error) {
                console.error("Error:", error);
            }
        });
        let goprofile = document.getElementById("go-to-profile");
        goprofile.addEventListener('click', async function(event) {
            event.preventDefault();
            try {
                const token = getCookie("access_token"); // Retrieve stored token
                if (!token) {
                    console.error("No access token found!");
                    return;
                }
                console.log('print token ' , token);
        
                const response = await fetch("http://localhost:8000/get_user_stats/", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`, // Add Authorization header
                        "Content-Type": "application/json"
                    },
                    credentials: "include" // Include cookies if needed
                });
        
                const responseData = await response.json();
                console.log("stats response:", responseData);
        
                if (response.ok) {
                    console.log("get_user_stats response:", responseData);
                    window.location.hash = "profile"; 

                } else {
                    console.error("Error fetching stats:", responseData);
                }
            } catch (error) {
                console.error("Error:", error);
            }
        });

        let gotodash = document.getElementById("go-to-dashboard");
        gotodash.addEventListener('click', async function(event) {
            event.preventDefault();
            try {
                const token = getCookie("access_token"); // Retrieve stored token
                if (!token) {
                    console.error("No access token found!");
                    return;
                }
                console.log('print token ' , token);
        
                const response = await fetch("http://localhost:8000/get_user_stats/", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`, // Add Authorization header
                        "Content-Type": "application/json"
                    },
                    credentials: "include" // Include cookies if needed
                });
        
                const responseData = await response.json();
                console.log("stats response:", responseData);
        
                if (response.ok) {
                    console.log("get_user_stats response:", responseData);
                    window.location.hash = "dashboard"; 

                } else {
                    console.error("Error fetching stats:", responseData);
                }
            } catch (error) {
                console.error("Error:", error);
            }
        });

            }
                }
customElements.define('home-component', home);


