class Profile extends HTMLElement {
    async connectedCallback() {
        const username = getCookie('username');
        const first_name = getCookie('first_name');
        const lastname = getCookie('last_name');
        const profilePicture = getCookie('profile_picture') || "/media/defaultprofilepic.png";
        console.log("picture", profilePicture);
        const email = getCookie('email');
        const matches_won = getCookie('matches_won');
        const matches_lost = getCookie('matches_lost');
        const tournaments_won = getCookie('tournaments_won');
        const tournaments_lost = getCookie('tournaments_lost');

        this.innerHTML = `
        <div id="lo">
            <div class="dash-dashboard-container">
                <div class="dash-col3">
                    <div class="dash-card5">
                        <div class="dash-card5-profile-infos">
                            <div class="dash-card5-profile-infos-part1">
                                <img src="${profilePicture}" alt="Profile Picture">
                            </div>
                            <div class="dash-card5-profile-infos-part2"> 
                                <p class="dash-name">${first_name} ${lastname}</p>
                                <p class="dash-nickname">${username}</p>
                                <p class="dash-level">LvL 0</p>
                                <p class="dash-description">"The Conqueror of PING-PONG Realm"</p>
                                <p class="dash-email">${email}</p>
                            </div>
                        </div>
                        <div class="dash-card5-settings">
                            <div class="dash-card5-part1">
                                <p>Settings:</p>
                            </div>
                            <div class="dash-card5-part2">
                                <div class="dash-input1">
                                    <p>Edit FName</p>
                                    <input type="text" id="FirstName" placeholder="New First Name">
                                </div>
                                <div class="dash-input2">
                                    <p>Edit Last Name</p>
                                    <input type="text" id="LastName" placeholder="New Last Name">
                                </div>
                                <div class="dash-input4">
                                    <p>Edit Username</p>
                                    <input type="text" id="newUsername" placeholder="New Username">
                                </div>
                                <div class="dash-input5">
                                    <p>Edit Email</p>
                                    <input type="text" id="newEmail" placeholder="New Email">
                                </div>
                                <div class="dash-input6">
                                    <p>Edit Password</p>
                                    <input type="password" id="newPassword" placeholder="New Password">
                                </div>    
                                <div class="dash-save_changes1">
                                    <button class="dash-Start" id="Editbtn">Save Changes</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;

        document.getElementById("Editbtn").addEventListener('click', async function (event) {
            event.preventDefault();
        
            // Prepare the data to be sent as JSON
            const data = {
                username: document.getElementById("newUsername").value,
                first_name: document.getElementById("FirstName").value,
                last_name: document.getElementById("LastName").value,
                email: document.getElementById("newEmail").value,
                password: document.getElementById("newPassword").value
            };
        
            const accessToken = getCookie('access_token');
            console.log("Access Token:", accessToken);
        
            // Debugging data
            console.log("Data to be sent:", data);
        
            try {
                const response = await fetch("http://localhost:8000/update-profile/", {
                    method: "PUT",
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                        "Content-Type": "application/json"  // Ensure you're sending JSON
                    },
                    body: JSON.stringify(data)  // Send the data as JSON
                });
        
                const responseData = await response.json();
                console.log("Response Data:", responseData);
            } catch (error) {
                console.error("Error updating profile:", error);
            }
        });
        

    }
}

customElements.define('profile-component', Profile);
