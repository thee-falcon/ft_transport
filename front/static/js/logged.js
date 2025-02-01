class dashboard extends HTMLElement {
    async connectedCallback() {
        this.innerHTML = `
        <h2>Welcome!</h2> 
        <p>You are logged in!</p>
        <button id="logout">Logout</button>
        `;

        document.getElementById("logout").addEventListener("click", function() {
            localStorage.removeItem("access_token");
            window.location.hash = "signin";
        });
    } 
}

customElements.define('dashboard-component', dashboard);
