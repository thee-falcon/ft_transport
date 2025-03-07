class home extends HTMLElement {
    async connectedCallback() {
        const username = getCookie('username');
        const profilePicture = getCookie("profile_picture");

        this.innerHTML = `
        <style>
        
        </style>
        <body>
        <link rel="stylesheet" href="static/css/home.css">

            <div id="ok1">
            
            <input type="text" id="userSearch" placeholder="Search user..." />
            <div id="searchResults"></div>


            <button id="open-settings" class="settings-button">⚙ Settings</button>
            <settings-component id="settings-panel" style="display: none; position: fixed; z-index: 2"></settings-component>
                <div class="card-container">
                        
                    <div class="col11">
                        <div class="card11">
                            <div class="card-content">
                                <a href="#" class="card-button" id="go-to-gameoption">Start Game</a>
                            </div>
                        </div>
                        <div class="card44">
                            <div class="card-content">
                                <a href="#" class="card-button" id="go-to-training">Start Training</a>
                            </div>
                        </div>
                    </div>

                    <div class="col22">
                        <div class="card22">
                            <div class="card-content">
                                <a href="#" class="card-button" id="go-to-tour">Join Tournament</a>
                            </div>
                        </div>
                        <div class="card55">
                            <div class="card-content">
                                <a href="#" class="card-button" id="go-to-dashboard">Show Dashboard</a>
                            </div>
                        </div>
                    </div>

                    <div class="col33">
                        <div class="card33">
                            <div class="card-content">
                                <a href="#" class="card-button" id="go-to-profile">Profile</a>
                            </div>
                            <div class="card-content">
                                <a href="#" class="card-button" id="logout">Logout</a>
                            </div>
                        </div>
                        <div class="card66">
                            <div class="card-content">
                                <a href="#" class="card-button">Join Chat</a>
                            </div>
                        </div>
                    </div>
  
                </div>
            </div>
        </body>`;

        async function refreshhhToken() {
            console.log('Refreshing access token...');
            const refresh_Token = getCookie('refresh_token');
        
            if (!refresh_Token|| isTokenExpired()) {
                console.log("No refresh token found, user not authenticated.");

        
            try {
                const response = await fetch("http://localhost:8000/token-refresh/", {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ refresh: refresh_Token }),
                });
        
                if (response.ok) {
                    const data = await response.json();
                    console.log("data  accces=== " , data.access);
                    document.cookie = `access_token=${data.access}; path=/; SameSite=None; Secure`;
                    console.log("New access token received:", data.access);
                    return true;
                } else {
                    console.error("Failed to refresh token. Redirecting to signin.");
                    deleteCookie("access_token");
                    deleteCookie("refresh_token");
                    return false;
                }
            } catch (error) {
                console.error("Error refreshing token:", error);
                return false;
            }
        }
        }
            
        document.getElementById("userSearch").addEventListener("input", function () {
            let query = this.value.trim();
            let searchResults = document.getElementById("searchResults");
        
            if (query.length > 0) {
                fetch(`/search-users/?q=${query}`)
                    .then(response => response.json())
                    .then(data => {
                        searchResults.innerHTML = ""; // Clear previous results
                        if (data.length === 0) {
                            searchResults.innerHTML = "<p>No users found</p>";
                        } else {
                            data.forEach(user => {
                                let userElement = document.createElement("div");
                                userElement.textContent = `${user.username} (${user.email})`;
                                userElement.classList.add("search-result-item");
                                userElement.dataset.userId = user.id; // Store user ID
        
                                // ✅ Make user clickable
                                userElement.addEventListener("click", function () {
                                    alert(`You clicked on ${user.username} (ID: ${user.id})`);
                                    // You can redirect or use the user ID to fetch more details
                                    // window.location.href = `/profile/${user.id}/`;
                                });
        
                                searchResults.appendChild(userElement);
                            });
                        }
                    });
            } else {
                searchResults.innerHTML = ""; // Clear results when input is empty
            }
        });
        

       function isTokenExpired(token) {
            if (!token) return true; 
        
            try {
                const base64Url = token.split('.')[1];  
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');  
                const payload = JSON.parse(atob(base64));  
                
                const currentTime = Math.floor(Date.now() / 1000);  
                return payload.exp < currentTime; 
            } catch (error) {
                console.error("Invalid token format:", error);
                return true;  
            }
        }
        
        document.getElementById("open-settings").addEventListener("click", () => {
            document.getElementById("settings-panel").style.display = "block"; // Show settings
        });

        document.getElementById("go-to-gameoption").addEventListener("click", function (event) {
            event.preventDefault();
            fetchUserStats("gameoption");

         });
         document.getElementById("go-to-tour").addEventListener("click", function (event) {
            event.preventDefault();
            console.log("tournament");
            fetchUserStats("tournament");
        });
        document.getElementById("go-to-training").addEventListener("click", function (event) {
            event.preventDefault();
            fetchUserStats("training");
        });
        async function fetchUserStats(redirectPage) {
            let token = getCookie("access_token");
        
            // If token is expired, refresh it
            if (isTokenExpired(token)) {
                console.log("Access token expired, attempting refresh...");
                const refreshed = await refreshhhToken();
                if (!refreshed) {
                    console.error("Failed to refresh token. Redirecting to signin.");
                    // window.location.hash = "signin";
                    // return;
                }
                token = getCookie("access_token"); // Get the new token
            }
        
            // Proceed with API request
            try {
                const response = await fetch("http://localhost:8000/get_user_stats/", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    credentials: "include"
                });
        
                const responseData = await response.json();
                if (response.ok) {
                    localStorage.setItem("userData", JSON.stringify(responseData));
                    console.log("User data retrieved:", responseData);
                    window.location.hash = redirectPage;
                } else {
                    console.error("Error fetching stats:", responseData);
                }
            } catch (error) {
                console.error("Error:", error);
            }
        }
        
            
        

         document.getElementById("go-to-profile").addEventListener("click", (event) => {
            event.preventDefault();
            fetchUserStats("profile");
        });

         document.getElementById("go-to-dashboard").addEventListener("click", (event) => {
            event.preventDefault();
            fetchUserStats("dashboard");
        });

        document.getElementById("logout").addEventListener("click", async function (event) {
            event.preventDefault();
            try {
                const csrftoken = getCookie("csrftoken");
                const response = await fetch("http://localhost:8000/logout/", {
                    method: "POST",
                    headers: { "X-CSRFToken": csrftoken },
                    credentials: "include"
                });

                const responseData = await response.json();
                if (response.ok) {
                    localStorage.clear();
                    document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                    document.cookie = "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                    document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                    document.cookie = "profile_picture=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                    window.location.hash = "signin";
                } else {
                    alert("Logout failed");
                }
            } catch (error) {
                console.error("Error:", error);
            }
        });
    }
}

// ✅ Define the Home Component
customElements.define("home-component", home);
