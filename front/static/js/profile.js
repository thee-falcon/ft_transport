class Profile extends HTMLElement {
    async connectedCallback() {
        const storedUserData = JSON.parse(localStorage.getItem('userData'));
        const username = storedUserData.username;
        const first_name = storedUserData.first_name;
        const lastname =storedUserData.last_name;
        const profilePicture = storedUserData.profile_picture;
        console.log("Profile Picture:", profilePicture);
        const email = storedUserData.email;

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
                                <p class="dash-level">LvL 69</p>
                                <p class="dash-description">"The Conqueror of PING-PONG Realm"</p>
                                <p class="dash-email">${email}</p>
                            </div>
                        </div>
                        
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;

    };
    }
        
        
        
 

customElements.define('profile-component', Profile);