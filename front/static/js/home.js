class home extends HTMLElement {
    async connectedCallback() {
        const username = getCookie('username');
        const profilePicture = getCookie("profile_picture");

        this.innerHTML = `
        <body>
            <div id="ok1">
                <div class="card-container">
                    <!-- ✅ Settings Button -->
                    <button id="open-settings" class="settings-button">⚙ Settings</button>
                    <settings-component id="settings-panel" style="display: none;"></settings-component>

                    <div class="col11">
                        <div class="card11">
                            <div class="card-content">
                                <a href="#" class="card-button" id="go-to-gameoption">Start Game</a>
                            </div>
                        </div>
                        <div class="card44">
                            <div class="card-content">
                                <a href="#" class="card-button">Start Training</a>
                            </div>
                        </div>
                    </div>

                    <div class="col22">
                        <div class="card22">
                            <div class="card-content">
                                <a href="#" class="card-button">Join Tournament</a>
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
                            <div id="koo">
                                <div id="limm">
                                    <h2>${username}!</h2> 
                                </div>
                            </div>
                            <div class="card-content">
                                <a href="#" class="card-button" id="go-to-profile">Profile</a>
                            </div>
                            <div class="card-content">
                                <a href="#" class="card-button" id="logout">Logout</a>
                            </div>
                        </div>
                        <div class="card66">
                            <div class="card-content">
                                <a href="#" class="card-button">Join Club</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </body>`;

        // ✅ Open & Close Settings Panel
        document.getElementById("open-settings").addEventListener("click", () => {
            document.getElementById("settings-panel").style.display = "block"; // Show settings
        });

        // ✅ Navigate to Game Options
        document.getElementById("go-to-gameoption").addEventListener("click", function (event) {
            event.preventDefault();
            window.location.hash = "gameoption";
        });

        // ✅ Navigate to Profile Page
        document.getElementById("go-to-profile").addEventListener("click", async function (event) {
            event.preventDefault();
            try {
                const token = getCookie("access_token");
                if (!token) {
                    console.error("No access token found!");
                    return;
                }

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
                    window.location.hash = "profile";
                } else {
                    console.error("Error fetching stats:", responseData);
                }
            } catch (error) {
                console.error("Error:", error);
            }
        });

        // ✅ Navigate to Dashboard Page
        document.getElementById("go-to-dashboard").addEventListener("click", async function (event) {
            event.preventDefault();
            try {
                const token = getCookie("access_token");
                if (!token) {
                    console.error("No access token found!");
                    return;
                }

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
                    window.location.hash = "dashboard";
                } else {
                    console.error("Error fetching stats:", responseData);
                }
            } catch (error) {
                console.error("Error:", error);
            }
        });

        // ✅ Logout Logic
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

