class dashboard extends HTMLElement {
    async connectedCallback() {
       const username =getCookie('username');
        // const profilename = getCookie('username');
        const profilePicture = getCookie("profile_picture")  ;
        
            console.log("profilePicture  " , profilePicture );
            this.innerHTML = `
            <div>
                <img 
                    src=${profilePicture} 
                     style="width: 100px; height: 100px; border-radius: 50%;"
                >
            </div>
            <button id="logout">Logout</button> 
              <h2>Welcome, ${username }!</h2> 
            <p>You are logged in!</p>
        `;
   

        document.getElementById("logout").addEventListener('click', async function(event) {
            event.preventDefault();
        
            try {
                const response = await fetch("http://localhost:8000/logout/", {
                    method: "POST",
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
                    window.location.hash = "#signin"; 
                } else {
                    console.error("Logout failed:", responseData);
                    alert(responseData.detail || "Logout failed");
                }
            } catch (error) {
                console.error("Error:", error);
            }
        });
        
    } 
}

customElements.define('dashboard-component', dashboard);