class Profile extends HTMLElement {
    async connectedCallback() {
        const username = getCookie('username');
        const first_name = getCookie('first_name');
        const last_name = getCookie('last_name');
        const profilePicture = getCookie('profile_picture') || "/media/defaultprofilepic.png";
        console.log("Profile Picture:", profilePicture);
        const email = getCookie('email');

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
                                <p class="dash-name">${first_name} ${last_name}</p>
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
                                    <p>Edit First Name</p>
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
                                    <input type="email" id="newEmail" placeholder="New Email">
                                </div>
                                <div class="dash-input6">
                                    <p>Old Password</p>
                                    <input type="password" id="OldPassword" placeholder="Old Password">
                                </div>    
                                <div class="dash-input6">
                                    <p>New Password</p>
                                    <input type="password" id="newPassword" placeholder="New Password">
                                </div>    
                                <div class="dash-input6">
                                    <p>Confirm Password</p>
                                    <input type="password" id="conf-password" placeholder="Confirm Password">
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
        
            const oldPassword = document.getElementById("OldPassword").value;
            const newPassword = document.getElementById("newPassword").value;
            const conf_password = document.getElementById("conf-password").value;
        
            if (!oldPassword) {
                console.error("Old password is required!");
                return;
            }
        
            if (newPassword && newPassword !== conf_password) {
                console.error("Passwords do not match!");
                return;
            }
        
            const data = {
                username: document.getElementById("newUsername").value || null,
                first_name: document.getElementById("FirstName").value || null,
                last_name: document.getElementById("LastName").value || null,
                email: document.getElementById("newEmail").value || null,
                oldPassword: oldPassword, // Backend will use this to verify before changing password
                password: newPassword || null, // Only sent if the user wants to change it
            };
        
            const accessToken = getCookie('access_token');
            console.log("Access Token:", accessToken);
            console.log("Data to be sent:", data);
        
            try {
                const response = await fetch("http://localhost:8000/update-profile/", {
                    method: "PUT",
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                });
        
                const responseData = await response.json();
                console.log("Response Data:", responseData);
        
                if (response.ok) {
                    console.log("Profile updated successfully!");
                } else {
                    console.error("Error updating profile:", responseData.message || "Unknown error");
                }
            } catch (error) {
                console.error("Error updating profile:", error);
            }
        });
        
        
        
    }
}

customElements.define('profile-component', Profile);
