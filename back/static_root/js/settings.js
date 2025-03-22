class SettingsPage extends HTMLElement {
    async connectedCallback() {
        async function refreshUserData() {
            try {
                const response = await fetch("http://localhost:8000/get_user_stats/", {
                    headers: {
                        "Authorization": `Bearer ${getCookie('access_token')}`
                    }
                });
                const data = await response.json();
                localStorage.setItem("userData", JSON.stringify(data));
            } catch (error) {
                console.error("Error refreshing user data:", error);
            }
        }

        await refreshUserData();
        const storedUserData = JSON.parse(localStorage.getItem('userData'));
        const profilePicture = storedUserData.profile_picture || "media/Screen Shot 2024-10-02 at 2.05.14 AM.png";

        this.innerHTML = `
            
        <!-- ✅ Settings Panel -->
        <link rel="stylesheet" href="static/css/profile.css">
        <div id="settings-overlay" class="settings-overlay">
            <div class="settings-content">
                <h2>Settings</h2>
                <div class="two-factor-section">
                    <h3>Two-Factor Authentication</h3>
                    <button id="toggle-2fa" class="${storedUserData.otp_enabled ? 'enabled' : ''}">
                    ${storedUserData.otp_enabled ? 'Disable 2FA' : 'Enable 2FA'}
                </button>
                <div class="twofa-code-input">
                    <input type="text" id="twofa-code" placeholder="Enter 6-digit code">
                    <button id="submit-twofa-code">Verify Code</button>
                    <div class="twofa-status"></div>
                </div>
                </div>
                <div class="oomar-ddiv1-ddiv1-rright">
                <div class="omarr-imgConatinerr">
                <img id="player-profile-picture" 
                src=${profilePicture}>
                </div>
                <div >
                <input type="file" id="profilePictureInput" accept="image/*">
                <button id="change" class="omar-gameStatus">Edit</button>
                </div>

                <label>Change FirstName:<input type="text" id="FirstName"></label>
                <label>Change Lastname:<input type="text" id="LastName"></label>
                <label>Change Username: <input type="text" id="newUsername"></label>
                <label>Change Email:<input type="email" id="newEmail"></label>
                <label>Old Password: <input type="password" id="OldPassword"></label>
                <label>New Password:<input type="password" id="newPassword"></label>
                <label>Confirm Password:<input type="password" id="conf-password"></label>
                <button id="save-settings">Save</button>
                <button id="close-settings">Close</button>
            </div>
        </div>`;

        this.querySelector('#toggle-2fa').addEventListener('click', async () => {
            document.querySelector('.twofa-code-input').style.display = 'block';
        });

        this.querySelector('#submit-twofa-code').addEventListener('click', async () => {
            const code = this.querySelector('#twofa-code').value;
            const statusDiv = this.querySelector('.twofa-status');
            
            try {
                const response = await fetch('http://localhost:8000/verify_code/', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${getCookie('access_token')}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ code })
                });

                const data = await response.json();
                
                if (response.ok) {
                    await refreshUserData();
                    const newData = JSON.parse(localStorage.getItem('userData'));
                    this.querySelector('#toggle-2fa').className = newData.otp_enabled ? 'enabled' : '';
                    this.querySelector('#toggle-2fa').textContent = newData.otp_enabled ? 'Disable 2FA' : 'Enable 2FA';
                    statusDiv.className = 'twofa-status twofa-success';
                    statusDiv.textContent = '✓ 2FA enabled successfully!';
                    this.querySelector('#toggle-2fa').classList.add('enabled');
                    this.querySelector('#toggle-2fa').textContent = 'Disable 2FA';
                    setTimeout(() => statusDiv.style.display = 'none', 3000);
                } else {
                    statusDiv.className = 'twofa-status twofa-error';
                    statusDiv.textContent = data.detail || 'Verification failed';
                }
                statusDiv.style.display = 'block';
                
            } catch (error) {
                console.error('Error:', error);
                statusDiv.className = 'twofa-status twofa-error';
                statusDiv.textContent = 'Network error - please try again';
                statusDiv.style.display = 'block';
            }
        });
   
        // ✅ Close Settings Button
        document.getElementById("close-settings").addEventListener("click", () => {
            this.style.display = "none";
        });

        // ✅ Save Settings (Send Data to Backend)
        document.getElementById("save-settings").addEventListener("click", async () => {
            const oldPassword = document.getElementById("OldPassword").value;
            const newPassword = document.getElementById("newPassword").value;
            const conf_password = document.getElementById("conf-password").value;

            if (!oldPassword) {
                alert("Old password is required!");
                return;
            }

            if (newPassword && newPassword !== conf_password) {
                alert("Passwords do not match!");
                return;
            }

            const data = {
                username: document.getElementById("newUsername").value || null,
                first_name: document.getElementById("FirstName").value || null,
                last_name: document.getElementById("LastName").value || null,
                email: document.getElementById("newEmail").value || null,
                oldPassword: oldPassword,
                password: newPassword || null,
            };

            const accessToken = getCookie('access_token');

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

                if (response.ok) {
                    alert("Profile updated successfully!");
                } else {
                    alert("Error updating profile: " + responseData.message || "Unknown error");
                }
            } catch (error) {
                console.error("Error:", error);
            }
            
        });
        document.getElementById("change").addEventListener("click", function (event) {
            const fileInput = document.getElementById("profilePictureInput");
            if (fileInput.files.length === 0) {
                alert("Please select a file");
                return;
            }

            // Use the global function to upload the file
            uploadProfilePicture(fileInput.files[0]);
        });
        
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

    }
}

// ✅ Define the Settings Component
customElements.define("settings-component", SettingsPage);
