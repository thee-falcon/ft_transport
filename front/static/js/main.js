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
    return localStorage.getItem("access_token") !== null;
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
