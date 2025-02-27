class SettingsPage extends HTMLElement {
    async connectedCallback() {
        this.innerHTML = `
        <style>
        /* ✅ Full-Screen Overlay */
        .settings-button {
            position: fixed;
            top: 10px;
            right: 10px;
            background-color: #4CAF50;
            color: white;
            border: none;
            padding: 10px 15px;
            font-size: 16px;
            border-radius: 5px;
            cursor: pointer;
            z-index: 1000;
        }
        
        /* ✅ Full-Screen Overlay */
        .settings-overlay {
            display: none; /* Hidden by default */
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1001;
        }
        
        /* ✅ Settings Panel */
        .settings-content {
            background: white;
            padding: 20px;
            border-radius: 10px;
            width: 300px;
            text-align: center;
        }
        
        .settings-content input {
            width: 100%;
            padding: 8px;
            margin: 10px 0;
            border: 1px solid #ccc;
            border-radius: 5px;
        }
        
        .settings-content button {
            padding: 10px;
            margin: 5px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        
        #save-settings {
            background-color: #4CAF50;
            color: white;
        }
        
        #close-settings {
            background-color: #f44336;
            color: white;
        }
    </style>

        <!-- ✅ Settings Panel -->

        <div id="settings-overlay" class="settings-overlay">
            <div class="settings-content">
                <h2>Settings</h2>
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
    }
}

// ✅ Define the Settings Component
customElements.define("settings-component", SettingsPage);
