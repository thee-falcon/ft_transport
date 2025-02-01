class dashboard extends HTMLElement {
    async connectedCallback() {
        const username = localStorage.getItem("username") || "Guest"; // Default to "Guest" if not found

        this.innerHTML = `
        <h2>Welcome, ${username}!</h2> 
        <p>You are logged in!</p>
        <button id="logout">Logout</button>
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
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("refresh_token");
                    localStorage.removeItem("username");
                    localStorage.clear();
        
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


