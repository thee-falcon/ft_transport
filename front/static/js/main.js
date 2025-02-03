const route = {
    'signin': 'signin-component',
    'signup': 'signup-component',
    'dashboard': 'dashboard-component',
};

function getCookie(name) {
    let match = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return match ? match[2] : null;
}

function isAuthenticated() {
    // Check if an access token is available in localStorage
    const token = localStorage.getItem("access_token");
    
    return token !== null; // Returns true if the token is present
}

async function navigate() {
    const path = window.location.hash.substring(1) || "signin";
    
    if (path === "dashboard" && !isAuthenticated()) {
        window.location.hash = "signin";
        return;
    }

    const page = route[path];
    const container = document.getElementById("view-container");

    if (!page) {
        window.location.hash = "signin";
        return;
    }
    
    container.innerHTML = `<${page}></${page}>`;
    container.classList.add("active");
}

window.addEventListener("hashchange", navigate);
window.addEventListener("DOMContentLoaded", navigate);
