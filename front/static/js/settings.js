class SettingsPage extends HTMLElement {

    async handle2FAToggle() {
        const button = this.querySelector('#toggle-2fa');
        const codeInput = this.querySelector('.twofa-code-input');
        const statusDiv = this.querySelector('.twofa-status');
        if (button.classList.contains('enabled')) {       // Disable 2FA
            try {
                const response = await fetch('http://localhost:8000/verify_code/', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${getCookie('access_token')}`,
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCookie("csrftoken")
                    },
                    body: JSON.stringify({ disable: true })
                });
                if (response.ok) {
                    button.classList.remove('enabled');
                    button.textContent = 'Enable 2FA';
                    statusDiv.className = 'twofa-status twofa-success';
                    statusDiv.textContent = '✓ 2FA disabled successfully!';
                    setTimeout(() => statusDiv.style.display = 'none', 3000);
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.detail || 'Failed to disable 2FA');
                }
            } catch (error) {
                console.error('Error disabling 2FA:', error);
                statusDiv.className = 'twofa-status twofa-error';
                statusDiv.textContent = error.message || 'Failed to disable 2FA';
                statusDiv.style.display = 'block';
            }
        } else {
            // Enable 2FA
            try {
                const response = await fetch('http://localhost:8000/send_code/', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${getCookie('access_token')}`,
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCookie("csrftoken")
                    }
                });
                if (response.ok) {
                    codeInput.style.display = 'block';
                    statusDiv.className = 'twofa-status twofa-success';
                    statusDiv.textContent = '✓ Verification code sent to your email!';
                    statusDiv.style.display = 'block';
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.detail || 'Failed to send code');
                }
            } catch (error) {
                console.error('Error sending 2FA code:', error);
                statusDiv.className = 'twofa-status twofa-error';
                statusDiv.textContent = error.message || 'Network error - please try again';
                statusDiv.style.display = 'block';
            }
        }
    }
    async handleCodeVerification() {
        const code = this.querySelector('#twofa-code').value;
        const button = this.querySelector('#toggle-2fa');
        const codeInput = this.querySelector('.twofa-code-input');
        const statusDiv = this.querySelector('.twofa-status');
        try {
            const response = await fetch('http://localhost:8000/verify_code/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${getCookie('access_token')}`,
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie("csrftoken")
                },
                body: JSON.stringify({ code })
            });
            const data = await response.json();
            if (response.ok) {
                button.classList.add('enabled');
                button.textContent = 'Disable 2FA';
                codeInput.style.display = 'none';
                statusDiv.className = 'twofa-status twofa-success';
                statusDiv.textContent = '✓ 2FA enabled successfully!';
                setTimeout(() => statusDiv.style.display = 'none', 3000);
            } else {
                throw new Error(data.detail || 'Invalid code');
            }
        } catch (error) {
            console.error('Error verifying code:', error);
            statusDiv.className = 'twofa-status twofa-error';
            statusDiv.textContent = error.message || 'Network error - please try again';
            statusDiv.style.display = 'block';
        }
    }
    async connectedCallback() {
        const storedUserData = JSON.parse(localStorage.getItem('userData')) || {};
        let profilePicture = storedUserData.profile_picture || "media/Screen Shot 2024-10-02 at 2.05.14 AM.png";
        
        this.innerHTML = `
        <style>
        /* Profile Picture Container with Border */
        .profile-picture-container {
          position: relative;
          display: inline-block;
          width: 150px;
          height: 150px;
          overflow: hidden;
          border-radius: 50%; /* Circular frame */
          border: 5px solid #3498db; /* Blue border */
          box-shadow: 0 0 15px rgba(0, 0, 0, 0.2); /* Optional shadow effect */
        }
      
        /* Profile Picture Styling */
        .profile-picture-container img {
          width: 100%;
          height: 100%;
          object-fit: cover; /* Ensures the image covers the area */
        }
      
        /* Controls inside the Profile Picture Container */
        .profile-picture-controls {
          position: absolute;
          bottom: 10px;
          left: 10px;
          display: flex;
          justify-content: space-between;
          width: calc(100% - 20px);
        }
      
        /* File Input */
        #profilePictureInput {
          display: block;
          margin-top: 10px;
        }
      
        /* Styling for the file input button */
        #profilePictureInput[type="file"] {
          display: block;
          margin-top: 10px;
          font-size: 14px;
        }
      
        /* Button Styling for file input */
        #change {
          background-color: rgba(255, 255, 255, 0.6); /* Semi-transparent background */
          border: none;
          padding: 5px 10px;
          border-radius: 5px;
          cursor: pointer;
          font-weight: bold;
        }
      
        /* Button Hover Effect */
        #change:hover {
          background-color: rgba(255, 255, 255, 0.8);
        }
      </style>
      


        <link rel="stylesheet" href="static/css/settings.css">
        <div id="settings-overlay" class="settings-overlay">
            <div class="settings-content">
                <h2 data-i18n="settings.title">Settings</h2>
                
                <div class="two-factor-section">
                    <h3>Two-Factor Authentication</h3>
                    <button id="toggle-2fa" class="${storedUserData.otp_enabled ? 'enabled' : ''}">
                        ${storedUserData.otp_enabled ? 'Disable 2FA' : 'Enable 2FA'}
                    </button>
                    <div class="twofa-code-input" style="display: none;">
                        <input type="text" id="twofa-code" placeholder="Enter 6-digit code">
                        <button id="submit-twofa-code">Verify Code</button>
                        <div class="twofa-status"></div>
                    </div>
                </div>
                
                <div class="omarr-imgConatinerr">
                <img id="player-profile-picture" 
                src=${profilePicture}>
                </div>
                <div >
                <input type="file" id="profilePictureInput" accept="image/*">
                <button id="change" class="omar-gameStatus">Edit</button>
                </div>
                
                    <div class="profile-form">
                        <div class="form-group">
                            <label for="FirstName" data-i18n="settings.changeFirstName">Change FirstName:</label>
                            <input type="text" id="FirstName" data-i18n-placeholder="settings.enterFirstName">
                        </div>
                        
                        <div class="form-group">
                            <label for="LastName" data-i18n="settings.changeLastName">Change Lastname:</label>
                            <input type="text" id="LastName" data-i18n-placeholder="settings.enterLastName">
                        </div>
                        
                        <div class="form-group">
                            <label for="newUsername" data-i18n="settings.changeUsername">Change Username:</label>
                            <input type="text" id="newUsername" data-i18n-placeholder="settings.enterUsername">
                        </div>
                        
                        <div class="form-group">
                            <label for="newEmail" data-i18n="settings.changeEmail">Change Email:</label>
                            <input type="email" id="newEmail" data-i18n-placeholder="settings.enterEmail">
                        </div>
                        
                        <div class="form-group">
                            <label for="OldPassword" data-i18n="settings.oldPassword">Old Password:</label>
                            <input type="password" id="OldPassword" data-i18n-placeholder="settings.enterOldPassword">
                        </div>
                        
                        <div class="form-group">
                            <label for="newPassword" data-i18n="settings.newPassword">New Password:</label>
                            <input type="password" id="newPassword" data-i18n-placeholder="settings.enterNewPassword">
                        </div>
                        
                        <div class="form-group">
                            <label for="conf-password" data-i18n="settings.confirmPassword">Confirm Password:</label>
                            <input type="password" id="conf-password" data-i18n-placeholder="settings.confirmNewPassword">
                        </div>
                    </div>
                    
                    <div class="button-group">
                        <button id="save-settings" data-i18n="settings.save">Save</button>
                        <button id="close-settings" data-i18n="settings.close">Close</button>
                    </div>
                </div>
            </div>
        </div>`;

        // ✅ Close Settings Button
        document.getElementById("close-settings").addEventListener("click", () => {
            this.style.display = "none";
        });
        const toggle2fa = this.querySelector('#toggle-2fa');
        const submitCode = this.querySelector('#submit-twofa-code');
        if (toggle2fa) {
            toggle2fa.addEventListener('click', this.handle2FAToggle.bind(this));
        }
        if (submitCode) {
            submitCode.addEventListener('click', this.handleCodeVerification.bind(this));
        }
        // ✅ Save Settings (Send Data to Backend)
        document.getElementById("save-settings").addEventListener("click", async () => {
            const oldPassword = document.getElementById("OldPassword").value;
            const newPassword = document.getElementById("newPassword").value;
            const conf_password = document.getElementById("conf-password").value;
            if (!oldPassword) {
                alert(window.LanguageUtils.translate("settings.oldPasswordRequired"));
                return;
            }
            if (newPassword && newPassword !== conf_password) {
                alert(window.LanguageUtils.translate("PasswordsDontMatch"));
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
                    alert(window.LanguageUtils.translate("settings.profileUpdated"));
                } else {
                    alert(window.LanguageUtils.translate("settings.updateError") + ": " + responseData.message || window.LanguageUtils.translate("settings.unknownError"));
                }
            } catch (error) {
                console.error("Error:", error);
            }
        });
        document.getElementById("change").addEventListener("click", function (event) {
            const fileInput = document.getElementById("profilePictureInput");
            if (fileInput.files.length === 0) {
                alert(window.LanguageUtils.translate("settings.selectFile"));
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
                    alert(window.LanguageUtils.translate("settings.pictureUpdated"));
                    document.getElementById("profilePreview").src = data.profile_picture_url; // Update preview
                    document.getElementById("player-profile-picture").src = data.profile_picture_url; // Update the profile image
                } else {
                    const errorData = await response.json();
                    alert(window.LanguageUtils.translate("Error") + ": " + JSON.stringify(errorData));
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