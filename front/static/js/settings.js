class SettingsPage extends HTMLElement {
    async connectedCallback() {
        const storedUserData = JSON.parse(localStorage.getItem('userData'));
        const profilePicture = storedUserData.profile_picture || "media/Screen Shot 2024-10-02 at 2.05.14 AM.png";

        this.innerHTML = `
		<style>
        /* ✅ Full-Screen Overlay */
        .settings-button {
            position: fixed;
            top: 10px;
            right: 10px;
            background-color: #10292F;
            color: #E5F690;
            border: 1px solid #E5F690;
            padding: 10px 15px;
            font-size: 16px;
            border-radius: 5px;
            cursor: pointer;
            z-index: 1000;
        }
        .settings-button:hover {
            position: fixed;
            top: 10px;
            right: 10px;
            background-color: #E5F690;
            color: #10292F;
            border: 1px solid #10292F;
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
            background: #10292F;
            padding: 20px;
            border-radius: 10px;
            width: 300px;
            text-align: center;
            color: #E5F690;
        }
        
        .settings-content input {
            width: 100%;
            padding: 6px 10px 6px 40px;
            margin: 10px 0;
            border: 2px solid #E5F690;
            border-radius: 20px;
            color: #E5F690;
            background-color: #10292F;
        }
        
        .settings-content button {
            padding: 10px;
            margin: 5px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        .omarr-imgConatinerr {
            height: 150px;
            overflow: hidden;
            border-radius: 32px;
            margin-bottom: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        .omarr-imgConatinerr img {
            max-width: 100%;
            max-height: 100%;
            border-radius: 32px;
            object-fit: cover; /* Adjust this if needed */
        }
        

        #save-settings {
            background-color: #10292F;
            color: #E5F690;
            border: 2px solid #E5F690;
        }
        #save-settings:hover {
            background-color: #E5F690;
            color: #10292F;
            border: 2px solid #10292F;
        }
        
        #close-settings {
            background-color: #10292F;
            color: #E5F690;
            border: 2px solid #E5F690;
        }

        #close-settings:hover {
            background-color: #E5F690;
            color: #10292F;
            border: 2px solid #10292F;
        }
    </style>
            
        <!-- ✅ Settings Panel -->
        <link rel="stylesheet" href="static/css/profile.css">
        <div id="settings-overlay" class="settings-overlay">
            <div class="settings-content">
                <h2>Settings</h2>
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
